const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3001;

// Serve the React app from the build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Set up WebSocket server and make it accessible from any IP (0.0.0.0)
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 3002 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });

    // Notify when the client disconnects
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the Express server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
