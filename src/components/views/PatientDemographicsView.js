import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Chip,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  MedicalServices as MedicalIcon,
  EventNote as EventIcon,
  Wc as GenderIcon,
  Cake as BirthdayIcon,
} from "@mui/icons-material";

const PatientDemographicsView = ({ patient }) => {
  // Helper function to format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "Not provided";
    return new Date(timestamp).toLocaleDateString();
  };

  // Format field names for better display
  const formatFieldName = (name) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Render a field with label, value and icon
  const renderField = (label, value, icon, defaultValue = "Not provided") => (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: "primary.light",
          mr: 2,
          width: 36,
          height: 36,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || defaultValue}
        </Typography>
      </Box>
    </Box>
  );

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine gender icon color
  const getGenderColor = (gender) => {
    if (gender === "male") return "#2196f3";
    if (gender === "female") return "#e91e63";
    return "#9c27b0"; // other
  };

  return (
    <>
      <Card elevation={2} sx={{ mb: 4, overflow: "visible" }}>
        <CardContent sx={{ pt: 4, pb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                fontSize: "1.5rem",
                mr: 2,
              }}
            >
              {getInitials(patient.name)}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {patient.name || "Unnamed Patient"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {patient.ipd_opd_no || "Not assigned"}
              </Typography>
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Chip
                label={
                  patient.consentObtained ? "Consent Obtained" : "No Consent"
                }
                color={patient.consentObtained ? "success" : "error"}
                sx={{ fontWeight: "medium" }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  height: "100%",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Personal Information
                </Typography>

                {renderField(
                  "Gender",
                  patient.gender ? formatFieldName(patient.gender) : null,
                  <GenderIcon sx={{ color: getGenderColor(patient.gender) }} />
                )}

                {renderField(
                  "Age",
                  patient.age ? `${patient.age} years` : null,
                  <PersonIcon />
                )}

                {renderField(
                  "Date of Birth",
                  formatDate(patient.dob),
                  <BirthdayIcon />
                )}

                {renderField(
                  "Contact Number",
                  patient.contactNo,
                  <PhoneIcon />
                )}

                {renderField("Address", patient.address, <HomeIcon />)}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  height: "100%",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Social Information
                </Typography>

                {renderField(
                  "Marital Status",
                  patient.maritalStatus
                    ? formatFieldName(patient.maritalStatus)
                    : null,
                  <PersonIcon />
                )}

                {renderField(
                  "Employment Status",
                  patient.employmentStatus
                    ? formatFieldName(patient.employmentStatus)
                    : null,
                  <WorkIcon />
                )}

                {renderField(
                  "Economic Status",
                  patient.economicStatus
                    ? formatFieldName(patient.economicStatus)
                    : null,
                  <MoneyIcon />
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Medical Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {renderField(
                      "Provisional Diagnosis",
                      patient.provisionalDiagnosis,
                      <MedicalIcon />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    {renderField(
                      "Final Diagnosis",
                      patient.finalDiagnosis,
                      <EventIcon />
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Complaints Section */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
            Patient Complaints
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {patient.complaints && patient.complaints.length > 0 ? (
            patient.complaints.map((complaint, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Symptom
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {complaint.symptom || "Not specified"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Severity
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {complaint.severity || "Not specified"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {complaint.duration || "Not specified"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No complaints recorded for this patient.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PatientDemographicsView;
