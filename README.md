## CEV LIDAR Visualization

This project is a LIDAR visualization tool built using React and WebSockets. It visualizes LIDAR data by plotting points around a car image, simulating distances detected by LIDAR sensors. The app can also handle incoming LIDAR data via WebSockets, displaying all points beyond a detected distance at each angle. The car is placed at the origin, and LIDAR points are plotted around it.

## Installation

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your machine.
- **NPM**: Comes with Node.js, but you can check by running `npm --version` in your terminal.

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone git@github.com:danielsapiary/CEV_lidar_visualization.git
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

   - LIDAR points are plotted around the car image at the origin.
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

<img width="300" alt="Screenshot 2024-11-04 at 12 55 50 PM" src="https://github.com/user-attachments/assets/870b1812-e09a-4fec-9a79-1c470b3d1303">

## Code Overview

### Backend

The backend is implemented using Node.js with the `express` and `ws` libraries. It performs the following functions:

- **HTTP POST Endpoint**: Receives LIDAR data from external sources via `/upload-lidar` endpoint.
- **WebSocket Server**: Broadcasts incoming LIDAR data to all connected frontend clients in real time.

The `server.js` file contains the logic for handling incoming POST requests, sanitizing data, and broadcasting it over WebSockets. It ensures that data with invalid or missing fields is handled gracefully to prevent crashes. The WebSocket server is hosted on port 3002 and dynamically sends real-time updates to connected clients.

### Frontend

The frontend is a React application responsible for rendering LIDAR data visually. Key files include:

- **`App.js`**: The entry point for the React app. It establishes a WebSocket connection to the backend, manages global state for the visualization, and conditionally renders components based on connection and data availability.
- **`LidarVisualization.js`**: A custom React component that handles the core LIDAR visualization logic. It translates polar coordinates to Cartesian coordinates, filters out invalid data, and renders the visualization as a dynamic SVG.

### Data Flow

1. **Data Reception**: The backend receives LIDAR data via a POST request.
2. **Broadcasting**: The backend sanitizes the data and broadcasts it to all connected clients via WebSockets.
3. **Visualization**: The frontend receives data, processes it into Cartesian coordinates, and dynamically updates the SVG rendering to reflect real-time LIDAR readings.

### Key React Components

1. **`App.js`**:

   - Manages WebSocket connections.
   - Tracks connection status and received LIDAR data.
   - Renders the `LidarVisualization` component when data is available.

2. **`LidarVisualization.js`**:

   - Converts polar coordinates (angle and distance) to Cartesian coordinates for rendering on a 2D plane.
   - Filters out points that fall below a minimum distance or exceed a maximum distance.
   - Handles interpolation for missing or invalid data to maintain a smooth visualization.
   - Uses an SVG `<polygon>` to group and display LIDAR points dynamically.

### Advanced Features

- **Data Interpolation**: Missing or invalid data points in the `ranges` array are replaced using interpolation between the nearest valid neighbors or default values when no neighbors are available.
- **Dynamic Grouping**: Points are grouped into polygons to represent detected objects or areas effectively. Grouping ensures smooth transitions in visualization as new data is received.
- **Real-Time Updates**: The SVG visualization updates dynamically with new data received through WebSockets, ensuring an interactive and responsive experience.

## Future Work

In the future, we plan to rework significant portions of the project to integrate data from a new 3D LIDAR system. This will allow for enhanced visualization capabilities, including support for depth perception and multi-dimensional analysis. The transition to 3D LIDAR will require updates to both the backend (to handle more complex data structures) and the frontend (to render 3D visualizations using advanced libraries such as Three.js).

