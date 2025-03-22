// convex/auth.ts
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import bcrypt from "bcryptjs";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Type definitions for database entities
interface User {
  _id: Id<"users">;
  email: string;
  hashedPassword: string;
  role: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
  createdBy?: Id<"users">;
}

// Update your Session interface in auth.ts to make expiresAt optional
interface Session {
  _id: Id<"sessions">;
  userId: Id<"users">;
  email: string;
  role: string;
  token: string;
  createdAt: number;
  expiresAt?: number; // Make expiresAt optional to match database schema
}

// Type definitions for return values
interface LoginResult {
  success: boolean;
  message?: string;
  user?: {
    _id: Id<"users">;
    email: string;
    name: string;
    role: string;
    createdAt: number;
  };
  token?: string;
  expiresAt?: number;
}

// Generate a salt and hash for password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Check if the password matches the hash
async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
// Add this function to your auth.ts file

// Helper function to get a session by token
// Then your getSessionByToken query should work correctly
export const getSessionByToken = query({
  args: { token: v.string() },
  async handler(ctx, args): Promise<Session | null> {
    return await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("token"), args.token))
      .first();
  },
});
// Create the initial main head user (this would be called once during setup)
export const createMainHead = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    // Check if a main head already exists
    const existingMainHead = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "mainHead"))
      .first();

    if (existingMainHead) {
      throw new ConvexError("Main head already exists");
    }

    // Check if email is already in use
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("Email already in use");
    }

    const hashedPassword = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      email: args.email,
      hashedPassword,
      role: "mainHead",
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    });

    return { userId, success: true };
  },
});

// Create a doctor user (called by main head)
// Update these functions in your auth.ts file

// Create a doctor user (called by main head)
export const createDoctor = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    token: v.optional(v.string()), // Add optional token parameter
  },
  async handler(ctx, args) {
    // Try to authenticate via Convex auth or token
    const identity = await ctx.auth.getUserIdentity();
    let userEmail: string | undefined = identity?.email;

    // If no identity but token provided, try to find session
    if (!userEmail && args.token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), args.token))
        .first();

      // Check if session exists and is not expired
      if (session) {
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        }
      }
    }

    // If we still don't have a user email, authentication failed
    if (!userEmail) {
      throw new ConvexError("Not authenticated");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user || user.role !== "mainHead") {
      throw new ConvexError("Not authorized to create doctors");
    }

    // Check if email is already in use
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("Email already in use");
    }

    const hashedPassword = await hashPassword(args.password);

    const doctorId = await ctx.db.insert("users", {
      email: args.email,
      hashedPassword,
      role: "doctor",
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: user._id,
      isActive: true,
    });

    return { doctorId, success: true };
  },
});

// (Duplicate declaration removed)
// Add helper query to get user by email (for the login action)
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  async handler(ctx, args): Promise<User | null> {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

// Add helper mutation to create a session (for the login action)
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  },
  async handler(ctx, args): Promise<Id<"sessions">> {
    return await ctx.db.insert("sessions", {
      userId: args.userId,
      email: args.email,
      role: args.role,
      token: args.token,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
  },
});

// Login function
export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  async handler(ctx, args): Promise<LoginResult> {
    // Get the user from the database
    const user: User | null = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    if (!user.isActive) {
      return { success: false, message: "Account is inactive" };
    }

    // Compare password - now safe to use in an action
    const passwordMatch = await bcrypt.compare(
      args.password,
      user.hashedPassword
    );

    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    // Generate a session token
    const sessionToken = generateSessionToken();

    // Set session expiration to 1 week from now (7 days)
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    // Store the session in the sessions table using a mutation
    await ctx.runMutation(api.auth.createSession, {
      userId: user._id,
      email: user.email,
      role: user.role,
      token: sessionToken,
      expiresAt: expiresAt,
    });

    // Return user data without sensitive information
    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: sessionToken,
      expiresAt: expiresAt, // Return the expiry time to the client
    };
  },
});

// Generate a random session token (helper function)
function generateSessionToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Logout function
export const logout = mutation({
  args: {
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false };
    }

    // If token is provided, delete that specific session
    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), args.token))
        .first();

      if (session) {
        await ctx.db.delete(session._id);
      }
    } else {
      // Otherwise, delete all sessions for this user
      const sessions = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .collect();

      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }
    }

    return { success: true };
  },
});

// Get current user
// Add this to your auth.ts file or update the existing function

export const getCurrentUser = query({
  args: {
    token: v.optional(v.string()), // Add optional token parameter
  },
  async handler(ctx, args) {
    // First try getting the user from Convex auth identity
    const identity = await ctx.auth.getUserIdentity();
    let userEmail = identity?.email;

    // If no identity but token provided, try to find session
    if (!userEmail && args.token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), args.token))
        .first();

      // Check if session exists and is not expired
      if (session) {
        // Handle the case where expiresAt might be undefined
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        } else {
          // Session is expired
          return null;
        }
      }
    }

    // If we have an email (from either source), get the user
    if (userEmail) {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), userEmail))
        .first();

      if (user && user.isActive) {
        return {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        };
      }
    }

    return null;
  },
});

// Get all doctors (for main head)
export const getAllDoctors = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user || user.role !== "mainHead") {
      return [];
    }

    const doctors = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "doctor"))
      .collect();

    return doctors.map((doctor) => ({
      _id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      createdAt: doctor.createdAt,
      isActive: doctor.isActive,
    }));
  },
});

// Toggle doctor active status (used by main head)
export const toggleDoctorStatus = mutation({
  args: {
    doctorId: v.id("users"),
    isActive: v.boolean(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user || user.role !== "mainHead") {
      throw new ConvexError("Not authorized to update doctor status");
    }

    // Check if the doctor exists
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      throw new ConvexError("Doctor not found");
    }

    // Update the doctor's status
    await ctx.db.patch(args.doctorId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
