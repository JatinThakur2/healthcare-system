import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
// import Grid from "@mui/material/Grid2";
const SocialInteractionsForm = ({ patient, handleChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Social Gatherings Affected</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.socialInteractions
                ?.socialGatheringsAffected || ""
            }
            onChange={(e) =>
              handleChange("socialGatheringsAffected", e.target.value)
            }
            label="Social Gatherings Affected"
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
          <InputLabel>Felt Isolated</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.socialInteractions?.feltIsolated || ""
            }
            onChange={(e) => handleChange("feltIsolated", e.target.value)}
            label="Felt Isolated"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="never">Never</MenuItem>
            <MenuItem value="rarely">Rarely</MenuItem>
            <MenuItem value="sometimes">Sometimes</MenuItem>
            <MenuItem value="often">Often</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Family Support</InputLabel>
          <Select
            value={
              patient.saqliQuestionnaire?.socialInteractions?.familySupport ||
              ""
            }
            onChange={(e) => handleChange("familySupport", e.target.value)}
            label="Family Support"
          >
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="minimal">Minimal</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="significant">Significant</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SocialInteractionsForm;
