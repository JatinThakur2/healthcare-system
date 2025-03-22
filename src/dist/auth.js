import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import bcrypt from "bcryptjs";
// Generate a salt and hash for password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
// Check if the password matches the hash
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
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
export const createDoctor = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        name: v.string(),
    },
    async handler(ctx, args) {
        // Get the current user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
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
// Login function
export const login = mutation({
    args: {
        email: v.string(),
        password: v.string(),
    },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }
        if (!user.isActive) {
            return { success: false, message: "Account is inactive" };
        }
        const passwordMatch = await comparePassword(args.password, user.hashedPassword);
        if (!passwordMatch) {
            return { success: false, message: "Invalid email or password" };
        }
        // Set up session and authenticate user
        await ctx.auth.createSession({
            userId: user._id,
            email: user.email,
            role: user.role,
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
        };
    },
});
// Logout function
export const logout = mutation({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { success: false };
        }
        await ctx.auth.invalidateSession();
        return { success: true };
    },
});
// Get current user
export const getCurrentUser = query({
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();
        if (!user) {
            return null;
        }
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
        };
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
