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

const processAgeData = (patients) => {
  if (!patients) return [];
  const ageGroups = {
    "0-19": 0,
    "20-39": 0,
    "40-59": 0,
    "60-79": 0,
    "80+": 0,
  };

  patients.forEach((p) => {
    // Prefer explicit age field; fallback to dob (stored as timestamp in ms) if age absent.
    let age = undefined;
    if (typeof p.age === "number") {
      age = p.age;
    } else if (typeof p.dob === "number") {
      const birthYear = new Date(p.dob).getFullYear();
      age = new Date().getFullYear() - birthYear;
    }
    if (typeof age !== "number" || isNaN(age)) return; // skip if cannot determine age
    if (age >= 0 && age <= 19) ageGroups["0-19"]++;
    else if (age >= 20 && age <= 39) ageGroups["20-39"]++;
    else if (age >= 40 && age <= 59) ageGroups["40-59"]++;
    else if (age >= 60 && age <= 79) ageGroups["60-79"]++;
    else if (age >= 80) ageGroups["80+"]++;
  });

  return Object.keys(ageGroups).map((key) => ({
    name: key,
    count: ageGroups[key],
  }));
};

const AgeDistributionChart = ({ patients }) => {
  const data = processAgeData(patients);
  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Patient Age Distribution
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#ff9800" name="Patients" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AgeDistributionChart;
