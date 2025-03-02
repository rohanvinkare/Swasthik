require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const PORT = 4000;
const SERVER_URL = process.env.WS_RECEIVER_URL;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Dummy Sender Running...');
});

app.listen(PORT, () => {
    console.log(`Dummy sender running on http://${process.env.SERVER_IP}:${PORT}`);
});

// Generate random vitals
const generateVitals = () => ({
    timestamp: new Date().toISOString(),
    heartRate: Math.floor(Math.random() * (180 - 50) + 50),
    respiratoryRate: Math.floor(Math.random() * (40 - 10) + 10),
    bodyTemperature: parseFloat((Math.random() * (39 - 35) + 35).toFixed(1)),
    oxygenSaturation: Math.floor(Math.random() * (100 - 85) + 85),
    bloodPressure: {
        systolic: Math.floor(Math.random() * (140 - 90) + 90),
        diastolic: Math.floor(Math.random() * (90 - 60) + 60),
    },
    painLevel: Math.floor(Math.random() * 11),
    glucose: Math.floor(Math.random() * (200 - 70) + 70),
});

const patientId = '0a982c1b-e124-42fd-b426-4de5c22195d9';

let ws;
let reconnectInterval = 5000;

function connectWebSocket() {
    console.log(`Connecting to receiver at ${SERVER_URL}...`);
    ws = new WebSocket(SERVER_URL);

    ws.on('open', () => {
        console.log('Connected to receiver server');

        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                const data = JSON.stringify({
                    patient_id: patientId,
                    vitals: [generateVitals()]
                });

                ws.send(data);
                console.log('Sent:', data);
            }
        }, 2000);
    });

    ws.on('error', (err) => {
        console.error('Connection error:', err);
        ws.close();
    });

    ws.on('close', () => {
        console.warn('Disconnected from receiver. Retrying in 5 seconds...');
        setTimeout(connectWebSocket, reconnectInterval);
    });
}

connectWebSocket();
