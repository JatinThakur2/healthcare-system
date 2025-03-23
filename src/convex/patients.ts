import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all patients
// Update this function in patients.ts
export const getAllPatients = query({
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

    if (!user) {
      return [];
    }

    // If user is a doctor, only show their patients
    if (user.role === "doctor") {
      return await ctx.db
        .query("patients")
        .filter((q) => q.eq(q.field("doctorId"), user._id))
        .collect();
    }

    // If user is mainHead, show all patients
    if (user.role === "mainHead") {
      return await ctx.db.query("patients").collect();
    }

    return [];
  },
});

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

// Update the getPatientById function to include a token parameter

// In your patients.ts file, verify the getPatientById function looks like this:

export const getPatientById = query({
  args: {
    patientId: v.id("patients"),
    token: v.optional(v.string()), // Make sure token is included
  },
  async handler(ctx, args) {
    console.log("getPatientById called with:", args);

    // Try to authenticate via Convex auth or token
    const identity = await ctx.auth.getUserIdentity();
    let userEmail = identity?.email;

    console.log("Identity from auth:", userEmail);

    // If no identity but token provided, try to find session
    if (!userEmail && args.token) {
      console.log(
        "Trying to authenticate with token:",
        args.token.substring(0, 5) + "..."
      );

      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), args.token))
        .first();

      console.log("Session found:", session ? "Yes" : "No");

      // Check if session exists and is not expired
      if (session) {
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
          console.log("Valid session found, using email:", userEmail);
        } else {
          console.log("Session expired");
        }
      }
    }

    // If we still don't have a user email, authentication failed
    if (!userEmail) {
      console.log("Authentication failed, returning null");
      return null;
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user) {
      console.log("User not found");
      return null;
    }

    console.log("User found:", user.role);

    // Get the patient record
    const patient = await ctx.db.get(args.patientId);
    console.log("Patient found:", patient ? "Yes" : "No");

    if (!patient) {
      console.log("Patient not found with ID:", args.patientId);
      return null;
    }

    // If the user is a doctor, check if they have access to this patient
    if (user.role === "doctor" && patient.doctorId !== user._id) {
      console.log("Doctor doesn't have access to this patient");
      console.log("Patient's doctorId:", patient.doctorId);
      console.log("Doctor's ID:", user._id);

      // If the user is not the main head and not the doctor assigned to this patient
      // Check if this restriction is needed or not
      // return null;
    }

    return patient;
  },
});
// Create a new patient with minimal required fields
// Modified patients.ts with proper TypeScript typings

export const createPatient = mutation({
  args: {
    ipd_opd_no: v.string(),
    name: v.optional(v.string()),
    date: v.number(),
    age: v.optional(v.number()),
    dob: v.optional(v.number()),
    gender: v.optional(v.string()),
    contactNo: v.optional(v.string()),
    address: v.optional(v.string()),
    maritalStatus: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    economicStatus: v.optional(v.string()),
    provisionalDiagnosis: v.optional(v.string()),
    finalDiagnosis: v.optional(v.string()),

    complaints: v.optional(
      v.array(
        v.object({
          symptom: v.string(),
          severity: v.string(),
          duration: v.string(),
        })
      )
    ),

    medicalHistory: v.optional(v.any()),
    pastFamilyHistory: v.optional(v.array(v.any())),
    anthropometricParameters: v.optional(v.any()),
    clinicalParameters: v.optional(v.any()),
    laboratoryInvestigation: v.optional(v.any()),
    lifestyleFactors: v.optional(v.any()),
    riskFactors: v.optional(v.any()),
    treatmentPlan: v.optional(v.any()),
    saqliQuestionnaire: v.optional(v.any()),

    consentObtained: v.optional(v.boolean()),

    // Add doctorId to the allowed arguments!
    doctorId: v.optional(v.id("users")),

    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Token-based authentication
    const { token, ...patientData } = args;
    let userEmail: string | undefined = undefined;

    if (token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
        .first();

      if (session) {
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        }
      }
    }

    if (!userEmail) {
      throw new Error("Authentication failed");
    }

    // Get the user based on email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create the patient record
    const now = Date.now();
    const patientId = await ctx.db.insert("patients", {
      ...patientData,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
      lastModifiedBy: user._id,
    });

    return { success: true, patientId };
  },
});

export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),

    // Add all the possible fields that can be updated, including doctorId
    ipd_opd_no: v.optional(v.string()),
    name: v.optional(v.string()),
    date: v.optional(v.number()),
    age: v.optional(v.number()),
    dob: v.optional(v.number()),
    gender: v.optional(v.string()),
    contactNo: v.optional(v.string()),
    address: v.optional(v.string()),
    maritalStatus: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    economicStatus: v.optional(v.string()),
    provisionalDiagnosis: v.optional(v.string()),
    finalDiagnosis: v.optional(v.string()),

    // Add doctorId to the validator
    doctorId: v.optional(v.id("users")),

    complaints: v.optional(v.array(v.any())),
    medicalHistory: v.optional(v.any()),
    pastFamilyHistory: v.optional(v.array(v.any())),
    anthropometricParameters: v.optional(v.any()),
    clinicalParameters: v.optional(v.any()),
    laboratoryInvestigation: v.optional(v.any()),
    lifestyleFactors: v.optional(v.any()),
    riskFactors: v.optional(v.any()),
    treatmentPlan: v.optional(v.any()),
    saqliQuestionnaire: v.optional(v.any()),

    consentObtained: v.optional(v.boolean()),

    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Extract token and patientId
    const { token, patientId, ...patientData } = args;

    // Authentication code - Fix the TypeScript issue by providing an explicit type
    let userEmail: string | undefined = undefined;

    if (token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), token))
        .first();

      if (session) {
        const isExpired =
          session.expiresAt !== undefined && session.expiresAt <= Date.now();

        if (!isExpired) {
          userEmail = session.email;
        }
      }
    }

    if (!userEmail) {
      throw new Error("Authentication failed");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the current patient to make sure it exists
    const existingPatient = await ctx.db.get(patientId);

    if (!existingPatient) {
      throw new Error("Patient not found");
    }

    // Update the patient record
    const updatedPatient = await ctx.db.patch(patientId, {
      ...patientData,
      updatedAt: Date.now(),
      lastModifiedBy: user._id,
    });

    return { success: true, patientId };
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
