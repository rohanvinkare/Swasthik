import express from "express";
import vitalsController from "../controllers/controller.vitals.js";

const router = express.Router();

router.post("/patient-vitals",vitalsController.upsertVitals );

router.get("/patient-vitals/:patient_id",vitalsController.getVitals );

router.get("/report/:patient_id",vitalsController.generateReport );

export default router;