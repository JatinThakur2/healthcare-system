import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAction } from "convex/react"; // Use useAction since that works with your backend
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, storeAuthToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Using useAction since that's what works with your backend
  const login = useAction(api.auth.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Store the user in context
        setUser(result.user);

        // Store token with expiration if provided
        if (result.token) {
          storeAuthToken(result.token);
        }

        // Navigate based on user role
        console.log("User role:", result.user.role);
        if (result.user.role === "doctor") {
          navigate("/doctor-dashboard");
        } else if (result.user.role === "mainHead") {
          navigate("/"); // Main head dashboard is at root route
        } else {
          // Fallback if role isn't recognized
          navigate("/");
        }
      } else {
        setError(result.message || "Failed to login");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Healthcare Information System
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
