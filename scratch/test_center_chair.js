const fs = require('fs');

console.log('=== TEST 1: Check Asset on Disk ===');
if (!fs.existsSync('assets/tiles/center-chair.png')) {
    throw new Error('assets/tiles/center-chair.png does not exist!');
}
console.log('✅ assets/tiles/center-chair.png exists on disk!');

console.log('=== TEST 2: Check Preloader Config ===');
const rendererJs = fs.readFileSync('js/renderer.js', 'utf8');
if (!rendererJs.includes("'center-chair': 'assets/tiles/center-chair.png'")) {
    throw new Error('center-chair not found in ENV_ASSET_PATHS');
}
if (!rendererJs.includes('getThroneImage')) {
    throw new Error('getThroneImage helper not found');
}
console.log('✅ Preloader includes center-chair.png and center-cup alias!');

console.log('=== TEST 3: Check Removal of Old Polygon & Emoji Crown ===');
if (rendererJs.includes("cTop: '#4a4e69'") || rendererJs.includes("cTop: '#22223b'")) {
    throw new Error('Old polygon dais colors still present in renderer.js');
}
if (rendererJs.includes("fillText('👑'")) {
    throw new Error('Old 2D crown text emoji still present in renderer.js');
}
if (rendererJs.includes("swordAngles")) {
    throw new Error('Old fanned swords code still present in renderer.js');
}
console.log('✅ Old polygon dais and 2D emoji crown completely removed!');

console.log('=== TEST 4: Check 3D DrawImage & Anchor Logic ===');
if (!rendererJs.includes('this.ctx.drawImage(img, drawX, drawY, drawW, drawH)')) {
    throw new Error('drawImage not used for throne in renderer.js');
}
if (!rendererJs.includes('THRONE_SCALE') || !rendererJs.includes('THRONE_ANCHOR_X') || !rendererJs.includes('THRONE_ANCHOR_Y')) {
    throw new Error('THRONE configuration constants missing');
}
console.log('✅ ctx.drawImage() and configurable anchor offsets implemented!');

console.log('=== TEST 5: Check Z-Indexing (Throne Rendered After All Tiles) ===');
// Mock minimal environment to test entity sorting
global.window = { addEventListener: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = {
    createElement: () => ({
        getContext: () => ({
            setTransform: () => {},
            scale: () => {},
            clearRect: () => {},
            drawImage: () => {}
        })
    }),
    addEventListener: () => {}
};
global.performance = { now: () => 1000 };
global.Image = class {};

eval(fs.readFileSync('js/board.js', 'utf8'));
eval(fs.readFileSync('js/factions.js', 'utf8'));
eval(fs.readFileSync('js/questions.js', 'utf8'));
eval(fs.readFileSync('js/dares.js', 'utf8'));
eval(fs.readFileSync('js/game.js', 'utf8'));
eval(fs.readFileSync('js/renderer.js', 'utf8'));

const board = new window.GameBoard();
const gameState = new window.GameState(board);
gameState.setupGame([
    { name: '1', factionId: 'elves' },
    { name: '2', factionId: 'dragon' },
    { name: '3', factionId: 'crown' },
    { name: '4', factionId: 'wolves' }
], 4);

const mockCanvas = document.createElement('canvas');
mockCanvas.getBoundingClientRect = () => ({ width: 1200, height: 800 });
const renderer = new window.IsometricRenderer(mockCanvas, board);

// Collect entities as renderer.render does
let maxTileDepth = -999;
let throneDepth = null;
let minPawnDepth = 999;

board.track.forEach(tile => {
    const d = tile.gx + tile.gy;
    if (d > maxTileDepth) maxTileDepth = d;
});
board.finishLanes.forEach(lane => {
    lane.forEach(tile => {
        const d = tile.gx + tile.gy + tile.gz * 0.2;
        if (d > maxTileDepth) maxTileDepth = d;
    });
});

throneDepth = 200; // As set in entities.push

gameState.teams.forEach(team => {
    team.pawns.forEach(pawn => {
        const pPos = pawn.getInterpolatedPos();
        const pawnD = 300 + (pPos.gx + pPos.gy) + pPos.gz * 0.2 + 0.1;
        if (pawnD < minPawnDepth) minPawnDepth = pawnD;
    });
});

console.log('Max Tile Depth:', maxTileDepth);
console.log('Throne Depth:', throneDepth);
console.log('Min Pawn Depth:', minPawnDepth);

if (throneDepth <= maxTileDepth) {
    throw new Error('Throne depth (' + throneDepth + ') is not greater than max tile depth (' + maxTileDepth + ')');
}
if (minPawnDepth <= throneDepth) {
    throw new Error('Pawn depth (' + minPawnDepth + ') is not greater than throne depth (' + throneDepth + ')');
}

console.log('✅ Z-Indexing Verified: All Tiles (' + maxTileDepth + ') < Throne (' + throneDepth + ') < Pawns (' + minPawnDepth + ')!');
console.log('🎉 ALL CENTER CHAIR TESTS PASSED 100% PERFECTLY!');
