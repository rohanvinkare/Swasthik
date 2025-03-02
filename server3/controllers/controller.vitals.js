import llmService from "../services/llmService.js";
import Vitals from "../models/model.vitals.js";


const upsertVitals = async (req, res) => {
    try {
        // Extract data from request body
        const { patient_id, vitalSigns } = req.body;

        console.log("Received Data:", patient_id, vitalSigns);

        // Ensure vitalSigns is an array
        const vitalsArray = Array.isArray(vitalSigns) ? vitalSigns : [vitalSigns];

        // Validate input
        if (!patient_id || vitalsArray.length === 0) {
            return res.status(400).json({ error: "Patient ID and vital signs are required" });
        }

        // Find existing vitals document for the patient
        let existingVitals = await Vitals.findOne({ patient_id });

        if (existingVitals) {
            // Append new vital signs with timestamps to the existing document
            existingVitals.vitals.push(...vitalsArray);
            await existingVitals.save();
        } else {
            // Create a new document if no existing record is found
            existingVitals = new Vitals({
                patient_id,
                vitals: vitalsArray
            });
            await existingVitals.save();
        }

        // Send response back to client
        res.status(200).json(existingVitals);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getVitals = async (req, res) => {
    try {
        // Extract patient ID from request parameters
        const { patient_id } = req.params;

        // Validate input
        if (!patient_id) {
            return res.status(400).json({ error: "Patient ID is required" });
        }

        // Find the patient first
        const patient = await Vitals.findOne({ patient_id });

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Generate response using LLM service
        const response = await llmService.analyzeVitals(patient);

        // Send response back to client
        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const generateReport = async (req, res) => {
  try {
    // Extract patient id from params
    const { patient_id } = req.params;

    // Validate input
    if (!patient_id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Call the LLM service to generate the report
    const response = await llmService.generateReport(patient_id);
    console.log(response);

    // Send the response back to the client
    res.status(200).send(response);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { upsertVitals, getVitals, generateReport };