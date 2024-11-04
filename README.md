# CEV LIDAR Visualization

This project is a LIDAR visualization tool built using React and WebSockets. It visualizes LIDAR data by plotting points around a car emoji, simulating distances detected by LIDAR sensors. The app can also handle incoming LIDAR data via WebSockets, displaying all points beyond a detected distance at each angle. The car is placed at the origin, and LIDAR points are plotted around it.

## Installation

### Prerequisites
- **Node.js**: Make sure you have Node.js installed on your machine.
- **NPM**: Comes with Node.js, but you can check by running `npm --version` in your terminal.

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd CEV_lidar_visualization
   ```

2. **Install dependencies for the backend**:
   ```bash
   npm install express ws
   ```

3. **Start the backend WebSocket server**:
   ```bash
   node server.js
   ```

   This will start the server on port 3001 for HTTP POST requests and port 3002 for WebSocket connections.

### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies for the frontend**:
   ```bash
   npm install
   ```

3. **Start the React frontend**:
   ```bash
   npm start
   ```

   This will start the frontend development server at `http://localhost:3000`.

## How to Use
1. **Start the Backend**: Run the WebSocket server using `node server.js`. The backend will listen for incoming LIDAR data via POST requests and broadcast it to connected clients via WebSocket.
   
2. **Start the Frontend**: Run the React app with `npm start` in the `frontend/` directory. The frontend will automatically connect to the WebSocket server and start visualizing data.

3. **Sending LIDAR Data**: You can send LIDAR data (JSON format) to the backend from any machine via an HTTP POST request. Example using `curl`:
   ```bash
   curl -X POST http://localhost:3001/upload-lidar \
   -H "Content-Type: application/json" \
   -d @scan.json
   ```
   This will send a LIDAR scan JSON file (e.g., `scan.json`) to the backend, and the frontend will update the visualization in real time.

4. **Visualization Behavior**:
   - LIDAR points are plotted around the car emoji at the origin.
   - For each detected point at distance `d`, all points beyond that distance (i.e., from `d` to 10 meters) are filled at the same angle.
   - LIDAR points less than 0.25 meters from the car are ignored.

## JSON Format for LIDAR Data
The expected format for LIDAR data sent via POST is as follows:
```json
{
  "timestamp": <timestamp>,
  "angle_min": -3.141592653589793,
  "angle_max": 3.141592653589793,
  "angle_increment": 0.008726646259971648,
  "ranges": [
    <distance1>, <distance2>, ..., <distanceN>
  ]
}
```
- **`ranges`**: An array of distances measured by the LIDAR sensor.
- **`angle_increment`**: The angle increment between two consecutive measurements.

## Handling Special Values
- If the `ranges` array contains `Infinity`, these values will be replaced with `null` to avoid parsing errors.
- The frontend filters out any points closer than 0.25 meters and draws points outward for all detected points.

## Example Visualization
The app will display a car emoji at the center of the screen, with LIDAR points drawn around it. If a point is detected at a certain distance, all points beyond that distance will be drawn in black.

## License
This project is licensed under the MIT License.

