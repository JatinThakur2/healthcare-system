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
  args: { patientId: v.id("patients") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const patient = await ctx.db.get(args.patientId);
    if (!patient) {
      return null;
    }

    return patient;
  },
});

// Create a new patient
export const createPatient = mutation({
  args: {
    ipd_opd_no: v.string(),
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
    medicalHistory: v.optional(
      v.object({
        hypertension: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        heartDisease: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        stroke: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        diabetes: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        copd: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        asthma: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        neurologicalDisorders: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        otherConditions: v.optional(v.string()),
      })
    ),
    pastFamilyHistory: v.optional(
      v.array(
        v.object({
          condition: v.string(),
          details: v.string(),
        })
      )
    ),
    anthropometricParameters: v.optional(
      v.object({
        height: v.optional(v.number()),
        waistCircumference: v.optional(v.number()),
        bmi: v.optional(v.number()),
        neckCircumference: v.optional(v.number()),
        hipCircumference: v.optional(v.number()),
        waistHipRatio: v.optional(v.number()),
        pulse: v.optional(v.number()),
        temperature: v.optional(v.number()),
        bloodPressure: v.optional(v.string()),
        sleepStudyType: v.optional(v.string()),
        bodyWeight: v.optional(v.number()),
        oxygenSaturation: v.optional(v.number()),
        apneaHypopneaIndex: v.optional(v.number()),
        sleepEfficiency: v.optional(v.number()),
        sleepStages: v.optional(v.string()),
        otherFindings: v.optional(v.string()),
      })
    ),
    clinicalParameters: v.optional(
      v.object({
        bloodPressure: v.optional(v.string()),
        oxygenSaturation: v.optional(v.string()),
        polysomnographyResults: v.optional(v.string()),
        heartRateVariability: v.optional(v.string()),
        electrocardiogram: v.optional(v.string()),
      })
    ),
    laboratoryInvestigation: v.optional(
      v.object({
        hb: v.optional(v.number()),
        triglycerides: v.optional(v.number()),
        hdl: v.optional(v.number()),
        ldl: v.optional(v.number()),
        fbs: v.optional(v.number()),
        tsh: v.optional(v.number()),
        t3: v.optional(v.number()),
        t4: v.optional(v.number()),
        additionalTests: v.optional(
          v.array(
            v.object({
              name: v.string(),
              value: v.string(),
              normalRange: v.optional(v.string()),
            })
          )
        ),
      })
    ),
    lifestyleFactors: v.optional(
      v.object({
        physicalActivity: v.optional(v.string()),
        smoking: v.optional(v.string()),
        eatingHabit: v.optional(v.string()),
        alcoholIntake: v.optional(v.string()),
      })
    ),
    riskFactors: v.optional(
      v.object({
        traditionalRiskFactors: v.object({
          hyperlipidemia: v.optional(v.boolean()),
          diabetesMellitus: v.optional(v.boolean()),
          hypertension: v.optional(v.boolean()),
          obesity: v.optional(v.boolean()),
          smoking: v.optional(v.boolean()),
          familyHistory: v.optional(v.boolean()),
        }),
        nonTraditionalRiskFactors: v.object({
          sleepDisorder: v.optional(v.boolean()),
          airPollution: v.optional(v.boolean()),
          dietStyle: v.optional(v.boolean()),
          psychosocialFactor: v.optional(v.boolean()),
          chronicKidneyDisease: v.optional(v.boolean()),
          depressionAndAnxiety: v.optional(v.boolean()),
        }),
      })
    ),
    treatmentPlan: v.optional(
      v.object({
        oralApplianceTherapy: v.optional(v.boolean()),
        cpapTherapy: v.optional(v.boolean()),
        surgery: v.optional(v.boolean()),
        epworthSleepScaleScore: v.optional(v.string()),
        sleepApneaCardiovascularRiskScore: v.optional(v.string()),
        dateOfStart: v.optional(v.number()),
        dateOfStop: v.optional(v.number()),
      })
    ),
    saqliQuestionnaire: v.optional(
      v.object({
        dailyFunctioning: v.object({
          troubleWithDailyActivities: v.optional(v.string()),
          concentrationAffected: v.optional(v.string()),
          physicallyFatigued: v.optional(v.string()),
        }),
        socialInteractions: v.object({
          socialGatheringsAffected: v.optional(v.string()),
          feltIsolated: v.optional(v.string()),
          familySupport: v.optional(v.string()),
        }),
        emotionalFunctioning: v.object({
          frustration: v.optional(v.string()),
          depression: v.optional(v.string()),
        }),
        symptoms: v.object({
          unrefreshedOrHeadache: v.optional(v.string()),
          snoringAffected: v.optional(v.string()),
          chestDiscomfortOrPalpitations: v.optional(v.string()),
        }),
      })
    ),
    consentObtained: v.optional(v.boolean()),
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

    if (!user) {
      throw new ConvexError("User not found");
    }

    const timestamp = Date.now();

    const patientId = await ctx.db.insert("patients", {
      ...args,
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
export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),
    ipd_opd_no: v.optional(v.string()),
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
    complaints: v.optional(
      v.array(
        v.object({
          symptom: v.string(),
          severity: v.string(),
          duration: v.string(),
        })
      )
    ),
    medicalHistory: v.optional(
      v.object({
        hypertension: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        heartDisease: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        stroke: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        diabetes: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        copd: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        asthma: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        neurologicalDisorders: v.object({
          status: v.boolean(),
          duration: v.optional(v.string()),
          treatment: v.optional(v.string()),
        }),
        otherConditions: v.optional(v.string()),
      })
    ),
    pastFamilyHistory: v.optional(
      v.array(
        v.object({
          condition: v.string(),
          details: v.string(),
        })
      )
    ),
    anthropometricParameters: v.optional(
      v.object({
        height: v.optional(v.number()),
        waistCircumference: v.optional(v.number()),
        bmi: v.optional(v.number()),
        neckCircumference: v.optional(v.number()),
        hipCircumference: v.optional(v.number()),
        waistHipRatio: v.optional(v.number()),
        pulse: v.optional(v.number()),
        temperature: v.optional(v.number()),
        bloodPressure: v.optional(v.string()),
        sleepStudyType: v.optional(v.string()),
        bodyWeight: v.optional(v.number()),
        oxygenSaturation: v.optional(v.number()),
        apneaHypopneaIndex: v.optional(v.number()),
        sleepEfficiency: v.optional(v.number()),
        sleepStages: v.optional(v.string()),
        otherFindings: v.optional(v.string()),
      })
    ),
    clinicalParameters: v.optional(
      v.object({
        bloodPressure: v.optional(v.string()),
        oxygenSaturation: v.optional(v.string()),
        polysomnographyResults: v.optional(v.string()),
        heartRateVariability: v.optional(v.string()),
        electrocardiogram: v.optional(v.string()),
      })
    ),
    laboratoryInvestigation: v.optional(
      v.object({
        hb: v.optional(v.number()),
        triglycerides: v.optional(v.number()),
        hdl: v.optional(v.number()),
        ldl: v.optional(v.number()),
        fbs: v.optional(v.number()),
        tsh: v.optional(v.number()),
        t3: v.optional(v.number()),
        t4: v.optional(v.number()),
        additionalTests: v.optional(
          v.array(
            v.object({
              name: v.string(),
              value: v.string(),
              normalRange: v.optional(v.string()),
            })
          )
        ),
      })
    ),
    lifestyleFactors: v.optional(
      v.object({
        physicalActivity: v.optional(v.string()),
        smoking: v.optional(v.string()),
        eatingHabit: v.optional(v.string()),
        alcoholIntake: v.optional(v.string()),
      })
    ),
    riskFactors: v.optional(
      v.object({
        traditionalRiskFactors: v.object({
          hyperlipidemia: v.optional(v.boolean()),
          diabetesMellitus: v.optional(v.boolean()),
          hypertension: v.optional(v.boolean()),
          obesity: v.optional(v.boolean()),
          smoking: v.optional(v.boolean()),
          familyHistory: v.optional(v.boolean()),
        }),
        nonTraditionalRiskFactors: v.object({
          sleepDisorder: v.optional(v.boolean()),
          airPollution: v.optional(v.boolean()),
          dietStyle: v.optional(v.boolean()),
          psychosocialFactor: v.optional(v.boolean()),
          chronicKidneyDisease: v.optional(v.boolean()),
          depressionAndAnxiety: v.optional(v.boolean()),
        }),
      })
    ),
    treatmentPlan: v.optional(
      v.object({
        oralApplianceTherapy: v.optional(v.boolean()),
        cpapTherapy: v.optional(v.boolean()),
        surgery: v.optional(v.boolean()),
        epworthSleepScaleScore: v.optional(v.string()),
        sleepApneaCardiovascularRiskScore: v.optional(v.string()),
        dateOfStart: v.optional(v.number()),
        dateOfStop: v.optional(v.number()),
      })
    ),
    saqliQuestionnaire: v.optional(
      v.object({
        dailyFunctioning: v.object({
          troubleWithDailyActivities: v.optional(v.string()),
          concentrationAffected: v.optional(v.string()),
          physicallyFatigued: v.optional(v.string()),
        }),
        socialInteractions: v.object({
          socialGatheringsAffected: v.optional(v.string()),
          feltIsolated: v.optional(v.string()),
          familySupport: v.optional(v.string()),
        }),
        emotionalFunctioning: v.object({
          frustration: v.optional(v.string()),
          depression: v.optional(v.string()),
        }),
        symptoms: v.object({
          unrefreshedOrHeadache: v.optional(v.string()),
          snoringAffected: v.optional(v.string()),
          chestDiscomfortOrPalpitations: v.optional(v.string()),
        }),
      })
    ),
    consentObtained: v.optional(v.boolean()),
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

    if (!user) {
      throw new ConvexError("User not found");
    }

    const { patientId, ...updateData } = args;

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
