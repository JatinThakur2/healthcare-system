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
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Science as ScienceIcon,
  LocalHospital as MedicalIcon,
  Bloodtype as BloodIcon,
  Opacity as DropIcon,
  MonitorHeart as HeartIcon,
  BiotechOutlined as LabIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const LabResultsView = ({ patient }) => {
  // Get appropriate colors for lab values
  const getValueColor = (key, value) => {
    // This is a simplified version - in a real app, you would compare with normal ranges
    if (key === "ldl" && value > 130) return "error";
    if (key === "hdl" && value < 40) return "error";
    if (key === "triglycerides" && value > 150) return "error";
    return "success";
  };

  // Get icon for lab test
  const getTestIcon = (key) => {
    const iconMap = {
      hb: <BloodIcon />,
      triglycerides: <DropIcon />,
      hdl: <HeartIcon />,
      ldl: <HeartIcon />,
      fbs: <DropIcon />,
      tsh: <MedicalIcon />,
      t3: <MedicalIcon />,
      t4: <MedicalIcon />,
    };

    return iconMap[key] || <LabIcon />;
  };

  // Format the key for display
  const formatKeyName = (key) => {
    const nameMap = {
      hb: "Hemoglobin",
      triglycerides: "Triglycerides",
      hdl: "HDL Cholesterol",
      ldl: "LDL Cholesterol",
      fbs: "Fasting Blood Sugar",
      tsh: "TSH",
      t3: "T3",
      t4: "T4",
    };

    return nameMap[key] || key.toUpperCase();
  };

  // Get unit for the test
  const getTestUnit = (key) => {
    const unitMap = {
      hb: "g/dL",
      triglycerides: "mg/dL",
      hdl: "mg/dL",
      ldl: "mg/dL",
      fbs: "mg/dL",
      tsh: "μIU/mL",
      t3: "ng/dL",
      t4: "μg/dL",
    };

    return unitMap[key] || "";
  };

  // Get normal range for test (simplified)
  const getNormalRange = (key) => {
    const rangeMap = {
      hb: "13.5-17.5 g/dL (male), 12.0-15.5 g/dL (female)",
      triglycerides: "<150 mg/dL",
      hdl: ">40 mg/dL (male), >50 mg/dL (female)",
      ldl: "<100 mg/dL",
      fbs: "70-99 mg/dL",
      tsh: "0.4-4.0 μIU/mL",
      t3: "80-200 ng/dL",
      t4: "5.0-12.0 μg/dL",
    };

    return rangeMap[key] || "";
  };

  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
              <ScienceIcon />
            </Avatar>
            <Typography variant="h6">Laboratory Investigation</Typography>
          </Box>
        }
        sx={{ bgcolor: "primary.lightest" }}
      />
      <Divider />
      <CardContent>
        {!patient.laboratoryInvestigation ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No laboratory results recorded
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Main lab values */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="primary"
                fontWeight="medium"
                sx={{ mb: 2 }}
              >
                Blood Test Results
              </Typography>
              <Grid container spacing={2}>
                {[
                  "hb",
                  "triglycerides",
                  "hdl",
                  "ldl",
                  "fbs",
                  "tsh",
                  "t3",
                  "t4",
                ].map((key) => {
                  const value = patient.laboratoryInvestigation[key];
                  if (value === undefined || value === null) return null;

                  const unit = getTestUnit(key);
                  const normalRange = getNormalRange(key);
                  const valueColor = getValueColor(key, value);

                  return (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          height: "100%",
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
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: "primary.lightest",
                                color: "primary.main",
                                width: 32,
                                height: 32,
                                mr: 1,
                              }}
                            >
                              {getTestIcon(key)}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {formatKeyName(key)}
                            </Typography>
                          </Box>
                          <Chip
                            label={unit}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          <Typography
                            variant="h4"
                            color={`${valueColor}.main`}
                            fontWeight="bold"
                          >
                            {value}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1, mb: 0.5 }}
                          >
                            {unit}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Normal Range: {normalRange}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Additional tests */}
            {patient.laboratoryInvestigation.additionalTests &&
              patient.laboratoryInvestigation.additionalTests.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="medium"
                    sx={{ mb: 2, mt: 2 }}
                  >
                    Additional Tests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {patient.laboratoryInvestigation.additionalTests.map(
                      (test, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
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
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: "secondary.lightest",
                                    color: "secondary.main",
                                    width: 32,
                                    height: 32,
                                    mr: 1,
                                  }}
                                >
                                  <AddIcon />
                                </Avatar>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="medium"
                                >
                                  {test.name}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                              <Typography variant="h5" fontWeight="bold">
                                {test.value}
                              </Typography>
                            </Box>

                            {test.normalRange && (
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Normal Range: {test.normalRange}
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Grid>
              )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LabResultsView;
