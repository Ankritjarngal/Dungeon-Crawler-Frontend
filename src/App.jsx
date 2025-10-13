import { useState, useEffect, useRef, useCallback } from 'react';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import useKeyboardControls from './hooks/useKeyboardControls';
import { renderGame } from './renderer';
import './App.css';

function App() {
  const [view, setView] = useState('lobby');
  const [gameState, setGameState] = useState(null);
  const [selfID, setSelfID] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [spritesheet, setSpritesheet] = useState(null);
  
  const socket = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const image = new Image();
    image.src = '/spritesheet.png';
    image.onload = () => setSpritesheet(image);
  }, []);

  const sendCommand = useCallback((command) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN && isConnectedRef.current) {
      socket.current.send(command);
    }
  }, []);

  useKeyboardControls(sendCommand, view === 'game');

  const connectAndJoin = (type, code) => {
    if (socket.current) socket.current.close();
    
    // Remember to configure your WebSocket URL, e.g., from environment variables
    const socketURL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/ws';
    socket.current = new WebSocket(socketURL);
    isConnectedRef.current = false;

    socket.current.onopen = () => {
      isConnectedRef.current = true;
      socket.current.send(JSON.stringify({ type, code }));
    };

    socket.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        switch (msg.type) {
          case "welcome":
            setSelfID(msg.id);
            setRoomCode(msg.code);
            setError('');
            setView('game');
            break;
          case "state":
            setGameState(msg.data);
            break;
          case "error":
            setError(msg.message);
            socket.current.close();
            break;
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    };

    socket.current.onclose = () => {
      isConnectedRef.current = false;
      if (view === 'game') {
        setView('lobby');
        setError('Connection to the server was lost.');
        setGameState(null);
      }
    };

    socket.current.onerror = () => {
      setError('Failed to connect to the server.');
    };
  };

  const handleCreateGame = (code) => {
    if (!/^[A-Z]{4}$/.test(code)) {
      setError("Code must be 4 uppercase letters.");
      return;
    }
    connectAndJoin('create', code);
  };

  const handleJoinGame = (code) => {
    if (!/^[A-Z]{4}$/.test(code)) {
      setError("Code must be 4 uppercase letters.");
      return;
    }
    connectAndJoin('join', code);
  };

  if (view === 'lobby') {
    return (
      <Lobby 
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        error={error}
        initialRoomCode={roomCode}
      />
    );
  }

  return (
    <GameView 
      gameState={gameState}
      selfID={selfID}
      roomCode={roomCode}
      spritesheet={spritesheet}
      renderGame={renderGame}
    />
  );
}

export default App;