import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
// import Grid from "@mui/material/Grid2";
const EmotionalFunctioningForm = ({ patient, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Frustration</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.emotionalFunctioning?.frustration ||
              ""
            }
            onChange={(e) => handleChange("frustration", e.target.value)}
            label="Frustration"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="rarely">Rarely</MenuItem>
            <MenuItem value="sometimes">Sometimes</MenuItem>
            <MenuItem value="often">Often</MenuItem>
            <MenuItem value="always">Always</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Depression</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.emotionalFunctioning?.depression || ""
            }
            onChange={(e) => handleChange("depression", e.target.value)}
            label="Depression"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="notAtAll">Not At All</MenuItem>
            <MenuItem value="slightly">Slightly</MenuItem>
            <MenuItem value="moderately">Moderately</MenuItem>
            <MenuItem value="veryMuch">Very Much</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default EmotionalFunctioningForm;
