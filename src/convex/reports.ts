import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define types for objects and parameters
type PatientStatistics = {
  totalPatients: number;
  todaysPatients: number;
  incompletePatients: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    notSpecified: number;
  };
  topDiagnoses: Array<{ diagnosis: string; count: number }>;
};

type DiagnosisCount = {
  [key: string]: number;
};

type DoctorMap = {
  [key: string]: string;
};

type MonthlyPatientTrendsArgs = {
  year?: number;
  doctorId?: Id<"users">;
  token?: string;
};

type PatientDataForExportArgs = {
  patientIds: Array<Id<"patients">>;
};

// User type to help with TypeScript type checking
type User = {
  _id: Id<"users">;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: number;
  hashedPassword: string;
  updatedAt: number;
  createdBy?: Id<"users">;
};

// Get patient statistics for dashboard
export const getPatientStatistics = query({
  async handler(ctx: QueryCtx): Promise<PatientStatistics | null> {
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

    // Build scoped patient list according to role (mirror logic from getAllPatients)
    let patients: any[] = [];
    if (user.role === "doctor") {
      patients = await ctx.db
        .query("patients")
        .filter((q) =>
          q.or(
            q.eq(q.field("doctorId"), user._id),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();
    } else if (user.role === "mainHead") {
      // Get doctors created by this main head
      const doctors = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("role"), "doctor"),
            q.eq(q.field("createdBy"), user._id)
          )
        )
        .collect();
      const doctorIds = doctors.map((d) => d._id);
      const allPatients = await ctx.db.query("patients").collect();
      patients = allPatients.filter(
        (p) =>
          p.createdBy === user._id ||
          (p.doctorId && doctorIds.includes(p.doctorId))
      );
    }

    // Calculate total patients
    const totalPatients = patients.length;

    // Calculate today's patients
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todaysPatients = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      patientDate.setHours(0, 0, 0, 0);
      return patientDate.getTime() === todayTimestamp;
    }).length;

    // Calculate incomplete forms
    const incompletePatients = patients.filter((patient) => {
      // Check for essential fields that should be filled
      const essentialFields = [
        patient.ipd_opd_no,
        patient.age || patient.dob,
        patient.gender,
        patient.contactNo,
        patient.provisionalDiagnosis,
      ];

      return essentialFields.some((field) => !field);
    }).length;

    // Get gender distribution
    const genderDistribution = {
      male: patients.filter((p) => p.gender === "male").length,
      female: patients.filter((p) => p.gender === "female").length,
      other: patients.filter(
        (p) => p.gender && p.gender !== "male" && p.gender !== "female"
      ).length,
      notSpecified: patients.filter((p) => !p.gender).length,
    };

    // Get diagnosis distribution
    const diagnosisCount: DiagnosisCount = {};
    patients.forEach((patient) => {
      if (patient.provisionalDiagnosis) {
        const diagnosis = patient.provisionalDiagnosis.trim();
        diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1;
      }
    });

    // Sort diagnoses by count and take top 5
    const topDiagnoses = Object.entries(diagnosisCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([diagnosis, count]) => ({ diagnosis, count: count as number }));

    return {
      totalPatients,
      todaysPatients,
      incompletePatients,
      genderDistribution,
      topDiagnoses,
    };
  },
});

// Get doctor statistics for main head
export const getDoctorStatistics = query({
  async handler(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user || user.role !== "mainHead") {
      return null;
    }

    // Get only doctors created by this main head
    const doctors = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("role"), "doctor"),
          q.eq(q.field("createdBy"), user._id)
        )
      )
      .collect();

    // Patients scoped to this main head network (own + their doctors)
    const doctorIds = doctors.map((d) => d._id);
    const allPatients = await ctx.db.query("patients").collect();
    const patients = allPatients.filter(
      (p) =>
        p.createdBy === user._id ||
        (p.doctorId && doctorIds.includes(p.doctorId))
    );

    // Calculate patient count per doctor
    const doctorStats = doctors.map((doctor) => {
      const doctorPatients = patients.filter((p) => p.doctorId === doctor._id);

      return {
        doctorId: doctor._id,
        name: doctor.name,
        patientCount: doctorPatients.length,
        incompleteFormCount: doctorPatients.filter((p) => {
          const essentialFields = [
            p.ipd_opd_no,
            p.age || p.dob,
            p.gender,
            p.contactNo,
            p.provisionalDiagnosis,
          ];

          return essentialFields.some((field) => !field);
        }).length,
        isActive: doctor.isActive,
      };
    });

    return {
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((d) => d.isActive).length,
      doctorStats,
    };
  },
});

// Get monthly patient trends for charts
export const getMonthlyPatientTrends = query({
  args: {
    year: v.optional(v.number()),
    doctorId: v.optional(v.id("users")),
    token: v.optional(v.string()), // Added token to validator
  },
  async handler(ctx: QueryCtx, args: MonthlyPatientTrendsArgs) {
    const identity = await ctx.auth.getUserIdentity();
    let user: User | null = null; // Corrected: Explicitly type the user variable

    if (identity) {
      user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .first();
    } else if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .filter((q) => q.eq(q.field("token"), args.token))
        .first();

      if (session) {
        user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), session.email))
          .first();
      }
    }

    if (!user) {
      return null;
    }

    // Capture non-nullable fields to satisfy TypeScript inside closures
    const currentUserId = user._id;
    const currentUserRole = user.role;

    // Default to current year if not specified
    const year = args.year || new Date().getFullYear();

    // Build base patients collection scoped to user network
    let scopedPatients: any[] = [];
    if (currentUserRole === "doctor") {
      scopedPatients = await ctx.db
        .query("patients")
        .filter((q) =>
          q.or(
            q.eq(q.field("doctorId"), currentUserId),
            q.eq(q.field("createdBy"), currentUserId)
          )
        )
        .collect();
    } else if (currentUserRole === "mainHead") {
      // Get doctors created by this main head
      const doctors = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("role"), "doctor"),
            q.eq(q.field("createdBy"), currentUserId)
          )
        )
        .collect();
      const doctorIds = doctors.map((d) => d._id);
      const allPatients = await ctx.db.query("patients").collect();
      scopedPatients = allPatients.filter(
        (p) =>
          p.createdBy === currentUserId ||
          (p.doctorId && doctorIds.includes(p.doctorId))
      );
    }

    // Optional filtering by specific doctor (only if that doctor belongs to network)
    let patients = scopedPatients;
    if (currentUserRole === "mainHead" && args.doctorId) {
      patients = patients.filter((p) => p.doctorId === args.doctorId);
    }

    // Initialize monthly data
    const monthlyData = Array(12)
      .fill(0)
      .map((_, index) => ({
        month: index + 1,
        monthName: new Date(year, index, 1).toLocaleString("default", {
          month: "short",
        }),
        count: 0,
      }));

    // Count patients by month
    patients.forEach((patient) => {
      const patientDate = new Date(patient.date);
      const patientYear = patientDate.getFullYear();
      const patientMonth = patientDate.getMonth();

      if (patientYear === year) {
        monthlyData[patientMonth].count++;
      }
    });

    return {
      year,
      monthlyData,
    };
  },
});

// Get patient data for export
export const getPatientDataForExport = query({
  args: { patientIds: v.array(v.id("patients")) },
  async handler(ctx: QueryCtx, args: PatientDataForExportArgs) {
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

    // Get all requested patients
    const patients = await Promise.all(
      args.patientIds.map(async (id) => {
        const patient = await ctx.db.get(id);

        // Check permission based on role
        if (
          user.role === "doctor" &&
          patient &&
          patient.doctorId !== user._id
        ) {
          // Doctors can only export their own patients
          return null;
        }

        return patient;
      })
    );

    // Filter out null values (patients the user can't access)
    const accessiblePatients = patients.filter((p) => p !== null);

    // Get doctor names for the patients
    const doctorIds = [
      ...new Set(
        accessiblePatients
          .map((p) => p?.doctorId)
          .filter((id): id is Id<"users"> => id !== undefined)
      ),
    ];

    const doctors = await Promise.all(
      doctorIds.map(async (id) => {
        const doctor = await ctx.db.get(id);
        return doctor as User | null;
      })
    );

    // Create a doctorId to name mapping
    const doctorMap: DoctorMap = {};
    doctors.forEach((doctor) => {
      if (doctor && doctor.name) {
        doctorMap[doctor._id.toString()] = doctor.name;
      }
    });

    // Add doctor names to patient data
    const patientsWithDoctorNames = accessiblePatients
      .map((p) => {
        if (!p) return null;
        return {
          ...p,
          doctorName:
            p.doctorId && doctorMap[p.doctorId.toString()]
              ? doctorMap[p.doctorId.toString()]
              : "Not Assigned",
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return patientsWithDoctorNames;
  },
});
