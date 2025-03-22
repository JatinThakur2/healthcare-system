import React from "react";
import { Box, Typography, Divider } from "@mui/material";

// Import SAQLI subcomponents
import DailyFunctioningForm from "./saqli/DailyFunctioningForm";
import SocialInteractionsForm from "./saqli/SocialInteractionsForm";
import EmotionalFunctioningForm from "./saqli/EmotionalFunctioningForm";
import SymptomsForm from "./saqli/SymptomsForm";

const SAQLIQuestionnaireForm = ({ patient, setPatient }) => {
  // Handle deep nested changes for each section of the SAQLI questionnaire
  const handleDailyFunctioningChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      saqliQuestionnaire: {
        ...prev.saqliQuestionnaire,
        dailyFunctioning: {
          ...prev.saqliQuestionnaire?.dailyFunctioning,
          [field]: value,
        },
      },
    }));
  };

  const handleSocialInteractionsChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      saqliQuestionnaire: {
        ...prev.saqliQuestionnaire,
        socialInteractions: {
          ...prev.saqliQuestionnaire?.socialInteractions,
          [field]: value,
        },
      },
    }));
  };

  const handleEmotionalFunctioningChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      saqliQuestionnaire: {
        ...prev.saqliQuestionnaire,
        emotionalFunctioning: {
          ...prev.saqliQuestionnaire?.emotionalFunctioning,
          [field]: value,
        },
      },
    }));
  };

  const handleSymptomsChange = (field, value) => {
    setPatient((prev) => ({
      ...prev,
      saqliQuestionnaire: {
        ...prev.saqliQuestionnaire,
        symptoms: {
          ...prev.saqliQuestionnaire?.symptoms,
          [field]: value,
        },
      },
    }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Sleep Apnea Quality of Life Index (SAQLI)
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Daily Functioning
      </Typography>
      <Box sx={{ mb: 4 }}>
        <DailyFunctioningForm
          patient={patient}
          handleChange={handleDailyFunctioningChange}
        />
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Social Interactions
      </Typography>
      <Box sx={{ mb: 4 }}>
        <SocialInteractionsForm
          patient={patient}
          handleChange={handleSocialInteractionsChange}
        />
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Emotional Functioning
      </Typography>
      <Box sx={{ mb: 4 }}>
        <EmotionalFunctioningForm
          patient={patient}
          handleChange={handleEmotionalFunctioningChange}
        />
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Symptoms
      </Typography>
      <Box>
        <SymptomsForm patient={patient} handleChange={handleSymptomsChange} />
      </Box>
    </>
  );
};

export default SAQLIQuestionnaireForm;
