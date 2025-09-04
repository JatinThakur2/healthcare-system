import React from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MonthlyTrendsChart from "../../components/reports/MonthlyTrendsChart";
import RiskFactorsChart from "../../components/reports/RiskFactorsChart";
import GenderDistributionChart from "../../components/reports/GenderDistributionChart";
import AgeDistributionChart from "../../components/reports/AgeDistributionChart";
import SAQLIScoresChart from "../../components/reports/SAQLIScoresChart";

const ReportsPage = () => {
  const token = localStorage.getItem("authToken");

  const allPatients = useQuery(
    api.patients.getAllPatients,
    token ? { token } : undefined
  );
  const monthlyTrends = useQuery(
    api.reports.getMonthlyPatientTrends,
    token ? { token } : undefined
  );

  if (allPatients === undefined || monthlyTrends === undefined) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Visualize key metrics and trends in patient data.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MonthlyTrendsChart data={monthlyTrends} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RiskFactorsChart patients={allPatients} />
        </Grid>
        <Grid item xs={12} md={6}>
          <GenderDistributionChart patients={allPatients} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AgeDistributionChart patients={allPatients} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SAQLIScoresChart patients={allPatients} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
