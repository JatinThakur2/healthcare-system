import { Id } from "./_generated/dataModel";

// User type definition
export interface User {
  _id: Id<"users">;
  email: string;
  hashedPassword: string;
  role: "mainHead" | "doctor";
  name: string;
  createdAt: number;
  updatedAt: number;
  createdBy?: Id<"users">;
  isActive: boolean;
}

// Patient Complaint
export interface Complaint {
  symptom: string;
  severity: string;
  duration: string;
}

// Medical Condition
export interface MedicalCondition {
  status: boolean;
  duration?: string;
  treatment?: string;
}

// Medical History
export interface MedicalHistory {
  hypertension: MedicalCondition;
  heartDisease: MedicalCondition;
  stroke: MedicalCondition;
  diabetes: MedicalCondition;
  copd: MedicalCondition;
  asthma: MedicalCondition;
  neurologicalDisorders: MedicalCondition;
  otherConditions?: string;
}

// Past/Family History Entry
export interface FamilyHistoryEntry {
  condition: string;
  details: string;
}

// Anthropometric Parameters
export interface AnthropometricParameters {
  height?: number;
  waistCircumference?: number;
  bmi?: number;
  neckCircumference?: number;
  hipCircumference?: number;
  waistHipRatio?: number;
  pulse?: number;
  temperature?: number;
  bloodPressure?: string;
  sleepStudyType?: string;
  bodyWeight?: number;
  oxygenSaturation?: number;
  apneaHypopneaIndex?: number;
  sleepEfficiency?: number;
  sleepStages?: string;
  otherFindings?: string;
}

// Clinical Parameters
export interface ClinicalParameters {
  bloodPressure?: string;
  oxygenSaturation?: string;
  polysomnographyResults?: string;
  heartRateVariability?: string;
  electrocardiogram?: string;
}

// Laboratory Test
export interface LaboratoryTest {
  name: string;
  value: string;
  normalRange?: string;
}

// Laboratory Investigation
export interface LaboratoryInvestigation {
  hb?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  fbs?: number;
  tsh?: number;
  t3?: number;
  t4?: number;
  additionalTests?: LaboratoryTest[];
}

// Lifestyle Factors
export interface LifestyleFactors {
  physicalActivity?: string;
  smoking?: string;
  eatingHabit?: string;
  alcoholIntake?: string;
}

// Traditional Risk Factors
export interface TraditionalRiskFactors {
  hyperlipidemia?: boolean;
  diabetesMellitus?: boolean;
  hypertension?: boolean;
  obesity?: boolean;
  smoking?: boolean;
  familyHistory?: boolean;
}

// Non-Traditional Risk Factors
export interface NonTraditionalRiskFactors {
  sleepDisorder?: boolean;
  airPollution?: boolean;
  dietStyle?: boolean;
  psychosocialFactor?: boolean;
  chronicKidneyDisease?: boolean;
  depressionAndAnxiety?: boolean;
}

// Risk Factors
export interface RiskFactors {
  traditionalRiskFactors: TraditionalRiskFactors;
  nonTraditionalRiskFactors: NonTraditionalRiskFactors;
}

// Treatment Plan
export interface TreatmentPlan {
  oralApplianceTherapy?: boolean;
  cpapTherapy?: boolean;
  surgery?: boolean;
  epworthSleepScaleScore?: string;
  sleepApneaCardiovascularRiskScore?: string;
  dateOfStart?: number;
  dateOfStop?: number;
}

// SAQLI Questionnaire - Daily Functioning
export interface SaqliDailyFunctioning {
  troubleWithDailyActivities?: string;
  concentrationAffected?: string;
  physicallyFatigued?: string;
}

// SAQLI Questionnaire - Social Interactions
export interface SaqliSocialInteractions {
  socialGatheringsAffected?: string;
  feltIsolated?: string;
  familySupport?: string;
}

// SAQLI Questionnaire - Emotional Functioning
export interface SaqliEmotionalFunctioning {
  frustration?: string;
  depression?: string;
}

// SAQLI Questionnaire - Symptoms
export interface SaqliSymptoms {
  unrefreshedOrHeadache?: string;
  snoringAffected?: string;
  chestDiscomfortOrPalpitations?: string;
}

// SAQLI Questionnaire
export interface SaqliQuestionnaire {
  dailyFunctioning: SaqliDailyFunctioning;
  socialInteractions: SaqliSocialInteractions;
  emotionalFunctioning: SaqliEmotionalFunctioning;
  symptoms: SaqliSymptoms;
}

// Patient definition
export interface Patient {
  _id: Id<"patients">;
  ipd_opd_no: string;
  date: number;
  age?: number;
  dob?: number;
  gender?: string;
  contactNo?: string;
  address?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  economicStatus?: string;
  provisionalDiagnosis?: string;
  finalDiagnosis?: string;
  complaints?: Complaint[];
  medicalHistory?: MedicalHistory;
  pastFamilyHistory?: FamilyHistoryEntry[];
  anthropometricParameters?: AnthropometricParameters;
  clinicalParameters?: ClinicalParameters;
  laboratoryInvestigation?: LaboratoryInvestigation;
  lifestyleFactors?: LifestyleFactors;
  riskFactors?: RiskFactors;
  treatmentPlan?: TreatmentPlan;
  saqliQuestionnaire?: SaqliQuestionnaire;
  createdBy: Id<"users">;
  doctorId?: Id<"users">;
  createdAt: number;
  updatedAt: number;
  lastModifiedBy: Id<"users">;
  consentObtained?: boolean;
}
