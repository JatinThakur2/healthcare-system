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

const processRiskFactorData = (patients) => {
  if (!patients) return [];

  const riskFactors = {
    hypertension: { M: 0, F: 0, Total: 0 },
    diabetesMellitus: { M: 0, F: 0, Total: 0 },
    hyperlipidemia: { M: 0, F: 0, Total: 0 },
    obesity: { M: 0, F: 0, Total: 0 },
    smoking: { M: 0, F: 0, Total: 0 },
    familyHistory: { M: 0, F: 0, Total: 0 },
  };

  patients.forEach((p) => {
    if (p.riskFactors?.traditionalRiskFactors) {
      Object.keys(p.riskFactors.traditionalRiskFactors).forEach((key) => {
        if (p.riskFactors.traditionalRiskFactors[key]) {
          if (riskFactors[key]) {
            riskFactors[key].Total++;
            if (p.gender === "male") {
              riskFactors[key].M++;
            } else if (p.gender === "female") {
              riskFactors[key].F++;
            }
          }
        }
      });
    }
  });

  return Object.keys(riskFactors).map((key) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    ...riskFactors[key],
  }));
};

const RiskFactorsChart = ({ patients }) => {
  const data = processRiskFactorData(patients);
  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Traditional CV Risk Factors by Gender
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="M" fill="#1976d2" name="Male" />
          <Bar dataKey="F" fill="#ba68c8" name="Female" />
          <Bar dataKey="Total" fill="#42a5f5" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RiskFactorsChart;
