

import React from 'react';

function DefeatScreen({ roomCode, onPlayAgain }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#1a0005] via-black to-black font-mono text-[#B3001B] p-4">
      <div className="relative w-full max-w-5xl border border-[#850014] bg-[#0c0003] p-6 shadow-glow-red">
        {/* Decorative Corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#B3001B] animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#B3001B] animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#B3001B] animate-pulse"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#B3001B] animate-pulse"></div>

        <div className="mb-8 overflow-x-auto">
          <pre
            className="whitespace-pre text-center text-xs leading-tight"
            style={{ textShadow: '0 0 5px #B3001B, 0 0 10px #B3001B' }}
          >
            {`
 ____  _____ ____  ____  ____  _____ ____  
|  _ \\| ____|  _ \\|  _ \\|  _ \\| ____|  _ \\ 
| | | |  _| | |_) | | | | | | |  _| | | | |
| |_| | |___|  _ <| |_| | |_| | |___| |_| |
|____/|_____|_| \\_\\____/|____/|_____|____/ 
                                          
`}
          </pre>
        </div>

        <div className="border border-[#4F000C] p-4 mb-8 text-xs text-[#850014]  bg-black/20">
          <p>"The torch sputters... The darkness closes in."</p>
          <p>"Your expedition ends here, another tale swallowed by the stone."</p>
          <p>"The dungeon claims its due."</p>
        </div>

        <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-wider text-[#8C2A3A]">Your Party has Perished</p>
            <p className="text-xs text-[#4F000C]">Room Code: {roomCode}</p>
        </div>


        <div className="relative text-center my-8">
            <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#4F000C] to-transparent"></div>
            <span className="relative px-4 bg-[#0c0003] text-lg text-[#4F000C]">☠</span>
        </div>


        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={onPlayAgain}
            className="py-2 px-6 border border-[#850014] text-[#B3001B] hover:bg-[#2e0008] hover:shadow-glow-red hover:scale-105 active:bg-[#4a000d] text-sm uppercase tracking-wider transition-all duration-200"
          >
            [ Flee to the Lobby ]
          </button>
        </div>



        <div className="mt-8 text-center text-xs text-[#4F000C]">
          <p>Only echoes and the fallen remain.</p>
        </div>
      </div>
    </div>
  );
}

export default DefeatScreen;