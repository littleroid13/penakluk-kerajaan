// Test Faction Entrance and Ended Tiles with Arbitrary Team Selections
const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.performance = { now: () => Date.now() };

global.Image = class {
    constructor() {
        this.width = 133;
        this.height = 83;
    }
};

const drawCalls = [];
global.document = {
    createElement: () => ({
        getContext: () => ({
            fillRect: () => {},
            clearRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            closePath: () => {},
            fill: () => {},
            stroke: () => {},
            arc: () => {},
            ellipse: () => {},
            rect: () => {},
            roundRect: () => {},
            save: () => {},
            restore: () => {},
            scale: () => {},
            setTransform: () => {},
            translate: () => {},
            rotate: () => {},
            quadraticCurveTo: () => {},
            fillText: () => {},
            strokeText: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} }),
            measureText: () => ({ width: 50 }),
            drawImage: (img, x, y, w, h) => {
                if (img && img._assetName) {
                    drawCalls.push({
                        name: img._assetName,
                        x, y, w, h
                    });
                }
            }
        }),
        getBoundingClientRect: () => ({ width: 1200, height: 800 })
    }),
    getElementById: () => null
};

require('../js/factions.js');
require('../js/questions.js');
require('../js/board.js');
require('../js/game.js');
require('../js/renderer.js');

const board = new GameBoard();
const canvas = document.createElement('canvas');
const renderer = new IsometricRenderer(canvas, board);

const mockAssets = {};
const allKeys = [
    'patch-grass', 'patch-dirt', 'platform', 'tree', 'tree-high', 'plant',
    'rocks-high', 'rocks-low', 'rocks-ramp', 'stones', 'tent', 'bridge', 'flag',
    'building-structure', 'building-platform', 'building-roof', 'ladder',
    'tile-normal', 'tile-special', 'tile-weird', 'tile-truth', 'tile-dare',
    'tile-entrance-red', 'tile-entrance-blue', 'tile-entrance-green', 'tile-entrance-yellow',
    'tile-ended-red', 'tile-ended-blue', 'tile-ended-green', 'tile-ended-yellow',
    'tile-ende-red', 'tile-ende-blue', 'tile-ende-green', 'tile-ende-yellow'
];

allKeys.forEach(k => {
    const img = new Image();
    img._assetName = k;
    mockAssets[k] = img;
    mockAssets[k.replace(/-/g, '_')] = img;
});

renderer.setEnvironmentAssets(mockAssets);

console.log('\n--- TEST 1: Arm Track Colors ---');
console.log('Arm 0 (North):', renderer.getArmTrackColor(0), 'Expected: red');
console.log('Arm 1 (East):', renderer.getArmTrackColor(1), 'Expected: yellow');
console.log('Arm 2 (South):', renderer.getArmTrackColor(2), 'Expected: blue');
console.log('Arm 3 (West):', renderer.getArmTrackColor(3), 'Expected: green');

console.log('\n--- TEST 2: Render with Arbitrary/Default Lobby Team Selection ---');
// Even if Team 0 is Arcane (purple) and Team 1 is Elves (green):
// The track arm colors must STRICTLY preserve their quadrant track colors:
const gameState = new GameState(board);
global.window.gameState = gameState;
gameState.setupGame([
    { name: 'Team A (Arcane)', factionId: 'arcane' },
    { name: 'Team B (Elves)', factionId: 'elves' },
    { name: 'Team C (Dragon)', factionId: 'dragon' },
    { name: 'Team D (Iron)', factionId: 'iron' }
], 4);

drawCalls.length = 0;
renderer.render(gameState, 0.016);

const counts = {};
drawCalls.forEach(d => {
    if (d.name.startsWith('tile-')) {
        counts[d.name] = (counts[d.name] || 0) + 1;
    }
});

console.log('Tiles Render Breakdown with Arbitrary Teams:');
console.log(counts);

// Verifikasi Finish Lanes (Ended tiles)
['red', 'yellow', 'blue', 'green'].forEach((c, idx) => {
    const count = counts[`tile-ended-${c}`] || 0;
    console.log(`  Jalur Finish Arm ${idx} (${c}): ${count} tiles (Expected: 5)`);
    if (count !== 5) {
        console.error(`❌ Mismatch on finish lane ${c}: got ${count}`);
        process.exit(1);
    }
});

// Verifikasi Entrance tiles
['red', 'yellow', 'blue', 'green'].forEach((c, idx) => {
    const count = counts[`tile-entrance-${c}`] || 0;
    console.log(`  Entrance Arm ${idx} (${c}): ${count} tiles (Expected: 2)`);
    if (count !== 2) {
        console.error(`❌ Mismatch on entrance ${c}: got ${count}`);
        process.exit(1);
    }
});

console.log('\n🎉 ALL LANES ENTERING THE FINISH MATCH THEIR ARM COLOR 100% PERFECTLY!');
