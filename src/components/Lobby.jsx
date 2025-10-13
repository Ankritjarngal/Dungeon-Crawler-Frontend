import { useState } from "react";

function Lobby({ onCreateGame, onJoinGame, error, initialRoomCode }) {
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [inputError, setInputError] = useState(""); 

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/[^A-Z]/.test(value)) {
      setInputError("A harsh whisper echoes: Only letters A-Z are allowed.");
    } else {
      setInputError("");
      setRoomCode(value);
    }
    setRoomCode(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black font-mono text-[#D4AF37] p-4">
      <div className="w-full max-w-5xl border border-[#B8941F] p-6 shadow-glow">
        <div className="mb-8 overflow-x-auto">
          <pre className="whitespace-pre text-center text-xs leading-tight">
            {`
 ____                             _____         _                 
|    \\ _ _ ___ ___ ___ ___ ___   |   __|_ _ ___| |___ ___ ___ ___ 
|  |  | | |   | . | -_| . |   |  |   __|_'_| . | | . |  _| -_|  _|
|____/|___|_|_|_  |___|___|_|_|  |_____|_,_|  _|_|___|_| |___|_|  
              |___|                        |_|                    
`}
          </pre>
        </div>

        <div className="border border-[#5a4b1a] bg-[#13110a]/60 rounded-md p-5 mb-10 text-sm text-[#c6b061]  leading-relaxed tracking-wide shadow-inner">
          <p className="mb-1">
            “The old pathways stir... ancient stone groans, awaiting footsteps.”
          </p>
          <p className="mb-1">
            “New corridors carve themselves from the dark, shaping paths for the bold.”
          </p>
          <p className="mb-1">
            “Whispers of forgotten treasures drift through the silent halls.”
          </p>
          <p className="mt-3 text-[#bca144]">State your intent, adventurer.</p>
        </div>

        <div className="mb-8 flex items-end space-x-3">
          <label htmlFor="roomCode" className="text-sm uppercase flex-shrink-0">
            Inscribe Dungeon Code:
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
          <div className="mt-2 border border-[#b84a1f] bg-[#2c1a10] p-3 text-center text-[#ff8a61] text-xs">
            {inputError || `A harsh whisper echoes: "${error}"`}
          </div>
        )}

        <div className="flex justify-center gap-6 mt-6 mb-8">
          <button
            onClick={() => onCreateGame(roomCode)}
            disabled={roomCode.length !== 4}
            className="py-2 px-6 border border-[#B8941F] text-[#D4AF37] hover:bg-[#1a160a] active:bg-[#2c2410] disabled:border-[#443711] disabled:text-[#66521a] disabled:bg-transparent text-sm uppercase tracking-wider transition-colors"
          >
            [ Chart a New Dungeon ]
          </button>
          <button
            onClick={() => onJoinGame(roomCode)}
            disabled={roomCode.length !== 4}
            className="py-2 px-6 border border-[#B8941F] text-[#D4AF37] hover:bg-[#1a160a] active:bg-[#2c2410] disabled:border-[#443711] disabled:text-[#66521a] disabled:bg-transparent text-sm uppercase tracking-wider transition-colors"
          >
            [ Join an Expedition ]
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-[#66521a] italic">
          <p>All paths remain unwritten until you begin.</p>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
