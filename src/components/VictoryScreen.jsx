




import React from 'react';

function VictoryScreen({ roomCode, onPlayAgain }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#001a1a] via-black to-black font-mono text-[#00E5FF] p-4">
      <div className="relative w-full max-w-5xl border border-[#00A2B3] bg-[#000c0d] p-6 shadow-glow-cyan">
        {/* Decorative Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#00E5FF] animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#00E5FF] animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#00E5FF] animate-pulse"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#00E5FF] animate-pulse"></div>

        {/* Top Header - ASCII art title */}
        <div className="mb-8 overflow-x-auto">
          <pre
            className="whitespace-pre text-center text-xs leading-tight"
            style={{ textShadow: '0 0 5px #00E5FF, 0 0 10px #00E5FF' }}
          >
{`
    _____       _ _                                    
   |  __ \\     | (_)                                   
   | |  | | ___| |___   _____ _ __ __ _ _ __   ___ ___ 
   | |  | |/ _ \\ | \\ \\ / / _ \\ '__/ _\` | '_ \\ / __/ _ \\
   | |__| |  __/ | |\\ V /  __/ | | (_| | | | | (_|  __/
   |_____/ \\___|_|_| \\_/ \\___|_|  \\__,_|_| |_|\\___\\___|
  `}
          </pre>
        </div>

        {/* Thematic Message Box */}
        <div className="border border-[#005F69] p-4 mb-8 text-xs text-[#00A2B3]  bg-black/20">
          <p>"The oppressive air lifts... A glimmer of daylight breaks the ancient gloom."</p>
          <p>"You emerge, bearing the scars and treasures of the deep."</p>
          <p>"Your legend is etched in the dungeon's stone."</p>
        </div>

        {/* Info Section */}
        <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-wider text-[#00818F]">Dungeon Cleared</p>
            <p className="text-xs text-[#005F69]">Room Code: {roomCode}</p>
        </div>
        
        {/* Decorative Divider */}
        <div className="relative text-center my-8">
            <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#005F69] to-transparent"></div>
            <span className="relative px-4 bg-[#000c0d] text-lg text-[#005F69]">✧</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={onPlayAgain}
            className="py-2 px-6 border border-[#00A2B3] text-[#00E5FF] hover:bg-[#00282e] hover:shadow-glow-cyan hover:scale-105 active:bg-[#00414a] text-sm uppercase tracking-wider transition-all duration-200"
          >
            [ Return to the Light ]
          </button>
        </div>


        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#005F69]">
          <p>The path to the surface is now clear.</p>
        </div>
      </div>
    </div>
  );
}

export default VictoryScreen;