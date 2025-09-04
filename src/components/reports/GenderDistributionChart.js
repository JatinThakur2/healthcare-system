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

const processGenderData = (patients) => {
  if (!patients) return [];
  const genderCounts = patients.reduce(
    (acc, p) => {
      if (p.gender === "male") {
        acc.male++;
      } else if (p.gender === "female") {
        acc.female++;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  return [
    { name: "Male", count: genderCounts.male },
    { name: "Female", count: genderCounts.female },
  ];
};

const GenderDistributionChart = ({ patients }) => {
  const data = processGenderData(patients);
  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Patient Gender Distribution
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
          <Bar dataKey="count" fill="#4caf50" name="Patients" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default GenderDistributionChart;
