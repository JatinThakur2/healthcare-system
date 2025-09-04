import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all patients
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
        .filter((q) =>
          q.or(
            q.eq(q.field("doctorId"), user._id),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();
    }

    // If user is mainHead, show only patients created by them or their doctors
    if (user.role === "mainHead") {
      // Get all doctors created by this main head
      const doctors = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("role"), "doctor"),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();

      // Get doctor IDs
      const doctorIds = doctors.map((doctor) => doctor._id);

      // Get all patients
      const allPatients = await ctx.db.query("patients").collect();

      // Filter patients to only include those created by this main head or their doctors
      return allPatients.filter(
        (patient) =>
          patient.createdBy === user._id ||
          (patient.doctorId && doctorIds.includes(patient.doctorId))
      );
    }

    return [];
  },
});

export const getPatients = query({
  args: {
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Authenticate user
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

    // Different logic based on user role
    if (user.role === "mainHead") {
      // For main head, collect all doctors under this main head first
      const doctors = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("role"), "doctor"),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();

      // Extract doctor IDs
      const doctorIds = doctors.map((doctor) => doctor._id);

      // Include the main head's ID to find patients created directly by the main head
      const allIds = [user._id, ...doctorIds];

      // Get patients created by main head or any of their doctors
      // Use multiple filters instead of 'in' operator
      const patients = await ctx.db.query("patients").collect();

      // Filter patients in JavaScript code rather than in the query
      return patients.filter(
        (patient) =>
          patient.createdBy === user._id ||
          (patient.doctorId && allIds.includes(patient.doctorId))
      );
    } else if (user.role === "doctor") {
      // For doctors, only return patients they created or are assigned to them
      return await ctx.db
        .query("patients")
        .filter((q) =>
          q.or(
            q.eq(q.field("createdBy"), user._id),
            q.eq(q.field("doctorId"), user._id)
          )
        )
        .collect();
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
        .filter((q) =>
          q.or(
            q.eq(q.field("doctorId"), user._id),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();
    }

    // If doctorId is provided and the current user is a main head
    if (args.doctorId && user.role === "mainHead") {
      // First verify the doctor belongs to this main head
      const doctor = await ctx.db.get(args.doctorId);

      if (
        !doctor ||
        doctor.role !== "doctor" ||
        doctor.createdBy !== user._id
      ) {
        // Doctor doesn't exist or doesn't belong to this main head
        return [];
      }

      // Get patients for this doctor
      return await ctx.db
        .query("patients")
        .filter((q) => q.eq(q.field("doctorId"), args.doctorId))
        .collect();
    }

    // If doctorId is provided and the current user is that doctor
    if (args.doctorId && user.role === "doctor" && args.doctorId === user._id) {
      return await ctx.db
        .query("patients")
        .filter((q) =>
          q.or(
            q.eq(q.field("doctorId"), user._id),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();
    }

    // If user is mainHead but no doctorId was provided, show all patients under their supervision
    if (user.role === "mainHead" && !args.doctorId) {
      // Get all doctors created by this main head
      const doctors = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("role"), "doctor"),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();

      // Get doctor IDs
      const doctorIds = doctors.map((doctor) => doctor._id);

      // Get all patients
      const allPatients = await ctx.db.query("patients").collect();

      // Filter patients to only include those created by this main head or their doctors
      return allPatients.filter(
        (patient) =>
          patient.createdBy === user._id ||
          (patient.doctorId && doctorIds.includes(patient.doctorId))
      );
    }

    // Default: return empty array for any other case
    return [];
  },
});

// Get a single patient by ID
export const getPatientById = query({
  args: {
    patientId: v.id("patients"),
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Authenticate user
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

    if (!user) {
      return null;
    }

    // Get the patient
    const patient = await ctx.db.get(args.patientId);

    if (!patient) {
      return null;
    }

    // Check access rights
    if (user.role === "mainHead") {
      // Main head can access if they created the patient directly
      if (patient.createdBy === user._id) {
        return patient;
      }

      // Or if the patient was created by one of their doctors
      const doctor = patient.doctorId
        ? await ctx.db.get(patient.doctorId)
        : null;

      if (doctor && doctor.createdBy === user._id) {
        return patient;
      }

      // Otherwise, deny access
      return null;
    } else if (user.role === "doctor") {
      // Doctor can only access if they created the patient or are assigned to it
      if (patient.createdBy === user._id || patient.doctorId === user._id) {
        return patient;
      }

      // Otherwise, deny access
      return null;
    }

    return null;
  },
});

// Create a new patient with minimal required fields
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

    // If doctorId is provided and user is main head, verify the doctor belongs to this main head
    if (patientData.doctorId && user.role === "mainHead") {
      const doctor = await ctx.db.get(patientData.doctorId);
      if (
        !doctor ||
        doctor.role !== "doctor" ||
        doctor.createdBy !== user._id
      ) {
        throw new Error("Not authorized to assign to this doctor");
      }
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

    // Check if user has permission to update this patient
    let hasPermission = false;

    if (user.role === "mainHead") {
      // Main head can update if they created the patient directly
      if (existingPatient.createdBy === user._id) {
        hasPermission = true;
      } else if (existingPatient.doctorId) {
        // Or if the patient's doctor was created by this main head
        const doctor = await ctx.db.get(existingPatient.doctorId);
        if (doctor && doctor.createdBy === user._id) {
          hasPermission = true;
        }
      }
    } else if (user.role === "doctor") {
      // Doctor can update if they created or are assigned to the patient
      if (
        existingPatient.createdBy === user._id ||
        existingPatient.doctorId === user._id
      ) {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      throw new Error("Not authorized to update this patient");
    }

    // If doctorId is provided and user is main head, verify the doctor belongs to this main head
    if (patientData.doctorId && user.role === "mainHead") {
      const doctor = await ctx.db.get(patientData.doctorId);
      if (
        !doctor ||
        doctor.role !== "doctor" ||
        doctor.createdBy !== user._id
      ) {
        throw new Error("Not authorized to assign to this doctor");
      }
    }

    // Update the patient record
    await ctx.db.patch(patientId, {
      ...patientData,
      updatedAt: Date.now(),
      lastModifiedBy: user._id,
    });

    return { success: true, patientId };
  },
});

export const getDoctorsUnderMainHead = query({
  args: {
    mainHeadId: v.id("users"),
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Get all doctors created by this main head
    const doctors = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("role"), "doctor"),
          q.eq(q.field("createdBy"), args.mainHeadId)
        )
      )
      .collect();

    return doctors.map((doctor: { _id: Id<"users"> }) => doctor._id);
  },
});

// Delete a patient
export const deletePatient = mutation({
  args: {
    patientId: v.id("patients"),
    token: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Authenticate user
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

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Only main head or the doctor who created the patient can delete
    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      throw new ConvexError("Patient not found");
    }

    // Check if the current user has permission to delete this patient
    if (user.role === "mainHead") {
      // If main head, check if they created the patient or if it was created by one of their doctors
      if (patient.createdBy === user._id) {
        // Main head created the patient directly
        await ctx.db.delete(args.patientId);
        return { success: true };
      }

      // Check if the patient's doctor was created by this main head
      if (patient.doctorId) {
        const doctor = await ctx.db.get(patient.doctorId);
        if (doctor && doctor.createdBy === user._id) {
          await ctx.db.delete(args.patientId);
          return { success: true };
        }
      }

      throw new ConvexError("Not authorized to delete this patient");
    } else if (user.role === "doctor") {
      // Doctors can only delete patients they created or are assigned to
      if (patient.createdBy === user._id || patient.doctorId === user._id) {
        await ctx.db.delete(args.patientId);
        return { success: true };
      }
      throw new ConvexError("Not authorized to delete this patient");
    }

    throw new ConvexError("Not authorized to delete patients");
  },
});
