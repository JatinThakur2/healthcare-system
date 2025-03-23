import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        color="primary"
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 4, position: "absolute", bottom: 16 }}
      >
        Healthcare Information System • Created by Jatin Thakur
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
