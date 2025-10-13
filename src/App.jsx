import { useState, useEffect, useRef, useCallback } from 'react';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import VictoryScreen from './components/VictoryScreen';
import DefeatScreen from './components/DefeatScreen';
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
  const [gameOverResult, setGameOverResult] = useState(null);
  const [createCode, setCreateCode] = useState('');

  const socket = useRef(null);
  const isConnectedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/bg.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch(err => console.log('Autoplay blocked:', err));
      document.removeEventListener('click', playAudio);
    };

    document.addEventListener('click', playAudio);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

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

  useKeyboardControls(sendCommand, view === 'game' && !gameOverResult);

  const connectAndJoin = (type, code) => {
    if (socket.current) socket.current.close();

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
            setGameOverResult(null);
            setView('game');
            break;
          case "state":
            setGameState(msg.data);
            break;
          case "error":
            setError(msg.message);
            socket.current.close();
            break;
          case "gameOver":
            setGameOverResult(msg.result);
            break;
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    };

    socket.current.onclose = () => {
      isConnectedRef.current = false;
      if (view === 'game' && !gameOverResult) {
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

  const handlePlayAgain = () => {
    setView('lobby');
    setGameState(null);
    setGameOverResult(null);
    setError('');
    setRoomCode('');
    setCreateCode('');
  };

  // --- Main Render Logic ---
  if (gameOverResult) {
    if (gameOverResult === 'victory') {
      return <VictoryScreen roomCode={roomCode} onPlayAgain={handlePlayAgain} />;
    } else {
      return <DefeatScreen roomCode={roomCode} onPlayAgain={handlePlayAgain} />;
    }
  }

  if (view === 'lobby') {
    return (
      <Lobby
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
        error={error}
        initialRoomCode={roomCode}
        onCodeChange={setRoomCode}
        onCreateCodeChange={setCreateCode}
        createCode={createCode}
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
