import React, { useState } from 'react';


const slides = [
    {
      image: "/TutorialImages/Lobby.png",
      text: "Your expedition begins at the threshold. Create a unique 4-letter sigil to carve a path into a new abyss, or use a known sigil to join your allies in a dungeon that has already been breached."
    },
    {
      image: "/TutorialImages/move.png",
      text: "Navigate the echoing halls with W, A, S, D or the Arrow Keys. Time itself is bound to your will; the world only moves when you do. Each step you take, the horrors in the dark take one as well. Tread carefully."
    },
    {
      image: "/TutorialImages/AttackClose.png",
      text: "To strike down a foe in close quarters, simply move into them. This is the way of the sword and fist. A well-timed bump is a well-placed blow. The damage you deal is determined by your equipped weapon."
    },
    {
      image: "/TutorialImages/Bow.png",
      text: "With a bow equipped, press 'F' to enter a targeting stance. The world will pause, revealing your line of sight. Press 'F' again to loose an arrow, or any other key to cancel. A clear shot is paramount."
    },
    {
      image: "/TutorialImages/Pick.png",
      text: "The dungeon holds relics of past adventurers. Stand upon an item and press 'G' to claim it. Press 'E' to cycle through your equipped weapons. Armor is automatically worn but will break under duress—its durability is your shield."
    },
    {
      image: "/TutorialImages/Types.png",
      text: "The darkness stirs with many threats. Face swarming Goblins, brutish Ogres, and relentless Skeleton Archers. Each foe has its own tactics; learn their ways or perish."
    },
    {
      image: "/TutorialImages/Teammate.png",
      text: "In the suffocating dark, allies are your only light. Standing near a teammate enhances your senses, granting you both a 'Teamwork Buff' that extends your vision radius. Huddle together to push back the shadows."
    },
    {
      image: "/TutorialImages/Fountain.png",
      text: "Not all is lost in the deep. Find glowing fountains to mend your wounds, but be warned—they are a finite blessing. The map you see is only what your light touches; unseen horrors may lurk just beyond your perception."
    },
    {
      image: "/TutorialImages/End.png",
      text: "Your ultimate objective is to find the exit stairs and descend deeper. Survive as a team. If one of you finds the way, all are victorious. But if all players fall, your souls will be lost to the dungeon forever. Good luck, adventurers."
    }
  ];

function Tutorial({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  };

  const goToPrev = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm font-mono text-[#C586FF]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl border border-[#A360E8] bg-[#191129] p-6 shadow-glow-purple"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-[#C586FF] animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-[#C586FF] animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-[#C586FF] animate-pulse"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-[#C586FF] animate-pulse"></div>
        
        <div className="text-center mb-4">
            <h2 
                className="text-lg uppercase tracking-widest"
                style={{ textShadow: '0 0 5px #C586FF' }}
            >
                ~ How to Survive ~
            </h2>
        </div>

        {/* Image Section */}
        <div className="w-full h-64 bg-black/20 border border-[#3A1E63] mb-4 flex items-center justify-center">
          <img 
            src={slides[currentSlide].image} 
            alt={`Tutorial slide ${currentSlide + 1}`} 
            className="max-w-full max-h-full object-cover"
          />
        </div>

        <div className="text-center text-sm text-[#A360E8] h-24 mb-4 flex items-center justify-center p-2">
          <p>{slides[currentSlide].text}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className="py-2 px-4 border border-[#A360E8] text-[#C586FF] hover:bg-[#2c1a4d] disabled:border-[#3A1E63] disabled:text-[#3A1E63] disabled:bg-transparent text-xs uppercase tracking-wider transition-colors"
          >
            [ Prev ]
          </button>
          
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full border border-[#A360E8] transition-colors ${currentSlide === index ? 'bg-[#C586FF]' : 'bg-transparent'}`}
              />
            ))}
          </div>

          <button 
            onClick={goToNext}
            disabled={currentSlide === slides.length - 1}
            className="py-2 px-4 border border-[#A360E8] text-[#C586FF] hover:bg-[#2c1a4d] disabled:border-[#3A1E63] disabled:text-[#3A1E63] disabled:bg-transparent text-xs uppercase tracking-wider transition-colors"
          >
            [ Next ]
          </button>
        </div>
        
        <div className="relative text-center my-6">
            <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#3A1E63] to-transparent"></div>
            <span className="relative px-4 bg-[#191129] text-lg text-[#3A1E63]">✧</span>
        </div>

        <div className="text-center">
            <button
                onClick={onClose}
                className="py-2 px-6 border border-[#A360E8] text-[#C586FF] hover:bg-[#2c1a4d] hover:shadow-glow-purple hover:scale-105 active:bg-[#4a2785] text-sm uppercase tracking-wider transition-all duration-200"
            >
                [ Begin Your Descent ]
            </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;

