// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper query to check if a main head already exists
export const checkMainHeadExists = query({
  async handler(ctx) {
    const existingMainHead = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "mainHead"))
      .first();

    return existingMainHead !== null;
  },
});

// Helper query to check if an email is already in use
export const checkEmailExists = query({
  args: { email: v.string() },
  async handler(ctx, args) {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    return existingUser !== null;
  },
});

// Helper query to get user by email (for login)
export const getUserByEmail = query({
  args: { email: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    return user;
  },
});

// Helper mutation to insert a main head user
export const insertMainHead = mutation({
  args: {
    email: v.string(),
    hashedPassword: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      hashedPassword: args.hashedPassword,
      role: "mainHead",
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    });

    return { userId, success: true };
  },
});
// Add these functions to your users.ts file
// Add this to your users.ts file

// Helper mutation to insert a doctor user
export const insertDoctor = mutation({
  args: {
    email: v.string(),
    hashedPassword: v.string(),
    name: v.string(),
    createdBy: v.id("users"),
  },
  async handler(ctx, args) {
    const doctorId = await ctx.db.insert("users", {
      email: args.email,
      hashedPassword: args.hashedPassword,
      role: "doctor",
      name: args.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: args.createdBy,
      isActive: true,
    });

    return doctorId;
  },
});
