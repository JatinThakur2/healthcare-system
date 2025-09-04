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
import { useAuth } from "../../context/AuthContext";

const MonthlyTrendsChart = ({ data }) => {
  const { isMainHead } = useAuth();
  const processedData = data?.monthlyData || [];

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Patient Registrations
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            fill={isMainHead ? "#1976d2" : "#9c27b0"}
            name="Patients"
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthlyTrendsChart;
