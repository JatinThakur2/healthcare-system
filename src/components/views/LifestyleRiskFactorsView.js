import React from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const LifestyleRiskFactorsView = ({ patient }) => {
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Lifestyle Factors" />
          <Divider />
          <CardContent>
            {!patient.lifestyleFactors ? (
              <Typography variant="body2" color="text.secondary">
                No lifestyle factors recorded
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {Object.entries(patient.lifestyleFactors).map(
                  ([key, value]) => {
                    if (!value) return null;

                    // Format the key and value for display
                    const formattedKey = formatFieldName(key);
                    const formattedValue = formatValue(value);

                    return (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="subtitle2">
                          {formattedKey}
                        </Typography>
                        <Typography variant="body1">
                          {formattedValue}
                        </Typography>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Risk Factors" />
          <Divider />
          <CardContent>
            {!patient.riskFactors ? (
              <Typography variant="body2" color="text.secondary">
                No risk factors recorded
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Traditional Risk Factors */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Traditional Risk Factors
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.entries(
                      patient.riskFactors.traditionalRiskFactors || {}
                    ).map(([key, value]) => {
                      if (!value) return null;

                      // Format the key for display
                      const formattedKey = formatFieldName(key);

                      return (
                        <Chip
                          key={key}
                          label={formattedKey}
                          color="error"
                          size="small"
                        />
                      );
                    })}
                    {!Object.values(
                      patient.riskFactors.traditionalRiskFactors || {}
                    ).some((v) => v) && (
                      <Typography variant="body2" color="text.secondary">
                        No traditional risk factors recorded
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Non-Traditional Risk Factors */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Non-Traditional Risk Factors
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.entries(
                      patient.riskFactors.nonTraditionalRiskFactors || {}
                    ).map(([key, value]) => {
                      if (!value) return null;

                      // Format the key for display
                      const formattedKey = formatFieldName(key);

                      return (
                        <Chip
                          key={key}
                          label={formattedKey}
                          color="warning"
                          size="small"
                        />
                      );
                    })}
                    {!Object.values(
                      patient.riskFactors.nonTraditionalRiskFactors || {}
                    ).some((v) => v) && (
                      <Typography variant="body2" color="text.secondary">
                        No non-traditional risk factors recorded
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LifestyleRiskFactorsView;
