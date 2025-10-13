import { useEffect, useRef } from 'react';
import GameUI from './GameUI';
import { renderGame } from '../renderer';

function GameView({ gameState, selfID, roomCode, spritesheet }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (gameState && canvasRef.current && spritesheet) {
      renderGame(canvasRef.current, spritesheet, gameState, selfID);
    }
  }, [gameState, selfID, spritesheet]);

  return (
    <div className="h-screen bg-[#0D0D0F] p-2 flex flex-col gap-2 font-mono overflow-hidden">
      
      <header className="flex-shrink-0 bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2">
        <h1 className="text-center font-bold text-[#B68F40] text-lg uppercase tracking-widest">
          Room: <span className="text-[#FF6B1A]">{roomCode}</span>
        </h1>
      </header>

      <main className="flex-grow flex gap-2 min-h-0 overflow-hidden">
        
        <div className="flex-grow flex flex-col gap-2 min-w-0 overflow-hidden">
          
          <div className="flex-grow bg-black border-4 border-[#4A4E57] rounded-md shadow-lg overflow-auto relative" ref={containerRef}>
            <div className="inline-block relative min-w-full min-h-full">
              <canvas ref={canvasRef} className="block" />
              {gameState?.Players && Object.values(gameState.Players).map(player => {
                if (!player.Position || player.Status === 'limbo') return null;
                
                const TILE_SIZE = 16;
                const blinkerClass = `blinker ${player.ID === selfID ? 'player-blinker' : 'other-player-blinker'}`;

                return (
                  <div
                    key={player.ID}
                    className={blinkerClass}
                    style={{
                      position: 'absolute',
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      transform: 'translate(-50%, -50%)',
                      left: player.Position.X * TILE_SIZE -7.5 + TILE_SIZE / 2,
                      top: player.Position.Y * TILE_SIZE -6.8 + TILE_SIZE / 2,
                    }}
                  />
                );
              })}
            </div>
          </div>
          

          <footer className="flex-shrink-0 bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2 h-12">
            <h2 className="text-[10px] font-bold text-[#B68F40] uppercase tracking-widest">Game Log</h2>
            <p className="text-xs text-[#E8E6E3] truncate">
              {gameState?.Log?.[0] || 'Welcome to the dungeon...'}
            </p>
          </footer>
        </div>

        <aside className="w-80 flex-shrink-0 overflow-y-auto overflow-x-hidden">
          <GameUI gameState={gameState} selfID={selfID} spritesheet={spritesheet} />
        </aside>
      </main>
    </div>
  );
}

export default GameView;