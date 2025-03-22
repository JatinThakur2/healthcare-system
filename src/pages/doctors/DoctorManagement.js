import React, { useState } from "react";
import { useQuery, useMutation, useAction, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const DoctorManagement = () => {
  const { user, isMainHead } = useAuth();
  const convex = useConvex(); // Add Convex client to invalidate queries

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Pass token to the query
  const doctors =
    useQuery(
      api.doctors.getDoctorsWithPatientCounts,
      token ? { token } : undefined
    ) || [];

  // Use action instead of mutation for createDoctor
  const createDoctor = useAction(api.auth_actions.createDoctor);

  const toggleDoctorStatus = useMutation(api.auth.toggleDoctorStatus);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || !isMainHead) {
        setError("You are not authorized to create doctors");
        setLoading(false);
        return;
      }

      console.log("Creating doctor with token:", token);

      // Pass the token directly as an argument
      const result = await createDoctor({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        token: token,
      });

      if (result && result.success) {
        setSuccess("Doctor created successfully");
        handleClose();

        // Invalidate the doctors query to refresh the list
        convex.invalidateQuery("doctors:getDoctorsWithPatientCounts");
      } else {
        setError((result && result.message) || "Failed to create doctor");
      }
    } catch (err) {
      console.error("Error creating doctor:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctorId, currentStatus) => {
    try {
      if (!user || !isMainHead) {
        setError("You are not authorized to update doctor status");
        return;
      }

      // Pass token as a parameter
      await toggleDoctorStatus({
        doctorId,
        isActive: !currentStatus,
        token: token,
      });

      setSuccess(`Doctor status updated successfully`);

      // Invalidate the doctors query to refresh the list
      convex.invalidateQuery("doctors:getDoctorsWithPatientCounts");
    } catch (err) {
      setError(err.message || "Failed to update doctor status");
      console.error("Error toggling doctor status:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSuccess("");
    setError("");
  };

  // Debugging output
  console.log("Doctors data:", doctors);

  if (doctors === undefined) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Doctor Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add New Doctor
        </Button>
      </Box>

      {doctors.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No doctors found. Add your first doctor to get started.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add New Doctor
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.isActive ? "Active" : "Inactive"}
                      color={doctor.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleToggleStatus(doctor._id, doctor.isActive)
                      }
                      color={doctor.isActive ? "error" : "success"}
                      title={doctor.isActive ? "Deactivate" : "Activate"}
                    >
                      {doctor.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Doctor Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter doctor details to create a new doctor account.
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <TextField
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create Doctor"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={Boolean(success || error)}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorManagement;
