import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Value -> numeric score mappings per answer set
// Scales chosen so higher = worse (adjust if you prefer opposite)
const SCALES = {
  frequency4: { rarely: 1, sometimes: 2, often: 3, veryOften: 4 },
  intensity4: { notAtAll: 1, slightly: 2, moderately: 3, veryMuch: 4 },
  presence4: { never: 1, rarely: 2, sometimes: 3, often: 4 },
  support4: { none: 1, minimal: 2, moderate: 3, significant: 4 },
  binary4: { always: 4 }, // used where options include 'always'; other keys will map elsewhere
};

// Field-level configuration describing where each question lives and which scale to apply
const FIELD_CONFIG = {
  // Daily Functioning
  troubleWithDailyActivities: {
    section: "dailyFunctioning",
    scale: "frequency4",
  },
  concentrationAffected: { section: "dailyFunctioning", scale: "intensity4" },
  physicallyFatigued: { section: "dailyFunctioning", scale: "frequency4" },
  // Social
  socialGatheringsAffected: {
    section: "socialInteractions",
    scale: "intensity4",
  },
  feltIsolated: { section: "socialInteractions", scale: "presence4" },
  familySupport: { section: "socialInteractions", scale: "support4" },
  // Emotional
  frustration: {
    section: "emotionalFunctioning",
    scale: "frequency4",
    extra: { always: 4 },
  },
  depression: { section: "emotionalFunctioning", scale: "intensity4" },
  // Symptoms
  unrefreshedOrHeadache: { section: "symptoms", scale: "frequency4" },
  snoringAffected: { section: "symptoms", scale: "intensity4" },
  chestDiscomfortOrPalpitations: {
    section: "symptoms",
    scale: "frequency4",
    extra: { always: 4 },
  },
};

const mapAnswerToScore = (field, raw) => {
  if (raw === undefined || raw === null || raw === "") return 0;
  const cfg = FIELD_CONFIG[field];
  if (!cfg) return 0;
  const base = SCALES[cfg.scale] || {};
  const extra = cfg.extra || {};
  const merged = { ...base, ...extra };
  return merged[raw] !== undefined ? merged[raw] : 0;
};

/*
 Expected questionnaire structure (example):
 saqliQuestionnaire: {
   troubleDailyActivities: 4,
   concentrationAffected: 3,
   physicallyFatigued: 5,
   socialGatheringsAffected: 2,
   feltIsolated: 1,
   familySupport: 6,
   frustration: 3,
   depression: 2,
   unrefreshedOrHeadache: 4,
   snoringAffected: 5,
   chestDiscomfortOrPalpitations: 1
 }

 Categories (as per user request & provided image):
  Daily Functioning -> troubleDailyActivities, concentrationAffected, physicallyFatigued
  Social -> socialGatheringsAffected, feltIsolated, familySupport
  Emotional -> frustration, depression
  Symptoms -> unrefreshedOrHeadache, snoringAffected, chestDiscomfortOrPalpitations

 We compute average per category (sum / number of items with any response) or total count; here we choose average for intuitive comparison. If all zeros, category will be zero.
*/

const CATEGORY_DEFS = [
  {
    key: "Daily Functioning",
    fields: [
      "troubleWithDailyActivities",
      "concentrationAffected",
      "physicallyFatigued",
    ],
  },
  {
    key: "Social",
    fields: ["socialGatheringsAffected", "feltIsolated", "familySupport"],
  },
  { key: "Emotional", fields: ["frustration", "depression"] },
  {
    key: "Symptoms",
    fields: [
      "unrefreshedOrHeadache",
      "snoringAffected",
      "chestDiscomfortOrPalpitations",
    ],
  },
];

const processSAQLIData = (patients) => {
  if (!patients) return [];

  // Initialize accumulators
  const accum = CATEGORY_DEFS.map((c) => ({ key: c.key, sum: 0, count: 0 }));

  patients.forEach((p) => {
    const root = p.saqliQuestionnaire || p.saqli; // permit legacy root naming
    if (!root || typeof root !== "object") return;

    CATEGORY_DEFS.forEach((cat, idx) => {
      cat.fields.forEach((field) => {
        const cfg = FIELD_CONFIG[field];
        if (!cfg) return;
        const sectionObj = root[cfg.section];
        const rawVal = sectionObj ? sectionObj[field] : root[field]; // fallback if stored flat
        const score = mapAnswerToScore(field, rawVal);
        if (score > 0) {
          accum[idx].sum += score;
          accum[idx].count += 1;
        }
      });
    });
  });

  // Transform to chart data (average per category)
  return accum.map((a) => ({
    category: a.key,
    average: a.count > 0 ? Number((a.sum / a.count).toFixed(2)) : 0,
  }));
};

const SAQLIScoresChart = ({ patients }) => {
  const data = processSAQLIData(patients);
  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        SAQLI Category Averages
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" fill="#f44336" name="Average Score" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SAQLIScoresChart;
