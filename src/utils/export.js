/**
 * Utility functions for exporting data
 */

/**
 * Flatten a nested object structure for CSV export
 * @param {Object} obj - The object to flatten
 * @param {String} prefix - The prefix for nested keys
 * @returns {Object} - Flattened object
 */
const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}_` : "";

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key]) &&
      Object.keys(obj[key]).length > 0
    ) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else if (Array.isArray(obj[key])) {
      // For arrays, we'll join the values with a delimiter
      acc[`${pre}${key}`] = obj[key]
        .map((item) => {
          if (typeof item === "object") {
            return JSON.stringify(item);
          }
          return item;
        })
        .join(" | ");
    } else {
      acc[`${pre}${key}`] = obj[key];
    }

    return acc;
  }, {});
};

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @returns {String} - CSV string
 */
const convertToCSV = (data) => {
  const flattenedData = data.map((item) => flattenObject(item));

  // Get all unique keys from the flattened data
  const allKeys = new Set();
  flattenedData.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });

  const headers = Array.from(allKeys);

  // Build CSV string
  let csvContent = headers.join(",") + "\n";

  flattenedData.forEach((item) => {
    const row = headers.map((header) => {
      // Handle commas and quotes in the data
      const cell = item[header] !== undefined ? String(item[header]) : "";
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });

    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  const csvContent = convertToCSV(data);

  // Create blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create download link and trigger click
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for display
 * @param {Number} timestamp - Timestamp to format
 * @returns {String} - Formatted date string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

/**
 * Format and export patient data to CSV
 * @param {Object} patient - The patient data object to export
 */
export const exportPatientToCSV = (patient) => {
  if (!patient || !patient._id) {
    console.error("Invalid patient data for export");
    return;
  }

  // Create a filename with IPD/OPD No. and patient name
  const filename =
    `${patient.ipd_opd_no || "unknown"}_${patient.name || "patient"}`.replace(
      /[^a-z0-9_-]/gi,
      "_"
    );

  // Create a structured object for CSV export
  const exportData = [
    {
      // Basic demographic information
      "IPD/OPD No.": patient.ipd_opd_no || "",
      "Patient Name": patient.name || "",
      Date: patient.date ? new Date(patient.date).toLocaleDateString() : "",
      "Age (years)": patient.age || "",
      "Date of Birth": patient.dob
        ? new Date(patient.dob).toLocaleDateString()
        : "",
      Gender: patient.gender || "",
      "Contact No.": patient.contactNo || "",
      Address: patient.address || "",
      "Marital Status": patient.maritalStatus || "",
      "Employment Status": patient.employmentStatus || "",
      "Economic Status": patient.economicStatus || "",
      "Provisional Diagnosis": patient.provisionalDiagnosis || "",
      "Final Diagnosis": patient.finalDiagnosis || "",

      // Medical history section
      Hypertension: patient.medicalHistory?.hypertension?.status ? "Yes" : "No",
      "Hypertension Duration":
        patient.medicalHistory?.hypertension?.duration || "",
      "Hypertension Treatment":
        patient.medicalHistory?.hypertension?.treatment || "",

      "Heart Disease": patient.medicalHistory?.heartDisease?.status
        ? "Yes"
        : "No",
      "Heart Disease Duration":
        patient.medicalHistory?.heartDisease?.duration || "",
      "Heart Disease Treatment":
        patient.medicalHistory?.heartDisease?.treatment || "",

      Stroke: patient.medicalHistory?.stroke?.status ? "Yes" : "No",
      "Stroke Duration": patient.medicalHistory?.stroke?.duration || "",
      "Stroke Treatment": patient.medicalHistory?.stroke?.treatment || "",

      Diabetes: patient.medicalHistory?.diabetes?.status ? "Yes" : "No",
      "Diabetes Duration": patient.medicalHistory?.diabetes?.duration || "",
      "Diabetes Treatment": patient.medicalHistory?.diabetes?.treatment || "",

      COPD: patient.medicalHistory?.copd?.status ? "Yes" : "No",
      "COPD Duration": patient.medicalHistory?.copd?.duration || "",
      "COPD Treatment": patient.medicalHistory?.copd?.treatment || "",

      Asthma: patient.medicalHistory?.asthma?.status ? "Yes" : "No",
      "Asthma Duration": patient.medicalHistory?.asthma?.duration || "",
      "Asthma Treatment": patient.medicalHistory?.asthma?.treatment || "",

      "Neurological Disorders": patient.medicalHistory?.neurologicalDisorders
        ?.status
        ? "Yes"
        : "No",
      "Neurological Disorders Duration":
        patient.medicalHistory?.neurologicalDisorders?.duration || "",
      "Neurological Disorders Treatment":
        patient.medicalHistory?.neurologicalDisorders?.treatment || "",

      "Other Medical Conditions": patient.medicalHistory?.otherConditions || "",

      // Anthropometric parameters
      "Height (cm)": patient.anthropometricParameters?.height || "",
      "Weight (kg)": patient.anthropometricParameters?.bodyWeight || "",
      BMI: patient.anthropometricParameters?.bmi || "",
      "Waist Circumference (cm)":
        patient.anthropometricParameters?.waistCircumference || "",
      "Hip Circumference (cm)":
        patient.anthropometricParameters?.hipCircumference || "",
      "Waist-Hip Ratio": patient.anthropometricParameters?.waistHipRatio || "",
      "Neck Circumference (cm)":
        patient.anthropometricParameters?.neckCircumference || "",
      Pulse: patient.anthropometricParameters?.pulse || "",
      Temperature: patient.anthropometricParameters?.temperature || "",
      "Blood Pressure": patient.anthropometricParameters?.bloodPressure || "",
      "Oxygen Saturation (%)":
        patient.anthropometricParameters?.oxygenSaturation || "",
      "Sleep Study Type":
        patient.anthropometricParameters?.sleepStudyType || "",
      "Apnea Hypopnea Index":
        patient.anthropometricParameters?.apneaHypopneaIndex || "",
      "Sleep Efficiency (%)":
        patient.anthropometricParameters?.sleepEfficiency || "",
      "Sleep Stages": patient.anthropometricParameters?.sleepStages || "",
      "Other Findings": patient.anthropometricParameters?.otherFindings || "",

      // Clinical parameters
      "Clinical Blood Pressure":
        patient.clinicalParameters?.bloodPressure || "",
      "Clinical Oxygen Saturation":
        patient.clinicalParameters?.oxygenSaturation || "",
      "Polysomnography Results":
        patient.clinicalParameters?.polysomnographyResults || "",
      "Heart Rate Variability":
        patient.clinicalParameters?.heartRateVariability || "",
      Electrocardiogram: patient.clinicalParameters?.electrocardiogram || "",

      // Laboratory investigation
      Hemoglobin: patient.laboratoryInvestigation?.hb || "",
      Triglycerides: patient.laboratoryInvestigation?.triglycerides || "",
      HDL: patient.laboratoryInvestigation?.hdl || "",
      LDL: patient.laboratoryInvestigation?.ldl || "",
      "Fasting Blood Sugar": patient.laboratoryInvestigation?.fbs || "",
      TSH: patient.laboratoryInvestigation?.tsh || "",
      T3: patient.laboratoryInvestigation?.t3 || "",
      T4: patient.laboratoryInvestigation?.t4 || "",

      // Lifestyle factors
      "Physical Activity": patient.lifestyleFactors?.physicalActivity || "",
      "Smoking Status": patient.lifestyleFactors?.smoking || "",
      "Eating Habits": patient.lifestyleFactors?.eatingHabit || "",
      "Alcohol Intake": patient.lifestyleFactors?.alcoholIntake || "",

      // Risk factors - Traditional
      Hyperlipidemia: patient.riskFactors?.traditionalRiskFactors
        ?.hyperlipidemia
        ? "Yes"
        : "No",
      "Diabetes Mellitus": patient.riskFactors?.traditionalRiskFactors
        ?.diabetesMellitus
        ? "Yes"
        : "No",
      "Hypertension (Risk)": patient.riskFactors?.traditionalRiskFactors
        ?.hypertension
        ? "Yes"
        : "No",
      Obesity: patient.riskFactors?.traditionalRiskFactors?.obesity
        ? "Yes"
        : "No",
      "Smoking (Risk)": patient.riskFactors?.traditionalRiskFactors?.smoking
        ? "Yes"
        : "No",
      "Family History": patient.riskFactors?.traditionalRiskFactors
        ?.familyHistory
        ? "Yes"
        : "No",

      // Risk factors - Non-traditional
      "Sleep Disorder": patient.riskFactors?.nonTraditionalRiskFactors
        ?.sleepDisorder
        ? "Yes"
        : "No",
      "Air Pollution": patient.riskFactors?.nonTraditionalRiskFactors
        ?.airPollution
        ? "Yes"
        : "No",
      "Diet Style": patient.riskFactors?.nonTraditionalRiskFactors?.dietStyle
        ? "Yes"
        : "No",
      "Psychosocial Factor": patient.riskFactors?.nonTraditionalRiskFactors
        ?.psychosocialFactor
        ? "Yes"
        : "No",
      "Chronic Kidney Disease": patient.riskFactors?.nonTraditionalRiskFactors
        ?.chronicKidneyDisease
        ? "Yes"
        : "No",
      "Depression and Anxiety": patient.riskFactors?.nonTraditionalRiskFactors
        ?.depressionAndAnxiety
        ? "Yes"
        : "No",

      // Treatment plan
      "Oral Appliance Therapy": patient.treatmentPlan?.oralApplianceTherapy
        ? "Yes"
        : "No",
      "CPAP Therapy": patient.treatmentPlan?.cpapTherapy ? "Yes" : "No",
      Surgery: patient.treatmentPlan?.surgery ? "Yes" : "No",
      "Epworth Sleep Scale Score":
        patient.treatmentPlan?.epworthSleepScaleScore || "",
      "Sleep Apnea Cardiovascular Risk Score":
        patient.treatmentPlan?.sleepApneaCardiovascularRiskScore || "",
      "Treatment Start Date": patient.treatmentPlan?.dateOfStart
        ? new Date(patient.treatmentPlan.dateOfStart).toLocaleDateString()
        : "",
      "Treatment End Date": patient.treatmentPlan?.dateOfStop
        ? new Date(patient.treatmentPlan.dateOfStop).toLocaleDateString()
        : "",

      // SAQLI questionnaire - Daily functioning
      "Trouble with Daily Activities":
        patient.saqliQuestionnaire?.dailyFunctioning
          ?.troubleWithDailyActivities || "",
      "Concentration Affected":
        patient.saqliQuestionnaire?.dailyFunctioning?.concentrationAffected ||
        "",
      "Physically Fatigued":
        patient.saqliQuestionnaire?.dailyFunctioning?.physicallyFatigued || "",

      // SAQLI questionnaire - Social interactions
      "Social Gatherings Affected":
        patient.saqliQuestionnaire?.socialInteractions
          ?.socialGatheringsAffected || "",
      "Felt Isolated":
        patient.saqliQuestionnaire?.socialInteractions?.feltIsolated || "",
      "Family Support":
        patient.saqliQuestionnaire?.socialInteractions?.familySupport || "",

      // SAQLI questionnaire - Emotional functioning
      Frustration:
        patient.saqliQuestionnaire?.emotionalFunctioning?.frustration || "",
      Depression:
        patient.saqliQuestionnaire?.emotionalFunctioning?.depression || "",

      // SAQLI questionnaire - Symptoms
      "Unrefreshed or Headache":
        patient.saqliQuestionnaire?.symptoms?.unrefreshedOrHeadache || "",
      "Snoring Affected":
        patient.saqliQuestionnaire?.symptoms?.snoringAffected || "",
      "Chest Discomfort or Palpitations":
        patient.saqliQuestionnaire?.symptoms?.chestDiscomfortOrPalpitations ||
        "",

      // Metadata
      "Consent Obtained": patient.consentObtained ? "Yes" : "No",
      "Date Created": patient.createdAt
        ? new Date(patient.createdAt).toLocaleString()
        : "",
      "Last Updated": patient.updatedAt
        ? new Date(patient.updatedAt).toLocaleString()
        : "",
    },
  ];

  // Add complaints as additional data
  if (patient.complaints && Array.isArray(patient.complaints)) {
    exportData[0]["Complaints"] = patient.complaints
      .map((c) => `${c.symptom} (${c.severity}, ${c.duration})`)
      .join("; ");
  }

  // Add past/family history
  if (patient.pastFamilyHistory && Array.isArray(patient.pastFamilyHistory)) {
    exportData[0]["Past/Family History"] = patient.pastFamilyHistory
      .map((h) => `${h.condition}: ${h.details}`)
      .join("; ");
  }

  // Add additional lab tests
  if (
    patient.laboratoryInvestigation?.additionalTests &&
    Array.isArray(patient.laboratoryInvestigation.additionalTests)
  ) {
    exportData[0]["Additional Lab Tests"] =
      patient.laboratoryInvestigation.additionalTests
        .map(
          (test) =>
            `${test.name}: ${test.value}${test.normalRange ? ` (normal: ${test.normalRange})` : ""}`
        )
        .join("; ");
  }

  // Export to CSV
  exportToCSV(exportData, filename);
};

/**
 * Export multiple patients to CSV with formatted data
 * @param {Array} patients - Array of patient objects to export
 * @param {String} filename - Base filename for the export (without extension)
 */
export const exportPatientsToCSV = (patients, filename = "patients_export") => {
  if (!patients || !Array.isArray(patients) || patients.length === 0) {
    console.error("No valid patients data to export");
    return;
  }

  // Format each patient's data
  const exportData = patients.map((patient) => {
    // Basic demographic information
    return {
      "IPD/OPD No.": patient.ipd_opd_no || "",
      "Patient Name": patient.name || "",
      Date: patient.date ? new Date(patient.date).toLocaleDateString() : "",
      "Age (years)": patient.age || "",
      "Date of Birth": patient.dob
        ? new Date(patient.dob).toLocaleDateString()
        : "",
      Gender: patient.gender || "",
      "Contact No.": patient.contactNo || "",
      Address: patient.address || "",
      "Marital Status": patient.maritalStatus || "",
      "Employment Status": patient.employmentStatus || "",
      "Economic Status": patient.economicStatus || "",
      "Provisional Diagnosis": patient.provisionalDiagnosis || "",
      "Final Diagnosis": patient.finalDiagnosis || "",

      // Medical history section
      Hypertension: patient.medicalHistory?.hypertension?.status ? "Yes" : "No",
      "Hypertension Duration":
        patient.medicalHistory?.hypertension?.duration || "",
      "Hypertension Treatment":
        patient.medicalHistory?.hypertension?.treatment || "",

      "Heart Disease": patient.medicalHistory?.heartDisease?.status
        ? "Yes"
        : "No",
      "Heart Disease Duration":
        patient.medicalHistory?.heartDisease?.duration || "",
      "Heart Disease Treatment":
        patient.medicalHistory?.heartDisease?.treatment || "",

      Stroke: patient.medicalHistory?.stroke?.status ? "Yes" : "No",
      "Stroke Duration": patient.medicalHistory?.stroke?.duration || "",
      "Stroke Treatment": patient.medicalHistory?.stroke?.treatment || "",

      Diabetes: patient.medicalHistory?.diabetes?.status ? "Yes" : "No",
      "Diabetes Duration": patient.medicalHistory?.diabetes?.duration || "",
      "Diabetes Treatment": patient.medicalHistory?.diabetes?.treatment || "",

      COPD: patient.medicalHistory?.copd?.status ? "Yes" : "No",
      "COPD Duration": patient.medicalHistory?.copd?.duration || "",
      "COPD Treatment": patient.medicalHistory?.copd?.treatment || "",

      Asthma: patient.medicalHistory?.asthma?.status ? "Yes" : "No",
      "Asthma Duration": patient.medicalHistory?.asthma?.duration || "",
      "Asthma Treatment": patient.medicalHistory?.asthma?.treatment || "",

      "Neurological Disorders": patient.medicalHistory?.neurologicalDisorders
        ?.status
        ? "Yes"
        : "No",
      "Neurological Disorders Duration":
        patient.medicalHistory?.neurologicalDisorders?.duration || "",
      "Neurological Disorders Treatment":
        patient.medicalHistory?.neurologicalDisorders?.treatment || "",

      "Other Medical Conditions": patient.medicalHistory?.otherConditions || "",

      // Anthropometric parameters
      "Height (cm)": patient.anthropometricParameters?.height || "",
      "Weight (kg)": patient.anthropometricParameters?.bodyWeight || "",
      BMI: patient.anthropometricParameters?.bmi || "",
      "Waist Circumference (cm)":
        patient.anthropometricParameters?.waistCircumference || "",
      "Hip Circumference (cm)":
        patient.anthropometricParameters?.hipCircumference || "",
      "Waist-Hip Ratio": patient.anthropometricParameters?.waistHipRatio || "",
      "Neck Circumference (cm)":
        patient.anthropometricParameters?.neckCircumference || "",
      Pulse: patient.anthropometricParameters?.pulse || "",
      Temperature: patient.anthropometricParameters?.temperature || "",
      "Blood Pressure": patient.anthropometricParameters?.bloodPressure || "",
      "Oxygen Saturation (%)":
        patient.anthropometricParameters?.oxygenSaturation || "",
      "Sleep Study Type":
        patient.anthropometricParameters?.sleepStudyType || "",
      "Apnea Hypopnea Index":
        patient.anthropometricParameters?.apneaHypopneaIndex || "",
      "Sleep Efficiency (%)":
        patient.anthropometricParameters?.sleepEfficiency || "",
      "Sleep Stages": patient.anthropometricParameters?.sleepStages || "",
      "Other Findings": patient.anthropometricParameters?.otherFindings || "",

      // Clinical parameters
      "Clinical Blood Pressure":
        patient.clinicalParameters?.bloodPressure || "",
      "Clinical Oxygen Saturation":
        patient.clinicalParameters?.oxygenSaturation || "",
      "Polysomnography Results":
        patient.clinicalParameters?.polysomnographyResults || "",
      "Heart Rate Variability":
        patient.clinicalParameters?.heartRateVariability || "",
      Electrocardiogram: patient.clinicalParameters?.electrocardiogram || "",

      // Laboratory investigation
      Hemoglobin: patient.laboratoryInvestigation?.hb || "",
      Triglycerides: patient.laboratoryInvestigation?.triglycerides || "",
      HDL: patient.laboratoryInvestigation?.hdl || "",
      LDL: patient.laboratoryInvestigation?.ldl || "",
      "Fasting Blood Sugar": patient.laboratoryInvestigation?.fbs || "",
      TSH: patient.laboratoryInvestigation?.tsh || "",
      T3: patient.laboratoryInvestigation?.t3 || "",
      T4: patient.laboratoryInvestigation?.t4 || "",

      // Lifestyle factors
      "Physical Activity": patient.lifestyleFactors?.physicalActivity || "",
      "Smoking Status": patient.lifestyleFactors?.smoking || "",
      "Eating Habits": patient.lifestyleFactors?.eatingHabit || "",
      "Alcohol Intake": patient.lifestyleFactors?.alcoholIntake || "",

      // Risk factors - Traditional
      Hyperlipidemia: patient.riskFactors?.traditionalRiskFactors
        ?.hyperlipidemia
        ? "Yes"
        : "No",
      "Diabetes Mellitus": patient.riskFactors?.traditionalRiskFactors
        ?.diabetesMellitus
        ? "Yes"
        : "No",
      "Hypertension (Risk)": patient.riskFactors?.traditionalRiskFactors
        ?.hypertension
        ? "Yes"
        : "No",
      Obesity: patient.riskFactors?.traditionalRiskFactors?.obesity
        ? "Yes"
        : "No",
      "Smoking (Risk)": patient.riskFactors?.traditionalRiskFactors?.smoking
        ? "Yes"
        : "No",
      "Family History": patient.riskFactors?.traditionalRiskFactors
        ?.familyHistory
        ? "Yes"
        : "No",

      // Risk factors - Non-traditional
      "Sleep Disorder": patient.riskFactors?.nonTraditionalRiskFactors
        ?.sleepDisorder
        ? "Yes"
        : "No",
      "Air Pollution": patient.riskFactors?.nonTraditionalRiskFactors
        ?.airPollution
        ? "Yes"
        : "No",
      "Diet Style": patient.riskFactors?.nonTraditionalRiskFactors?.dietStyle
        ? "Yes"
        : "No",
      "Psychosocial Factor": patient.riskFactors?.nonTraditionalRiskFactors
        ?.psychosocialFactor
        ? "Yes"
        : "No",
      "Chronic Kidney Disease": patient.riskFactors?.nonTraditionalRiskFactors
        ?.chronicKidneyDisease
        ? "Yes"
        : "No",
      "Depression and Anxiety": patient.riskFactors?.nonTraditionalRiskFactors
        ?.depressionAndAnxiety
        ? "Yes"
        : "No",

      // Treatment plan
      "Oral Appliance Therapy": patient.treatmentPlan?.oralApplianceTherapy
        ? "Yes"
        : "No",
      "CPAP Therapy": patient.treatmentPlan?.cpapTherapy ? "Yes" : "No",
      Surgery: patient.treatmentPlan?.surgery ? "Yes" : "No",
      "Epworth Sleep Scale Score":
        patient.treatmentPlan?.epworthSleepScaleScore || "",
      "Sleep Apnea Cardiovascular Risk Score":
        patient.treatmentPlan?.sleepApneaCardiovascularRiskScore || "",
      "Treatment Start Date": patient.treatmentPlan?.dateOfStart
        ? new Date(patient.treatmentPlan.dateOfStart).toLocaleDateString()
        : "",
      "Treatment End Date": patient.treatmentPlan?.dateOfStop
        ? new Date(patient.treatmentPlan.dateOfStop).toLocaleDateString()
        : "",

      // SAQLI questionnaire - Daily functioning
      "Trouble with Daily Activities":
        patient.saqliQuestionnaire?.dailyFunctioning
          ?.troubleWithDailyActivities || "",
      "Concentration Affected":
        patient.saqliQuestionnaire?.dailyFunctioning?.concentrationAffected ||
        "",
      "Physically Fatigued":
        patient.saqliQuestionnaire?.dailyFunctioning?.physicallyFatigued || "",

      // SAQLI questionnaire - Social interactions
      "Social Gatherings Affected":
        patient.saqliQuestionnaire?.socialInteractions
          ?.socialGatheringsAffected || "",
      "Felt Isolated":
        patient.saqliQuestionnaire?.socialInteractions?.feltIsolated || "",
      "Family Support":
        patient.saqliQuestionnaire?.socialInteractions?.familySupport || "",

      // SAQLI questionnaire - Emotional functioning
      Frustration:
        patient.saqliQuestionnaire?.emotionalFunctioning?.frustration || "",
      Depression:
        patient.saqliQuestionnaire?.emotionalFunctioning?.depression || "",

      // SAQLI questionnaire - Symptoms
      "Unrefreshed or Headache":
        patient.saqliQuestionnaire?.symptoms?.unrefreshedOrHeadache || "",
      "Snoring Affected":
        patient.saqliQuestionnaire?.symptoms?.snoringAffected || "",
      "Chest Discomfort or Palpitations":
        patient.saqliQuestionnaire?.symptoms?.chestDiscomfortOrPalpitations ||
        "",

      // Metadata
      "Consent Obtained": patient.consentObtained ? "Yes" : "No",
      "Date Created": patient.createdAt
        ? new Date(patient.createdAt).toLocaleString()
        : "",
      "Last Updated": patient.updatedAt
        ? new Date(patient.updatedAt).toLocaleString()
        : "",

      // Additional concatenated fields (added after the base object)
      Complaints:
        patient.complaints && Array.isArray(patient.complaints)
          ? patient.complaints
              .map((c) => `${c.symptom} (${c.severity}, ${c.duration})`)
              .join("; ")
          : "",

      "Past/Family History":
        patient.pastFamilyHistory && Array.isArray(patient.pastFamilyHistory)
          ? patient.pastFamilyHistory
              .map((h) => `${h.condition}: ${h.details}`)
              .join("; ")
          : "",

      "Additional Lab Tests":
        patient.laboratoryInvestigation?.additionalTests &&
        Array.isArray(patient.laboratoryInvestigation.additionalTests)
          ? patient.laboratoryInvestigation.additionalTests
              .map(
                (test) =>
                  `${test.name}: ${test.value}${test.normalRange ? ` (normal: ${test.normalRange})` : ""}`
              )
              .join("; ")
          : "",
    };
  });

  // Export to CSV
  exportToCSV(exportData, filename);
};
