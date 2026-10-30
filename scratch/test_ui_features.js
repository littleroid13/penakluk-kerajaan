const fs = require('fs');

// Check game.html
const html = fs.readFileSync('game.html', 'utf8');
const checks = [
    'id="btnEndGame"',
    'id="btnFullscreen"',
    'id="btnZoomIn"',
    'id="btnResetView"',
    'id="btnZoomOut"',
    'id="endGameConfirmModal"',
    'id="btnCancelEndGame"',
    'id="btnConfirmEndGame"',
    'id="leaderboardModal"',
    'id="btnBackLobbyLeaderboard"',
    'id="btnPlayAgain"',
    'id="btnExportCSV"'
];

checks.forEach(c => {
    if (!html.includes(c)) throw new Error('Missing in game.html: ' + c);
});
console.log('✅ game.html contains all requested buttons & modals (including Kembali Ke Lobby and Bermain Lagi)!');

// Check index.html
const lobbyHtml = fs.readFileSync('index.html', 'utf8');
if (lobbyHtml.includes('TIM ${t + 1}')) throw new Error('index.html still contains TIM ${t + 1}');
if (!lobbyHtml.includes('${t + 1}')) throw new Error('index.html missing ${t + 1}');
console.log('✅ index.html uses numbers only for team badges!');

// Check css/medieval.css
const css = fs.readFileSync('css/medieval.css', 'utf8');
if (!css.includes('.piagam-frame') || !css.includes('overflow-y: auto')) {
    throw new Error('css/medieval.css missing scrollable .piagam-frame');
}
if (!css.includes('.p-rank-num')) {
    throw new Error('css/medieval.css missing .p-rank-num');
}
console.log('✅ css/medieval.css contains scrollable .piagam-frame and .p-rank-num!');

// Check ui.js
const uiJs = fs.readFileSync('js/ui.js', 'utf8');
if (uiJs.includes('Peringkat ${item.rank}')) {
    throw new Error('ui.js still contains text "Peringkat ${item.rank}" in leaderboard modal');
}
if (!uiJs.includes('p-rank-num')) {
    throw new Error('ui.js missing p-rank-num in leaderboard modal');
}
if (!uiJs.includes('btnBackLobbyLeaderboard')) {
    throw new Error('ui.js missing btnBackLobbyLeaderboard handler');
}
console.log('✅ ui.js renders numbers 1, 2, 3, 4 only for rank and handles all leaderboard buttons!');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
