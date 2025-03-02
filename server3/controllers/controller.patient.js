import llmService from "../services/llmService.js";
import Patient from '../models/model.patient.js';


const addNewPatient = async (apiResponse) => {
  try {
      // Transform the API response to match the schema
      const patientData = {
          patient_id: apiResponse.patient_id,
          first_name: apiResponse.first_name,
          last_name: apiResponse.last_name,
          date_of_birth: new Date(apiResponse.date_of_birth), // Convert to Date object
          gender: apiResponse.gender,
          contact_number: apiResponse.contact_number,
          emergency_contact: {
              name: apiResponse.emergency_contact.name,
              relationship: apiResponse.emergency_contact.relationship,
              contact_number: apiResponse.emergency_contact.contact_number
          },
          address: {
              street: apiResponse.address.street,
              city: apiResponse.address.city,
              state: apiResponse.address.state,
              postal_code: apiResponse.address.postal_code,
              country: apiResponse.address.country
          },
          blood_type: apiResponse.blood_type,
          patient_type: apiResponse.patient_type,
          lifestyle: {
              diet: apiResponse.lifestyle.diet,
              physical_activity: apiResponse.lifestyle.physical_activity,
              smoking_status: apiResponse.lifestyle.smoking_status,
              alcohol_consumption: apiResponse.lifestyle.alcohol_consumption,
              stress_level: apiResponse.lifestyle.stress_level,
              sleep_quality: apiResponse.lifestyle.sleep_quality
          },
          height: apiResponse.height,
          weight: apiResponse.weight,
          allergies: apiResponse.allergies,
          medical_history: apiResponse.medical_history,
          current_medications: apiResponse.current_medications.map(med => ({
              name: med.name,
              dosage: med.dosage,
              frequency: med.frequency,
              start_date: new Date(med.start_date) // Convert to Date object
          })),
          insurance_information: {
              provider: apiResponse.insurance_information.provider,
              policy_number: apiResponse.insurance_information.policy_number,
              expiration_date: new Date(apiResponse.insurance_information.expiration_date) // Convert to Date object
          },
          assigned_doctor_id: apiResponse.assigned_doctor_id,
          assigned_nurse_id: apiResponse.assigned_nurse_id,
          admission_date: new Date(apiResponse.admission_date) // Convert to Date object
      };

      // Create a new Patient instance with the transformed data
      const newPatient = new Patient(patientData);

      // Save the new patient to the database
      const savedPatient = await newPatient.save();

      // console.log('Patient stored successfully:', savedPatient);
      return savedPatient;
  } catch (error) {
      console.error('Error storing patient:', error);
      throw error;
  }
};


// Controller to handle patient data analysis
const analyzePatient = async (req, res) => {
  try {
    // Extract patient data from the request body
    const patientData = req.body;

    // Validate that patient data is provided
    if (!patientData || Object.keys(patientData).length === 0) {
      return res.status(400).json({ error: "Patient data is required" });
    }
    
    // console.log(patientData);
    const savedPatient = await addNewPatient(patientData);

    // Call the LLM service to analyze the patient data
    const response = await llmService.analyzePatient(patientData);

    // Send the response back to the client
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const patientDiet = async (req, res) => {
  try {
    //patient_id from params
    const { patient_id } = req.params;

    // extract patient data from the database
    const patientData = await Patient.findOne({ patient_id });

    // Validate that patient data is provided
    if (!patientData || Object.keys(patientData).length === 0) {
      return res.status(400).json({ error: "Patient data is required" });
    }

    // Call the LLM service to analyze the patient data
    const response = await llmService.patientDiet(patientData);

    // Send the response back to the client
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const requiredMedications = async (req, res) => {
  try {
    // Extract patient data from the request body
    const patientData = req.body;

    // Validate that patient data is provided
    if (!patientData || Object.keys(patientData).length === 0) {
      return res.status(400).json({ error: "Patient data is required" });
    }

    // Call the LLM service to analyze the patient data
    const response = await llmService.requiredMedications(patientData);

    // Send the response back to the client
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { analyzePatient, patientDiet, requiredMedications };