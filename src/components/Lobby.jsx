import { useState } from "react";

function Lobby({ onCreateGame, onJoinGame, error, initialRoomCode }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [inputError, setInputError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/[^A-Z]/.test(value)) {
      setInputError("A harsh whisper echoes : Only letters A-Z are permitted for the sigil.");
    } else {
      setInputError("");
    }
    setRoomCode(value.replace(/[^A-Z]/g, ""));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#1a160a] via-black to-black font-mono text-[#D4AF37] p-4">
      <div className="relative w-full max-w-5xl border border-[#B8941F] bg-[#13110a] p-6 shadow-glow">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#D4AF37] animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#D4AF37] animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#D4AF37] animate-pulse"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#D4AF37] animate-pulse"></div>
        <div className="mb-8 overflow-x-auto">
          <pre
            className="whitespace-pre text-center text-xs leading-tight"
            style={{ textShadow: '0 0 5px #D4AF37, 0 0 10px #D4AF37' }}
          >
            {`
  _____                                       ______            _                     
 |  __ \\                                     |  ____|          | |                    
 | |  | |_   _ _ __   __ _  ___  ___  _ __   | |__  __  ___ __ | | ___  _ __ ___ _ __ 
 | |  | | | | | '_ \\ / _\` |/ _ \\/ _ \\| '_ \\  |  __| \\ \\/ / '_ \\| |/ _ \\| '__/ _ \\ '__|
 | |__| | |_| | | | | (_| |  __/ (_) | | | | | |____ >  <| |_) | | (_) | | |  __/ |   
 |_____/ \\__,_|_| |_|\\__, |\\___|\\___/|_| |_| |______/_/\\_\\ .__/|_|\\___/|_|  \\___|_|   
                      __/ |                              | |                          
                                         ___/                               |_|                                             
`}
          </pre>
        </div>
        <div className="border border-[#443711] p-4 mb-10 text-xs text-[#aa8e2f]  bg-black/20">
          <p>"The old pathways stir... Ancient stone groans, eager for torchlight."</p>
          <p>"New corridors carve themselves from the darkness, awaiting footsteps."</p>
          <p>"State your intent, adventurer."</p>
        </div>
        <div className="mb-2 flex items-end space-x-3">
          <label htmlFor="roomCode" className="text-sm uppercase flex-shrink-0">
            Inscribe Dungeon Sigil:
          </label>
          <input
            id="roomCode"
            type="text"
            placeholder="XXXX"
            value={roomCode}
            onChange={handleInputChange}
            maxLength="4"
            className="flex-1 bg-transparent text-2xl tracking-[0.3em] focus:outline-none caret-[#D4AF37] placeholder:text-[#443711] border-b border-dotted border-[#66521a]"
            autoFocus
            spellCheck="false"
          />
          <span className="animate-pulse text-2xl -mb-1">\u2588</span>
        </div>

        {(inputError || error) && (
          <div className="mt-4 border border-[#b84a1f] bg-[#2c1a10] p-3 text-center text-[#ff8a61] text-xs">
            {inputError || `A harsh whisper echoes: "${error}"`}
          </div>
        )}
<div className="text-center my-8 relative">
  <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#443711] to-transparent transform -translate-y-1/2"></div>
  <span
    className="relative px-6 py-1 bg-[#13110a] text-2xl text-[#D4AF37] leading-none"
    style={{ textShadow: '0 0 5px #D4AF37' }}
  >
    {'Ω ≡ Ψ Λ'}
  </span>
</div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => onCreateGame(roomCode)}
            disabled={roomCode.length !== 4}
            className="py-2 px-6 border border-[#B8941F] text-[#D4AF37] hover:bg-[#1a160a] hover:shadow-glow hover:scale-105 active:bg-[#2c2410] disabled:border-[#443711] disabled:text-[#66521a] disabled:bg-transparent text-sm uppercase tracking-wider transition-all duration-200"
          >
            [ Chart a New Dungeon ]
          </button>
          <button
            onClick={() => onJoinGame(roomCode)}
            disabled={roomCode.length !== 4}
            className="py-2 px-6 border border-[#B8941F] text-[#D4AF37] hover:bg-[#1a160a] hover:shadow-glow hover:scale-105 active:bg-[#2c2410] disabled:border-[#443711] disabled:text-[#66521a] disabled:bg-transparent text-sm uppercase tracking-wider transition-all duration-200"
          >
            [ Join an Expedition ]
          </button>
        </div>
        <div className="mt-8 text-center text-xs text-[#66521a]">
          <p>The flickering torch is all that separates you from the dark.</p>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
