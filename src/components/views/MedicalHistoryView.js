import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Favorite as HeartIcon,
  Bloodtype as StrokeIcon,
  Monitor as DiabetesIcon,
  AirlineSeatLegroomExtra as COPDIcon,
  Air as AsthmaIcon,
  Psychology as NeurologicalIcon,
  Healing as HypertensionIcon,
  MedicalServices as MedicalIcon,
  HistoryEdu as HistoryIcon,
  ArrowCircleUp as PresentIcon,
  Cancel as AbsentIcon,
} from "@mui/icons-material";

const MedicalHistoryView = ({ patient }) => {
  // Format field names for better display

  // Render a field with label and value
  const renderField = (label, value, defaultValue = "Not provided") => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value || defaultValue}
      </Typography>
    </Box>
  );

  // Check if medical history exists
  const hasHistory =
    patient.medicalHistory && Object.keys(patient.medicalHistory).length > 0;
  const medicalHistory = patient.medicalHistory || {};

  // Check if past/family history exists
  const hasPastFamilyHistory =
    patient.pastFamilyHistory && patient.pastFamilyHistory.length > 0;

  // Array of conditions to display with icons
  const conditions = [
    { key: "hypertension", label: "Hypertension", icon: <HypertensionIcon /> },
    { key: "heartDisease", label: "Heart Disease", icon: <HeartIcon /> },
    { key: "stroke", label: "Stroke", icon: <StrokeIcon /> },
    { key: "diabetes", label: "Diabetes", icon: <DiabetesIcon /> },
    { key: "copd", label: "COPD", icon: <COPDIcon /> },
    { key: "asthma", label: "Asthma", icon: <AsthmaIcon /> },
    {
      key: "neurologicalDisorders",
      label: "Neurological Disorders",
      icon: <NeurologicalIcon />,
    },
  ];

  return (
    <>
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MedicalIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary.main">
                Medical Conditions
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          {!hasHistory ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No medical history recorded.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Medical conditions */}
              {conditions.map((condition) => {
                const conditionData = medicalHistory[condition.key];
                const isPresent = conditionData?.status;

                return (
                  <Grid item xs={12} md={6} key={condition.key}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: isPresent
                          ? "error.light"
                          : "success.light",
                        backgroundColor: isPresent
                          ? "error.lightest"
                          : "success.lightest",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: isPresent
                                ? "error.main"
                                : "success.main",
                              mr: 1.5,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {condition.icon}
                          </Avatar>
                          <Typography variant="h6">
                            {condition.label}
                          </Typography>
                        </Box>
                        <Tooltip
                          title={
                            isPresent ? "Condition Present" : "Condition Absent"
                          }
                        >
                          <Avatar
                            sx={{
                              bgcolor: isPresent
                                ? "error.lightest"
                                : "success.lightest",
                              color: isPresent ? "error.main" : "success.main",
                            }}
                          >
                            {isPresent ? <PresentIcon /> : <AbsentIcon />}
                          </Avatar>
                        </Tooltip>
                      </Box>

                      {isPresent && (
                        <Box
                          sx={{
                            mt: 2,
                            pl: 2,
                            borderLeft: "2px solid",
                            borderColor: "error.light",
                          }}
                        >
                          {renderField("Duration", conditionData?.duration)}
                          {renderField("Treatment", conditionData?.treatment)}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}

              {/* Other conditions */}
              {medicalHistory.otherConditions && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "primary.light",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "primary.main" }}
                    >
                      Other Conditions
                    </Typography>
                    <Typography variant="body1">
                      {medicalHistory.otherConditions}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <HistoryIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="primary.main">
                Past/Family History
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          {!hasPastFamilyHistory ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No past or family history recorded.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {patient.pastFamilyHistory.map((history, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: 1,
                      },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Chip
                            label="Condition"
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            {history.condition || "Not specified"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Chip
                            label="Details"
                            size="small"
                            color="secondary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body1">
                            {history.details || "Not specified"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MedicalHistoryView;
