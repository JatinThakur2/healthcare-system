// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    hashedPassword: v.string(),
    role: v.string(), // 'mainHead' or 'doctor'
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.optional(v.id("users")), // Reference to main head who created this doctor
    isActive: v.boolean(),
  }),

  patients: defineTable({
    // Social-Demographic Parameters
    ipd_opd_no: v.string(),
    date: v.number(), // Timestamp
    age: v.optional(v.number()),
    dob: v.optional(v.number()), // Timestamp
    gender: v.optional(v.string()), // 'male' or 'female'
    contactNo: v.optional(v.string()),
    address: v.optional(v.string()),
    maritalStatus: v.optional(v.string()), // 'married', 'unmarried', 'divorced', 'widowed'
    employmentStatus: v.optional(v.string()), // 'employed', 'unemployed', 'student', 'retired'
    economicStatus: v.optional(v.string()), // 'upperClass', 'upperMiddleClass', 'lowerMiddleClass', 'lowerClass'
    provisionalDiagnosis: v.optional(v.string()),
    finalDiagnosis: v.optional(v.string()),

    // Patient Complaints as JSON
    complaints: v.optional(
      v.array(
        v.object({
          symptom: v.string(),
          severity: v.string(),
          duration: v.string(),
        })
      )
    ),

    // Medical History as JSON
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

    // Past/Family History
    pastFamilyHistory: v.optional(
      v.array(
        v.object({
          condition: v.string(),
          details: v.string(),
        })
      )
    ),

    // Anthropometric Parameters
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

    // Clinical Parameters
    clinicalParameters: v.optional(
      v.object({
        bloodPressure: v.optional(v.string()),
        oxygenSaturation: v.optional(v.string()),
        polysomnographyResults: v.optional(v.string()),
        heartRateVariability: v.optional(v.string()),
        electrocardiogram: v.optional(v.string()),
      })
    ),

    // Laboratory Investigation
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

    // Lifestyle Factors
    lifestyleFactors: v.optional(
      v.object({
        physicalActivity: v.optional(v.string()), // 'sedentary', 'lightActivity', etc.
        smoking: v.optional(v.string()), // 'nonSmoker', 'experimentalSmoker', etc.
        eatingHabit: v.optional(v.string()), // 'unhealthyDiet', 'irregularDiet', etc.
        alcoholIntake: v.optional(v.string()), // 'nonDrinker', 'occasionalDrinker', etc.
      })
    ),

    // Risk Factors
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

    // Treatment Plan
    treatmentPlan: v.optional(
      v.object({
        oralApplianceTherapy: v.optional(v.boolean()),
        cpapTherapy: v.optional(v.boolean()),
        surgery: v.optional(v.boolean()),
        epworthSleepScaleScore: v.optional(v.string()),
        sleepApneaCardiovascularRiskScore: v.optional(v.string()),
        dateOfStart: v.optional(v.number()), // Timestamp
        dateOfStop: v.optional(v.number()), // Timestamp
      })
    ),

    // SAQLI Questionnaire
    saqliQuestionnaire: v.optional(
      v.object({
        dailyFunctioning: v.object({
          troubleWithDailyActivities: v.optional(v.string()), // 'rarely', 'sometimes', etc.
          concentrationAffected: v.optional(v.string()), // 'notAtAll', 'slightly', etc.
          physicallyFatigued: v.optional(v.string()), // 'rarely', 'sometimes', etc.
        }),
        socialInteractions: v.object({
          socialGatheringsAffected: v.optional(v.string()), // 'notAtAll', 'slightly', etc.
          feltIsolated: v.optional(v.string()), // 'never', 'rarely', etc.
          familySupport: v.optional(v.string()), // 'none', 'minimal', etc.
        }),
        emotionalFunctioning: v.object({
          frustration: v.optional(v.string()), // 'rarely', 'sometimes', etc.
          depression: v.optional(v.string()), // 'notAtAll', 'slightly', etc.
        }),
        symptoms: v.object({
          unrefreshedOrHeadache: v.optional(v.string()), // 'rarely', 'sometimes', etc.
          snoringAffected: v.optional(v.string()), // 'notAtAll', 'slightly', etc.
          chestDiscomfortOrPalpitations: v.optional(v.string()), // 'rarely', 'sometimes', etc.
        }),
      })
    ),

    createdBy: v.id("users"),
    doctorId: v.optional(v.id("users")), // Reference to doctor user
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
    lastModifiedBy: v.id("users"),
    consentObtained: v.optional(v.boolean()),
  }),

  // Add a sessions table for authentication
  sessions: defineTable({
    userId: v.id("users"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }),
});
