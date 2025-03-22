import React from "react";
import { Typography, TextField, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
const ClinicalParametersForm = ({ patient, setPatient }) => {
  // Handle nested field changes
  const handleNestedChange = (section, field, value) => {
    setPatient((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Anthropometric Parameters
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Height (cm)"
            type="number"
            value={patient.anthropometricParameters?.height || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "height",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Body Weight (kg)"
            type="number"
            value={patient.anthropometricParameters?.bodyWeight || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "bodyWeight",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="BMI"
            type="number"
            value={patient.anthropometricParameters?.bmi || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Waist Circumference (cm)"
            type="number"
            value={patient.anthropometricParameters?.waistCircumference || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "waistCircumference",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Hip Circumference (cm)"
            type="number"
            value={patient.anthropometricParameters?.hipCircumference || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "hipCircumference",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Waist-Hip Ratio"
            type="number"
            value={patient.anthropometricParameters?.waistHipRatio || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Neck Circumference (cm)"
            type="number"
            value={patient.anthropometricParameters?.neckCircumference || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "neckCircumference",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Pulse (bpm)"
            type="number"
            value={patient.anthropometricParameters?.pulse || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "pulse",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Temperature (°C)"
            type="number"
            value={patient.anthropometricParameters?.temperature || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "temperature",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Blood Pressure"
            value={patient.anthropometricParameters?.bloodPressure || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "bloodPressure",
                e.target.value
              )
            }
            placeholder="e.g., 120/80"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Oxygen Saturation (%)"
            type="number"
            value={patient.anthropometricParameters?.oxygenSaturation || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "oxygenSaturation",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Sleep Study Type"
            value={patient.anthropometricParameters?.sleepStudyType || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "sleepStudyType",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Apnea Hypopnea Index"
            type="number"
            value={patient.anthropometricParameters?.apneaHypopneaIndex || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "apneaHypopneaIndex",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Sleep Efficiency (%)"
            type="number"
            value={patient.anthropometricParameters?.sleepEfficiency || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "sleepEfficiency",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Sleep Stages"
            value={patient.anthropometricParameters?.sleepStages || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "sleepStages",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Other Findings"
            multiline
            rows={2}
            value={patient.anthropometricParameters?.otherFindings || ""}
            onChange={(e) =>
              handleNestedChange(
                "anthropometricParameters",
                "otherFindings",
                e.target.value
              )
            }
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Clinical Parameters
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Blood Pressure"
            value={patient.clinicalParameters?.bloodPressure || ""}
            onChange={(e) =>
              handleNestedChange(
                "clinicalParameters",
                "bloodPressure",
                e.target.value
              )
            }
            placeholder="e.g., 120/80"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Oxygen Saturation"
            value={patient.clinicalParameters?.oxygenSaturation || ""}
            onChange={(e) =>
              handleNestedChange(
                "clinicalParameters",
                "oxygenSaturation",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Polysomnography Results"
            multiline
            rows={2}
            value={patient.clinicalParameters?.polysomnographyResults || ""}
            onChange={(e) =>
              handleNestedChange(
                "clinicalParameters",
                "polysomnographyResults",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Heart Rate Variability"
            value={patient.clinicalParameters?.heartRateVariability || ""}
            onChange={(e) =>
              handleNestedChange(
                "clinicalParameters",
                "heartRateVariability",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Electrocardiogram"
            multiline
            rows={2}
            value={patient.clinicalParameters?.electrocardiogram || ""}
            onChange={(e) =>
              handleNestedChange(
                "clinicalParameters",
                "electrocardiogram",
                e.target.value
              )
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ClinicalParametersForm;
