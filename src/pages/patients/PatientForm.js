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

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isMainHead } = useAuth();

  // State for the patient data
  const [patient, setPatient] = useState(initialPatientState);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Fetch doctors for main head to assign
  const doctors = useQuery(api.auth.getAllDoctors) || [];

  // Fetch patient data if editing
  const existingPatient = useQuery(
    id ? api.patients.getPatientById : null,
    id ? { id } : null
  );

  // Mutations
  const createPatient = useMutation(api.patients.createPatient);
  const updatePatient = useMutation(api.patients.updatePatient);

  // Set form data if editing an existing patient
  useEffect(() => {
    if (id && existingPatient) {
      setPatient(existingPatient);
    }
  }, [id, existingPatient]);

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
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const formData = {
        ...patient,
        // Set last modified info
        lastModifiedBy: user._id,
        updatedAt: Date.now(),
      };

      // Ensure doctorId is set properly
      if (!formData.doctorId) {
        formData.doctorId = isMainHead ? null : user._id;
      }

      if (id) {
        // Update existing patient
        await updatePatient({
          id,
          ...formData,
        });
        setSuccess("Patient updated successfully");
      } else {
        // Create new patient
        formData.createdBy = user._id;
        formData.createdAt = Date.now();
        if (!isMainHead) {
          formData.doctorId = user._id;
        }

        const result = await createPatient(formData);
        setSuccess("Patient created successfully");

        // Navigate to the patient view
        setTimeout(() => {
          navigate(`/patients/${result.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(
        "An error occurred while saving patient data. Please try again."
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

  // Loading state for editing
  if (id && !existingPatient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        {/* Render the appropriate form component */}
        {renderStepContent()}
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
