// convex/auth_actions.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Define return type for the action
type MainHeadCreationResult = {
  userId: Id<"users">;
  success: boolean;
};
type DoctorCreationResult = {
  doctorId?: Id<"users">;
  success: boolean;
  message?: string;
};

// Create the initial main head user (this would be called once during setup)
// Update in convex/auth_actions.ts
export const createMainHead = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  async handler(ctx, args): Promise<MainHeadCreationResult> {
    // Remove check for existing main head
    // Only check if email is already in use
    const existingUser = await ctx.runQuery(api.users.checkEmailExists, {
      email: args.email,
    });

    if (existingUser) {
      throw new ConvexError("Email already in use");
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.password, salt);

    // Insert the user
    const insertResult = await ctx.runMutation(api.users.insertMainHead, {
      email: args.email,
      hashedPassword,
      name: args.name,
    });

    return insertResult as MainHeadCreationResult;
  },
});

// Create a doctor user (called by main head)
export const createDoctor = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    token: v.optional(v.string()), // Optional token for auth
  },
  async handler(ctx, args): Promise<DoctorCreationResult> {
    try {
      // Authenticate using token if provided
      let userEmail = null;

      if (args.token) {
        // Try to find session with the token
        const session = await ctx.runQuery(api.auth.getSessionByToken, {
          token: args.token,
        });

        if (!session) {
          return { success: false, message: "Invalid session token" };
        }

        // Check if session is expired
        if (session.expiresAt && session.expiresAt <= Date.now()) {
          return {
            success: false,
            message: "Session expired, please log in again",
          };
        }

        userEmail = session.email;
      }

      if (!userEmail) {
        return { success: false, message: "Not authenticated" };
      }

      // Get the user from database
      const user = await ctx.runQuery(api.auth.getUserByEmail, {
        email: userEmail,
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      if (user.role !== "mainHead") {
        return { success: false, message: "Not authorized to create doctors" };
      }

      // Check if email is already in use
      const existingUser = await ctx.runQuery(api.auth.getUserByEmail, {
        email: args.email,
      });

      if (existingUser) {
        return { success: false, message: "Email already in use" };
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      // Insert the doctor directly
      const doctorId = await ctx.runMutation(api.users.insertDoctor, {
        email: args.email,
        hashedPassword,
        name: args.name,
        createdBy: user._id,
      });

      return {
        success: true,
        doctorId,
      };
    } catch (error: any) {
      // Fix: TypeScript error by typing 'error' as 'any'
      console.error("Error creating doctor:", error);
      return {
        success: false,
        message: error?.message || "Failed to create doctor",
      };
    }
  },
});
