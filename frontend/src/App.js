import React, { useEffect, useState } from 'react';
import LidarVisualization from './components/LidarVisualization'; // Import the LidarVisualization component

function App() {
  const [scanData, setScanData] = useState(null);  // State to hold LIDAR scan data
  const [connected, setConnected] = useState(false);  // State to manage WebSocket connection status
  const [socket, setSocket] = useState(null);  // WebSocket instance

  // Function to establish WebSocket connection to the backend
  const connectToWebSocket = () => {
    const backendIp = window.location.hostname;  // Change this to correct IP where backend is hosted once we port this to Mobile Dash / AR

    const ws = new WebSocket(`ws://${backendIp}:3002`);  // Connect to WebSocket server on port 3002

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    };

    // On receiving messages (LIDAR JSON data)
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);  // Parse incoming JSON data
        setScanData(data);  // Store the received LIDAR scan data
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Handle WebSocket closure
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    };

    setSocket(ws);  // Save the WebSocket instance to state
  };

  // Automatically connect when the component mounts
  useEffect(() => {
    connectToWebSocket();
  }, []);  // Only run once, when the component mounts

  return (
    <div className="App">
      <center>
      <h1>LIDAR Visualization</h1>
      {connected ? (
        <div>
          {/* Render the LidarVisualization component if data is available */}
          {scanData ? (
            <LidarVisualization scanData={scanData} />
          ) : (
            <p>Waiting for LIDAR data...</p>
          )}
        </div>
      ) : (
        <p>Connecting to WebSocket server...</p>
      )}
      </center>
    </div>
  );
}

export default App;
