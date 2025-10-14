import React, { useState, useEffect, useCallback } from 'react';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

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
    text: "The dungeon holds relics of past adventurers. Stand upon an item and press 'G' to claim it. Press 'E' to cycle through your equipped weapons. Armor is automatically worn after picking but will break under duress—its durability is your shield."
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
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrev, onClose]);


  return (
    <>
      {/* Fullscreen Image Viewer Overlay */}
      {isImageFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/20 backdrop-blur-md"
          onClick={() => setIsImageFullscreen(false)}
        >
          <img
            src={slides[currentSlide].image}
            alt={`Tutorial slide ${currentSlide + 1} fullscreen`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setIsImageFullscreen(false)}
            className="absolute right-5 top-5 cursor-pointer text-white/70 transition-colors hover:text-white"
            title="Close fullscreen view (Escape)"
          >
            <FiMinimize size={32} />
          </button>
        </div>
      )}

      {/* Main Tutorial Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm font-mono text-[#C586FF]"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-2xl border border-[#A360E8] bg-[#191129] p-6 shadow-glow-purple"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute -left-1 -top-1 h-4 w-4 animate-pulse border-l-2 border-t-2 border-[#C586FF]"></div>
          <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse border-r-2 border-t-2 border-[#C586FF]"></div>
          <div className="absolute -bottom-1 -left-1 h-4 w-4 animate-pulse border-l-2 border-b-2 border-[#C586FF]"></div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 animate-pulse border-r-2 border-b-2 border-[#C586FF]"></div>
          
          <div className="mb-4 text-center">
              <h2 
                  className="text-lg uppercase tracking-widest"
                  style={{ textShadow: '0 0 5px #C586FF' }}
              >
                  ~ How to Play ~
              </h2>
          </div>

          <div className="group relative mb-4 w-full cursor-zoom-in border border-[#3A1E63]" onClick={() => setIsImageFullscreen(true)}>
            <img 
              src={slides[currentSlide].image} 
              alt={`Tutorial slide ${currentSlide + 1}`} 
              className="h-auto w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <FiMaximize className="text-4xl text-white/80" />
            </div>
          </div>

          <div className="flex h-24 items-center justify-center p-2 text-center text-sm text-[#A360E8]">
            <p>{slides[currentSlide].text}</p>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <button 
              onClick={goToPrev}
              disabled={currentSlide === 0}
              className="border border-[#A360E8] px-4 py-2 text-xs uppercase tracking-wider text-[#C586FF] transition-colors hover:bg-[#2c1a4d] disabled:border-[#3A1E63] disabled:bg-transparent disabled:text-[#3A1E63]"
            >
              [ Prev ]
            </button>
            
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full border border-[#A360E8] transition-colors ${currentSlide === index ? 'bg-[#C586FF]' : 'bg-transparent'}`}
                />
              ))}
            </div>

            <button 
              onClick={goToNext}
              disabled={currentSlide === slides.length - 1}
              className="border border-[#A360E8] px-4 py-2 text-xs uppercase tracking-wider text-[#C586FF] transition-colors hover:bg-[#2c1a4d] disabled:border-[#3A1E63] disabled:bg-transparent disabled:text-[#3A1E63]"
            >
              [ Next ]
            </button>
          </div>
          
          <div className="relative my-6 text-center">
              <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-[#3A1E63] to-transparent"></div>
              <span className="relative bg-[#191129] px-4 text-lg text-[#3A1E63]">✧</span>
          </div>

          <div className="text-center">
              <button
                  onClick={onClose}
                  className="border border-[#A360E8] px-6 py-2 text-sm uppercase tracking-wider text-[#C586FF] transition-all duration-200 hover:scale-105 hover:bg-[#2c1a4d] hover:shadow-glow-purple active:bg-[#4a2785]"
              >
                  [ Begin Your Descent ]
              </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tutorial;

