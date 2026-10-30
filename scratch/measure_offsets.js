const fs = require('fs');
const zlib = require('zlib');

function getAlpha(f) {
  const buf = fs.readFileSync('assets/env/' + f);
  let off = 8, idats = [], trns = null;
  while(off < buf.length) {
    let len = buf.readUInt32BE(off);
    let type = buf.toString('ascii', off+4, off+8);
    if (type === 'tRNS') trns = buf.slice(off+8, off+8+len);
    if (type === 'IDAT') idats.push(buf.slice(off+8, off+8+len));
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idats));
  const grid = [];
  for(let y=0; y<64; y++) {
    const row = [];
    let r = y*65 + 1;
    for(let x=0; x<64; x++) {
      let idx = raw[r+x];
      let a = trns && idx < trns.length ? trns[idx] : 255;
      row.push(a);
    }
    grid.push(row);
  }
  return grid;
}

const struct = getAlpha('building-structure.png');
const plat = getAlpha('building-platform.png');
const roof = getAlpha('building-roof.png');
const lad = getAlpha('ladder.png');
const bri = getAlpha('bridge.png');

// Find top edge of structure:
// Structure top posts: where are they?
for(let y=0; y<20; y++) {
  let count = struct[y].filter(a => a > 50).length;
  if (count > 0) console.log(`structure row ${y}: ${count} solid pixels`);
}

// Find bottom edge of platform:
for(let y=45; y<55; y++) {
  let count = plat[y].filter(a => a > 50).length;
  if (count > 0) console.log(`platform row ${y}: ${count} solid pixels`);
}

// Find bottom edge of roof:
for(let y=45; y<58; y++) {
  let count = roof[y].filter(a => a > 50).length;
  if (count > 0) console.log(`roof row ${y}: ${count} solid pixels`);
}
