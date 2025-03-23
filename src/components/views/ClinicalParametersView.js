import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Paper,
  Box,
  Avatar,
  Tooltip,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import {
  MonitorHeart as HeartIcon,
  Height as HeightIcon,
  Scale as WeightIcon,
  BloodtypeOutlined as BloodPressureIcon,
  Thermostat as TemperatureIcon,
  Speed as PulseIcon,
  AirOutlined as OxygenIcon,
  Analytics as MetricsIcon,
  Straighten as MeasurementIcon,
} from "@mui/icons-material";

const ClinicalParametersView = ({ patient }) => {
  // Format parameter name for display
  const formatParameterName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Get icon for parameter
  const getParameterIcon = (key) => {
    const iconMap = {
      height: <HeightIcon />,
      bodyWeight: <WeightIcon />,
      bmi: <ScaleIcon />,
      waistCircumference: <MeasurementIcon />,
      hipCircumference: <MeasurementIcon />,
      waistHipRatio: <MeasurementIcon />,
      neckCircumference: <MeasurementIcon />,
      bloodPressure: <BloodPressureIcon />,
      pulse: <PulseIcon />,
      temperature: <TemperatureIcon />,
      oxygenSaturation: <OxygenIcon />,
      apneaHypopneaIndex: <MetricsIcon />,
      heartRateVariability: <HeartIcon />,
      electrocardiogram: <HeartIcon />,
      polysomnographyResults: <MetricsIcon />,
    };

    return iconMap[key] || <MetricsIcon />;
  };

  // Get appropriate background color for parameter card
  const getParameterColor = (key) => {
    const colorMap = {
      bloodPressure: "error.lightest",
      pulse: "error.lightest",
      oxygenSaturation: "info.lightest",
      apneaHypopneaIndex: "warning.lightest",
      bmi: "warning.lightest",
      temperature: "warning.lightest",
    };

    return colorMap[key] || "grey.50";
  };

  // Get appropriate icon color for parameter
  const getIconColor = (key) => {
    const colorMap = {
      bloodPressure: "error.main",
      pulse: "error.main",
      oxygenSaturation: "info.main",
      apneaHypopneaIndex: "warning.main",
      bmi: "warning.main",
      temperature: "warning.main",
    };

    return colorMap[key] || "primary.main";
  };

  // Simple icon component for BMI
  const ScaleIcon = () => <WeightIcon />;

  // Group parameters for better organization
  const parameterGroups = {
    bodyMeasurements: [
      "height",
      "bodyWeight",
      "bmi",
      "waistCircumference",
      "hipCircumference",
      "waistHipRatio",
      "neckCircumference",
    ],
    vitalSigns: ["bloodPressure", "pulse", "temperature", "oxygenSaturation"],
    sleepParameters: [
      "apneaHypopneaIndex",
      "sleepEfficiency",
      "sleepStages",
      "sleepStudyType",
    ],
    cardiacParameters: ["heartRateVariability", "electrocardiogram"],
    otherParameters: ["polysomnographyResults", "otherFindings"],
  };

  return (
    <Grid container spacing={3}>
      {/* Anthropometric Parameters */}
      <Grid item xs={12}>
        <Card elevation={2} sx={{ mb: 0, overflow: "hidden" }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
                  <MeasurementIcon />
                </Avatar>
                <Typography variant="h6">Anthropometric Parameters</Typography>
              </Box>
            }
            sx={{ bgcolor: "primary.lightest" }}
          />
          <Divider />
          <CardContent>
            {!patient.anthropometricParameters ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No anthropometric parameters recorded
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Body Measurements Section */}
                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight="medium"
                  sx={{ mb: 2 }}
                >
                  Body Measurements
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {parameterGroups.bodyMeasurements.map((key) => {
                    const value = patient.anthropometricParameters[key];
                    if (!value) return null;

                    // Format the key for display
                    const formattedKey = formatParameterName(key);
                    const paramColor = getParameterColor(key);
                    const iconColor = getIconColor(key);

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <Tooltip title={formattedKey}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: paramColor,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: 2,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "white",
                                  color: iconColor,
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                }}
                              >
                                {getParameterIcon(key)}
                              </Avatar>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {formattedKey}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{ mt: "auto", fontWeight: "bold" }}
                            >
                              {value}
                              {key === "height" && " cm"}
                              {key === "bodyWeight" && " kg"}
                              {key === "temperature" && " °C"}
                              {key === "waistCircumference" && " cm"}
                              {key === "hipCircumference" && " cm"}
                              {key === "neckCircumference" && " cm"}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Vital Signs Section */}
                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight="medium"
                  sx={{ mb: 2 }}
                >
                  Vital Signs
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {parameterGroups.vitalSigns.map((key) => {
                    const value = patient.anthropometricParameters[key];
                    if (!value) return null;

                    const formattedKey = formatParameterName(key);
                    const paramColor = getParameterColor(key);
                    const iconColor = getIconColor(key);

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <Tooltip title={formattedKey}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: paramColor,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: 2,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "white",
                                  color: iconColor,
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                }}
                              >
                                {getParameterIcon(key)}
                              </Avatar>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {formattedKey}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{ mt: "auto", fontWeight: "bold" }}
                            >
                              {value}
                              {key === "oxygenSaturation" && "%"}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Sleep Parameters Section */}
                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight="medium"
                  sx={{ mb: 2 }}
                >
                  Sleep Parameters
                </Typography>
                <Grid container spacing={2}>
                  {parameterGroups.sleepParameters.map((key) => {
                    const value = patient.anthropometricParameters[key];
                    if (!value) return null;

                    const formattedKey = formatParameterName(key);
                    const paramColor = getParameterColor(key);
                    const iconColor = getIconColor(key);

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <Tooltip title={formattedKey}>
                          <Paper
                            sx={{
                              p: 2,
                              bgcolor: paramColor,
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: 2,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "white",
                                  color: iconColor,
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                }}
                              >
                                {getParameterIcon(key)}
                              </Avatar>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {formattedKey}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{ mt: "auto", fontWeight: "bold" }}
                            >
                              {value}
                              {key === "sleepEfficiency" && "%"}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Clinical Parameters */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
                  <HeartIcon />
                </Avatar>
                <Typography variant="h6">Clinical Parameters</Typography>
              </Box>
            }
            sx={{ bgcolor: "secondary.lightest" }}
          />
          <Divider />
          <CardContent>
            {!patient.clinicalParameters ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No clinical parameters recorded
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {Object.entries(patient.clinicalParameters).map(
                  ([key, value]) => {
                    // Skip empty values
                    if (!value) return null;

                    // Format the key for display
                    const formattedKey = formatParameterName(key);
                    const paramColor = getParameterColor(key);
                    const iconColor = getIconColor(key);

                    return (
                      <Grid item xs={12} sm={6} key={key}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: paramColor,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "white",
                                color: iconColor,
                                width: 32,
                                height: 32,
                                mr: 1,
                              }}
                            >
                              {getParameterIcon(key)}
                            </Avatar>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {formattedKey}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "medium" }}
                          >
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClinicalParametersView;
