import React from "react";
import {
  Card,
  Divider,
  Typography,
  Avatar,
  Box,
  Paper,
  LinearProgress,
  Tooltip,
  Chip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Psychology as MentalIcon,
  NightsStay as SleepIcon,
  Groups as SocialIcon,
  Mood as EmotionIcon,
  SickOutlined as SymptomsIcon,
} from "@mui/icons-material";

// Utility function to format field names and values
const formatText = (text) => {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const SAQLIQuestionnaireView = ({ patient }) => {
  const theme = useTheme();

  // Get score level based on specified scale
  const getScoreLevel = (value) => {
    if (!value) return { level: 0, color: "grey", score: 0 };

    // Frequency scale (0-4)
    const frequencyScale = {
      notAtAll: { level: 0, color: "success", score: 0 },
      never: { level: 0, color: "success", score: 0 },
      rarely: { level: 25, color: "success", score: 1 },
      sometimes: { level: 50, color: "warning", score: 2 },
      often: { level: 75, color: "error", score: 3 },
      veryOften: { level: 100, color: "error", score: 4 },
    };

    // Intensity scale (0-3)
    const intensityScale = {
      slightly: { level: 33, color: "success", score: 1 },
      moderately: { level: 67, color: "warning", score: 2 },
      veryMuch: { level: 100, color: "error", score: 4 },
    };

    // Severity scale (0-3)
    const severityScale = {
      none: { level: 0, color: "success", score: 0 },
      minimal: { level: 33, color: "success", score: 1 },
      moderate: { level: 67, color: "warning", score: 2 },
      significant: { level: 100, color: "error", score: 3 },
      always: { level: 100, color: "error", score: 3 },
    };

    // Combine all scales for lookup
    const allScales = {
      ...frequencyScale,
      ...intensityScale,
      ...severityScale,
    };

    const lowerValue = value.toLowerCase().trim();

    // First, try to find an exact match
    if (allScales[lowerValue]) {
      return allScales[lowerValue];
    }

    // If no exact match, look for partial matches
    for (const [key, data] of Object.entries(allScales)) {
      if (lowerValue.includes(key)) {
        return data;
      }
    }

    // If we can't find any match, try to extract a number
    const numberMatch = lowerValue.match(/\d+/);
    if (numberMatch) {
      const num = parseInt(numberMatch[0], 10);
      if (num >= 0 && num <= 4) {
        const normalizedValue = (num / 4) * 100;
        let color = "success";
        if (normalizedValue > 66) color = "error";
        else if (normalizedValue > 33) color = "warning";

        return { level: normalizedValue, color, score: num };
      }
    }

    // Default fallback
    return { level: 50, color: "warning", score: 2 };
  };

  // Get icon for section
  const getSectionIcon = (section) => {
    const iconMap = {
      dailyFunctioning: <MentalIcon />,
      socialInteractions: <SocialIcon />,
      emotionalFunctioning: <EmotionIcon />,
      symptoms: <SymptomsIcon />,
    };

    return iconMap[section] || <SleepIcon />;
  };

  // Get title for section
  const getSectionTitle = (section) => {
    const titleMap = {
      dailyFunctioning: "Daily Functioning",
      socialInteractions: "Social Interactions",
      emotionalFunctioning: "Emotional Functioning",
      symptoms: "Symptoms",
    };

    return titleMap[section] || formatText(section);
  };

  // Get background color for section
  const getSectionColor = (section) => {
    const colorMap = {
      dailyFunctioning: "primary",
      socialInteractions: "info",
      emotionalFunctioning: "secondary",
      symptoms: "error",
    };

    return colorMap[section] || "primary";
  };

  // Render a questionnaire section
  const renderSection = (sectionKey, sectionData) => {
    if (!sectionData) return null;

    const sectionTitle = getSectionTitle(sectionKey);
    const sectionIcon = getSectionIcon(sectionKey);
    const colorTheme = getSectionColor(sectionKey);

    return (
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            height: "100%",
            overflow: "hidden",
            border: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Box
            sx={{
              bgcolor: `${colorTheme}.lightest` || "rgba(0, 0, 0, 0.02)",
              p: 2,
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              sx={{
                bgcolor:
                  theme.palette[colorTheme]?.main || theme.palette.primary.main,
                mr: 1.5,
                width: 36,
                height: 36,
              }}
            >
              {sectionIcon}
            </Avatar>
            <Typography variant="subtitle1" fontWeight="500">
              {sectionTitle}
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {Object.entries(sectionData).some(([_, value]) => value) ? (
              Object.entries(sectionData).map(([key, value]) => {
                if (!value) return null;

                // Format the key for display
                const formattedKey = formatText(key);
                // Get score level for visualization
                const scoreData = getScoreLevel(value);

                return (
                  <Box key={key} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight="500">
                        {formattedKey}
                      </Typography>
                      <Chip
                        label={value}
                        size="small"
                        color={scoreData.color}
                        sx={{ fontWeight: "medium", height: 24 }}
                      />
                    </Box>
                    <Tooltip title={`Impact level: ${scoreData.score}/4`}>
                      <LinearProgress
                        variant="determinate"
                        value={scoreData.level}
                        color={scoreData.color}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.04)",
                        }}
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
                        No Impact
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Severe Impact
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                No data recorded for this section
              </Typography>
            )}
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
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
          <SleepIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="h6" fontSize={18} fontWeight="500">
            Sleep Apnea Quality of Life Index (SAQLI)
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize={13}>
            Patient self-reported impact assessment
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {!patient.saqliQuestionnaire ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No SAQLI questionnaire data recorded
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Daily Functioning */}
            {renderSection(
              "dailyFunctioning",
              patient.saqliQuestionnaire.dailyFunctioning
            )}

            {/* Social Interactions */}
            {renderSection(
              "socialInteractions",
              patient.saqliQuestionnaire.socialInteractions
            )}

            {/* Emotional Functioning */}
            {renderSection(
              "emotionalFunctioning",
              patient.saqliQuestionnaire.emotionalFunctioning
            )}

            {/* Symptoms */}
            {renderSection("symptoms", patient.saqliQuestionnaire.symptoms)}
          </Grid>
        )}
      </Box>
    </Card>
  );
};

export default SAQLIQuestionnaireView;
