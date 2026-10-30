const fs = require('fs');
const assert = require('assert');

console.log('--- TESTING DICE OVERHAUL & IMMUNITY LOGIC ---');

// Mock browser globals for testing
global.window = {
    renderer: {
        addFloatingText: () => {},
        addParticleBurst: () => {}
    },
    soundEngine: {
        playSpecialPower: () => {},
        playWeirdEvent: () => {},
        playCorrect: () => {},
        playWrong: () => {},
        playDiceRoll: () => {},
        playDiceLand: () => {}
    },
    dice: {
        isRolling: false,
        setDisabled: () => {},
        roll: (val) => {}
    }
};

const factionsCode = fs.readFileSync('js/factions.js', 'utf8');
const boardCode = fs.readFileSync('js/board.js', 'utf8');
const gameCode = fs.readFileSync('js/game.js', 'utf8');
const uiCode = fs.readFileSync('js/ui.js', 'utf8');

const vm = require('vm');
vm.runInThisContext(factionsCode);
vm.runInThisContext(boardCode);
vm.runInThisContext(gameCode);

const board = new window.GameBoard();
const game = new window.GameState(board);

const teamConfigs = [
    { name: 'Tim Naga', factionId: 'dragon' },
    { name: 'Tim Benteng', factionId: 'iron' },
    { name: 'Tim Elf', factionId: 'elves' },
    { name: 'Tim Serigala', factionId: 'wolves' }
];

game.setupGame(teamConfigs, 4);

console.log('\n[2] Testing Immunity Shield:');
const p1 = game.teams[0].pawns[0];
p1.state = 'track';
p1.trackIndex = 5;

// Apply Immunity
game.applySpecialItem(p1, 'IMMUNITY');
assert.strictEqual(p1.hasShield, true, 'Pawn must gain shield upon Immunity');
console.log('✅ Immunity grants shield.');

// Immunity protects from wrong answer (kebal kesalahan)
p1.saveCheckpoint();
game.handleTruthResult(p1, false);
assert.strictEqual(p1.hasShield, false, 'Shield must be consumed after absorbing wrong answer error');
console.log('✅ Shield protects from wrong answer and is consumed.');

// Re-apply shield and test Special Dice reset rule
p1.hasShield = true;
// Landing on special_dice again must remove shield
game.resolveTileEvent(p1, { id: 'test_tile', type: { id: 'special_dice' } });
assert.strictEqual(p1.hasShield, false, 'Shield must be lost if pawn lands on special dice again');
console.log('✅ Shield is lost when landing on special dice again.');

// Test Immunity protects from Mind Control
p1.hasShield = true;
const pEnemy = game.teams[1].pawns[0];
pEnemy.state = 'track';
pEnemy.trackIndex = 10;
pEnemy.hasShield = true;

// Mock UI for Mind Control
game.ui = {
    showMindControlPicker: (pawns, cb) => cb({ team: game.teams[1], pawn: pEnemy }),
    showStealTurnPicker: (teams, cur, cb) => cb(game.teams[1]),
    showStealPointPicker: (teams, cb) => cb(game.teams[1]),
    showSwapPlacePicker: (pawns, cb) => cb({ team: game.teams[1], pawn: pEnemy }),
    showLuckyDicePicker: (pawn, cb) => cb(5)
};

game.applySpecialItem(p1, 'MIND_CONTROL');
assert.strictEqual(pEnemy.hasShield, false, 'Shield must break when absorbing mind control');
assert.strictEqual(pEnemy.trackIndex, 10, 'Pawn with shield must NOT retreat from mind control');
console.log('✅ Mind Control is blocked by Shield.');

// Mind Control on pawn without shield
game.applySpecialItem(p1, 'MIND_CONTROL');
assert.strictEqual(pEnemy.trackIndex, 7, 'Pawn without shield must retreat 3 tiles');
console.log('✅ Mind Control moves enemy without shield back 3 tiles.');

// Test Steal Turn
game.applySpecialItem(p1, 'STEAL_TURN');
assert.strictEqual(game.teams[1].skipNextTurn, true, 'Target team must have skipNextTurn set to true');
assert.strictEqual(game.hasBonusRoll, true, 'Current team must gain extra bonus roll');
console.log('✅ Steal Turn successfully steals enemy turn and gives bonus roll.');

// Test Steal Point
game.teams[1].score = 100;
game.teams[0].score = 0;
game.applySpecialItem(p1, 'STEAL_POINT');
assert.strictEqual(game.teams[1].score, 50, 'Target team must lose 50 points');
assert.strictEqual(game.teams[0].score, 50, 'Current team must gain 50 points');
console.log('✅ Steal Point transfers 50 points correctly.');

// Test Bear Trap (-20 points)
game.applyWeirdEffect(p1, 'BEAR_TRAP');
assert.strictEqual(game.teams[0].score, 30, 'Score must decrease by 20 on Bear Trap');
console.log('✅ Bear Trap deducts 20 points.');

// Test Ouch Banana (-2 steps)
p1.trackIndex = 15;
p1.tilesTraveled = 15;
game.applyWeirdEffect(p1, 'OUCH_BANANA');
assert.strictEqual(p1.trackIndex, 13, 'Pawn must retreat 2 tiles on Ouch Banana');
console.log('✅ Ouch Banana moves pawn back 2 tiles.');

// Test Swap Place
pEnemy.trackIndex = 25;
pEnemy.tilesTraveled = 25;
p1.trackIndex = 13;
p1.tilesTraveled = 13;
game.applyWeirdEffect(p1, 'SWAP_PLACE');
assert.strictEqual(p1.trackIndex, 25, 'Current pawn must take enemy position');
assert.strictEqual(pEnemy.trackIndex, 13, 'Enemy pawn must take current pawn position');
console.log('✅ Swap Place swaps positions cleanly.');

// Test Trick or Treat wrong answer with shield vs without shield
p1.hasShield = true;
game.teams[0].score = 50;
game.handleTruthResult(p1, false, true); // wrong answer in Trick or Treat
assert.strictEqual(p1.hasShield, false, 'Shield must break');
assert.strictEqual(game.teams[0].score, 50, 'Score must not decrease when shield is active');
console.log('✅ Trick or Treat penalty is absorbed by Shield.');

game.handleTruthResult(p1, false, true); // wrong answer without shield
assert.strictEqual(game.teams[0].score, 30, 'Score must decrease by 20 without shield');
console.log('✅ Trick or Treat deducts 20 points without shield.');

// Test Reverse Roll mode
game.applyWeirdEffect(p1, 'REVERSE');
assert.strictEqual(game.isReverseRoll, true, 'isReverseRoll must be true');
p1.trackIndex = 20;
p1.tilesTraveled = 20;
game.handleDiceRoll(4);
assert.strictEqual(p1.trackIndex, 16, 'Pawn must move backwards by 4 tiles');
assert.strictEqual(game.isReverseRoll, false, 'isReverseRoll must reset');
console.log('✅ Reverse rolls dice and moves pawn backwards.');

console.log('\n🎉 ALL DICE OVERHAUL LOGIC VERIFICATIONS PASSED! 🎉');
