import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
// Get all doctors with their patient counts
export const getDoctorsWithPatientCounts = query({
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
        // Get all patients
        const patients = await ctx.db.query("patients").collect();
        // Calculate patient counts for each doctor
        const doctorsWithCounts = await Promise.all(doctors.map(async (doctor) => {
            const patientCount = patients.filter((patient) => patient.doctorId === doctor._id).length;
            return {
                _id: doctor._id,
                email: doctor.email,
                name: doctor.name,
                createdAt: doctor.createdAt,
                isActive: doctor.isActive,
                patientCount,
            };
        }));
        return doctorsWithCounts;
    },
});
// Update doctor status (active/inactive)
export const updateDoctorStatus = mutation({
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
    args: { doctorId: v.id("users") },
    async handler(ctx, args) {
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
        const doctor = await ctx.db.get(args.doctorId);
        if (!doctor || doctor.role !== "doctor") {
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
