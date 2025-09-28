import { useEffect, useRef } from 'react';

const DEADZONE = 0.5;

export function useGamepad(callback) {
  const lastCommand = useRef(null);
  const animationFrameId = useRef(null);
  const lastButtonState = useRef([]);

  const pollGamepads = () => {
    const gamepads = navigator.getGamepads();
    if (gamepads && gamepads[0]) {
      const gp = gamepads[0];
      const axes = gp.axes;
      const buttons = gp.buttons;
      let moveCommand = null;

      if (axes[1] < -DEADZONE) moveCommand = 'w';
      else if (axes[1] > DEADZONE) moveCommand = 's';
      else if (axes[0] < -DEADZONE) moveCommand = 'a';
      else if (axes[0] > DEADZONE) moveCommand = 'd';

      if (moveCommand && moveCommand !== lastCommand.current) {
        callback(moveCommand);
      }
      lastCommand.current = moveCommand;

      // Button 0 ('A' on Xbox, 'X' on PS) for Get/Interact
      if (buttons[0] && buttons[0].pressed && !lastButtonState.current[0]) {
        callback('g');
      }
      // Button 2 ('X' on Xbox, 'Square' on PS) for Fire
      if (buttons[2] && buttons[2].pressed && !lastButtonState.current[2]) {
        callback('f');
      }
      // Button 3 ('Y' on Xbox, 'Triangle' on PS) for Drop
      if (buttons[3] && buttons[3].pressed && !lastButtonState.current[3]) {
        callback('D');
      }

      lastButtonState.current = buttons.map(b => b.pressed);

    } else {
      lastCommand.current = null;
      lastButtonState.current = [];
    }

    animationFrameId.current = requestAnimationFrame(pollGamepads);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(pollGamepads);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [callback]);
}

