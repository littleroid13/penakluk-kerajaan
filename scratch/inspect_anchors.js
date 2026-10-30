const fs = require('fs');
const zlib = require('zlib');

function getAlphaMatrix(filePath) {
    const buf = fs.readFileSync(filePath);
    let off = 8, idats = [], trns = null;
    while (off < buf.length) {
        let len = buf.readUInt32BE(off);
        let type = buf.toString('ascii', off + 4, off + 8);
        if (type === 'tRNS') trns = buf.slice(off + 8, off + 8 + len);
        if (type === 'IDAT') idats.push(buf.slice(off + 8, off + 8 + len));
        offset = off += 12 + len;
    }
    const raw = zlib.inflateSync(Buffer.concat(idats));
    const matrix = [];
    for (let y = 0; y < 64; y++) {
        const row = [];
        const r = y * 65 + 1;
        for (let x = 0; x < 64; x++) {
            const idx = raw[r + x];
            const a = trns && idx < trns.length ? trns[idx] : 255;
            row.push(a);
        }
        matrix.push(row);
    }
    return matrix;
}

const names = ['building-structure', 'building-platform', 'building-roof', 'ladder', 'bridge'];
names.forEach(n => {
    const m = getAlphaMatrix(`assets/env/${n}.png`);
    // Find bottom-most non-transparent pixel (contact point Y)
    // and horizontal center of the bottom-most row
    let bottomY = -1;
    for (let y = 63; y >= 0; y--) {
        if (m[y].some(a => a > 50)) {
            bottomY = y;
            break;
        }
    }
    let topY = -1;
    for (let y = 0; y < 64; y++) {
        if (m[y].some(a => a > 50)) {
            topY = y;
            break;
        }
    }
    // Calculate centroid of bottom 4 rows
    let sumX = 0, countX = 0;
    for (let y = Math.max(0, bottomY - 3); y <= bottomY; y++) {
        for (let x = 0; x < 64; x++) {
            if (m[y][x] > 50) {
                sumX += x;
                countX++;
            }
        }
    }
    const avgX = countX > 0 ? (sumX / countX).toFixed(1) : 32;
    console.log(`${n.padEnd(20)} topY=${topY}, bottomY=${bottomY}, height=${bottomY-topY+1}, contactX=${avgX}`);
});
