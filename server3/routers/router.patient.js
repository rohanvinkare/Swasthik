import express from "express";
import patientController from "../controllers/controller.patient.js";

const router = express.Router();

// POST endpoint to handle patient data analysis
router.post("/analyze-patient", patientController.analyzePatient);

router.get("/patient-diet/:patient_id",patientController.patientDiet);

router.post("/required-medications",patientController.requiredMedications);

export default router;