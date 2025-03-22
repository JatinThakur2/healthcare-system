import React from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const MedicalHistoryView = ({ patient }) => {
  const formatConditionName = (condition) => {
    return (
      condition.charAt(0).toUpperCase() +
      condition.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Medical Conditions" />
          <Divider />
          <CardContent>
            {!patient.medicalHistory ? (
              <Typography variant="body2" color="text.secondary">
                No medical history recorded
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {Object.entries(patient.medicalHistory).map(([key, value]) => {
                  // Skip the 'otherConditions' field as we'll display it separately
                  if (key === "otherConditions") return null;

                  // For each medical condition
                  return (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            {formatConditionName(key)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              Status:
                            </Typography>
                            <Chip
                              label={value.status ? "Present" : "Absent"}
                              color={value.status ? "error" : "success"}
                              size="small"
                            />
                          </Box>
                          {value.status && (
                            <>
                              <Typography variant="body2">
                                <strong>Duration:</strong>{" "}
                                {value.duration || "Not specified"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Treatment:</strong>{" "}
                                {value.treatment || "Not specified"}
                              </Typography>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* Other conditions */}
            {patient.medicalHistory?.otherConditions && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">Other Conditions</Typography>
                <Typography variant="body1">
                  {patient.medicalHistory.otherConditions}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Past/Family History" />
          <Divider />
          <CardContent>
            {!patient.pastFamilyHistory ||
            patient.pastFamilyHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No past/family history recorded
              </Typography>
            ) : (
              <List>
                {patient.pastFamilyHistory.map((history, index) => (
                  <ListItem
                    key={index}
                    divider={index < patient.pastFamilyHistory.length - 1}
                  >
                    <ListItemText
                      primary={history.condition}
                      secondary={history.details}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MedicalHistoryView;
