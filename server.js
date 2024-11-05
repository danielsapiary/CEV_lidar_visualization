const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Serve the React app from the build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Preprocess raw JSON string to replace "Infinity" with null
const preprocessJson = (rawData) => {
  return rawData.replace(/Infinity/g, 'null');
};

// Load default.json and preprocess it
let rawData = fs.readFileSync('frame.json', 'utf8');
let latestScanData = JSON.parse(preprocessJson(rawData));

// Function to replace Infinity values with null in the ranges array (not needed if handled earlier, but good for incoming data)
const replaceInfinityWithNull = (data) => {
  return {
    ...data,
    ranges: data.ranges.map(range => (range === Infinity ? null : range)),
  };
};

// Set up WebSocket server and make it accessible from any IP (0.0.0.0)
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 3002 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send the latest scan data to the client when they connect
  if (latestScanData) {
    ws.send(JSON.stringify(latestScanData));
  }

  // Notify when the client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Endpoint to receive JSON data via HTTP POST from external sources
app.use(express.json()); // Parse incoming JSON

app.post('/upload-lidar', (req, res) => {
  // Replace Infinity values with null in the incoming data
  latestScanData = replaceInfinityWithNull(req.body);

  // Broadcast the new data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(latestScanData));
    }
  });

  res.status(200).send('LIDAR data received and broadcasted.');
});

// Start the Express server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});