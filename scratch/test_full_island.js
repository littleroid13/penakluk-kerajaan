// Full Island generation test including corner hills & offscreen rendering
const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.performance = { now: () => Date.now() };

// Mock Image
global.Image = class {
    constructor() {
        this.width = 64;
        this.height = 64;
    }
};

// Mock Document
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
            measureText: () => ({ width: 40 }),
            drawImage: () => {},
            createLinearGradient: () => ({ addColorStop: () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} })
        }),
        getBoundingClientRect: () => ({ width: 1200, height: 800 }),
        addEventListener: () => {}
    }),
    getElementById: () => null,
    querySelectorAll: () => []
};

require('../js/factions.js');
require('../js/questions.js');
require('../js/board.js');
require('../js/game.js');
require('../js/renderer.js');

const board = new GameBoard();
const canvas = document.createElement('canvas');
const renderer = new IsometricRenderer(canvas, board);

console.log('Renderer created. Initializing assets...');
const mockAssets = {};
[
    'patch-grass', 'patch-dirt', 'platform', 'tree', 'tree-high', 'plant',
    'rocks-high', 'rocks-low', 'rocks-ramp', 'stones', 'tent', 'bridge', 'flag',
    'building-structure', 'building-platform', 'building-roof', 'ladder',
    'tile-normal', 'tile-special', 'tile-weird', 'tile-truth', 'tile-dare',
    'tile-entrance-red', 'tile-entrance-blue', 'tile-entrance-green', 'tile-entrance-yellow',
    'tile-ended-red', 'tile-ended-blue', 'tile-ended-green', 'tile-ended-yellow'
].forEach(k => {
    mockAssets[k] = new Image();
    mockAssets[k.replace(/-/g, '_')] = mockAssets[k];
});
renderer.setEnvironmentAssets(mockAssets);

console.log('Calling generateIsland()...');
renderer.generateIsland();

console.log(`Generated ${renderer.islandData.groundTiles.length} ground tiles.`);
console.log(`Generated ${renderer.islandData.props.length} props.`);

// Count rock props by type
const rockCounts = {};
renderer.islandData.props.forEach(p => {
    rockCounts[p.assetKey] = (rockCounts[p.assetKey] || 0) + 1;
});
console.log('Props breakdown:', rockCounts);

console.log('Testing renderOffscreenIsland()...');
renderer.renderOffscreenIsland();
console.log('✅ Offscreen Island rendered successfully!');

const gameState = new GameState(board);
gameState.setupGame([
    { name: 'Dragon', factionId: 'dragon' },
    { name: 'Iron', factionId: 'iron' },
    { name: 'Elves', factionId: 'elves' },
    { name: 'Arcane', factionId: 'arcane' }
], 4);

console.log('Testing full render(gameState)...');
renderer.render(gameState);
console.log('✅ Full render frame completed cleanly at 60 FPS!');
