import agent from "../llmAgent.js";
import { SYSTEM_PROMPT_vitals ,SYSTEM_PROMPT_diet , SYSTEM_PROMPT_medications , SYSTEM_PROMPT_report} from "../utils/constants.js";
import Patient from '../models/model.patient.js';
import Vitals from "../models/model.vitals.js";

// Service to analyze patient data using the LLM model
const analyzePatient = async (patientData) => {
  try {
    // Call the llmAgent function with the patient data
    const response = await agentllmAgent(JSON.stringify(patientData), SYSTEM_PROMPT_vitals);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze patient data: ${error.message}`);
  }
};
// Service to analyze patient data using the LLM model
const patientDiet = async (patientData) => {
  try {
    // Call the llmAgent function with the patient data
    const response = await agent.llmAgent(JSON.stringify(patientData), SYSTEM_PROMPT_diet);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze patient data: ${error.message}`);
  }
};

const requiredMedications = async (patientData) => {
  try {
    // Call the llmAgent function with the patient data
    const response = await agent.llmAgent(JSON.stringify(patientData), SYSTEM_PROMPT_medications);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze patient data: ${error.message}`);
  }
};

const generateReport = async (patient_id) => {
  try {
    //call patient data from the database with patient_id
    const patientData = await Patient.findOne({ patient_id })
    const vitalData = await Vitals.findOne({ patient_id })
    // Call the llmAgent function with the patient data
    const response = await agent.llmAgentReport(JSON.stringify({patientData , vitalData}), SYSTEM_PROMPT_report);
    return response;
  } catch (error) {
    throw new Error(`Failed to analyze patient data: ${error.message}`);
  }
};

export default { analyzePatient , patientDiet , requiredMedications , generateReport };