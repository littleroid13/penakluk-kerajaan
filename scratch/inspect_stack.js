const fs = require('fs');
const zlib = require('zlib');

function getPixels(filePath) {
    const buf = fs.readFileSync(filePath);
    let off = 8, idats = [], trns = null, plte = null;
    while (off < buf.length) {
        let len = buf.readUInt32BE(off);
        let type = buf.toString('ascii', off + 4, off + 8);
        if (type === 'PLTE') plte = buf.slice(off + 8, off + 8 + len);
        if (type === 'tRNS') trns = buf.slice(off + 8, off + 8 + len);
        if (type === 'IDAT') idats.push(buf.slice(off + 8, off + 8 + len));
        off += 12 + len;
    }
    const raw = zlib.inflateSync(Buffer.concat(idats));
    return { raw, trns, plte };
}

// Let's inspect building-structure, building-platform, building-roof
const s = getPixels('assets/env/building-structure.png');
const p = getPixels('assets/env/building-platform.png');
const r = getPixels('assets/env/building-roof.png');
const l = getPixels('assets/env/ladder.png');
const b = getPixels('assets/env/bridge.png');

console.log('Structure, Platform, Roof, Ladder, Bridge pixel loaded.');
