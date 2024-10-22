import React, { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [backendIp, setBackendIp] = useState('');
  const [connected, setConnected] = useState(false);

  const connectToWebSocket = () => {
    if (!backendIp.trim()) {
      alert('Please enter a valid backend IP address.');
      return;
    }
    // Connect to WebSocket server
    const ws = new WebSocket(`ws://${backendIp}:3002`);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    };

    setSocket(ws);
  };

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <h1>WebSocket Test</h1>
      {!connected ? (
        <div>
          <input
            value={backendIp}
            onChange={(e) => setBackendIp(e.target.value)}
            placeholder="Enter backend IP address"
          />
          <button onClick={connectToWebSocket}>Connect</button>
        </div>
      ) : (
        <div>
          <div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <div>
            <h2>Messages</h2>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
