import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const LabResultsForm = ({ patient, setPatient }) => {
  // Handle nested field changes
  const handleNestedChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      laboratoryInvestigation: {
        ...prev.laboratoryInvestigation,
        [field]: value,
      },
    }));
  };

  // Handle additional tests array
  const handleAddTest = () => {
    setPatient((prev) => ({
      ...prev,
      laboratoryInvestigation: {
        ...prev.laboratoryInvestigation,
        additionalTests: [
          ...(prev.laboratoryInvestigation?.additionalTests || []),
          { name: "", value: "", normalRange: "" },
        ],
      },
    }));
  };

  const handleRemoveTest = (index) => {
    setPatient((prev) => ({
      ...prev,
      laboratoryInvestigation: {
        ...prev.laboratoryInvestigation,
        additionalTests: prev.laboratoryInvestigation.additionalTests.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleTestChange = (index, field, value) => {
    setPatient((prev) => {
      const newTests = [
        ...(prev.laboratoryInvestigation?.additionalTests || []),
      ];
      newTests[index] = {
        ...newTests[index],
        [field]: value,
      };
      return {
        ...prev,
        laboratoryInvestigation: {
          ...prev.laboratoryInvestigation,
          additionalTests: newTests,
        },
      };
    });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Laboratory Investigation
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Hemoglobin (Hb)"
            type="number"
            value={patient.laboratoryInvestigation?.hb || ""}
            onChange={(e) => handleNestedChange("hb", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Triglycerides"
            type="number"
            value={patient.laboratoryInvestigation?.triglycerides || ""}
            onChange={(e) =>
              handleNestedChange("triglycerides", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="HDL"
            type="number"
            value={patient.laboratoryInvestigation?.hdl || ""}
            onChange={(e) => handleNestedChange("hdl", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="LDL"
            type="number"
            value={patient.laboratoryInvestigation?.ldl || ""}
            onChange={(e) => handleNestedChange("ldl", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Fasting Blood Sugar (FBS)"
            type="number"
            value={patient.laboratoryInvestigation?.fbs || ""}
            onChange={(e) => handleNestedChange("fbs", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="TSH"
            type="number"
            value={patient.laboratoryInvestigation?.tsh || ""}
            onChange={(e) => handleNestedChange("tsh", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="T3"
            type="number"
            value={patient.laboratoryInvestigation?.t3 || ""}
            onChange={(e) => handleNestedChange("t3", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="T4"
            type="number"
            value={patient.laboratoryInvestigation?.t4 || ""}
            onChange={(e) => handleNestedChange("t4", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Additional Tests
          </Typography>

          {patient.laboratoryInvestigation?.additionalTests &&
            patient.laboratoryInvestigation.additionalTests.map(
              (test, index) => (
                <Box
                  key={index}
                  sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
                >
                  <Grid container spacing={2} sx={{ flex: 1 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Test Name"
                        value={test.name || ""}
                        onChange={(e) =>
                          handleTestChange(index, "name", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Value"
                        value={test.value || ""}
                        onChange={(e) =>
                          handleTestChange(index, "value", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Normal Range"
                        value={test.normalRange || ""}
                        onChange={(e) =>
                          handleTestChange(index, "normalRange", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveTest(index)}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            )}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddTest}
            sx={{ mt: 1 }}
          >
            Add Test
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LabResultsForm;
