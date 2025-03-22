import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all patients
export const getAllPatients = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get all patients from database
    const patients = await ctx.db.query("patients").collect();
    return patients;
  },
});

// Get patients by doctor ID

// Get patients by doctor ID
export const getPatientsByDoctor = query({
  args: {
    doctorId: v.optional(v.id("users")),
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

    if (!user) {
      return [];
    }

    // If user is a doctor, only show their patients
    if (user.role === "doctor" && !args.doctorId) {
      return await ctx.db
        .query("patients")
        .filter((q) => q.eq(q.field("doctorId"), user._id))
        .collect();
    }

    // If doctorId is provided, filter by that doctor
    if (args.doctorId) {
      return await ctx.db
        .query("patients")
        .filter((q) => q.eq(q.field("doctorId"), args.doctorId))
        .collect();
    }

    // If user is mainHead, show all patients
    if (user.role === "mainHead") {
      return await ctx.db.query("patients").collect();
    }

    return [];
  },
});

// Get a single patient by ID
export const getPatientById = query({
  args: { id: v.id("patients") }, // Changed from patientId to id
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const patient = await ctx.db.get(args.id); // Also update this line
    if (!patient) {
      return null;
    }

    return patient;
  },
});

// Create a new patient
// Add token parameter to the createPatient mutation
export const createPatient = mutation({
  args: {
    // Keep all your existing parameters
    ipd_opd_no: v.string(),
    date: v.number(),
    age: v.optional(v.number()),
    // ... all other fields ...
    consentObtained: v.optional(v.boolean()),
    // Add token parameter
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Extract token from args to avoid storing it in the database
    const { token, ...patientData } = args;

    // Try to authenticate via Convex auth or token
    const identity = await ctx.auth.getUserIdentity();
    let userEmail = identity?.email;

    // If no identity but token provided, try to find session
    if (!userEmail && token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
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

    if (!user) {
      throw new ConvexError("User not found");
    }

    const timestamp = Date.now();

    const patientId = await ctx.db.insert("patients", {
      ...patientData,
      createdBy: user._id,
      doctorId: user.role === "doctor" ? user._id : undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastModifiedBy: user._id,
    });

    return { patientId, success: true };
  },
});

// Update an existing patient
// Update the updatePatient mutation to accept a token
export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),
    // Keep all your existing parameters
    ipd_opd_no: v.optional(v.string()),
    date: v.optional(v.number()),
    // ... all other fields ...
    consentObtained: v.optional(v.boolean()),
    // Add token parameter
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Extract token from args
    const { token, patientId, ...updateData } = args;

    // Try to authenticate via Convex auth or token
    const identity = await ctx.auth.getUserIdentity();
    let userEmail = identity?.email;

    // If no identity but token provided, try to find session
    if (!userEmail && token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
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

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Check if the patient exists
    const existingPatient = await ctx.db.get(patientId);
    if (!existingPatient) {
      throw new ConvexError("Patient not found");
    }

    // Update the patient record
    await ctx.db.patch(patientId, {
      ...updateData,
      updatedAt: Date.now(),
      lastModifiedBy: user._id,
    });

    return { success: true };
  },
});

// Delete a patient
export const deletePatient = mutation({
  args: { patientId: v.id("patients") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Only main head or the doctor who created the patient can delete
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      throw new ConvexError("Patient not found");
    }

    if (user.role !== "mainHead" && patient.doctorId !== user._id) {
      throw new ConvexError("Not authorized to delete this patient");
    }

    await ctx.db.delete(args.patientId);
    return { success: true };
  },
});
