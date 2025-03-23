import React from "react";
import {
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
const TreatmentPlanForm = ({ patient, setPatient }) => {
  // Handle nested checkbox changes
  const handleNestedCheckboxChange = (field, checked) => {
    setPatient((prev) => ({
      ...prev,
      treatmentPlan: {
        ...prev.treatmentPlan,
        [field]: checked,
      },
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      treatmentPlan: {
        ...prev.treatmentPlan,
        [field]: value,
      },
    }));
  };

  // Handle date fields
  const handleDateChange = (field, dateValue) => {
    const timestamp = dateValue ? new Date(dateValue).getTime() : "";
    handleNestedChange(field, timestamp);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Treatment Plan
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Treatment Types
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={patient.treatmentPlan?.oralApplianceTherapy || false}
                onChange={(e) =>
                  handleNestedCheckboxChange(
                    "oralApplianceTherapy",
                    e.target.checked
                  )
                }
              />
            }
            label="Oral Appliance Therapy"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={patient.treatmentPlan?.cpapTherapy || false}
                onChange={(e) =>
                  handleNestedCheckboxChange("cpapTherapy", e.target.checked)
                }
              />
            }
            label="CPAP Therapy"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={patient.treatmentPlan?.surgery || false}
                onChange={(e) =>
                  handleNestedCheckboxChange("surgery", e.target.checked)
                }
              />
            }
            label="Surgery"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Epworth Sleep Scale Score"
            value={patient.treatmentPlan?.epworthSleepScaleScore || ""}
            onChange={(e) =>
              handleNestedChange("epworthSleepScaleScore", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Sleep Apnea Cardiovascular Risk Score"
            value={
              patient.treatmentPlan?.sleepApneaCardiovascularRiskScore || ""
            }
            onChange={(e) =>
              handleNestedChange(
                "sleepApneaCardiovascularRiskScore",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Start"
            type="date"
            value={
              patient.treatmentPlan?.dateOfStart
                ? new Date(patient.treatmentPlan.dateOfStart)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) => handleDateChange("dateOfStart", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Stop"
            type="date"
            value={
              patient.treatmentPlan?.dateOfStop
                ? new Date(patient.treatmentPlan.dateOfStop)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) => handleDateChange("dateOfStop", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TreatmentPlanForm;
