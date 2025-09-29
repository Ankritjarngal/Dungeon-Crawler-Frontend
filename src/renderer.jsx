const TILE_SIZE = 16;

const SPRITE_MAP = {
    wall_1: [10 * TILE_SIZE, 18 * TILE_SIZE],
    wall_2: [10 * TILE_SIZE, 17 * TILE_SIZE],
    floor_1: [2 * TILE_SIZE, 0 * TILE_SIZE],
    floor_2: [3 * TILE_SIZE, 0 * TILE_SIZE],
    floor_3: [4 * TILE_SIZE, 0 * TILE_SIZE],
    exit: [43 * TILE_SIZE, 12 * TILE_SIZE],
    health: [42 * TILE_SIZE, 10 * TILE_SIZE],
    sword: [36 * TILE_SIZE, 8 * TILE_SIZE],
    bow: [40 * TILE_SIZE, 6 * TILE_SIZE],
    chainmail: [32 * TILE_SIZE, 1 * TILE_SIZE],
    player: [32 * TILE_SIZE, 0 * TILE_SIZE],
    player_armored: [36 * TILE_SIZE, 0 * TILE_SIZE],
    otherPlayer: [33 * TILE_SIZE, 0 * TILE_SIZE],
    defeated: [0 * TILE_SIZE, 15 * TILE_SIZE],
    goblin: [30 * TILE_SIZE, 3 * TILE_SIZE],
    ogre: [30 * TILE_SIZE, 6 * TILE_SIZE],
    skeleton: [24 * TILE_SIZE, 1 * TILE_SIZE],  
    darkness_1: [0 * TILE_SIZE, 0 * TILE_SIZE],
    darkness_2: [1 * TILE_SIZE, 1 * TILE_SIZE],
};

const floorVariants = ['floor_1', 'floor_2', 'floor_3'];
const wallVariants = ['wall_1', 'wall_2'];

export function renderGame(canvas, spritesheet, gameState, selfID) {
    if (!canvas || !spritesheet || !gameState || !gameState.Dungeon) return;

    const ctx = canvas.getContext('2d');
    const width = gameState.Dungeon[0].length;
    const height = gameState.Dungeon.length;
    canvas.width = width * TILE_SIZE;
    canvas.height = height * TILE_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const visibleSet = new Set();
    if (gameState.VisibleTiles) {
        gameState.VisibleTiles.forEach(p => visibleSet.add(`${p.X},${p.Y}`));
    }
    
    const trailSet = new Set();
    if (gameState.PlayerTrails) {
        const selfPlayerTrail = gameState.PlayerTrails[selfID] || [];
        selfPlayerTrail.forEach(p => trailSet.add(`${p.X},${p.Y}`));
    }

    const drawSprite = (spriteName, x, y) => {
        const spriteCoords = SPRITE_MAP[spriteName];
        if (!spriteCoords) return;
        const [spriteX, spriteY] = spriteCoords;
        ctx.drawImage(
            spritesheet,
            spriteX, spriteY, TILE_SIZE, TILE_SIZE,
            x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
        );
    };

    // --- The New Rendering Loop ---
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coordStr = `${x},${y}`;
            const isVisible = visibleSet.has(coordStr);
            const isTrail = trailSet.has(coordStr);

            if (isVisible) {
                // TIER 1: Currently Visible -> Draw everything
                const floorVariantIndex = (x + y) % floorVariants.length;
                drawSprite(floorVariants[floorVariantIndex], x, y);
                const tileType = gameState.Dungeon[y][x];
                if (tileType === 0) {
                    const wallVariantIndex = (x + y) % wallVariants.length;
                    drawSprite(wallVariants[wallVariantIndex], x, y);
                }
                if (tileType === 2) drawSprite('exit', x, y);
                if (tileType === 3) drawSprite('health', x, y);
            } else if (isTrail) {
                // TIER 2: Breadcrumb Trail -> Draw only a faint floor tile
                const floorVariantIndex = (x + y) % floorVariants.length;
                ctx.globalAlpha = 0.2;
                drawSprite(floorVariants[floorVariantIndex], x, y);
                ctx.globalAlpha = 1.0;
            } else {
                // TIER 3: Unseen -> Draw the normal tiles, but with a dark overlay
                const floorVariantIndex = (x + y) % floorVariants.length;
                drawSprite(floorVariants[floorVariantIndex], x, y);
                const tileType = gameState.Dungeon[y][x];
                if (tileType === 0) {
                     const wallVariantIndex = (x + y) % wallVariants.length;
                     drawSprite(wallVariants[wallVariantIndex], x, y);
                }
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'; // 75% dark overlay
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    
    // --- Render Entities (only if they are currently visible) ---
    if (gameState.ItemsOnGround) {
        gameState.ItemsOnGround.forEach(item => {
            if (visibleSet.has(`${item.Position.X},${item.Position.Y}`)) {
                drawSprite(item.Item.Name.toLowerCase().replace(' ', '_'), item.Position.X, item.Position.Y);
            }
        });
    }

    if (gameState.Monsters) {
        gameState.Monsters.forEach(monster => {
            if (visibleSet.has(`${monster.Position.X},${monster.Position.Y}`)) {
                let spriteName = 'goblin';
                if (monster.Template.Name === 'Ogre') spriteName = 'ogre';
                if (monster.Template.Name === 'Skeleton Archer') spriteName = 'skeleton';
                drawSprite(spriteName, monster.Position.X, monster.Position.Y);
            }
        });
    }
    
    if (gameState.Players) {
        Object.values(gameState.Players).forEach(player => {
            if (visibleSet.has(`${player.Position.X},${player.Position.Y}`)) {
                let spriteName = 'player';
                if (player.EquippedArmor != null) {
                    spriteName = 'player_armored';
                }
                if (player.Status === 'defeated') {
                    spriteName = 'defeated';
                } else if (player.ID !== selfID) {
                    spriteName = 'otherPlayer';
                }
                drawSprite(spriteName, player.Position.X, player.Position.Y);
            }
        });
    }
    
    // Finally, draw the LOS beam on top of everything
    if (gameState.HighlightedTiles && gameState.HighlightedTiles.length > 0) {
        const path = gameState.HighlightedTiles;
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.6)';
        ctx.lineWidth = TILE_SIZE / 3;
        ctx.beginPath();
        ctx.moveTo(path[0].X * TILE_SIZE + TILE_SIZE / 2, path[0].Y * TILE_SIZE + TILE_SIZE / 2);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].X * TILE_SIZE + TILE_SIZE / 2, path[i].Y * TILE_SIZE + TILE_SIZE / 2);
        }
        ctx.stroke();
    }
}