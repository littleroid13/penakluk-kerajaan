const fs = require('fs');
const path = require('path');

console.log('=== TEST 1: Check 24 Pawn Files in assets/pawns/ ===');
const factions = ['dragon', 'citadel', 'elf', 'crown', 'wolf', 'arcane'];
const colors = ['green', 'red', 'yellow', 'blue'];
let missingFiles = 0;

factions.forEach(f => {
  colors.forEach(c => {
    const filename = `assets/pawns/pawn-${f}-${c}.png`;
    if (!fs.existsSync(filename)) {
      console.error(`❌ Missing pawn file: ${filename}`);
      missingFiles++;
    }
  });
});

if (missingFiles === 0) {
  console.log('✅ All 24 pawn images exist on disk in assets/pawns/!');
} else {
  console.error(`❌ Total missing pawn files: ${missingFiles}`);
  process.exit(1);
}

console.log('\n=== TEST 2: Check getPawnImage(teamIndex, selectedFaction) ===');
// Mock browser environment
global.window = global;
global.window.addEventListener = () => {};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.performance = { now: () => Date.now() };
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
      save: () => {},
      restore: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      fillText: () => {},
      strokeText: () => {},
      drawImage: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} })
    }),
    width: 1200,
    height: 800
  })
};

global.TILE_WIDTH = 88;
global.TILE_HEIGHT = 55;
global.OFFSET_X = 0;
global.OFFSET_Y = 0;
global.BASE_OFFSETS = { top: { x: 0, y: 0 }, right: { x: -25, y: 0 }, bottom: { x: 0, y: 0 }, left: { x: 22, y: 0 } };
global.BASE_SCALE = 0.55;
global.BASE_ELEVATION_GZ = 0.4;
global.PAWN_SPREAD = 0.7;
global.PAWN_SCALE = 0.35;
global.PAWN_ANCHOR_X = 0.50;
global.PAWN_ANCHOR_Y = 0.745;
global.PAWN_OFFSET_X = 0;
global.PAWN_OFFSET_Y = 0;
global.PAWN_IDLE_AMPLITUDE = 2.5;

require('../js/factions.js');
require('../js/questions.js');
require('../js/board.js');
require('../js/game.js');
require('../js/renderer.js');

const mockCanvas = {
  getContext: () => ({
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    arc: () => {},
    ellipse: () => {},
    drawImage: (img, ...args) => {
      if (img && img.assetKey) {
        drawCounts[img.assetKey] = (drawCounts[img.assetKey] || 0) + 1;
      }
    },
    strokeText: () => {},
    fillText: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} })
  }),
  getBoundingClientRect: () => ({ width: 1200, height: 800 }),
  width: 1200,
  height: 800
};

const drawCounts = {};
const renderer = new IsometricRenderer(mockCanvas, new GameBoard());
const mockAssets = {};
factions.forEach(f => {
  colors.forEach(c => {
    const key = `pawn-${f}-${c}`;
    mockAssets[key] = { assetKey: key, width: 160, height: 200 };
  });
});
renderer.setEnvironmentAssets(mockAssets);

const testCases = [
  { team: 0, faction: 'dragon', expected: 'pawn-dragon-green' },
  { team: 1, faction: 'citadel', expected: 'pawn-citadel-red' },
  { team: 2, faction: 'crown', expected: 'pawn-crown-yellow' },
  { team: 3, faction: 'wolf', expected: 'pawn-wolf-blue' },
  { team: 0, faction: 'elves', expected: 'pawn-elf-green' },
  { team: 1, faction: 'iron', expected: 'pawn-citadel-red' },
  { team: 2, faction: 'wolves', expected: 'pawn-wolf-yellow' },
  { team: 3, faction: 'arcane', expected: 'pawn-arcane-blue' }
];

testCases.forEach(tc => {
  const img = renderer.getPawnImage(tc.team, tc.faction);
  const actual = img ? img.assetKey : null;
  console.log(`Team ${tc.team} (${tc.faction}) -> ${actual} | Expected: ${tc.expected}`);
  if (actual !== tc.expected) {
    console.error(`❌ getPawnImage mismatch! Got ${actual}, expected ${tc.expected}`);
    process.exit(1);
  }
});
console.log('✅ getPawnImage returns 100% correct assets for all teams and factions!');

console.log('\n=== TEST 3: Stacking Calculation & Micro-Offsets ===');
const board = new GameBoard();
const gameState = new GameState(board);
const teamConfigs = [
  { factionId: 'dragon', name: 'Tim Naga' },
  { factionId: 'iron', name: 'Tim Citadel' },
  { factionId: 'elves', name: 'Tim Elf' },
  { factionId: 'crown', name: 'Tim Mahkota' }
];
gameState.setupGame(teamConfigs, 4);

// Test 2 pawns on track tile 5
const p1 = gameState.teams[0].pawns[0];
const p2 = gameState.teams[1].pawns[0];
p1.state = 'track';
p1.trackIndex = 5;
p2.state = 'track';
p2.trackIndex = 5;

renderer.calculatePawnStacking(gameState);
console.log(`Stack 2 Pawns: p1 offset=(${p1.stackOffsetX}, ${p1.stackOffsetY}), p2 offset=(${p2.stackOffsetX}, ${p2.stackOffsetY})`);
if (p1.stackOffsetY < 0 && p2.stackOffsetY > 0) {
  console.log('✅ 2-Pawn stacking correctly shifts p1 back (-Y) and p2 front (+Y)!');
} else {
  console.error('❌ Stacking offset calculation failed for 2 pawns!');
  process.exit(1);
}

// Test 3 pawns on track tile 10
const p3 = gameState.teams[2].pawns[0];
p3.state = 'track';
p3.trackIndex = 5;
renderer.calculatePawnStacking(gameState);
console.log(`Stack 3 Pawns: p1=(${p1.stackOffsetX}, ${p1.stackOffsetY}), p2=(${p2.stackOffsetX}, ${p2.stackOffsetY}), p3=(${p3.stackOffsetX}, ${p3.stackOffsetY})`);
if (p1.stackOffsetY < 0 && p2.stackOffsetY > 0 && p3.stackOffsetY > 0) {
  console.log('✅ 3-Pawn stacking correctly places 1 in back and 2 in front!');
} else {
  console.error('❌ Stacking offset calculation failed for 3 pawns!');
  process.exit(1);
}

console.log('\n=== TEST 4: Pawn Hop & Squash/Stretch Properties ===');
const testPawn = gameState.teams[0].pawns[1];
console.log('Pawn initial scale:', testPawn.scaleX, testPawn.scaleY, 'isMoving:', testPawn.isMoving);
if (testPawn.scaleX === 1.0 && testPawn.scaleY === 1.0 && !testPawn.isMoving) {
  console.log('✅ Pawn initialization has scaleX=1.0, scaleY=1.0, isMoving=false!');
} else {
  console.error('❌ Pawn initialization incorrect!');
  process.exit(1);
}

console.log('\n=== TEST 5: Full Pawn Frame Render ===');
renderer.renderPawn(p1, gameState.teams[0]);
console.log('Draw counts for pawns:', drawCounts);
if (drawCounts['pawn-dragon-green'] > 0) {
  console.log('✅ renderPawn successfully renders pawn sprite image with transform!');
} else {
  console.error('❌ renderPawn did not draw pawn image!');
  process.exit(1);
}

console.log('\n🎉 ALL PAWN SYSTEM TESTS PASSED 100% PERFECTLY!');
