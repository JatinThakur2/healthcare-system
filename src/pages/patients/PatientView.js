import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  AssignmentReturned as ExportIcon,
} from "@mui/icons-material";
import { exportToCSV } from "../../utils/export";

// Import view components
import PatientDemographicsView from "../../components/views/PatientDemographicsView";
import MedicalHistoryView from "../../components/views/MedicalHistoryView";
import ClinicalParametersView from "../../components/views/ClinicalParametersView";
import LabResultsView from "../../components/views/LabResultsView";
import LifestyleRiskFactorsView from "../../components/views/LifestyleRiskFactorsView";
import TreatmentPlanView from "../../components/views/TreatmentPlanView";
import SAQLIQuestionnaireView from "../../components/views/SAQLIQuestionnaireView";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PatientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("authToken");
  const [tabValue, setTabValue] = useState(0);

  // Use patientId parameter instead of id
  const patient = useQuery(api.patients.getPatientById, {
    patientId: id,
    token,
  });

  // Fetch doctors with token
  const doctors = useQuery(api.auth.getAllDoctors, { token }) || [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getDoctorName = (doctorId) => {
    if (!doctorId) return "Not assigned";

    // Debug logging to check doctorId and doctors array
    console.log("Looking for doctor with ID:", doctorId);
    console.log("Current user ID:", user?._id);
    console.log("Available doctors in array:", doctors.length);

    // If the current user is the doctor for this patient, use their name
    if (user && doctorId === user._id) {
      console.log("Current user is the doctor for this patient");
      return user.name;
    }

    // Find the doctor in the doctors array
    const doctor = doctors.find((d) => d._id === doctorId);

    // Return the doctor's name or 'Unknown' if not found
    const result = doctor ? doctor.name : "Unknown";
    console.log("Doctor name lookup result:", result);

    return result;
  };

  const handleExport = () => {
    if (patient) {
      exportToCSV([patient], `patient_${patient.ipd_opd_no}`);
    }
  };

  // Determine if form is incomplete
  const isIncomplete = () => {
    if (!patient) return false;

    const essentialFields = [
      patient.ipd_opd_no,
      patient.age || patient.dob,
      patient.gender,
      patient.contactNo,
      patient.provisionalDiagnosis,
    ];

    return essentialFields.some((field) => !field);
  };

  // Show loading state while data is being fetched
  if (patient === undefined || doctors === undefined) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle case where patient is not found
  if (patient === null) {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Tooltip title="Back to patients list">
            <IconButton onClick={() => navigate("/patients")} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1">
            Patient Not Found
          </Typography>
        </Box>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" gutterBottom>
            The patient you are looking for could not be found.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/patients")}
            sx={{ mt: 2 }}
          >
            Back to Patients List
          </Button>
        </Paper>
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Back to patients list">
            <IconButton onClick={() => navigate("/patients")} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" component="h1">
            Patient: {patient.ipd_opd_no}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/patients/${id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Registered on: {new Date(patient.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Doctor:{" "}
              {patient.doctorId === user?._id
                ? `Dr. ${user.name} (You)`
                : getDoctorName(patient.doctorId)}
            </Typography>
          </Box>
          <PatientStatusChip isIncomplete={isIncomplete()} />
        </Box>
      </Paper>

      {/* Tabs for organizing patient data */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="patient information tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Demographics" />
            <Tab label="Medical History" />
            <Tab label="Clinical Parameters" />
            <Tab label="Lab Results" />
            <Tab label="Lifestyle & Risk" />
            <Tab label="Treatment Plan" />
            <Tab label="SAQLI" />
          </Tabs>
        </Box>

        {/* Demographics Tab */}
        <TabPanel value={tabValue} index={0}>
          <PatientDemographicsView patient={patient} />
        </TabPanel>

        {/* Medical History Tab */}
        <TabPanel value={tabValue} index={1}>
          <MedicalHistoryView patient={patient} />
        </TabPanel>

        {/* Clinical Parameters Tab */}
        <TabPanel value={tabValue} index={2}>
          <ClinicalParametersView patient={patient} />
        </TabPanel>

        {/* Lab Results Tab */}
        <TabPanel value={tabValue} index={3}>
          <LabResultsView patient={patient} />
        </TabPanel>

        {/* Lifestyle & Risk Factors Tab */}
        <TabPanel value={tabValue} index={4}>
          <LifestyleRiskFactorsView patient={patient} />
        </TabPanel>

        {/* Treatment Plan Tab */}
        <TabPanel value={tabValue} index={5}>
          <TreatmentPlanView patient={patient} />
        </TabPanel>

        {/* SAQLI Tab */}
        <TabPanel value={tabValue} index={6}>
          <SAQLIQuestionnaireView patient={patient} />
        </TabPanel>
      </Box>
    </Box>
  );
};

// Status chip component
const PatientStatusChip = ({ isIncomplete }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 0.5,
        borderRadius: 1,
        bgcolor: isIncomplete ? "error.main" : "success.main",
        color: "white",
        fontWeight: "medium",
      }}
    >
      {isIncomplete ? "Incomplete Form" : "Complete Form"}
    </Box>
  );
};

export default PatientView;
