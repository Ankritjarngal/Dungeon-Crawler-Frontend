const TILE_SIZE = 16;

const SPRITE_MAP = {
    // Tiles
    wall_1: [10 * TILE_SIZE, 18 * TILE_SIZE],
    wall_2: [10 * TILE_SIZE, 17 * TILE_SIZE],

    floor_1: [2 * TILE_SIZE, 0 * TILE_SIZE],
    floor_2: [3 * TILE_SIZE, 0 * TILE_SIZE],
    floor_3: [4 * TILE_SIZE, 0 * TILE_SIZE],

    exit: [43 * TILE_SIZE, 12 * TILE_SIZE],
    health: [42 * TILE_SIZE, 10 * TILE_SIZE],

    // Items
    sword: [36 * TILE_SIZE, 8 * TILE_SIZE],
    bow: [40 * TILE_SIZE, 6 * TILE_SIZE],

    // Players
    player: [32 * TILE_SIZE, 0 * TILE_SIZE],
    otherPlayer: [33 * TILE_SIZE, 0 * TILE_SIZE],
    defeated: [0 * TILE_SIZE, 15 * TILE_SIZE],

    // Monsters
    goblin: [30 * TILE_SIZE, 3 * TILE_SIZE],
    ogre: [30 * TILE_SIZE, 6 * TILE_SIZE],
    skeleton: [24 * TILE_SIZE, 1 * TILE_SIZE],
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
            const floorVariantIndex = (x + y) % floorVariants.length;
            drawSprite(floorVariants[floorVariantIndex], x, y);

            const tileType = gameState.Dungeon[y][x];

            if (tileType === 0) {
                const wallVariantIndex = (x + y) % wallVariants.length;
                drawSprite(wallVariants[wallVariantIndex], x, y);
            }
            if (tileType === 2) drawSprite('exit', x, y);
            if (tileType === 3) drawSprite('health', x, y);
        }
    }

    if (gameState.HighlightedTiles) {
        ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
        gameState.HighlightedTiles.forEach(p => {
            ctx.fillRect(p.X * TILE_SIZE, p.Y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        });
    }

    if (gameState.ItemsOnGround) {
        gameState.ItemsOnGround.forEach(item => {
            drawSprite(item.Item.Name.toLowerCase().replace(' ', '_'), item.Position.X, item.Position.Y);
        });
    }

    if (gameState.Monsters) {
        gameState.Monsters.forEach(monster => {
            let spriteName = 'goblin';
            if (monster.Template.Name === 'Ogre') spriteName = 'ogre';
            if (monster.Template.Name === 'Skeleton Archer') spriteName = 'skeleton';
            drawSprite(spriteName, monster.Position.X, monster.Position.Y);
        });
    }
    
    if (gameState.Players) {
        Object.values(gameState.Players).forEach(player => {
            let spriteName = 'player';
            if (player.Status === 'defeated') {
                spriteName = 'defeated';
            } else if (player.ID !== selfID) {
                spriteName = 'otherPlayer';
            }
            drawSprite(spriteName, player.Position.X, player.Position.Y);
        });
    }
}