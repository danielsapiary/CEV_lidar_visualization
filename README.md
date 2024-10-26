# CEV_lidar_visualization

This is a simple WebSocket chat application built with a React frontend and a Node.js backend. The backend serves the frontend and also handles WebSocket connections for real-time messaging.

## Features
- Connect to a WebSocket server by specifying the backend IP address.
- Send and receive messages in real time.

## Requirements
- Node.js (v12 or later)
- npm (v6 or later)

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone <repository-url>
   cd websocket-chat-app
   ```

2. **Install Dependencies**
   ```sh
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. **Build the React Frontend**
   ```sh
   cd frontend
   npm run build
   cd ..
   ```

4. **Run the Backend Server**
   ```sh
   node server.js
   ```

   The server will start on port 3001, and the WebSocket server will run on port 3002.

5. **Access the Application**
   - Open your web browser and go to `http://<your-ip-address>:3001`
   - Enter the backend IP address in the input field to connect to the WebSocket server.

## Usage
- Once connected, you can send messages through the input field.
- All connected clients will see messages in real time.

## Troubleshooting
- Ensure that the server is running on `0.0.0.0` to make it accessible from other devices on the same network.
- Make sure ports `3001` and `3002` are open on the host machine.

## License
This project is licensed under the MIT License.

