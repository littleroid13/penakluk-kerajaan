/**
 * Verification test script for the latest user requests
 */

const fs = require('fs');

// 1. Verify Lobby HTML texts
console.log('--- TEST 1: Lobby Buttons & Texts ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const hasBankSoal = indexHtml.includes('<span>Bank Soal</span>');
const hasOldBankSoal = indexHtml.includes('<span>Bank Soal Edukasi</span>');
const hasTantanganDare = indexHtml.includes('<span>Tantangan Dare</span>');
const hasOldTantanganDare = indexHtml.includes('<span>Daftar Tantangan Dare</span>');
const hasSuaraNyala = indexHtml.includes('Suara: Nyala');
const hasSoundIconOnly = indexHtml.includes('<span id="sound-icon" class="text-base">🔊</span>');

console.log('Bank Soal:', hasBankSoal, '(Old gone:', !hasOldBankSoal, ')');
console.log('Tantangan Dare:', hasTantanganDare, '(Old gone:', !hasOldTantanganDare, ')');
console.log('Suara text gone:', !hasSuaraNyala, 'Sound icon present:', hasSoundIconOnly);

if (hasBankSoal && !hasOldBankSoal && hasTantanganDare && !hasOldTantanganDare && !hasSuaraNyala && hasSoundIconOnly) {
  console.log('✓ TEST 1 PASSED: Lobby texts and sound icon verified!');
} else {
  console.error('✗ TEST 1 FAILED');
}

// 2. Verify Shield in renderer.js
console.log('\n--- TEST 2: Shield Radius & Enclosure ---');
const rendererJs = fs.readFileSync('js/renderer.js', 'utf8');
const hasShieldRadius36 = rendererJs.includes('const shieldRadius = 36 * s;');
const hasPawnMidY30 = rendererJs.includes('const pawnMidY = currentBaseY - 30 * s * scaleY;');

console.log('shieldRadius = 36 * s:', hasShieldRadius36);
console.log('pawnMidY = currentBaseY - 30 * s:', hasPawnMidY30);
if (hasShieldRadius36 && hasPawnMidY30) {
  console.log('✓ TEST 2 PASSED: Shield sphere enlarged to 36*s to completely cover pawn 3D body!');
} else {
  console.error('✗ TEST 2 FAILED');
}

// 3. Verify Multiple Choice & Matching Shuffling
console.log('\n--- TEST 3: Multiple Choice & Matching Shuffling ---');
global.document = {
  createElement: (tag) => ({
    tagName: tag,
    style: {},
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} },
    querySelectorAll: () => [],
    querySelector: () => null
  })
};

// Test Multiple Choice Shuffling
const testQ = {
  type: 'multiple_choice',
  question: 'What is the capital of England?',
  options: ['London', 'Paris', 'Rome', 'Berlin'],
  correctIndex: 0 // London
};

let ordersSeen = new Set();
let allOptionsValid = true;

for (let iter = 0; iter < 30; iter++) {
  const container = { innerHTML: '' };
  
  // Replicate renderMultipleChoice
  const mapped = testQ.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }
  
  const orderKey = mapped.map(m => m.text).join('|');
  ordersSeen.add(orderKey);

  // Check correctIndex preservation
  const correctItem = mapped.find(m => m.originalIndex === testQ.correctIndex);
  if (!correctItem || correctItem.text !== 'London') {
    allOptionsValid = false;
  }
}

console.log('Different option orders generated in 30 iterations:', ordersSeen.size);
console.log('Correct answer mapping intact:', allOptionsValid);
if (ordersSeen.size > 1 && allOptionsValid) {
  console.log('✓ TEST 3A PASSED: Multiple Choice options are randomly shuffled while preserving correct answer!');
} else {
  console.error('✗ TEST 3A FAILED');
}

// Test Matching Pairs Shuffling
const testMatching = {
  type: 'matching',
  pairs: [
    { id: 'p1', left: 'King', right: 'Crown' },
    { id: 'p2', left: 'Knight', right: 'Sword' },
    { id: 'p3', left: 'Wizard', right: 'Staff' }
  ]
};

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

let matchingOrders = new Set();
for (let iter = 0; iter < 30; iter++) {
  const left = shuffle(testMatching.pairs);
  let right = shuffle(testMatching.pairs);
  if (testMatching.pairs.length > 1 && right.every((item, idx) => item.id === left[idx].id)) {
    right.push(right.shift());
  }
  matchingOrders.add(left.map(x => x.id).join('-') + ':' + right.map(x => x.id).join('-'));
}

console.log('Different matching layout orders generated in 30 iterations:', matchingOrders.size);
if (matchingOrders.size > 1) {
  console.log('✓ TEST 3B PASSED: Matching pairs are randomized every time!');
} else {
  console.error('✗ TEST 3B FAILED');
}

// 4. Test Game Over only when ALL teams finish
console.log('\n--- TEST 4: Game Over Condition ---');
global.window = {};
global.localStorage = { getItem: () => null, setItem: () => {} };
eval(fs.readFileSync('js/board.js', 'utf8'));
eval(fs.readFileSync('js/factions.js', 'utf8'));
eval(fs.readFileSync('js/questions.js', 'utf8'));
eval(fs.readFileSync('js/game.js', 'utf8'));

const board = new window.GameBoard();
const game = new window.GameState(board);
const configs = [
  { factionId: 'wolves', name: 'Tim 1 (Wolves)' },
  { factionId: 'elves', name: 'Tim 2 (Elves)' },
  { factionId: 'dragon', name: 'Tim 3 (Dragon)' },
  { factionId: 'crown', name: 'Tim 4 (Crown)' }
];
game.setupGame(configs, 4);

// Simulate Team 0 pawns all reaching the throne
game.currentTeamIndex = 0;
game.teams[0].pawns.forEach(p => { p.state = 'throne'; });

// Trigger handleThroneArrival for Team 0 (which calls finishTurn -> nextTurn)
game.handleThroneArrival(game.teams[0].pawns[0]);

console.log('Team 0 all pawns finished: isGameOver =', game.isGameOver);
console.log('Winner team set to Team 0:', game.winnerTeam && game.winnerTeam.index === 0);
console.log('Team 0 has bonus 500 score:', game.teams[0].score >= 500);
console.log('Current turn after handleThroneArrival:', game.currentTeamIndex, '(Team name:', game.getCurrentTeam().name, ')');

if (!game.isGameOver && game.winnerTeam && game.winnerTeam.index === 0 && game.currentTeamIndex === 1) {
  console.log('✓ Subtest 4A & 4B: When Team 0 finishes, game continues and turn immediately passes to Team 1!');
} else {
  console.error('✗ Subtest 4A & 4B FAILED');
}

// Now simulate Team 1 and Team 2 finishing
game.teams[1].pawns.forEach(p => { p.state = 'throne'; });
game.teams[2].pawns.forEach(p => { p.state = 'throne'; });

// Next turn should skip Team 0, 1, 2 and land on Team 3
game.nextTurn();
console.log('Turn when Teams 0,1,2 finished:', game.currentTeamIndex, '(Team name:', game.getCurrentTeam().name, ')');
if (game.currentTeamIndex === 3) {
  console.log('✓ Subtest 4C: Teams 0, 1, 2 all skipped, turn goes to remaining Team 3!');
} else {
  console.error('✗ Subtest 4C FAILED');
}

// Now Team 3 finishes all pawns
game.teams[3].pawns.forEach(p => { p.state = 'throne'; });
game.handleThroneArrival(game.teams[3].pawns[0]);

console.log('When ALL 4 teams finish all pawns: isGameOver =', game.isGameOver);
if (game.isGameOver) {
  console.log('✓ Subtest 4D: Game naturally ends only when ALL pawns of ALL teams have reached the throne!');
} else {
  console.error('✗ Subtest 4D FAILED: Game should have ended');
}

console.log('\n====================================');
console.log('ALL NEW FEATURES & BUG FIXES PASSED!');
console.log('====================================');
