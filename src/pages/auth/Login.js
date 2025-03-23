import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAction } from "convex/react";
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
  Link as MuiLink,
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('/images/medical-pattern.svg') repeat",
          opacity: 0.05,
          zIndex: 0,
        },
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ zIndex: 1, position: "relative" }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              mb: 4,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Healthcare Information System
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Sign in to access your account
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
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
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 1.5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <MuiLink component={Link} to="/register" variant="body2">
                  Don't have an account? Register
                </MuiLink>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                width: "100%",
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Healthcare Information System |
                Created by{" "}
                <MuiLink
                  href="https://jatin-thakur.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jatin Thakur
                </MuiLink>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                sx={{ display: "block", mt: 1 }}
              >
                Address: Mandi, Himachal Pradesh, 175001 |
                jatinthakur3333@gmail.com
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
