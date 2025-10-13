import { useEffect } from 'react';

function useKeyboardControls(sendCommand, isActive) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;
      
      let command = "";
      switch (e.key) {
        case 'w': case 'ArrowUp': command = 'w'; break;
        case 'a': case 'ArrowLeft': command = 'a'; break;
        case 's': case 'ArrowDown': command = 's'; break;
        case 'd': case 'ArrowRight': command = 'd'; break;
        case 'e': command = 'e'; break; // Cycle inventory
        case 'g': command = 'g'; break; // Get item
        case 'f': command = 'f'; break; // Fire projectile
        case 'D': command = 'D'; break; // Drop item
        case 'Escape': command = 'Escape'; break; // Cancel targeting
      }
      
      if (command) {
        e.preventDefault();
        sendCommand(command);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, sendCommand]);
}

export default useKeyboardControls;