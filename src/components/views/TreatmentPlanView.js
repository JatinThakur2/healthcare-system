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
const TreatmentPlanView = ({ patient }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Treatment Plan" />
          <Divider />
          <CardContent>
            {!patient.treatmentPlan ? (
              <Typography variant="body2" color="text.secondary">
                No treatment plan recorded
              </Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Treatment Types</Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {patient.treatmentPlan.oralApplianceTherapy && (
                      <Chip
                        label="Oral Appliance Therapy"
                        color="primary"
                        size="small"
                      />
                    )}
                    {patient.treatmentPlan.cpapTherapy && (
                      <Chip label="CPAP Therapy" color="primary" size="small" />
                    )}
                    {patient.treatmentPlan.surgery && (
                      <Chip label="Surgery" color="primary" size="small" />
                    )}
                    {!patient.treatmentPlan.oralApplianceTherapy &&
                      !patient.treatmentPlan.cpapTherapy &&
                      !patient.treatmentPlan.surgery && (
                        <Typography variant="body2" color="text.secondary">
                          No treatment types specified
                        </Typography>
                      )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Epworth Sleep Scale Score
                  </Typography>
                  <Typography variant="body1">
                    {patient.treatmentPlan.epworthSleepScaleScore ||
                      "Not provided"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Sleep Apnea Cardiovascular Risk Score
                  </Typography>
                  <Typography variant="body1">
                    {patient.treatmentPlan.sleepApneaCardiovascularRiskScore ||
                      "Not provided"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date of Start</Typography>
                  <Typography variant="body1">
                    {patient.treatmentPlan.dateOfStart
                      ? new Date(
                          patient.treatmentPlan.dateOfStart
                        ).toLocaleDateString()
                      : "Not provided"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2">Date of Stop</Typography>
                  <Typography variant="body1">
                    {patient.treatmentPlan.dateOfStop
                      ? new Date(
                          patient.treatmentPlan.dateOfStop
                        ).toLocaleDateString()
                      : "Not provided"}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TreatmentPlanView;
