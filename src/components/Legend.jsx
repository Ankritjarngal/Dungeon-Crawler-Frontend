import { useRef, useEffect } from 'react';

const TILE_SIZE = 16;

const legendItems = [
  { name: 'You', spriteCoords: [32 * 16, 0 * 16] },
  { name: 'Other Player', spriteCoords: [33 * 16, 0 * 16] },
  { name: 'Goblin', spriteCoords: [30 * 16, 3 * 16] },
  { name: 'Ogre', spriteCoords: [30 * 16, 6 * 16] },
  { name: 'Skeleton', spriteCoords: [24 * 16, 1 * 16] },
  { name: 'Bat', spriteCoords: [26 * 16, 8 * 16] },
  {name :'Guardian', spriteCoords: [25 * 16, 8 * 16] },
  { name: 'Sword', spriteCoords: [36 * 16, 8 * 16] },
  { name: 'Bow', spriteCoords: [40 * 16, 6 * 16] },
  { name: 'Armor', spriteCoords: [32 * 16, 1 * 16] },
  { name: 'Exit', spriteCoords: [43 * 16, 12 * 16] },
  { name: 'Fountain', spriteCoords: [42 * 16, 10 * 16] },
];

function LegendItem({ name, spriteCoords, spritesheet }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && spritesheet) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
      const [spriteX, spriteY] = spriteCoords;
      ctx.drawImage(
        spritesheet,
        spriteX, spriteY, TILE_SIZE, TILE_SIZE,
        0, 0, TILE_SIZE, TILE_SIZE
      );
    }
  }, [spritesheet, spriteCoords]);

  return (
    <div className="flex items-center gap-1.5">
      <canvas ref={canvasRef} width={TILE_SIZE} height={TILE_SIZE} className="bg-[#0D0D0F] rounded border border-[#4A4E57]"></canvas>
      <span className="text-[10px] text-[#E8E6E3]">{name}</span>
    </div>
  );
}

function Legend({ spritesheet }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
      {legendItems.map(item => (
        <LegendItem key={item.name} {...item} spritesheet={spritesheet} />
      ))}
    </div>
  );
}

export default Legend;