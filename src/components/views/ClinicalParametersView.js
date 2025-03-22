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
const ClinicalParametersView = ({ patient }) => {
  // Format parameter name for display
  const formatParameterName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Anthropometric Parameters" />
          <Divider />
          <CardContent>
            {!patient.anthropometricParameters ? (
              <Typography variant="body2" color="text.secondary">
                No anthropometric parameters recorded
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {Object.entries(patient.anthropometricParameters).map(
                  ([key, value]) => {
                    // Skip empty values
                    if (!value) return null;

                    // Format the key for display
                    const formattedKey = formatParameterName(key);

                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {formattedKey}
                          </Typography>
                          <Typography variant="h6">{value}</Typography>
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

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Clinical Parameters" />
          <Divider />
          <CardContent>
            {!patient.clinicalParameters ? (
              <Typography variant="body2" color="text.secondary">
                No clinical parameters recorded
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {Object.entries(patient.clinicalParameters).map(
                  ([key, value]) => {
                    // Skip empty values
                    if (!value) return null;

                    // Format the key for display
                    const formattedKey = formatParameterName(key);

                    return (
                      <Grid item xs={12} sm={6} key={key}>
                        <Paper sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {formattedKey}
                          </Typography>
                          <Typography variant="body1">{value}</Typography>
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
