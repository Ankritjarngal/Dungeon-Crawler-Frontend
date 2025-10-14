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
    bat: [26 * TILE_SIZE, 8 * TILE_SIZE],
    guardian :[25*TILE_SIZE,8*TILE_SIZE]
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
    ctx.imageSmoothingEnabled = false;

    const visibleSet = new Set(gameState.VisibleTiles?.map(p => `${p.X},${p.Y}`));

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

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawSprite(floorVariants[(x + y) % floorVariants.length], x, y);
            const tileType = gameState.Dungeon[y][x];
            if (tileType === 0) drawSprite(wallVariants[(x + y) % wallVariants.length], x, y);
            if (tileType === 3) drawSprite('health', x, y);
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!visibleSet.has(`${x},${y}`)) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (visibleSet.has(`${x},${y}`)) {
                if (gameState.Dungeon[y][x] === 2) drawSprite('exit', x, y);
            }
        }
    }

    gameState.ItemsOnGround?.forEach(item => {
        if (visibleSet.has(`${item.Position.X},${item.Position.Y}`)) {
            drawSprite(item.Item.Name.toLowerCase().replace(' ', '_'), item.Position.X, item.Position.Y);
        }
    });

    gameState.Monsters?.forEach(monster => {
        if (visibleSet.has(`${monster.Position.X},${monster.Position.Y}`)) {
            let spriteName = 'goblin';
            if (monster.Template.Name === 'Ogre') spriteName = 'ogre';
            if (monster.Template.Name === 'Skeleton Archer') spriteName = 'skeleton';
            if (monster.Template.Name === 'Bat') spriteName = 'bat';
            if(monster.Template.Name==='Guardian') spriteName='guardian'
            drawSprite(spriteName, monster.Position.X, monster.Position.Y);
        }
    });
    
    Object.values(gameState.Players)?.forEach(player => {
        if (visibleSet.has(`${player.Position.X},${player.Position.Y}`)) {
            let spriteName = 'player';
            if (player.EquippedArmor) spriteName = 'player_armored';
            if (player.Status === 'defeated') spriteName = 'defeated';
            else if (player.ID !== selfID) spriteName = 'otherPlayer';
            drawSprite(spriteName, player.Position.X, player.Position.Y);
        }
    });

    if (gameState.HighlightedTiles?.length > 0) {
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