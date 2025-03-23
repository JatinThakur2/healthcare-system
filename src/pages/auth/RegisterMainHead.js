import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Link as MuiLink,
  CssBaseline,
  Avatar,
} from "@mui/material";
import { PersonAddOutlined as PersonAddOutlinedIcon } from "@mui/icons-material";

const RegisterMainHead = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createMainHead = useAction(api.auth_actions.createMainHead);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const result = await createMainHead({ email, password, name });

      if (result && result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      // Check if the error is because a main head already exists
      if (err.message && err.message.includes("Main head already exists")) {
        setError(
          "A main administrator account already exists. Please log in instead."
        );
      } else if (err.message && err.message.includes("Email already in use")) {
        setError("Email is already registered. Please use a different email.");
      } else {
        setError("An error occurred during registration. Please try again.");
        console.error("Registration error:", err);
      }
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
                bgcolor: "primary.main",
                p: 2,
                width: 56,
                height: 56,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <PersonAddOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2, mt: 1 }}>
              Register Administrator Account
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Create the main administrator account for your Healthcare
              Information System. Only one main administrator account can be
              created.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                Registration successful! Redirecting to login...
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || success}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                helperText="Password must be at least 8 characters long"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || success}
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
                disabled={loading || success}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign in
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

export default RegisterMainHead;
