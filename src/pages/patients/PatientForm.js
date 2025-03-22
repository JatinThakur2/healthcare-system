import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
} from "@mui/icons-material";

// Import form components
import PatientDemographicsForm from "../../components/forms/PatientDemographicsForm";
import MedicalHistoryForm from "../../components/forms/MedicalHistoryForm";
import ClinicalParametersForm from "../../components/forms/ClinicalParametersForm";
import LabResultsForm from "../../components/forms/LabResultsForm";
import LifestyleRiskFactorsForm from "../../components/forms/LifestyleRiskFactorsForm";
import TreatmentPlanForm from "../../components/forms/TreatmentPlanForm";
import SAQLIQuestionnaireForm from "../../components/forms/SAQLIQuestionnaireForm";

// Initial state for a new patient
const initialPatientState = {
  ipd_opd_no: "",
  date: Date.now(),
  age: "",
  dob: "",
  gender: "",
  contactNo: "",
  address: "",
  maritalStatus: "",
  employmentStatus: "",
  economicStatus: "",
  provisionalDiagnosis: "",
  finalDiagnosis: "",

  complaints: [],

  medicalHistory: {
    hypertension: { status: false, duration: "", treatment: "" },
    heartDisease: { status: false, duration: "", treatment: "" },
    stroke: { status: false, duration: "", treatment: "" },
    diabetes: { status: false, duration: "", treatment: "" },
    copd: { status: false, duration: "", treatment: "" },
    asthma: { status: false, duration: "", treatment: "" },
    neurologicalDisorders: { status: false, duration: "", treatment: "" },
    otherConditions: "",
  },

  pastFamilyHistory: [],

  anthropometricParameters: {
    height: "",
    waistCircumference: "",
    bmi: "",
    neckCircumference: "",
    hipCircumference: "",
    waistHipRatio: "",
    pulse: "",
    temperature: "",
    bloodPressure: "",
    sleepStudyType: "",
    bodyWeight: "",
    oxygenSaturation: "",
    apneaHypopneaIndex: "",
    sleepEfficiency: "",
    sleepStages: "",
    otherFindings: "",
  },

  clinicalParameters: {
    bloodPressure: "",
    oxygenSaturation: "",
    polysomnographyResults: "",
    heartRateVariability: "",
    electrocardiogram: "",
  },

  laboratoryInvestigation: {
    hb: "",
    triglycerides: "",
    hdl: "",
    ldl: "",
    fbs: "",
    tsh: "",
    t3: "",
    t4: "",
    additionalTests: [],
  },

  lifestyleFactors: {
    physicalActivity: "",
    smoking: "",
    eatingHabit: "",
    alcoholIntake: "",
  },

  riskFactors: {
    traditionalRiskFactors: {
      hyperlipidemia: false,
      diabetesMellitus: false,
      hypertension: false,
      obesity: false,
      smoking: false,
      familyHistory: false,
    },
    nonTraditionalRiskFactors: {
      sleepDisorder: false,
      airPollution: false,
      dietStyle: false,
      psychosocialFactor: false,
      chronicKidneyDisease: false,
      depressionAndAnxiety: false,
    },
  },

  treatmentPlan: {
    oralApplianceTherapy: false,
    cpapTherapy: false,
    surgery: false,
    epworthSleepScaleScore: "",
    sleepApneaCardiovascularRiskScore: "",
    dateOfStart: "",
    dateOfStop: "",
  },

  saqliQuestionnaire: {
    dailyFunctioning: {
      troubleWithDailyActivities: "",
      concentrationAffected: "",
      physicallyFatigued: "",
    },
    socialInteractions: {
      socialGatheringsAffected: "",
      feltIsolated: "",
      familySupport: "",
    },
    emotionalFunctioning: {
      frustration: "",
      depression: "",
    },
    symptoms: {
      unrefreshedOrHeadache: "",
      snoringAffected: "",
      chestDiscomfortOrPalpitations: "",
    },
  },

  consentObtained: false,
};

// Steps for the form stepper
const steps = [
  "Patient Info",
  "Medical History",
  "Clinical Parameters",
  "Lab Results",
  "Lifestyle & Risk",
  "Treatment Plan",
  "SAQLI",
];

// Create separate components to handle the different cases
// Component for editing an existing patient
const EditPatientForm = ({ id, setPatient, renderContent }) => {
  // Always call useQuery (no conditions)
  const patientData = useQuery(api.patients.getPatientById, { id });

  // Update parent state when data is available
  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
    }
  }, [patientData, setPatient]);

  // Show loading while waiting for data
  if (!patientData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render the form content once data is loaded
  return renderContent();
};

// Component for creating a new patient (no data fetching needed)
const NewPatientForm = ({ renderContent }) => {
  return renderContent();
};

// Utility function to convert string values to appropriate types
const convertFormData = (data) => {
  // Helper function to convert a value if it exists
  const convert = (value, type) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (type === "number") {
      return parseFloat(value);
    } else if (type === "date") {
      return typeof value === "string" ? new Date(value).getTime() : value;
    }

    return value;
  };

  // Create a new object with converted values
  return {
    ...data,
    age: convert(data.age, "number"),
    dob: convert(data.dob, "date"),

    anthropometricParameters: data.anthropometricParameters
      ? {
          ...data.anthropometricParameters,
          height: convert(data.anthropometricParameters.height, "number"),
          waistCircumference: convert(
            data.anthropometricParameters.waistCircumference,
            "number"
          ),
          bmi: convert(data.anthropometricParameters.bmi, "number"),
          neckCircumference: convert(
            data.anthropometricParameters.neckCircumference,
            "number"
          ),
          hipCircumference: convert(
            data.anthropometricParameters.hipCircumference,
            "number"
          ),
          waistHipRatio: convert(
            data.anthropometricParameters.waistHipRatio,
            "number"
          ),
          pulse: convert(data.anthropometricParameters.pulse, "number"),
          temperature: convert(
            data.anthropometricParameters.temperature,
            "number"
          ),
          bodyWeight: convert(
            data.anthropometricParameters.bodyWeight,
            "number"
          ),
          oxygenSaturation: convert(
            data.anthropometricParameters.oxygenSaturation,
            "number"
          ),
          apneaHypopneaIndex: convert(
            data.anthropometricParameters.apneaHypopneaIndex,
            "number"
          ),
          sleepEfficiency: convert(
            data.anthropometricParameters.sleepEfficiency,
            "number"
          ),
        }
      : undefined,

    laboratoryInvestigation: data.laboratoryInvestigation
      ? {
          ...data.laboratoryInvestigation,
          hb: convert(data.laboratoryInvestigation.hb, "number"),
          triglycerides: convert(
            data.laboratoryInvestigation.triglycerides,
            "number"
          ),
          hdl: convert(data.laboratoryInvestigation.hdl, "number"),
          ldl: convert(data.laboratoryInvestigation.ldl, "number"),
          fbs: convert(data.laboratoryInvestigation.fbs, "number"),
          tsh: convert(data.laboratoryInvestigation.tsh, "number"),
          t3: convert(data.laboratoryInvestigation.t3, "number"),
          t4: convert(data.laboratoryInvestigation.t4, "number"),
        }
      : undefined,

    treatmentPlan: data.treatmentPlan
      ? {
          ...data.treatmentPlan,
          dateOfStart: convert(data.treatmentPlan.dateOfStart, "date"),
          dateOfStop: convert(data.treatmentPlan.dateOfStop, "date"),
        }
      : undefined,
  };
};

// Main PatientForm component
const PatientForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user, isMainHead } = useAuth();

  // Get ID from params
  const id = params.id || null;
  const isEditing = Boolean(id);

  // Patient form state
  const [patient, setPatient] = useState(initialPatientState);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Fetch doctors (this is always needed)
  const allDoctors = useQuery(api.auth.getAllDoctors);
  const doctors = allDoctors || [];

  // Mutations
  const createPatient = useMutation(api.patients.createPatient);
  const updatePatient = useMutation(api.patients.updatePatient);

  // Calculate derived values (BMI, etc) when related fields change
  useEffect(() => {
    // Calculate BMI
    const height = parseFloat(patient.anthropometricParameters?.height);
    const weight = parseFloat(patient.anthropometricParameters?.bodyWeight);

    if (height && weight) {
      // BMI = weight(kg) / height(m)²
      const heightInMeters = height / 100; // convert cm to meters
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

      setPatient((prev) => ({
        ...prev,
        anthropometricParameters: {
          ...prev.anthropometricParameters,
          bmi,
        },
      }));
    }

    // Calculate waist-hip ratio
    const waist = parseFloat(
      patient.anthropometricParameters?.waistCircumference
    );
    const hip = parseFloat(patient.anthropometricParameters?.hipCircumference);

    if (waist && hip) {
      const ratio = (waist / hip).toFixed(2);
      setPatient((prev) => ({
        ...prev,
        anthropometricParameters: {
          ...prev.anthropometricParameters,
          waistHipRatio: ratio,
        },
      }));
    }
  }, [
    patient.anthropometricParameters?.height,
    patient.anthropometricParameters?.bodyWeight,
    patient.anthropometricParameters?.waistCircumference,
    patient.anthropometricParameters?.hipCircumference,
  ]);

  // Stepper navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  // Submit the form
  // In PatientForm.js
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Convert string values to appropriate types
      const convertedData = convertFormData(patient);

      if (id) {
        // Update existing patient
        await updatePatient({
          patientId: id,
          // Only include the fields that are expected by the backend
          ipd_opd_no: convertedData.ipd_opd_no,
          date: convertedData.date,
          age: convertedData.age,
          consentObtained: convertedData.consentObtained,
          token,
        });
        setSuccess("Patient updated successfully");
      } else {
        // Create new patient - only include fields in the validator
        const result = await createPatient({
          ipd_opd_no: convertedData.ipd_opd_no,
          date: convertedData.date,
          age: convertedData.age,
          consentObtained: convertedData.consentObtained,
          token,
        });

        setSuccess("Patient created successfully");

        // Navigate to the patient view
        setTimeout(() => {
          navigate(`/patients/${result.patientId}`);
        }, 1500);
      }
    } catch (err) {
      setError(
        `Error saving patient data: ${err.message || "Please try again."}`
      );
      console.error("Error saving patient:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel form handling
  const handleCancel = () => {
    if (id) {
      navigate(`/patients/${id}`);
    } else {
      setConfirmDialog(true);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmDialog(false);
    navigate("/patients");
  };

  const handleCloseSnackbar = () => {
    setSuccess("");
    setError("");
  };

  // Render the appropriate form component based on the active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PatientDemographicsForm
            patient={patient}
            setPatient={setPatient}
            doctors={doctors}
            isMainHead={isMainHead}
          />
        );
      case 1:
        return <MedicalHistoryForm patient={patient} setPatient={setPatient} />;
      case 2:
        return (
          <ClinicalParametersForm patient={patient} setPatient={setPatient} />
        );
      case 3:
        return <LabResultsForm patient={patient} setPatient={setPatient} />;
      case 4:
        return (
          <LifestyleRiskFactorsForm patient={patient} setPatient={setPatient} />
        );
      case 5:
        return <TreatmentPlanForm patient={patient} setPatient={setPatient} />;
      case 6:
        return (
          <SAQLIQuestionnaireForm patient={patient} setPatient={setPatient} />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Tooltip title="Back">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" component="h1">
          {id ? "Edit Patient" : "New Patient"}
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error/Success alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Conditionally render the right component */}
        {isEditing ? (
          <EditPatientForm
            id={id}
            setPatient={setPatient}
            renderContent={renderStepContent}
          />
        ) : (
          <NewPatientForm renderContent={renderStepContent} />
        )}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button variant="outlined" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>

        <Box>
          {activeStep > 0 && (
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<PrevIcon />}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NextIcon />}
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<SaveIcon />}
              disabled={loading}
              color="success"
            >
              {loading ? <CircularProgress size={24} /> : "Save Patient"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All unsaved changes will be lost. Are you sure you want to cancel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            No, Keep Editing
          </Button>
          <Button onClick={handleConfirmCancel} color="error">
            Yes, Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientForm;
