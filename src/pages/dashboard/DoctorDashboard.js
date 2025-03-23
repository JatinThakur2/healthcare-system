import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
  Today as TodayIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get auth token from localStorage
  const authToken = localStorage.getItem("authToken");

  // Add debugging to check values
  console.log("Current user:", user);
  console.log("User ID:", user?._id);
  console.log("Auth token:", authToken ? "Token exists" : "No token");

  // Pass both doctorId and token to the query
  const myPatients =
    useQuery(
      api.patients.getPatientsByDoctor,
      user?._id && authToken
        ? { doctorId: user._id, token: authToken }
        : undefined
    ) || [];

  // More debugging
  console.log("Retrieved patients:", myPatients ? myPatients.length : 0);

  if (myPatients === undefined) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const todaysPatients = myPatients.filter((patient) => {
    const today = new Date();
    const patientDate = new Date(patient.date);
    return (
      patientDate.getDate() === today.getDate() &&
      patientDate.getMonth() === today.getMonth() &&
      patientDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate incomplete forms - checking for empty fields
  const incompletePatients = myPatients.filter((patient) => {
    // Check for essential fields that should be filled
    const essentialFields = [
      patient.ipd_opd_no,
      patient.age || patient.dob,
      patient.gender,
      patient.contactNo,
    ];

    return essentialFields.some((field) => !field);
  });

  const stats = [
    {
      title: "My Patients",
      value: myPatients.length,
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      action: () => navigate("/patients"),
      actionText: "View All Patients",
    },
    {
      title: "Today's Patients",
      value: todaysPatients.length,
      icon: <TodayIcon fontSize="large" color="info" />,
      action: () => navigate("/patients"),
      actionText: "View Today's Patients",
    },
    {
      title: "Incomplete Forms",
      value: incompletePatients.length,
      icon: <ErrorIcon fontSize="large" color="error" />,
      action: () => navigate("/patients"),
      actionText: "Review Incomplete Forms",
    },
    {
      title: "Add New Patient",
      value: "+",
      icon: <PersonAddIcon fontSize="large" color="success" />,
      action: () => navigate("/patients/new"),
      actionText: "Add Patient",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, Dr. {user?.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h5" component="div" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h3" color="text.secondary" gutterBottom>
                  {stat.value}
                </Typography>
                <Button size="small" onClick={stat.action} sx={{ mt: 1 }}>
                  {stat.actionText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Patients
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {myPatients.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No patients found. Add some patients to get started.
          </Typography>
        ) : (
          myPatients.slice(0, 10).map((patient) => (
            <Box
              key={patient._id}
              sx={{
                py: 1.5,
                px: 1,
                borderBottom: "1px solid #eee",
                "&:last-child": { borderBottom: "none" },
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                cursor: "pointer",
              }}
              onClick={() => navigate(`/patients/${patient._id}`)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  {patient.ipd_opd_no}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(patient.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  {patient.gender || "?"}, {patient.age || "?"} years
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    patient.provisionalDiagnosis ? "success.main" : "error.main"
                  }
                >
                  {patient.provisionalDiagnosis
                    ? "Diagnosed"
                    : "Pending diagnosis"}
                </Typography>
              </Box>
            </Box>
          ))
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/patients")}
          >
            View All Patients
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/patients/new")}
          >
            Add New Patient
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;
