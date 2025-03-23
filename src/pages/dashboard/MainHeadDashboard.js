import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
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
  PeopleAlt as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const MainHeadDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Pass token to queries
  const doctors =
    useQuery(
      api.doctors.getDoctorsWithPatientCounts,
      token ? { token } : undefined
    ) || [];

  const allPatients =
    useQuery(api.patients.getAllPatients, token ? { token } : undefined) || [];

  if (!doctors || !allPatients) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const todaysPatients = allPatients.filter((patient) => {
    const today = new Date();
    const patientDate = new Date(patient.date);
    return (
      patientDate.getDate() === today.getDate() &&
      patientDate.getMonth() === today.getMonth() &&
      patientDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate incomplete forms - checking for empty fields
  const incompletePatients = allPatients.filter((patient) => {
    // Check for essential fields that should be filled
    const essentialFields = [
      patient.ipd_opd_no,
      patient.age || patient.dob,
      patient.gender,
      patient.contactNo,
    ];

    return essentialFields.some((field) => !field);
  });

  // Calculate total patient count from all doctors
  const totalPatientCount = doctors.reduce(
    (sum, doctor) => sum + (doctor.patientCount || 0),
    0
  );

  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: <PeopleIcon fontSize="large" color="primary" />,
      action: () => navigate("/doctors"),
      actionText: "Manage Doctors",
    },
    {
      title: "Total Patients",
      value: allPatients.length || totalPatientCount,
      icon: <AssignmentIcon fontSize="large" color="secondary" />,
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
      icon: <PersonAddIcon fontSize="large" color="error" />,
      action: () => navigate("/patients"),
      actionText: "Review Incomplete Forms",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Main Head Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Doctors
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {doctors.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No doctors found. Add some doctors to get started.
              </Typography>
            ) : (
              doctors.slice(0, 5).map((doctor) => (
                <Box
                  key={doctor._id}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #eee",
                    "&:last-child": { borderBottom: "none" },
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/patients?doctorId=${doctor._id}`)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">{doctor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.email}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {doctor.isActive ? (
                        <span style={{ color: "green" }}>Active</span>
                      ) : (
                        <span style={{ color: "red" }}>Inactive</span>
                      )}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Patients: {doctor.patientCount || 0}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/doctors")}
              sx={{ mt: 2 }}
            >
              View All Doctors
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Patients
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {allPatients.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No patients found. Add some patients to get started.
              </Typography>
            ) : (
              allPatients.slice(0, 5).map((patient) => (
                <Box
                  key={patient._id}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid #eee",
                    "&:last-child": { borderBottom: "none" },
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
                    <Typography variant="body1">
                      {patient.ipd_opd_no || "No ID"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(patient.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {patient.gender || "Unknown"}, {patient.age || "?"} years
                    {patient.doctorId && (
                      <span>
                        {" "}
                        • Dr.{" "}
                        {doctors.find((d) => d._id === patient.doctorId)
                          ?.name || "Unknown"}
                      </span>
                    )}
                  </Typography>
                </Box>
              ))
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/patients")}
              sx={{ mt: 2 }}
            >
              View All Patients
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainHeadDashboard;
