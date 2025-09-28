import { useState, useEffect, useRef, useCallback } from 'react';
import { renderGame } from './renderer.jsx';
import { useGamepad } from './controlerLogic/useGamepad.jsx';
import './App.css';

function LegendItem({ name, spriteCoords, spritesheet }) {
  const canvasRef = useRef(null);
  const TILE_SIZE = 16;

  useEffect(() => {
    if (canvasRef.current && spritesheet) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
      const [spriteX, spriteY] = spriteCoords;
      ctx.drawImage(
        spritesheet,
        spriteX, spriteY, TILE_SIZE, TILE_SIZE,
        0, 0, TILE_SIZE, TILE_SIZE
      );
    }
  }, [spritesheet, spriteCoords]);

  return (
    <div className="flex items-center gap-x-3">
      <canvas ref={canvasRef} width={TILE_SIZE} height={TILE_SIZE} className="bg-gray-700 rounded-sm flex-shrink-0"></canvas>
      <span className="text-sm">{name}</span>
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState(null);
  const [selfID, setSelfID] = useState(null);
  const [spritesheet, setSpritesheet] = useState(null);
  const canvasRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    const image = new Image();
    image.src = '/spritesheet.png';
    image.onload = () => setSpritesheet(image);
  }, []);

  useEffect(() => {
    if (!spritesheet) return;
    if (socket.current) return;
    socket.current = new WebSocket('ws://localhost:8080/ws');
    socket.current.onopen = () => console.log('Connected to game server.');
    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "welcome") setSelfID(msg.id);
      if (msg.type === "state") setGameState(msg.data);
    };
    socket.current.onclose = () => {
      console.log('Server connection lost.');
      setGameState(null);
    };
    return () => { if (socket.current) socket.current.close(); };
  }, [spritesheet]);

  useEffect(() => {
    if (gameState && canvasRef.current && spritesheet) {
      renderGame(canvasRef.current, spritesheet, gameState, selfID);
    }
  }, [gameState, selfID, spritesheet]);

  const sendCommand = useCallback((command) => {
    if (socket.current) {
      socket.current.send(command);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      let command = "";
      switch (e.key) {
        case 'w': case 'ArrowUp': command = 'w'; break;
        case 'a': case 'ArrowLeft': command = 'a'; break;
        case 's': case 'ArrowDown': command = 's'; break;
        case 'd': case 'ArrowRight': command = 'd'; break;
        case 'e': command = 'e'; break;
        case 'g': command = 'g'; break;
        case 'f': command = 'f'; break;
        case 'D': command = 'D'; break;
        case 'Escape': command = 'quit_or_cancel'; break;
      }
      if (command) {
        e.preventDefault();
        sendCommand(command);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendCommand]);

  useGamepad(sendCommand);

  const selfPlayer = gameState && selfID ? gameState.Players[selfID] : null;

  const legendItems = [
    { name: 'You', spriteCoords: [32 * 16, 0 * 16] },
    { name: 'Other Player', spriteCoords: [33 * 16, 0 * 16] },
    { name: 'Goblin', spriteCoords: [30 * 16, 3 * 16] },
    { name: 'Ogre', spriteCoords: [30 * 16, 6 * 16] },
    { name: 'Skeleton', spriteCoords: [24 * 16, 1 * 16] },
    { name: 'Sword', spriteCoords: [36 * 16, 8 * 16] },
    { name: 'Bow', spriteCoords: [40 * 16, 6 * 16] },
    { name: 'Armor', spriteCoords: [32 * 16, 1 * 16] },
    { name: 'Exit', spriteCoords: [43 * 16, 12 * 16] },
    { name: 'Fountain', spriteCoords: [42 * 16, 10 * 16] },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4 font-mono">
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full max-w-[1700px] mx-auto">
        <div className="relative border-4 border-gray-600 rounded-md shadow-lg">
          <canvas ref={canvasRef} />
          {gameState?.Players && Object.values(gameState.Players).map(player => {
            if (player.Status !== 'playing') return null;
            const blinkerClass = player.ID === selfID ? 'player-blinker' : 'other-player-blinker';
            return (
              <div
                key={player.ID}
                className={blinkerClass}
                style={{
                  left: player.Position.X * 16,
                  top: player.Position.Y * 16,
                }}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-96">
          <div className="ui-panel">
            <h2 className="panel-title">Status</h2>
            {selfPlayer ? (
              <div className="space-y-1 text-base">
                <p>HP: <span className="font-bold text-green-400">{selfPlayer.HP} / {selfPlayer.MaxHP}</span></p>
                <p>Weapon: <span className="font-bold text-yellow-400">{selfPlayer.EquippedWeapon ? selfPlayer.EquippedWeapon.Name : 'Fists'}</span></p>
                <p>Armor: <span className="font-bold text-sky-400">{selfPlayer.EquippedArmor ? `${selfPlayer.EquippedArmor.Name} (${selfPlayer.EquippedArmor.Durability})` : 'None'}</span></p>
                {selfPlayer.Status === 'targeting' && <p className="targeting-text">AIMING...</p>}
                {selfPlayer.Status === 'defeated' && <p className="text-red-500 font-bold">DEFEATED</p>}
              </div>
            ) : <p className="text-gray-400">Loading...</p>}
          </div>
          <div className="ui-panel">
            <h2 className="panel-title">Inventory (e to cycle)</h2>
            <div className="h-16 overflow-y-auto scrollbar-hide text-sm space-y-1">
              {selfPlayer && selfPlayer.Inventory.length > 0 ? (
                selfPlayer.Inventory.map((item, index) => (
                  <p key={index} className={item === selfPlayer.EquippedWeapon || item === selfPlayer.EquippedArmor ? 'text-yellow-300' : ''}>- {item.Name}</p>
                ))
              ) : <p className="text-gray-500 italic">Empty</p>}
            </div>
          </div>
          <div className="ui-panel">
            <h2 className="panel-title">Players</h2>
            <div className="h-22 overflow-y-auto scrollbar-hide space-y-2">
              {gameState?.Players && Object.values(gameState.Players).map(p => (
                <div key={p.ID} className={`p-2 rounded ${p.ID === selfID ? 'bg-purple-900/50' : ''}`}>
                  <p className="font-bold text-sm">{p.ID === selfID ? 'You' : `Player ${p.ID.substring(0, 4)}`}
                    <span className={`ml-2 ${p.Status === 'defeated' ? 'text-gray-500' : 'text-green-400'}`}>
                      ({p.HP > 0 ? p.HP : 0} HP)
                    </span>
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(p.HP / p.MaxHP) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ui-panel">
            <h2 className="panel-title">Legend</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {legendItems.map(item => (
                <LegendItem key={item.name} {...item} spritesheet={spritesheet} />
              ))}
            </div>
          </div>
          <div className="ui-panel">
             <h2 className="panel-title">Log</h2>
            <div className="h-8 flex items-center text-sm text-gray-400 italic">
                <span>{gameState?.Log?.[0] || '...'}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;