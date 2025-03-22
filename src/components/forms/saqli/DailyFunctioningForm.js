import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
const DailyFunctioningForm = ({ patient, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Trouble with Daily Activities</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.dailyFunctioning
                ?.troubleWithDailyActivities || ""
            }
            onChange={(e) =>
              handleChange("troubleWithDailyActivities", e.target.value)
            }
            label="Trouble with Daily Activities"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="rarely">Rarely</MenuItem>
            <MenuItem value="sometimes">Sometimes</MenuItem>
            <MenuItem value="often">Often</MenuItem>
            <MenuItem value="veryOften">Very Often</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Concentration Affected</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.dailyFunctioning
                ?.concentrationAffected || ""
            }
            onChange={(e) =>
              handleChange("concentrationAffected", e.target.value)
            }
            label="Concentration Affected"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="notAtAll">Not At All</MenuItem>
            <MenuItem value="slightly">Slightly</MenuItem>
            <MenuItem value="moderately">Moderately</MenuItem>
            <MenuItem value="veryMuch">Very Much</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Physically Fatigued</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.dailyFunctioning
                ?.physicallyFatigued || ""
            }
            onChange={(e) => handleChange("physicallyFatigued", e.target.value)}
            label="Physically Fatigued"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="rarely">Rarely</MenuItem>
            <MenuItem value="sometimes">Sometimes</MenuItem>
            <MenuItem value="often">Often</MenuItem>
            <MenuItem value="veryOften">Very Often</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default DailyFunctioningForm;
