import Legend from './Legend';

function GameUI({ gameState, selfID, spritesheet }) {
  const selfPlayer = gameState && selfID ? gameState.Players[selfID] : null;

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      <div className="bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2">
        <h2 className="text-[10px] font-bold text-[#B68F40] mb-1.5 uppercase tracking-widest border-b border-[#4A4E57] pb-1">Status</h2>
        {selfPlayer ? (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#4A4E57] uppercase text-[10px]">HP:</span>
              <span className="font-bold text-[#5AFC03] text-xs">{selfPlayer.HP} / {selfPlayer.MaxHP}</span>
            </div>
            <div className="w-full bg-[#0D0D0F] rounded h-1.5 border border-[#4A4E57]">
              <div 
                className="bg-[#5AFC03] h-full rounded transition-all duration-300" 
                style={{ width: `${(selfPlayer.HP / selfPlayer.MaxHP) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-[#4A4E57] uppercase text-[10px]">Weapon:</span>
              <span className="font-semibold text-[#FF6B1A] text-xs">{selfPlayer.EquippedWeapon ? selfPlayer.EquippedWeapon.Name : 'Fists'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4A4E57] uppercase text-[10px]">Armor:</span>
              <span className="font-semibold text-[#00E5FF] text-xs">
                {selfPlayer.EquippedArmor ? `${selfPlayer.EquippedArmor.Name} (${selfPlayer.EquippedArmor.Durability})` : 'None'}
              </span>
            </div>
            {selfPlayer.Status === 'targeting' && (
              <p className="text-[#B68F40] font-bold animate-pulse pt-0.5 text-[10px] uppercase">⚔ AIMING... (F to fire)</p>
            )}
            {selfPlayer.Status === 'defeated' && (
              <p className="text-[#B3001B] font-bold pt-0.5 text-[10px] uppercase">☠ DEFEATED</p>
            )}
          </div>
        ) : (
          <p className="text-[#4A4E57] text-xs">Loading...</p>
        )}
      </div>

      <div className="bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2">
        <h2 className="text-[10px] font-bold text-[#B68F40] mb-1.5 uppercase tracking-widest border-b border-[#4A4E57] pb-1">Inventory (E To Cycle Items)</h2>
        <div className="max-h-16 overflow-y-auto text-[10px] space-y-0.5 scrollbar-thin">
          {selfPlayer && selfPlayer.Inventory.length > 0 ? (
            selfPlayer.Inventory.map((item, index) => (
              <p 
                key={index} 
                className={`${item === selfPlayer.EquippedWeapon || item === selfPlayer.EquippedArmor ? 'text-[#B68F40] font-semibold' : 'text-[#E8E6E3]'}`}
              >
                • {item.Name}
              </p>
            ))
          ) : (
            <p className="text-[#4A4E57] italic">Empty</p>
          )}
        </div>
      </div>

      {/* Players Panel - Expandable */}
      <div className="bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2 flex-grow overflow-hidden flex flex-col">
        <h2 className="text-[10px] font-bold text-[#B68F40] mb-1.5 uppercase tracking-widest border-b border-[#4A4E57] pb-1">Players</h2>
        <div className="overflow-y-auto space-y-1.5 flex-grow scrollbar-thin">
          {gameState?.Players && Object.values(gameState.Players).map(p => (
            <div 
              key={p.ID} 
              className={`p-1.5 rounded border ${p.ID === selfID ? 'bg-[#7A00B3]/20 border-[#7A00B3]' : 'bg-[#0D0D0F] border-[#4A4E57]'}`}
            >
              <div className="flex justify-between items-center mb-0.5">
                <p className="font-semibold text-[10px] text-[#E8E6E3]">
                  {p.ID === selfID ? '▶ YOU' : `◆ ${p.ID.substring(0, 6)}`}
                </p>
                <span className={`text-[10px] font-bold ${p.Status === 'defeated' ? 'text-[#B3001B]' : 'text-[#5AFC03]'}`}>
                  {p.HP > 0 ? p.HP : 0} HP
                </span>
              </div>
              <div className="w-full bg-[#0D0D0F] rounded h-1 border border-[#4A4E57]">
                <div 
                  className="bg-[#5AFC03] h-full rounded transition-all duration-300" 
                  style={{ width: `${(p.HP / p.MaxHP) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Panel - Compact */}
      <div className="bg-[#2B2B33] border-2 border-[#4A4E57] rounded p-2">
        <h2 className="text-[10px] font-bold text-[#B68F40] mb-1.5 uppercase tracking-widest border-b border-[#4A4E57] pb-1">Legend</h2>
        <Legend spritesheet={spritesheet} />
      </div>
    </div>
  );
}

export default GameUI;