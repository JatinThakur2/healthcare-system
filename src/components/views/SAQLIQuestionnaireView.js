import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
// Utility function to format field names and values
const formatText = (text) => {
  if (!text) return "";
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const SAQLIQuestionnaireView = ({ patient }) => {
  // Render a SAQLI section
  const renderSection = (title, sectionData) => {
    if (!sectionData) return null;

    return (
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <CardHeader title={title} />
          <Divider />
          <CardContent>
            <List>
              {Object.entries(sectionData).map(([key, value]) => {
                if (!value) return null;

                // Format the key for display
                const formattedKey = formatText(key);

                // Format the value
                const formattedValue = formatText(value);

                return (
                  <ListItem key={key} divider>
                    <ListItemText
                      primary={formattedKey}
                      secondary={formattedValue}
                    />
                  </ListItem>
                );
              })}
              {!Object.values(sectionData).some((v) => v) && (
                <Typography variant="body2" color="text.secondary">
                  No data recorded
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Card>
      <CardHeader title="Sleep Apnea Quality of Life Index (SAQLI)" />
      <Divider />
      <CardContent>
        {!patient.saqliQuestionnaire ? (
          <Typography variant="body2" color="text.secondary">
            No SAQLI questionnaire data recorded
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Daily Functioning */}
            {renderSection(
              "Daily Functioning",
              patient.saqliQuestionnaire.dailyFunctioning
            )}

            {/* Social Interactions */}
            {renderSection(
              "Social Interactions",
              patient.saqliQuestionnaire.socialInteractions
            )}

            {/* Emotional Functioning */}
            {renderSection(
              "Emotional Functioning",
              patient.saqliQuestionnaire.emotionalFunctioning
            )}

            {/* Symptoms */}
            {renderSection("Symptoms", patient.saqliQuestionnaire.symptoms)}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default SAQLIQuestionnaireView;
