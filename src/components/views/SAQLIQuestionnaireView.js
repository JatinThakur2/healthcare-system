import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Avatar,
  Box,
  Paper,
  LinearProgress,
  Tooltip,
  Chip,
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
  // Get score level for visual representation - in real app, would use actual scoring logic
  const getScoreLevel = (value) => {
    if (!value) return { level: 0, color: "grey" };

    const scoreMap = {
      none: { level: 0, color: "success" },
      never: { level: 0, color: "success" },
      "not at all": { level: 0, color: "success" },
      rarely: { level: 25, color: "success" },
      minimal: { level: 25, color: "success" },
      sometimes: { level: 50, color: "warning" },
      moderate: { level: 50, color: "warning" },
      moderately: { level: 50, color: "warning" },
      slightly: { level: 25, color: "success" },
      frequently: { level: 75, color: "error" },
      significant: { level: 75, color: "error" },
      always: { level: 100, color: "error" },
      severe: { level: 100, color: "error" },
    };

    const lowerValue = value.toLowerCase();

    for (const [key, data] of Object.entries(scoreMap)) {
      if (lowerValue.includes(key)) {
        return data;
      }
    }

    return { level: 50, color: "warning" }; // Default if not found
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
          elevation={1}
          sx={{
            borderRadius: 2,
            height: "100%",
            overflow: "hidden",
            border: "1px solid",
            borderColor: `${colorTheme}.light`,
          }}
        >
          <Box
            sx={{
              bgcolor: `${colorTheme}.lightest`,
              p: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: `${colorTheme}.main`, mr: 1.5 }}>
              {sectionIcon}
            </Avatar>
            <Typography variant="h6">{sectionTitle}</Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {Object.entries(sectionData).some(([_, value]) => value) ? (
              Object.entries(sectionData).map(([key, value]) => {
                if (!value) return null;

                // Format the key for display
                const formattedKey = formatText(key);
                // Get score level for visualization
                const score = getScoreLevel(value);

                return (
                  <Box key={key} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {formattedKey}
                      </Typography>
                      <Chip
                        label={value}
                        size="small"
                        color={score.color}
                        sx={{ fontWeight: "medium" }}
                      />
                    </Box>
                    <Tooltip title={`Impact level: ${value}`}>
                      <LinearProgress
                        variant="determinate"
                        value={score.level}
                        color={score.color}
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
    <Card elevation={2}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
              <SleepIcon />
            </Avatar>
            <Typography variant="h6">
              Sleep Apnea Quality of Life Index (SAQLI)
            </Typography>
          </Box>
        }
        sx={{ bgcolor: "primary.lightest" }}
      />
      <Divider />
      <CardContent>
        {!patient.saqliQuestionnaire ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No SAQLI questionnaire data recorded
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
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
      </CardContent>
    </Card>
  );
};

export default SAQLIQuestionnaireView;
