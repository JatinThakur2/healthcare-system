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
  useTheme,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import {
  DirectionsRun as ActivityIcon,
  SmokingRooms as SmokingIcon,
  RestaurantMenu as EatingIcon,
  LocalBar as AlcoholIcon,
  Warning as RiskIcon,
  FavoriteBorder as HeartIcon,
  Air as EnvironmentIcon,
  Coronavirus as VirusIcon,
  Psychology as MentalIcon,
  Spa as LifestyleIcon,
} from "@mui/icons-material";

const LifestyleRiskFactorsView = ({ patient }) => {
  const theme = useTheme();

  // Format field names and values
  const formatFieldName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatValue = (value) => {
    if (typeof value === "string") {
      return value
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    }
    return value;
  };

  // Get appropriate icon for lifestyle factor
  const getLifestyleIcon = (key) => {
    const iconMap = {
      physicalActivity: <ActivityIcon />,
      smoking: <SmokingIcon />,
      eatingHabit: <EatingIcon />,
      alcoholIntake: <AlcoholIcon />,
    };

    return iconMap[key] || <LifestyleIcon />;
  };

  // Get appropriate icon for risk factor
  const getRiskIcon = (key, isTraditional) => {
    if (isTraditional) {
      const traditionaIconMap = {
        hyperlipidemia: <HeartIcon />,
        diabetesMellitus: <HeartIcon />,
        hypertension: <HeartIcon />,
        obesity: <HeartIcon />,
        smoking: <SmokingIcon />,
        familyHistory: <HeartIcon />,
      };
      return traditionaIconMap[key] || <RiskIcon />;
    } else {
      const nonTraditionalIconMap = {
        sleepDisorder: <MentalIcon />,
        airPollution: <EnvironmentIcon />,
        dietStyle: <EatingIcon />,
        psychosocialFactor: <MentalIcon />,
        chronicKidneyDisease: <VirusIcon />,
        depressionAndAnxiety: <MentalIcon />,
      };
      return nonTraditionalIconMap[key] || <RiskIcon />;
    }
  };

  return (
    <Card elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Avatar
          sx={{
            bgcolor:
              theme.palette.primary.lightest || "rgba(25, 118, 210, 0.1)",
            color: theme.palette.primary.main,
            width: 36,
            height: 36,
            mr: 1.5,
          }}
        >
          <LifestyleIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="medium">
            Lifestyle & Risk Factors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Health assessment overview
          </Typography>
        </Box>
      </Box>

      {/* Divider after header */}
      <Divider />

      {/* Main content in grid layout */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Lifestyle Factors Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LifestyleIcon
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Lifestyle Factors
                    </Typography>
                  </Box>
                }
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: "rgba(0, 0, 0, 0.01)",
                }}
              />
              <CardContent sx={{ flex: "1", p: 0 }}>
                {!patient.lifestyleFactors ? (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No lifestyle factors recorded
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {Object.entries(patient.lifestyleFactors).map(
                      ([key, value], index) => {
                        if (!value) return null;

                        // Format the key and value for display
                        const formattedKey = formatFieldName(key);
                        const formattedValue = formatValue(value);
                        const icon = getLifestyleIcon(key);

                        // Determine color based on factor type
                        let factorColor;
                        switch (key) {
                          case "physicalActivity":
                            factorColor = theme.palette.info.main;
                            break;
                          case "smoking":
                            factorColor = theme.palette.error.main;
                            break;
                          case "eatingHabit":
                            factorColor = theme.palette.success.main;
                            break;
                          case "alcoholIntake":
                            factorColor = theme.palette.warning.main;
                            break;
                          default:
                            factorColor = theme.palette.primary.main;
                        }

                        return (
                          <React.Fragment key={key}>
                            {index > 0 && <Divider />}
                            <Box
                              sx={{
                                px: 2,
                                py: 1.5,
                                borderLeft: `3px solid ${factorColor}`,
                                "&:hover": {
                                  bgcolor: "rgba(0, 0, 0, 0.01)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 0.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    mr: 1,
                                    display: "flex",
                                    color: factorColor,
                                  }}
                                >
                                  {icon}
                                </Box>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="text.primary"
                                >
                                  {formattedKey}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ ml: 3 }}
                                color="text.secondary"
                              >
                                {formattedValue}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        );
                      }
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Factors Section */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <RiskIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Risk Factors
                    </Typography>
                  </Box>
                }
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: "rgba(0, 0, 0, 0.01)",
                }}
              />
              <CardContent sx={{ flex: "1", p: 0 }}>
                {!patient.riskFactors ? (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No risk factors recorded
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 0 }}>
                    {/* Traditional Risk Factors */}
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                        sx={{ mb: 1 }}
                      >
                        Traditional Risk Factors
                      </Typography>

                      <Grid container spacing={1}>
                        {Object.entries(
                          patient.riskFactors.traditionalRiskFactors || {}
                        ).map(([key, value]) => {
                          // Format the key for display
                          const formattedKey = formatFieldName(key);
                          const icon = getRiskIcon(key, true);

                          return (
                            <Grid item xs={6} key={key}>
                              <Chip
                                icon={
                                  <Box sx={{ display: "flex", ml: 0.5 }}>
                                    {icon}
                                  </Box>
                                }
                                label={formattedKey}
                                variant={value ? "filled" : "outlined"}
                                color={value ? "primary" : "default"}
                                size="small"
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  padding: "4px 0",
                                  justifyContent: "flex-start",
                                  "& .MuiChip-label": {
                                    display: "block",
                                    whiteSpace: "normal",
                                    paddingTop: "2px",
                                    paddingBottom: "2px",
                                  },
                                  opacity: value ? 1 : 0.7,
                                }}
                              />
                            </Grid>
                          );
                        })}
                        {!Object.values(
                          patient.riskFactors.traditionalRiskFactors || {}
                        ).some((v) => v) && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              No traditional risk factors recorded
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>

                    <Divider />

                    {/* Non-Traditional Risk Factors */}
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                        sx={{ mb: 1 }}
                      >
                        Non-Traditional Risk Factors
                      </Typography>

                      <Grid container spacing={1}>
                        {Object.entries(
                          patient.riskFactors.nonTraditionalRiskFactors || {}
                        ).map(([key, value]) => {
                          // Format the key for display
                          const formattedKey = formatFieldName(key);
                          const icon = getRiskIcon(key, false);

                          return (
                            <Grid item xs={6} key={key}>
                              <Chip
                                icon={
                                  <Box sx={{ display: "flex", ml: 0.5 }}>
                                    {icon}
                                  </Box>
                                }
                                label={formattedKey}
                                variant={value ? "filled" : "outlined"}
                                color={value ? "secondary" : "default"}
                                size="small"
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  padding: "4px 0",
                                  justifyContent: "flex-start",
                                  "& .MuiChip-label": {
                                    display: "block",
                                    whiteSpace: "normal",
                                    paddingTop: "2px",
                                    paddingBottom: "2px",
                                  },
                                  opacity: value ? 1 : 0.7,
                                }}
                              />
                            </Grid>
                          );
                        })}
                        {!Object.values(
                          patient.riskFactors.nonTraditionalRiskFactors || {}
                        ).some((v) => v) && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              No non-traditional risk factors recorded
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default LifestyleRiskFactorsView;
