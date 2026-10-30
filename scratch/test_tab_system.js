const fs = require('fs');
const assert = require('assert');

console.log('--- VERIFYING BANK SOAL TAB SYSTEM & MATH TIPS ---');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const medievalCss = fs.readFileSync('css/medieval.css', 'utf8');

// 1. Verify Tab Buttons
console.log('\n[1] Checking Tab Buttons:');
assert(indexHtml.includes('id="btn-tab-soal"'), 'btn-tab-soal must exist');
assert(indexHtml.includes('id="btn-tab-tips"'), 'btn-tab-tips must exist');
assert(indexHtml.includes('class="tab-btn active" id="btn-tab-soal"'), 'btn-tab-soal must have class "tab-btn active"');
assert(indexHtml.includes('class="tab-btn" id="btn-tab-tips"'), 'btn-tab-tips must have class "tab-btn"');
assert(indexHtml.includes('>Daftar Soal</button>'), 'btn-tab-soal text must be "Daftar Soal"');
assert(indexHtml.includes('>Tips Soal Matematika</button>'), 'btn-tab-tips text must be "Tips Soal Matematika"');
console.log('✅ Tab buttons exist with correct classes and labels.');

// 2. Verify Containers
console.log('\n[2] Checking Containers:');
assert(indexHtml.includes('<div id="content-soal">'), 'content-soal container must exist');
assert(indexHtml.includes('<div id="content-tips" style="display: none;">'), 'content-tips container must exist with style="display: none;"');
const idxSoal = indexHtml.indexOf('<div id="content-soal">');
const idxList = indexHtml.indexOf('id="qbQuestionList"');
const idxAdd = indexHtml.indexOf('id="formAddNewQuestion"');
const idxTips = indexHtml.indexOf('<div id="content-tips"');
assert(idxSoal < idxList && idxList < idxTips, 'content-soal must wrap the question list');
assert(idxSoal < idxAdd && idxAdd < idxTips, 'content-soal must wrap the question add form');
console.log('✅ Containers structured correctly.');

// 3. Verify Math Tips Content (KaTeX Guide)
console.log('\n[3] Checking Math Tips Content:');
assert(indexHtml.includes('<div class="math-tips-container">'), 'math-tips-container must exist');
assert(indexHtml.includes('<h3>Panduan Menulis Rumus Matematika, Fisika & Kimia</h3>'), 'Header must match');
assert(indexHtml.includes('ATURAN UTAMA:'), 'ATURAN UTAMA text must exist');
assert(indexHtml.includes('<code>$x + y = 10$</code>'), 'Inline math example must exist');
assert(indexHtml.includes('<code>$$A = \\pi r^2$$</code>'), 'Display math example must exist');
assert(indexHtml.includes('HostMath.com'), 'HostMath tip must exist');
assert(indexHtml.includes('$\\frac{1}{2}$'), 'Fraction example must exist');
assert(indexHtml.includes('$\\sqrt{144}$'), 'Square root example must exist');
assert(indexHtml.includes('$H_2O$'), 'Subscript chemical example must exist');
console.log('✅ Math tips guide content matches exact specifications.');

// 4. Verify JavaScript Logic
console.log('\n[4] Checking JS Tab Switcher:');
assert(indexHtml.includes("btnTabTips.addEventListener('click'"), 'click listener for btnTabTips must exist');
assert(indexHtml.includes("btnTabSoal.addEventListener('click'"), 'click listener for btnTabSoal must exist');
assert(indexHtml.includes("contentSoal.style.display = 'none'") && indexHtml.includes("contentTips.style.display = 'block'"), 'tips button click must switch display');
assert(indexHtml.includes("btnTabTips.classList.add('active')") && indexHtml.includes("btnTabSoal.classList.remove('active')"), 'tips button click must update active classes');
assert(indexHtml.includes("contentSoal.style.display = 'block'") && indexHtml.includes("contentTips.style.display = 'none'"), 'soal button click must switch display');
assert(indexHtml.includes("btnTabSoal.classList.add('active')") && indexHtml.includes("btnTabTips.classList.remove('active')"), 'soal button click must update active classes');
console.log('✅ JavaScript tab switcher logic properly implemented.');

// 5. Verify CSS
console.log('\n[5] Checking CSS Styles:');
assert(medievalCss.includes('.tab-btn'), 'medieval.css must style .tab-btn');
assert(medievalCss.includes('.tab-btn.active'), 'medieval.css must style .tab-btn.active');
assert(medievalCss.includes('.math-tips-container'), 'medieval.css must style .math-tips-container');
console.log('✅ CSS styles present in medieval.css.');

console.log('\n🎉 ALL BANK SOAL TAB SYSTEM VERIFICATIONS PASSED! 🎉');
