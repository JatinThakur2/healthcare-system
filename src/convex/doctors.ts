// convex/doctors.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all doctors with their patient counts
export const getDoctorsWithPatientCounts = query({
  args: {
    token: v.optional(v.string()), // Add token parameter
  },
  async handler(ctx, args) {
    // Try to authenticate via Convex auth or token
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
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        }
      }
    }

    // If we still don't have a user email, authentication failed
    if (!userEmail) {
      return [];
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user || user.role !== "mainHead") {
      return [];
    }

    // Filter doctors to only show those created by this main head
    const doctors = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("role"), "doctor"),
          q.eq(q.field("createdBy"), user._id)
        )
      )
      .collect();

    // Get all patients
    const patients = await ctx.db.query("patients").collect();

    // Calculate patient counts for each doctor
    const doctorsWithCounts = await Promise.all(
      doctors.map(async (doctor) => {
        const patientCount = patients.filter(
          (patient) => patient.doctorId === doctor._id
        ).length;

        return {
          _id: doctor._id,
          email: doctor.email,
          name: doctor.name,
          createdAt: doctor.createdAt,
          isActive: doctor.isActive,
          patientCount,
        };
      })
    );

    return doctorsWithCounts;
  },
});

// Update doctor status (active/inactive)
export const updateDoctorStatus = mutation({
  args: {
    doctorId: v.id("users"),
    isActive: v.boolean(),
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Try to authenticate via Convex auth or token
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
      throw new ConvexError("Not authorized to update doctor status");
    }

    // Check if the doctor exists
    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      throw new ConvexError("Doctor not found");
    }

    // Verify the main head created this doctor
    if (doctor.createdBy !== user._id) {
      throw new ConvexError("Not authorized to update this doctor's status");
    }

    // Update the doctor's status
    await ctx.db.patch(args.doctorId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get doctor by ID
export const getDoctorById = query({
  args: {
    doctorId: v.id("users"),
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Try to authenticate via Convex auth or token
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
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        }
      }
    }

    // If we still don't have a user email, authentication failed
    if (!userEmail) {
      return null;
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user || user.role !== "mainHead") {
      return null;
    }

    const doctor = await ctx.db.get(args.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return null;
    }

    // Verify the main head created this doctor
    if (doctor.createdBy !== user._id) {
      return null;
    }

    return {
      _id: doctor._id,
      email: doctor.email,
      name: doctor.name,
      createdAt: doctor.createdAt,
      isActive: doctor.isActive,
    };
  },
});
