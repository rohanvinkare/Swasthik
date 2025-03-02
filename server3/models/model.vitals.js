import mongoose from 'mongoose';
const vitalDataSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        required: true,
        default: Date.now // Automatically set the current timestamp
    },
    heartRate: {
        type: Number,
        min: 0,
        max: 300
    },
    respiratoryRate: {
        type: Number,
        min: 0,
        max: 100
    },
    bodyTemperature: {
        type: Number,
        min: 20,
        max: 45
    },
    oxygenSaturation: {
        type: Number,
        min: 0,
        max: 100
    },
    bloodPressure: {
        systolic: {
            type: Number,
            min: 0,
            max: 300
        },
        diastolic: {
            type: Number,
            min: 0,
            max: 300
        }
    },
    painLevel: {
        type: Number,
        min: 0,
        max: 10
    },
    glucose: {
        type: Number,
        min: 0,
        max: 1000
    }
});

const vitalsSchema = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true,
        ref: 'Patient' // Reference to the Patient model (optional)
    },
    vitals: [vitalDataSchema] // Array of vital data objects
}, { timestamps: true });

const Vitals = mongoose.model('Vitals', vitalsSchema);

export default Vitals;