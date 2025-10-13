import { useEffect, useRef, useState } from 'react';
import GameUI from './GameUI';
import { renderGame } from '../renderer';

function GameView({ gameState, selfID, roomCode, spritesheet }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlayerInView, setIsPlayerInView] = useState(true);

  // This effect handles the core rendering of the game on the canvas
  useEffect(() => {
    if (gameState && canvasRef.current && spritesheet) {
      renderGame(canvasRef.current, spritesheet, gameState, selfID);
    }
  }, [gameState, selfID, spritesheet]);

  // This new effect checks if the player is scrolled into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkPlayerVisibility = () => {
      const selfPlayer = gameState?.Players?.[selfID];
      if (!selfPlayer?.Position) {
        setIsPlayerInView(true); 
        return;
      }

      const TILE_SIZE = 16;
      const playerLeft = selfPlayer.Position.X * TILE_SIZE;
      const playerRight = playerLeft + TILE_SIZE;
      const playerTop = selfPlayer.Position.Y * TILE_SIZE;
      const playerBottom = playerTop + TILE_SIZE;

      const viewLeft = container.scrollLeft;
      const viewRight = viewLeft + container.clientWidth;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;

      const isInView =
        playerLeft < viewRight &&
        playerRight > viewLeft &&
        playerTop < viewBottom &&
        playerBottom > viewTop;

      setIsPlayerInView(isInView);
    };

    checkPlayerVisibility();

    container.addEventListener('scroll', checkPlayerVisibility, { passive: true });

    return () => {
      container.removeEventListener('scroll', checkPlayerVisibility);
    };
  }, [gameState, selfID]);

  const handleCenterView = () => {
    const container = containerRef.current;
    const selfPlayer = gameState?.Players?.[selfID];
    if (!container || !selfPlayer) return;

    const TILE_SIZE = 16;
    // Calculate the player's center position in pixels
    const playerCenterX = (selfPlayer.Position.X + 0.5) * TILE_SIZE;
    const playerCenterY = (selfPlayer.Position.Y + 0.5) * TILE_SIZE;

    // Calculate where to scroll to place the player in the middle
    const targetScrollLeft = playerCenterX - container.clientWidth / 2;
    const targetScrollTop = playerCenterY - container.clientHeight / 2;

    container.scrollTo({
      left: targetScrollLeft,
      top: targetScrollTop,
      behavior: 'smooth',
    });
  };

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

            {!isPlayerInView && (
              <button
                onClick={handleCenterView}
                className="absolute bottom-3 right-2 z-10 bg-black bg-opacity-60 text-white rounded-full p-3 border-2 border-[#B68F40] shadow-lg backdrop-blur-sm hover:bg-[#B68F40] hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#FF6B1A]"
                title="Center on player"
                aria-label="Center on player"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            )}

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
