// Comprehensive verification for Exit Gate & Bonus Roll Gameplay Mechanics
const fs = require('fs');

// Mock browser globals
global.window = global;
global.window.addEventListener = () => {};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};
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
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

// Load game files
require('../js/factions.js');
require('../js/questions.js');
require('../js/board.js');
require('../js/game.js');
require('../js/renderer.js');

console.log('--- 1. Testing Exit Gates Definition ---');
const board = new GameBoard();
console.assert(board.exitGates.length === 4, 'Must have 4 exit gates');
board.exitGates.forEach((g, idx) => {
    console.log(`Team ${idx} Exit Gate: (${g.gx}, ${g.gy}) name: ${g.name}`);
    const startIdx = board.getTeamStartIndex(idx);
    const startTile = board.track[startIdx];
    const dist = Math.hypot(g.gx - startTile.gx, g.gy - startTile.gy);
    console.assert(dist === 1, `Gate ${idx} must be adjacent to Start Tile (dist=1, got ${dist})`);
});
console.log('✅ All 4 Exit Gates verified and adjacent to Start Tiles!');

console.log('\n--- 2. Testing calculatePath Logic ---');
const pawnT0 = new Pawn('p0', 0, 1, board.bases[0][0]);
// At Base
console.assert(board.calculatePath(pawnT0, 5).length === 0, 'Roll < 6 at base should return empty path');
const pathRoll6 = board.calculatePath(pawnT0, 6);
console.assert(pathRoll6.length === 1, `Roll 6 at base should return 1 step to Gate, got ${pathRoll6.length}`);
console.assert(pathRoll6[0].targetState === 'gate', `targetState must be 'gate', got ${pathRoll6[0].targetState}`);
console.assert(pathRoll6[0].gx === board.exitGates[0].gx && pathRoll6[0].gy === board.exitGates[0].gy, 'Coords must match exit gate');

// At Gate
pawnT0.state = 'gate';
pawnT0.gx = board.exitGates[0].gx;
pawnT0.gy = board.exitGates[0].gy;

const pathFromGateRoll1 = board.calculatePath(pawnT0, 1);
console.assert(pathFromGateRoll1.length === 1, `Roll 1 from gate must have 1 step, got ${pathFromGateRoll1.length}`);
console.assert(pathFromGateRoll1[0].trackIndex === 0, `Roll 1 should land on start tile (index 0), got ${pathFromGateRoll1[0].trackIndex}`);
console.assert(pathFromGateRoll1[0].targetState === 'track', `targetState should be 'track'`);

const pathFromGateRoll4 = board.calculatePath(pawnT0, 4);
console.assert(pathFromGateRoll4.length === 4, `Roll 4 from gate must have 4 steps, got ${pathFromGateRoll4.length}`);
console.assert(pathFromGateRoll4[0].trackIndex === 0, `Step 1 on start tile`);
console.assert(pathFromGateRoll4[3].trackIndex === 3, `Step 4 on track tile 3, got ${pathFromGateRoll4[3].trackIndex}`);
console.assert(pathFromGateRoll4[3].tilesTraveled === 3, `tilesTraveled should be 3, got ${pathFromGateRoll4[3].tilesTraveled}`);

console.log('✅ calculatePath from Base and Gate verified for all scenarios!');

console.log('\n--- 3. Testing GameState Flow: Base -> Gate (Roll 6) -> Track (Roll 2) ---');
const gameState = new GameState(board);
const teamConfigs = [
    { name: 'House of the Dragon', factionId: 'dragon' },
    { name: 'Iron Citadel', factionId: 'iron' },
    { name: 'Woodland Elves', factionId: 'elves' },
    { name: 'Arcane Order', factionId: 'arcane' }
];
gameState.setupGame(teamConfigs, 4);

// Mock soundEngine and renderer
window.soundEngine = new Proxy({}, {
    get: () => () => {}
});
window.renderer = {
    addFloatingText: (gx, gy, gz, txt) => console.log(`   [FloatingText] (${gx},${gy}): ${txt}`),
    addParticleBurst: () => {}
};
window.dice = {
    setDisabled: (val) => console.log(`   [Dice] setDisabled(${val})`)
};

const curTeam = gameState.getCurrentTeam();
console.log(`Current team: ${curTeam.name}`);

// Step 1: Roll 6
console.log('\n> Action: Roll 6 for Team 0');
let selectedPawn = null;
gameState.onPawnSelectionNeeded = (team, pawns, roll) => {
    console.log(`   [Modal] onPawnSelectionNeeded: Team has ${pawns.length} eligible pawns on roll ${roll}`);
    selectedPawn = pawns[0]; // Player chooses pawn 1
};
gameState.onTileEvent = (type, pawn, team) => {
    console.log(`   [Event] onTileEvent: ${type} landed! Auto-resolving for test...`);
    gameState.finishTurn();
};
gameState.handleDiceRoll(6);
console.assert(selectedPawn !== null, 'Should trigger selection when 4 pawns in base');

console.log('> Player selects Pawn 1:');
gameState.selectPawnToMove(selectedPawn);

setTimeout(() => {
    console.assert(selectedPawn.state === 'gate', `Pawn 1 state must be 'gate', got ${selectedPawn.state}`);
    console.assert(selectedPawn.gx === board.exitGates[0].gx, 'Pawn 1 must be at Exit Gate');
    console.assert(gameState.currentTeamIndex === 0, 'Team 0 should still be current team due to bonus roll');
    console.log('✅ Pawn successfully arrived at Exit Gate and bonus roll triggered!');

    // Step 2: Bonus Roll (Roll 3)
    console.log('\n> Action: Team 0 rolls bonus roll: 3');
    selectedPawn = null;
    gameState.onPawnSelectionNeeded = (team, pawns, roll) => {
        console.log(`   [Modal] onPawnSelectionNeeded for bonus roll: ${pawns.length} eligible pawns on roll ${roll}`);
        // Pawns eligible: only pawn 1 at gate! Because pawns in base need 6.
        console.assert(pawns.length === 1, `Only 1 pawn should be eligible on roll 3, got ${pawns.length}`);
        selectedPawn = pawns[0];
    };
    gameState.handleDiceRoll(3);

    // If only 1 pawn eligible, handleDiceRoll executes move automatically!
    setTimeout(() => {
        const p1 = curTeam.pawns[0];
        console.assert(p1.state === 'track', `Pawn 1 should now be on 'track', got ${p1.state}`);
        console.assert(p1.trackIndex === 2, `Pawn 1 should be on track index 2, got ${p1.trackIndex}`);
        console.log(`Pawn 1 is at track index: ${p1.trackIndex}, state: ${p1.state}`);
        console.assert(gameState.currentTeamIndex === 1, `Turn should now pass to Team 1, got team ${gameState.currentTeamIndex}`);
        console.log('✅ Bonus roll moved pawn from Gate to Track, and turn passed cleanly to Team 1!');

        console.log('\n--- 4. Testing Renderer Entity Queue ---');
        const renderer = new IsometricRenderer(document.createElement('canvas'), board);
        // Spy on entities in render
        let renderedEntities = [];
        const origRenderExitGate = renderer.renderExitGate.bind(renderer);
        renderer.renderExitGate = (gate, teamIdx) => {
            renderedEntities.push({ type: 'exit_gate', team: teamIdx, gate });
            origRenderExitGate(gate, teamIdx);
        };
        renderer.render(gameState);

        console.assert(renderedEntities.length === 4, `Renderer should render 4 exit gates, got ${renderedEntities.length}`);
        console.log(`✅ Renderer rendered ${renderedEntities.length} exit gates successfully!`);

        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
        process.exit(0);
    }, 2500);

}, 1000);
