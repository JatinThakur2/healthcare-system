import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const LifestyleRiskFactorsForm = ({ patient, setPatient }) => {
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

  // Handle deep nested checkbox changes
  const handleDeepNestedCheckboxChange = (
    section,
    subsection,
    field,
    checked
  ) => {
    setPatient((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: checked,
        },
      },
    }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Lifestyle Factors
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="physical-activity-label">
              Physical Activity
            </InputLabel>
            <Select
              labelId="physical-activity-label"
              value={patient.lifestyleFactors?.physicalActivity || ""}
              onChange={(e) =>
                handleNestedChange(
                  "lifestyleFactors",
                  "physicalActivity",
                  e.target.value
                )
              }
              label="Physical Activity"
            >
              <MenuItem value="">Select Activity Level</MenuItem>
              <MenuItem value="sedentary">Sedentary</MenuItem>
              <MenuItem value="lightActivity">Light Activity</MenuItem>
              <MenuItem value="moderateActivity">Moderate Activity</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="highlyActive">Highly Active</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="smoking-label">Smoking</InputLabel>
            <Select
              labelId="smoking-label"
              value={patient.lifestyleFactors?.smoking || ""}
              onChange={(e) =>
                handleNestedChange(
                  "lifestyleFactors",
                  "smoking",
                  e.target.value
                )
              }
              label="Smoking"
            >
              <MenuItem value="">Select Smoking Status</MenuItem>
              <MenuItem value="nonSmoker">Non-Smoker</MenuItem>
              <MenuItem value="experimentalSmoker">
                Experimental Smoker
              </MenuItem>
              <MenuItem value="socialSmoker">Social Smoker</MenuItem>
              <MenuItem value="regularSmoker">Regular Smoker</MenuItem>
              <MenuItem value="addictedSmoker">Addicted Smoker</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="eating-habit-label">Eating Habit</InputLabel>
            <Select
              labelId="eating-habit-label"
              value={patient.lifestyleFactors?.eatingHabit || ""}
              onChange={(e) =>
                handleNestedChange(
                  "lifestyleFactors",
                  "eatingHabit",
                  e.target.value
                )
              }
              label="Eating Habit"
            >
              <MenuItem value="">Select Eating Habit</MenuItem>
              <MenuItem value="unhealthyDiet">Unhealthy Diet</MenuItem>
              <MenuItem value="irregularDiet">Irregular Diet</MenuItem>
              <MenuItem value="balancedDiet">Balanced Diet</MenuItem>
              <MenuItem value="healthyEating">Healthy Eating</MenuItem>
              <MenuItem value="veryHealthyDiet">Very Healthy Diet</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="alcohol-intake-label">Alcohol Intake</InputLabel>
            <Select
              labelId="alcohol-intake-label"
              value={patient.lifestyleFactors?.alcoholIntake || ""}
              onChange={(e) =>
                handleNestedChange(
                  "lifestyleFactors",
                  "alcoholIntake",
                  e.target.value
                )
              }
              label="Alcohol Intake"
            >
              <MenuItem value="">Select Alcohol Intake</MenuItem>
              <MenuItem value="nonDrinker">Non-Drinker</MenuItem>
              <MenuItem value="occasionalDrinker">Occasional Drinker</MenuItem>
              <MenuItem value="socialDrinker">Social Drinker</MenuItem>
              <MenuItem value="regularDrinker">Regular Drinker</MenuItem>
              <MenuItem value="heavyDrinker">Heavy Drinker</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Risk Factors
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Traditional Risk Factors
          </Typography>

          {Object.keys(patient.riskFactors?.traditionalRiskFactors || {}).map(
            (factor) => (
              <FormControlLabel
                key={factor}
                control={
                  <Checkbox
                    checked={
                      patient.riskFactors?.traditionalRiskFactors?.[factor] ||
                      false
                    }
                    onChange={(e) =>
                      handleDeepNestedCheckboxChange(
                        "riskFactors",
                        "traditionalRiskFactors",
                        factor,
                        e.target.checked
                      )
                    }
                  />
                }
                label={factor
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              />
            )
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Non-Traditional Risk Factors
          </Typography>

          {Object.keys(
            patient.riskFactors?.nonTraditionalRiskFactors || {}
          ).map((factor) => (
            <FormControlLabel
              key={factor}
              control={
                <Checkbox
                  checked={
                    patient.riskFactors?.nonTraditionalRiskFactors?.[factor] ||
                    false
                  }
                  onChange={(e) =>
                    handleDeepNestedCheckboxChange(
                      "riskFactors",
                      "nonTraditionalRiskFactors",
                      factor,
                      e.target.checked
                    )
                  }
                />
              }
              label={factor
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default LifestyleRiskFactorsForm;
