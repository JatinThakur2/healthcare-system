import React from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Paper,
  Stack,
  LinearProgress,
  Tooltip,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import {
  MedicalServices as MedicalIcon,
  MasksOutlined as MaskIcon,
  HealingOutlined as HealingIcon,
  BedOutlined as BedIcon,
  EventOutlined as EventIcon,
  AssessmentOutlined as AssessmentIcon,
  ModelTraining as EvaluationIcon,
} from "@mui/icons-material";

const TreatmentPlanView = ({ patient }) => {
  // Get progress value and color based on score
  const getScoreProgress = (score) => {
    if (!score || score === "") return { value: 0, color: "info" };

    // For epworthSleepScaleScore (0-24, higher is worse)
    if (score.includes("/24") || score.includes("/20")) {
      const numericValue = parseInt(score.split("/")[0]);
      const maxValue = parseInt(score.split("/")[1]);
      const percent = (numericValue / maxValue) * 100;

      let color = "success";
      if (percent > 50) color = "warning";
      if (percent > 75) color = "error";

      return { value: percent, color };
    }

    // For other scores (assuming 0-100, higher is better)
    const numericValue = parseInt(score);
    if (isNaN(numericValue)) return { value: 50, color: "info" };

    let color = "error";
    if (numericValue > 30) color = "warning";
    if (numericValue > 70) color = "success";

    return { value: numericValue, color };
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return "Not scheduled";
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                  <MedicalIcon />
                </Avatar>
                <Typography variant="h6">Treatment Plan</Typography>
              </Box>
            }
            sx={{ bgcolor: "primary.lightest" }}
          />
          <Divider />
          <CardContent>
            {!patient.treatmentPlan ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No treatment plan recorded
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "primary.main", mb: 3 }}
                    >
                      Treatment Approaches
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{
                        flexWrap: { sm: "wrap" },
                        justifyContent: "center",
                        "& > div": {
                          flexGrow: 1,
                          width: { xs: "100%", sm: "auto" },
                          minWidth: { sm: "180px" },
                        },
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: patient.treatmentPlan
                            .oralApplianceTherapy
                            ? "primary.light"
                            : "divider",
                          bgcolor: patient.treatmentPlan.oralApplianceTherapy
                            ? "primary.lightest"
                            : "white",
                          opacity: patient.treatmentPlan.oralApplianceTherapy
                            ? 1
                            : 0.7,
                          textAlign: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            mx: "auto",
                            mb: 1,
                            bgcolor: patient.treatmentPlan.oralApplianceTherapy
                              ? "primary.main"
                              : "action.disabled",
                          }}
                        >
                          <MaskIcon />
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          fontWeight={
                            patient.treatmentPlan.oralApplianceTherapy
                              ? "medium"
                              : "normal"
                          }
                        >
                          Oral Appliance Therapy
                        </Typography>
                        <Chip
                          label={
                            patient.treatmentPlan.oralApplianceTherapy
                              ? "Active"
                              : "Not Applied"
                          }
                          size="small"
                          color={
                            patient.treatmentPlan.oralApplianceTherapy
                              ? "primary"
                              : "default"
                          }
                          sx={{ mt: 1 }}
                        />
                      </Paper>

                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: patient.treatmentPlan.cpapTherapy
                            ? "primary.light"
                            : "divider",
                          bgcolor: patient.treatmentPlan.cpapTherapy
                            ? "primary.lightest"
                            : "white",
                          opacity: patient.treatmentPlan.cpapTherapy ? 1 : 0.7,
                          textAlign: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            mx: "auto",
                            mb: 1,
                            bgcolor: patient.treatmentPlan.cpapTherapy
                              ? "primary.main"
                              : "action.disabled",
                          }}
                        >
                          <HealingIcon />
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          fontWeight={
                            patient.treatmentPlan.cpapTherapy
                              ? "medium"
                              : "normal"
                          }
                        >
                          CPAP Therapy
                        </Typography>
                        <Chip
                          label={
                            patient.treatmentPlan.cpapTherapy
                              ? "Active"
                              : "Not Applied"
                          }
                          size="small"
                          color={
                            patient.treatmentPlan.cpapTherapy
                              ? "primary"
                              : "default"
                          }
                          sx={{ mt: 1 }}
                        />
                      </Paper>

                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: patient.treatmentPlan.surgery
                            ? "primary.light"
                            : "divider",
                          bgcolor: patient.treatmentPlan.surgery
                            ? "primary.lightest"
                            : "white",
                          opacity: patient.treatmentPlan.surgery ? 1 : 0.7,
                          textAlign: "center",
                        }}
                      >
                        <Avatar
                          sx={{
                            mx: "auto",
                            mb: 1,
                            bgcolor: patient.treatmentPlan.surgery
                              ? "primary.main"
                              : "action.disabled",
                          }}
                        >
                          <BedIcon />
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          fontWeight={
                            patient.treatmentPlan.surgery ? "medium" : "normal"
                          }
                        >
                          Surgery
                        </Typography>
                        <Chip
                          label={
                            patient.treatmentPlan.surgery
                              ? "Planned"
                              : "Not Planned"
                          }
                          size="small"
                          color={
                            patient.treatmentPlan.surgery
                              ? "primary"
                              : "default"
                          }
                          sx={{ mt: 1 }}
                        />
                      </Paper>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: "rgba(0, 0, 0, 0.02)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "primary.main", mb: 2 }}
                    >
                      Treatment Timeline
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "success.lightest",
                              color: "success.main",
                              width: 32,
                              height: 32,
                              mr: 1,
                            }}
                          >
                            <EventIcon />
                          </Avatar>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Start Date
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{ pl: 5 }}
                        >
                          {formatDate(patient.treatmentPlan.dateOfStart)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "error.lightest",
                              color: "error.main",
                              width: 32,
                              height: 32,
                              mr: 1,
                            }}
                          >
                            <EventIcon />
                          </Avatar>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            End Date
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{ pl: 5 }}
                        >
                          {formatDate(patient.treatmentPlan.dateOfStop)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card elevation={2} sx={{ height: "100%" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6">Evaluation Scores</Typography>
              </Box>
            }
            sx={{ bgcolor: "secondary.lightest" }}
          />
          <Divider />
          <CardContent>
            {!patient.treatmentPlan ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No evaluation scores recorded
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "warning.lightest",
                        color: "warning.main",
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <EvaluationIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Epworth Sleep Scale Score
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mt: 1, mb: 1, pl: 5 }}
                  >
                    {patient.treatmentPlan.epworthSleepScaleScore ||
                      "Not evaluated"}
                  </Typography>

                  {patient.treatmentPlan.epworthSleepScaleScore && (
                    <Box sx={{ pl: 5, pr: 2 }}>
                      <Tooltip title="Higher score indicates higher level of daytime sleepiness">
                        <LinearProgress
                          variant="determinate"
                          value={
                            getScoreProgress(
                              patient.treatmentPlan.epworthSleepScaleScore
                            ).value
                          }
                          color={
                            getScoreProgress(
                              patient.treatmentPlan.epworthSleepScaleScore
                            ).color
                          }
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Tooltip>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Normal
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Severe
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "error.lightest",
                        color: "error.main",
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <AssessmentIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Sleep Apnea Cardiovascular Risk Score
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mt: 1, mb: 1, pl: 5 }}
                  >
                    {patient.treatmentPlan.sleepApneaCardiovascularRiskScore ||
                      "Not evaluated"}
                  </Typography>

                  {patient.treatmentPlan.sleepApneaCardiovascularRiskScore && (
                    <Box sx={{ pl: 5, pr: 2 }}>
                      <Tooltip title="Higher score indicates higher cardiovascular risk">
                        <LinearProgress
                          variant="determinate"
                          value={
                            getScoreProgress(
                              patient.treatmentPlan
                                .sleepApneaCardiovascularRiskScore
                            ).value
                          }
                          color={
                            getScoreProgress(
                              patient.treatmentPlan
                                .sleepApneaCardiovascularRiskScore
                            ).color
                          }
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Tooltip>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Low Risk
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          High Risk
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TreatmentPlanView;
