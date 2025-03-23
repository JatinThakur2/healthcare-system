// PatientDemographicsForm.js - FIXED VERSION

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const PatientDemographicsForm = ({
  patient,
  setPatient,
  doctors,
  isMainHead,
  currentUser,
}) => {
  // Debug logs to check values
  console.log("======== PATIENT DEMOGRAPHICS FORM ========");
  console.log("Doctors:", doctors);
  console.log("isMainHead:", isMainHead);
  console.log("currentUser:", currentUser);
  console.log("Current doctorId:", patient.doctorId);
  console.log("==========================================");

  // Effect to set the doctorId when a doctor creates a new patient
  useEffect(() => {
    // Only run this if the user is a doctor (not main head) and there's no doctorId set yet
    if (!isMainHead && currentUser && currentUser._id && !patient.doctorId) {
      console.log("Auto-assigning doctor:", currentUser._id);
      setPatient((prev) => ({
        ...prev,
        doctorId: currentUser._id,
      }));
    }
  }, [isMainHead, currentUser, patient.doctorId, setPatient]);

  // Handle field changes - for general fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Special handler just for doctor selection
  const handleDoctorChange = (e) => {
    try {
      const value = e.target.value;
      console.log("Doctor selection changed to:", value);

      // Find the doctor object for logging
      const selectedDoctor = doctors.find((doc) => doc._id === value);
      console.log(
        "Selected doctor:",
        selectedDoctor ? selectedDoctor.name : "None"
      );

      // Ensure we're updating the state properly
      setPatient((prevPatient) => {
        const updatedPatient = {
          ...prevPatient,
          doctorId: value,
        };
        console.log("Updated patient with doctorId:", updatedPatient.doctorId);
        return updatedPatient;
      });
    } catch (error) {
      console.error("Error in handleDoctorChange:", error);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPatient((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Array field handlers for complaints
  const handleAddComplaint = () => {
    setPatient((prev) => ({
      ...prev,
      complaints: [
        ...(prev.complaints || []),
        { symptom: "", severity: "", duration: "" },
      ],
    }));
  };

  const handleRemoveComplaint = (index) => {
    setPatient((prev) => ({
      ...prev,
      complaints: prev.complaints.filter((_, i) => i !== index),
    }));
  };

  const handleComplaintChange = (index, field, value) => {
    setPatient((prev) => {
      const newComplaints = [...prev.complaints];
      newComplaints[index] = {
        ...newComplaints[index],
        [field]: value,
      };
      return {
        ...prev,
        complaints: newComplaints,
      };
    });
  };

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If birthday hasn't occurred yet this year, subtract one year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format the date for input type="date"
  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Handle DOB change - now also updates age automatically
  const handleDOBChange = (e) => {
    const dateString = e.target.value;
    const date = new Date(dateString);
    const timestamp = date.getTime();

    // Calculate age based on the selected DOB
    const calculatedAge = calculateAge(date);

    // Update both DOB and age fields
    setPatient((prev) => ({
      ...prev,
      dob: timestamp,
      age: calculatedAge,
    }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Patient Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            label="IPD/OPD Number"
            name="ipd_opd_no"
            value={patient.ipd_opd_no || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Patient Name field */}
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            required
            label="Patient Name"
            name="name"
            value={patient.name || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* Date of Birth field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            value={formatDateForInput(patient.dob)}
            onChange={handleDOBChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Age field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age (years)"
            name="age"
            type="number"
            value={patient.age || ""}
            onChange={handleChange}
            InputProps={{
              readOnly: Boolean(patient.dob),
            }}
            helperText={
              patient.dob
                ? "Auto-calculated from DOB"
                : "Enter age or select DOB"
            }
          />
        </Grid>

        {/* Gender Select */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={patient.gender || ""}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNo"
            value={patient.contactNo || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            multiline
            rows={2}
            value={patient.address || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="marital-status-label">Marital Status</InputLabel>
            <Select
              labelId="marital-status-label"
              name="maritalStatus"
              value={patient.maritalStatus || ""}
              onChange={handleChange}
              label="Marital Status"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="married">Married</MenuItem>
              <MenuItem value="unmarried">Unmarried</MenuItem>
              <MenuItem value="divorced">Divorced</MenuItem>
              <MenuItem value="widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="employment-status-label">
              Employment Status
            </InputLabel>
            <Select
              labelId="employment-status-label"
              name="employmentStatus"
              value={patient.employmentStatus || ""}
              onChange={handleChange}
              label="Employment Status"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="employed">Employed</MenuItem>
              <MenuItem value="unemployed">Unemployed</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="economic-status-label">Economic Status</InputLabel>
            <Select
              labelId="economic-status-label"
              name="economicStatus"
              value={patient.economicStatus || ""}
              onChange={handleChange}
              label="Economic Status"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="upperClass">Upper Class</MenuItem>
              <MenuItem value="upperMiddleClass">Upper Middle Class</MenuItem>
              <MenuItem value="lowerMiddleClass">Lower Middle Class</MenuItem>
              <MenuItem value="lowerClass">Lower Class</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Provisional Diagnosis"
            name="provisionalDiagnosis"
            value={patient.provisionalDiagnosis || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Final Diagnosis"
            name="finalDiagnosis"
            value={patient.finalDiagnosis || ""}
            onChange={handleChange}
          />
        </Grid>

        {/* DOCTOR ASSIGNMENT - COMPLETELY REWRITTEN */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={isMainHead && !patient.doctorId}
            disabled={!isMainHead}
          >
            <InputLabel id="doctor-assignment-label">
              Assigned Doctor
            </InputLabel>
            <Select
              labelId="doctor-assignment-label"
              id="doctor-assignment"
              value={patient.doctorId || ""}
              label="Assigned Doctor"
              onChange={handleDoctorChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select a doctor</em>
              </MenuItem>

              {isMainHead ? (
                // For main head, show all doctors
                Array.isArray(doctors) && doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No doctors available
                  </MenuItem>
                )
              ) : (
                // For doctors, show only themselves
                currentUser && (
                  <MenuItem value={currentUser._id}>
                    {currentUser.name || "Current Doctor"}
                  </MenuItem>
                )
              )}
            </Select>
            {isMainHead && (
              <FormHelperText>
                {!patient.doctorId
                  ? "Please assign a doctor to this patient"
                  : "Doctor assigned successfully"}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={patient.consentObtained || false}
                onChange={(e) =>
                  handleCheckboxChange({
                    target: {
                      name: "consentObtained",
                      checked: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Consent Obtained"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Patient Complaints
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {patient.complaints &&
            patient.complaints.map((complaint, index) => (
              <Box
                key={index}
                sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
              >
                <Grid container spacing={2} sx={{ flex: 1 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Symptom"
                      value={complaint.symptom || ""}
                      onChange={(e) =>
                        handleComplaintChange(index, "symptom", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Severity"
                      value={complaint.severity || ""}
                      onChange={(e) =>
                        handleComplaintChange(index, "severity", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Duration"
                      value={complaint.duration || ""}
                      onChange={(e) =>
                        handleComplaintChange(index, "duration", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveComplaint(index)}
                  sx={{ mt: 1, ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

          <Box sx={{ mt: 1 }}>
            <IconButton
              color="primary"
              onClick={handleAddComplaint}
              sx={{ mr: 1 }}
            >
              <AddIcon />
            </IconButton>
            <Typography
              variant="button"
              color="primary"
              component="span"
              sx={{ cursor: "pointer" }}
              onClick={handleAddComplaint}
            >
              Add Complaint
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDemographicsForm;
