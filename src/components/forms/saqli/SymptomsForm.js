import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid2";
const SymptomsForm = ({ patient, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Unrefreshed or Headache</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.symptoms?.unrefreshedOrHeadache || ""
            }
            onChange={(e) =>
              handleChange("unrefreshedOrHeadache", e.target.value)
            }
            label="Unrefreshed or Headache"
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
          <InputLabel>Snoring Affected</InputLabel>
          <Select
            value={patient.saqliQuestionnaire?.symptoms?.snoringAffected || ""}
            onChange={(e) => handleChange("snoringAffected", e.target.value)}
            label="Snoring Affected"
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
          <InputLabel>Chest Discomfort or Palpitations</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.symptoms
                ?.chestDiscomfortOrPalpitations || ""
            }
            onChange={(e) =>
              handleChange("chestDiscomfortOrPalpitations", e.target.value)
            }
            label="Chest Discomfort or Palpitations"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="rarely">Rarely</MenuItem>
            <MenuItem value="sometimes">Sometimes</MenuItem>
            <MenuItem value="often">Often</MenuItem>
            <MenuItem value="always">Always</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SymptomsForm;
