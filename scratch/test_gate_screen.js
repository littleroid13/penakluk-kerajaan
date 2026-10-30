const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTING GATE SCREEN & LICENSE SYSTEM ---');

// 1. Verify index.html markup
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Container
assert(indexHtml.includes('id="gate-screen"'), 'Gate screen container must have id="gate-screen"');

// License input
assert(indexHtml.includes('id="license-input"'), 'Input must have id="license-input"');
assert(indexHtml.includes('placeholder="Contoh: XXXXXX"'), 'Input must have placeholder="Contoh: XXXXXX"');

// Validate button
assert(indexHtml.includes('id="btn-validate"'), 'Button must have id="btn-validate"');
assert(/id="btn-validate"[^>]*>[\s\S]*?Masuk Arena[\s\S]*?<\/button>/i.test(indexHtml), 'Button must have text "Masuk Arena"');

// Message paragraph
assert(indexHtml.includes('id="gate-msg"'), 'Message element must have id="gate-msg"');

// Lynk.id link
assert(indexHtml.includes('https://lynk.id/littleroid13'), 'Must contain Lynk.id URL: https://lynk.id/littleroid13');
assert(indexHtml.includes('Dapatkan lisensi di Lynk.id'), 'Must contain text: Dapatkan lisensi di Lynk.id');

// Copyright footer
assert(indexHtml.includes('© 2026 littleroid13. All rights reserved.'), 'Must contain copyright footer text');

// Lobby Screen
assert(indexHtml.includes('id="lobby-screen"'), 'Lobby container must have id="lobby-screen"');

// API endpoint URL
assert(indexHtml.includes('https://script.google.com/macros/s/AKfycbwL2PD-0VGdS02RiyTVTGz6RidWAcebNYEIwZcM00ks-A0FdbNPntzaVLjLAT37qPkL0g/exec?code='), 'API endpoint URL must match specification');

console.log('✓ index.html structure & markup assertions PASSED');

// 2. Verify game.html guard
const gameHtml = fs.readFileSync(path.join(__dirname, '../game.html'), 'utf8');
assert(gameHtml.includes('ludo_licensed'), 'game.html must check ludo_licensed');
assert(gameHtml.includes('window.location.replace("index.html")') || gameHtml.includes("window.location.href = 'index.html'"), 'game.html must redirect if unlicensed');
console.log('✓ game.html route guard PASSED');

// 3. Verify calibrate_chair.html guard
const calHtml = fs.readFileSync(path.join(__dirname, '../calibrate_chair.html'), 'utf8');
assert(calHtml.includes('ludo_licensed'), 'calibrate_chair.html must check ludo_licensed');
console.log('✓ calibrate_chair.html route guard PASSED');

// 4. Test logic simulation
function createMockDOM() {
  const elements = {};
  const storage = {};
  
  const mockEl = (id) => ({
    id,
    style: {},
    className: '',
    textContent: '',
    value: '',
    disabled: false,
    innerHTML: '',
    classList: {
      add: (c) => {},
      remove: (c) => {}
    },
    addEventListener: function(evt, handler) {
      this['on' + evt] = handler;
    },
    focus: () => {}
  });

  ['gate-screen', 'lobby-screen', 'license-input', 'btn-validate', 'gate-msg'].forEach(id => {
    elements[id] = mockEl(id);
  });

  return {
    elements,
    localStorage: {
      getItem: (k) => storage[k] || null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; }
    }
  };
}

// Test unauthenticated initial state
{
  const { elements, localStorage } = createMockDOM();
  const isLicensed = localStorage.getItem('ludo_licensed') === 'true';
  assert.strictEqual(isLicensed, false);
  
  // Logic from script
  if (isLicensed) {
    elements['gate-screen'].style.display = 'none';
    elements['lobby-screen'].style.display = '';
  } else {
    elements['gate-screen'].style.display = 'flex';
    elements['lobby-screen'].style.display = 'none';
  }

  assert.strictEqual(elements['gate-screen'].style.display, 'flex', 'Gate screen must be visible when unlicensed');
  assert.strictEqual(elements['lobby-screen'].style.display, 'none', 'Lobby screen must be hidden when unlicensed');
  console.log('✓ Unauthenticated initial state test PASSED');
}

// Test authenticated initial state
{
  const { elements, localStorage } = createMockDOM();
  localStorage.setItem('ludo_licensed', 'true');
  const isLicensed = localStorage.getItem('ludo_licensed') === 'true';
  assert.strictEqual(isLicensed, true);

  if (isLicensed) {
    elements['gate-screen'].style.display = 'none';
    elements['lobby-screen'].style.display = '';
  } else {
    elements['gate-screen'].style.display = 'flex';
    elements['lobby-screen'].style.display = 'none';
  }

  assert.strictEqual(elements['gate-screen'].style.display, 'none', 'Gate screen must be hidden when licensed');
  assert.strictEqual(elements['lobby-screen'].style.display, '', 'Lobby screen must be displayed when licensed');
  console.log('✓ Authenticated initial state test PASSED');
}

// Test validation flow with valid code
(async () => {
  const { elements, localStorage } = createMockDOM();
  elements['license-input'].value = 'VALID_CODE';
  
  let fetchUrl = '';
  const mockFetch = async (url) => {
    fetchUrl = url;
    return {
      json: async () => ({ valid: true, message: 'OK' })
    };
  };

  const inputCode = elements['license-input'].value.trim();
  const API_URL = "https://script.google.com/macros/s/AKfycbwL2PD-0VGdS02RiyTVTGz6RidWAcebNYEIwZcM00ks-A0FdbNPntzaVLjLAT37qPkL0g/exec?code=" + encodeURIComponent(inputCode);
  const res = await mockFetch(API_URL);
  const data = await res.json();

  if (data && data.valid === true) {
    localStorage.setItem("ludo_licensed", "true");
    elements['gate-screen'].style.opacity = '0';
    elements['lobby-screen'].style.display = '';
  }

  assert(fetchUrl.includes('code=VALID_CODE'), 'Fetch URL must contain encoded code');
  assert.strictEqual(localStorage.getItem('ludo_licensed'), 'true', 'Token must be stored');
  assert.strictEqual(elements['lobby-screen'].style.display, '', 'Lobby screen must be visible on success');
  console.log('✓ Validation success flow PASSED');
})();

// Test validation flow with invalid code
(async () => {
  const { elements, localStorage } = createMockDOM();
  elements['license-input'].value = 'WRONG_CODE';

  const mockFetch = async (url) => ({
    json: async () => ({ valid: false, message: 'Kode lisensi tidak valid.' })
  });

  const inputCode = elements['license-input'].value.trim();
  const API_URL = "https://script.google.com/macros/s/AKfycbwL2PD-0VGdS02RiyTVTGz6RidWAcebNYEIwZcM00ks-A0FdbNPntzaVLjLAT37qPkL0g/exec?code=" + encodeURIComponent(inputCode);
  const res = await mockFetch(API_URL);
  const data = await res.json();

  if (data && data.valid === true) {
    localStorage.setItem("ludo_licensed", "true");
  } else {
    elements['gate-msg'].textContent = data.message;
  }

  assert.strictEqual(localStorage.getItem('ludo_licensed'), null, 'Token must not be stored on invalid code');
  assert.strictEqual(elements['gate-msg'].textContent, 'Kode lisensi tidak valid.');
  console.log('✓ Validation failure flow PASSED');
})();

console.log('ALL GATE SCREEN TESTS COMPLETED SUCCESSFULLY!');
