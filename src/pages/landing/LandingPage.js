import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      title: "Patient Management",
      description:
        "Comprehensive patient records, history tracking, and appointment scheduling.",
      icon: (
        <PersonIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Doctor Administration",
      description:
        "Manage doctor profiles, specialties, and patient assignments.",
      icon: (
        <MedicalServicesIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Medical Reports",
      description: "Generate detailed medical reports and analytics.",
      icon: (
        <AssessmentIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Secure Access",
      description: "Role-based access control for doctors and administrators.",
      icon: (
        <SecurityIcon
          fontSize="large"
          sx={{ color: theme.palette.primary.main }}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Healthcare Information System
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                A comprehensive platform for managing patient care, doctor
                administration, and medical records.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ px: 3 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ px: 3 }}
                >
                  Register
                </Button>
              </Box>
            </Grid>

            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box sx={{ position: "relative", height: "350px" }}>
                  <Paper
                    elevation={4}
                    sx={{
                      position: "absolute",
                      top: "10%",
                      left: "5%",
                      width: "70%",
                      height: "70%",
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      p: 2,
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Patient Dashboard
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "grey.100",
                        height: "70%",
                        borderRadius: 1,
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {[1, 2, 3].map((item) => (
                        <Box
                          key={item}
                          sx={{
                            height: "25%",
                            bgcolor: "white",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: "30%",
                              height: "60%",
                              bgcolor: "primary.light",
                              borderRadius: 1,
                              mr: 1,
                            }}
                          ></Box>
                          <Box sx={{ width: "65%" }}>
                            <Box
                              sx={{
                                width: "100%",
                                height: 10,
                                bgcolor: "grey.300",
                                borderRadius: 1,
                                mb: 0.5,
                              }}
                            ></Box>
                            <Box
                              sx={{
                                width: "70%",
                                height: 10,
                                bgcolor: "grey.300",
                                borderRadius: 1,
                              }}
                            ></Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>

                  <Paper
                    elevation={4}
                    sx={{
                      position: "absolute",
                      bottom: "10%",
                      right: "5%",
                      width: "65%",
                      height: "60%",
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      p: 2,
                      zIndex: 0,
                    }}
                  >
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Medical Reports
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      {[1, 2, 3].map((item) => (
                        <Box
                          key={item}
                          sx={{
                            width: "30%",
                            height: 100,
                            bgcolor: "secondary.light",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "50%",
                              height: 10,
                              bgcolor: "white",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          ></Box>
                          <Box
                            sx={{
                              width: "70%",
                              height: 30,
                              bgcolor: "white",
                              borderRadius: 1,
                            }}
                          ></Box>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: "40%",
                        bgcolor: "grey.100",
                        borderRadius: 1,
                      }}
                    ></Box>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              bgcolor: "primary.light",
              color: "primary.main",
              p: 2,
              borderRadius: "50%",
              mb: 2,
            }}
          >
            <HealthAndSafetyIcon fontSize="large" />
          </Box>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="500">
            Key Features
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Our Healthcare Information System provides all the tools you need to
            efficiently manage your healthcare practice.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                  borderRadius: 1,
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                    fontWeight="500"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "secondary.light", py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 1 }} elevation={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" gutterBottom fontWeight="500">
                Ready to get started?
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ mb: 4, color: "text.secondary" }}
              >
                Join healthcare providers who use our system to streamline
                patient care and medical management.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Register Now
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          py: 6,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Healthcare Information System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Healthcare Information System
                <br />
                Created by{" "}
                <MuiLink
                  href="https://jatin-thakur.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jatin Thakur
                </MuiLink>
                <br />
                All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: jatinthakur3333@gmail.com
                <br />
                Address: Mandi, Himachal Pradesh, 175001
                <br />
                If you face any issues, please reach out to us.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Resources
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Box
                  component="a"
                  href="#"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Documentation
                </Box>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Support Center
                </Box>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  User Guide
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
