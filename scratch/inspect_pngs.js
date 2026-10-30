const fs = require('fs');
const path = require('path');

// Read PNG dimensions and headers
const dir = path.join(__dirname, '..', 'assets', 'tiles');
const files = [
    'tile-entrance-red.png', 'tile-entrance-yellow.png', 'tile-entrance-blue.png', 'tile-entrance-green.png',
    'tile-ended-red.png', 'tile-ended-yellow.png', 'tile-ended-blue.png', 'tile-ended-green.png'
];

files.forEach(f => {
    const p = path.join(dir, f);
    const buf = fs.readFileSync(p);
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const stat = fs.statSync(p);
    console.log(f, `${w}x${h}`, `size=${stat.size} bytes`, `modified=${stat.mtime.toLocaleTimeString()}`);
});
