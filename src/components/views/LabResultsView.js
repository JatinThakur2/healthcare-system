import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const LabResultsView = ({ patient }) => {
  return (
    <Card>
      <CardHeader title="Laboratory Investigation" />
      <Divider />
      <CardContent>
        {!patient.laboratoryInvestigation ? (
          <Typography variant="body2" color="text.secondary">
            No laboratory results recorded
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Main lab values */}
            <Grid item xs={12}>
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

                  // Format the key for display
                  const formattedKey = key.toUpperCase();

                  return (
                    <Grid item xs={12} sm={6} md={3} key={key}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {formattedKey}
                        </Typography>
                        <Typography variant="h6">{value}</Typography>
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
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Additional Tests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    {patient.laboratoryInvestigation.additionalTests.map(
                      (test, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">
                              {test.name}
                            </Typography>
                            <Typography variant="h6">{test.value}</Typography>
                            {test.normalRange && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Normal Range: {test.normalRange}
                              </Typography>
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
