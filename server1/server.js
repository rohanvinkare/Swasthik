require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Receiving Server Running...');
});

const server = app.listen(PORT, () => {
    console.log(`Receiving server running on http://${process.env.SERVER_IP}:${PORT}`);
});

// WebSocket server for sender
const wssSender = new WebSocketServer({ server });
console.log(`WebSocket server for sender listening on ${process.env.WS_RECEIVER_URL}`);

// WebSocket server for React frontend
const wssFrontend = new WebSocketServer({ port: 6000 });
console.log(`WebSocket server for frontend listening on ${process.env.WS_FRONTEND_URL}`);

wssSender.on('connection', (ws) => {
    console.log('Sender connected');

    ws.on('message', (message) => {
        console.log('Received from sender:', message.toString());

        // Send data immediately to all connected frontend clients
        wssFrontend.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => console.log('Sender disconnected'));
});

wssFrontend.on('connection', (ws) => {
    console.log('Frontend connected');
});
