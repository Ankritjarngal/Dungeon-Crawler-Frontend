import { useState, useEffect, useRef, useCallback } from 'react';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import VictoryScreen from './components/VictoryScreen';
import DefeatScreen from './components/DefeatScreen';
import Tutorial from './howtoplay/Tutorial.jsx';
import useKeyboardControls from './hooks/useKeyboardControls';
import { renderGame } from './renderer.jsx';
import './App.css';
import { GiScrollQuill } from "react-icons/gi";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Added Mute icon for polish

function App() {
  const [view, setView] = useState('lobby');
  const [gameState, setGameState] = useState(null);
  const [selfID, setSelfID] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [spritesheet, setSpritesheet] = useState(null);
  const [gameOverResult, setGameOverResult] = useState(null);
  const [createCode, setCreateCode] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  // Audio State
  const [isAudioBarVisible, setIsAudioBarVisible] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const socket = useRef(null);
  const isConnectedRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/bg.mp3');
    audio.loop = true;
    audio.volume = volume;
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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

  useKeyboardControls(sendCommand, view === 'game' && !gameOverResult && !isTutorialOpen);

  const connectAndJoin = (type, code) => {
    if (socket.current) socket.current.close();

    const socketURL =
      process.env.NODE_ENV === "production"
        ? "wss://artistic-gretal-ankritjarngal-9fa33e09.koyeb.app/ws"
        : "ws://localhost:8080/ws";

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

  const renderCurrentView = () => {
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
  };

  return (
    <>
      {/* Tutorial Button */}
      {!isTutorialOpen && (
        <button
          onClick={() => setIsTutorialOpen(true)}
          title="How to Play" 
          aria-label="Open tutorial" 
          className="fixed top-3 right-3 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-[#B8941F] bg-[#13110a] text-[#D4AF37] shadow-glow transition-all duration-300 ease-in-out hover:scale-110 hover:border-[#ffd700] hover:text-[#ffd700]"
        >
          <GiScrollQuill className="h-7 w-7" />
        </button>
      )}

      {isTutorialOpen && <Tutorial onClose={() => setIsTutorialOpen(false)} />}
      
      {renderCurrentView()}

      {/* SMOOTH ANIMATED AUDIO BAR */}
      <div
        className={`fixed top-3 right-16 z-[60] flex items-center overflow-hidden rounded-full border bg-[#13110a] shadow-glow transition-all duration-500 ease-out ${
          isAudioBarVisible 
            ? "w-48 border-[#ffd700] pr-4" /* Expanded: Wide, brighter border */ 
            : "w-10 border-[#B8941F]"      /* Collapsed: Circle, darker border */
        }`}
        style={{ height: "40px" }}
        onMouseEnter={() => setIsAudioBarVisible(true)}
        onMouseLeave={() => setIsAudioBarVisible(false)}
      >
        {/* Icon Section (Fixed Width) */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#D4AF37]">
          {volume === 0 ? (
             <FaVolumeMute className="h-5 w-5 opacity-70" />
          ) : (
             <FaVolumeUp className={`h-5 w-5 transition-colors duration-300 ${isAudioBarVisible ? 'text-[#ffd700]' : 'text-[#D4AF37]'}`} />
          )}
        </div>

        {/* Slider Section (Animated Entrance) */}
        <div 
          className={`flex flex-grow items-center transition-all duration-500 ease-out ${
            isAudioBarVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="audio-slider w-full"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </>
  );
}

export default App;