const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING FINAL VERIFICATION FOR 3 REQUESTS ---');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const gameHtml = fs.readFileSync('game.html', 'utf8');
const medievalCss = fs.readFileSync('css/medieval.css', 'utf8');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');
const questionsJs = fs.readFileSync('js/questions.js', 'utf8');

// 1. VERIFY LOBBY PAWN PREVIEW
console.log('\n[TEST 1] Lobby Pawn Preview:');
assert(indexHtml.includes('<img class="pawn-preview"'), 'index.html must contain <img class="pawn-preview"');
assert(indexHtml.includes('getPawnAssetSrc'), 'index.html must define getPawnAssetSrc');
assert(indexHtml.includes('${f.motto}'), 'index.html must retain faction motto');
assert(indexHtml.includes('.pawn-preview {') && indexHtml.includes('height: 80px') && indexHtml.includes('object-fit: contain'), 'CSS for .pawn-preview must have height 80px and object-fit contain');

// Test all 24 pawn paths resolve
const teams = [0, 1, 2, 3];
const factions = ['dragon', 'citadel', 'iron', 'elf', 'elves', 'crown', 'wolf', 'wolves', 'arcane'];
const TEAM_COLORS = ['blue', 'green', 'red', 'yellow'];

function getPawnAssetSrc(teamIndex, factionId) {
    const color = TEAM_COLORS[teamIndex] || 'blue';
    let faction = 'dragon';
    const fId = String(factionId || '').toLowerCase();
    if (fId.includes('dragon')) faction = 'dragon';
    else if (fId.includes('citadel') || fId.includes('iron') || fId.includes('knight')) faction = 'citadel';
    else if (fId.includes('elf') || fId.includes('elves')) faction = 'elf';
    else if (fId.includes('crown')) faction = 'crown';
    else if (fId.includes('wolf') || fId.includes('wolves')) faction = 'wolf';
    else if (fId.includes('arcane') || fId.includes('wizard')) faction = 'arcane';
    return `assets/pawns/pawn-${faction}-${color}.png`;
}

for (let t of teams) {
    for (let f of factions) {
        const p = getPawnAssetSrc(t, f);
        assert(fs.existsSync(p), `File ${p} must exist on disk!`);
    }
}
console.log('✅ All 24 pawn variations mapped and exist on disk.');

// 2. VERIFY KATEX INTEGRATION
console.log('\n[TEST 2] KaTeX Integration:');
assert(indexHtml.includes('katex.min.css') && indexHtml.includes('katex.min.js') && indexHtml.includes('auto-render.min.js'), 'index.html must include KaTeX CDN');
assert(gameHtml.includes('katex.min.css') && gameHtml.includes('katex.min.js') && gameHtml.includes('auto-render.min.js'), 'game.html must include KaTeX CDN');
assert(uiJs.includes('renderKaTeX('), 'ui.js must define renderKaTeX method');
assert(uiJs.includes("left: '$$'") && uiJs.includes("left: '$'"), 'KaTeX delimiters must support $ and $$');
assert(uiJs.includes('this.renderKaTeX(this.truthModal)'), 'showTruthModal must call renderKaTeX');
assert(uiJs.includes('this.renderKaTeX(feedbackContainer)'), 'handleTruthFeedback must call renderKaTeX');
assert(uiJs.includes('this.renderKaTeX(duelQText)'), 'showClashDuelModal must call renderKaTeX');
assert(uiJs.includes('this.renderKaTeX(answerContent)'), 'startAnswering must call renderKaTeX');
assert(questionsJs.includes('frac{3}{4}') && questionsJs.includes('F = m') && questionsJs.includes('C_6H_{12}O_6'), 'questions.js must include LaTeX math & science questions');
console.log('✅ KaTeX integrated across index.html, game.html, ui.js, and questions.js.');

// 3. VERIFY COPYRIGHT FOOTER
console.log('\n[TEST 3] Copyright Footer:');
const expectedFooter = '<div id="copyright-footer">© 2026 littleroid13. All rights reserved.</div>';
assert(indexHtml.includes(expectedFooter), 'index.html must have exact copyright footer');
assert(gameHtml.includes(expectedFooter), 'game.html must have exact copyright footer');
assert(medievalCss.includes('#copyright-footer') && medievalCss.includes('bottom: 10px') && medievalCss.includes('width: 100%'), 'medieval.css must style #copyright-footer with fixed bottom 10px, 100% width');
console.log('✅ Copyright footer verified on all pages.');

console.log('\n🌟 ALL VERIFICATION CHECKS PASSED PERFECTLY! 🌟');
