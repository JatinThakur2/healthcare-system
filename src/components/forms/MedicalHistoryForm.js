import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
  Paper,
  Button,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const MedicalHistoryForm = ({ patient, setPatient }) => {
  // Handle medical history status changes
  const handleMedicalHistoryStatusChange = (condition, checked) => {
    setPatient((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [condition]: {
          ...prev.medicalHistory[condition],
          status: checked,
        },
      },
    }));
  };

  // Handle medical history details changes
  const handleMedicalHistoryDetailChange = (condition, field, value) => {
    setPatient((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [condition]: {
          ...prev.medicalHistory[condition],
          [field]: value,
        },
      },
    }));
  };

  // Handle other conditions change
  const handleOtherConditionsChange = (e) => {
    setPatient((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        otherConditions: e.target.value,
      },
    }));
  };

  // Handle past/family history array
  const handleAddHistory = () => {
    setPatient((prev) => ({
      ...prev,
      pastFamilyHistory: [
        ...(prev.pastFamilyHistory || []),
        { condition: "", details: "" },
      ],
    }));
  };

  const handleRemoveHistory = (index) => {
    setPatient((prev) => ({
      ...prev,
      pastFamilyHistory: prev.pastFamilyHistory.filter((_, i) => i !== index),
    }));
  };

  const handleHistoryChange = (index, field, value) => {
    setPatient((prev) => {
      const newHistory = [...prev.pastFamilyHistory];
      newHistory[index] = {
        ...newHistory[index],
        [field]: value,
      };
      return {
        ...prev,
        pastFamilyHistory: newHistory,
      };
    });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Medical History
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Medical conditions */}
        {[
          "hypertension",
          "heartDisease",
          "stroke",
          "diabetes",
          "copd",
          "asthma",
          "neurologicalDisorders",
        ].map((condition) => (
          <Grid item xs={12} md={6} key={condition}>
            <Paper sx={{ p: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={patient.medicalHistory[condition]?.status || false}
                    onChange={(e) =>
                      handleMedicalHistoryStatusChange(
                        condition,
                        e.target.checked
                      )
                    }
                  />
                }
                label={
                  condition.charAt(0).toUpperCase() +
                  condition.slice(1).replace(/([A-Z])/g, " $1")
                }
              />

              {patient.medicalHistory[condition]?.status && (
                <Box sx={{ pl: 4, mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={
                          patient.medicalHistory[condition]?.duration || ""
                        }
                        onChange={(e) =>
                          handleMedicalHistoryDetailChange(
                            condition,
                            "duration",
                            e.target.value
                          )
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Treatment"
                        value={
                          patient.medicalHistory[condition]?.treatment || ""
                        }
                        onChange={(e) =>
                          handleMedicalHistoryDetailChange(
                            condition,
                            "treatment",
                            e.target.value
                          )
                        }
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Other Conditions"
            multiline
            rows={2}
            value={patient.medicalHistory?.otherConditions || ""}
            onChange={handleOtherConditionsChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Past/Family History
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {patient.pastFamilyHistory &&
            patient.pastFamilyHistory.map((history, index) => (
              <Box
                key={index}
                sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
              >
                <Grid container spacing={2} sx={{ flex: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Condition"
                      value={history.condition || ""}
                      onChange={(e) =>
                        handleHistoryChange(index, "condition", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Details"
                      value={history.details || ""}
                      onChange={(e) =>
                        handleHistoryChange(index, "details", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveHistory(index)}
                  sx={{ mt: 1, ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddHistory}
            sx={{ mt: 1 }}
          >
            Add Past/Family History
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default MedicalHistoryForm;
