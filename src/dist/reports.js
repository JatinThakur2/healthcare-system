import { query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
// Get patient statistics for dashboard
export const getPatientStatistics = query({
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
        // Get all patients or only those assigned to current doctor
        const patientsQuery = user.role === "mainHead"
            ? ctx.db.query("patients")
            : ctx.db
                .query("patients")
                .filter((q) => q.eq(q.field("doctorId"), user._id));
        const patients = await patientsQuery.collect();
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
            other: patients.filter((p) => p.gender && p.gender !== "male" && p.gender !== "female").length,
            notSpecified: patients.filter((p) => !p.gender).length,
        };
        // Get diagnosis distribution
        const diagnosisCount = {};
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
            .map(([diagnosis, count]) => ({ diagnosis, count }));
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
    async handler(ctx) {
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
        // Get all doctors
        const doctors = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "doctor"))
            .collect();
        // Get all patients
        const patients = await ctx.db.query("patients").collect();
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
    },
    async handler(ctx, args) {
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
        // Default to current year if not specified
        const year = args.year || new Date().getFullYear();
        // Get all patients based on user role and args
        let patientsQuery = ctx.db.query("patients");
        if (user.role === "doctor") {
            // Doctors can only see their patients
            patientsQuery = patientsQuery.filter((q) => q.eq(q.field("doctorId"), user._id));
        }
        else if (args.doctorId) {
            // Main head can filter by doctor
            patientsQuery = patientsQuery.filter((q) => q.eq(q.field("doctorId"), args.doctorId));
        }
        const patients = await patientsQuery.collect();
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
        // Get all requested patients
        const patients = await Promise.all(args.patientIds.map(async (id) => {
            const patient = await ctx.db.get(id);
            // Check permission based on role
            if (user.role === "doctor" && patient.doctorId !== user._id) {
                // Doctors can only export their own patients
                return null;
            }
            return patient;
        }));
        // Filter out null values (patients the user can't access)
        const accessiblePatients = patients.filter((p) => p !== null);
        // Get doctor names for the patients
        const doctorIds = [
            ...new Set(accessiblePatients.map((p) => p.doctorId).filter((id) => id)),
        ];
        const doctors = await Promise.all(doctorIds.map(async (id) => {
            return await ctx.db.get(id);
        }));
        // Create a doctorId to name mapping
        const doctorMap = {};
        doctors.forEach((doctor) => {
            if (doctor) {
                doctorMap[doctor._id] = doctor.name;
            }
        });
        // Add doctor names to patient data
        const patientsWithDoctorNames = accessiblePatients.map((p) => ({
            ...p,
            doctorName: p.doctorId
                ? doctorMap[p.doctorId] || "Unknown"
                : "Not Assigned",
        }));
        return patientsWithDoctorNames;
    },
});
