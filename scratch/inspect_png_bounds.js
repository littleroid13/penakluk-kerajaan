const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
    const data = fs.readFileSync(filePath);
    // Find IDAT chunk
    let offset = 8;
    const idatBuffers = [];
    let width = 0, height = 0;

    while (offset < data.length) {
        const length = data.readUInt32BE(offset);
        const type = data.toString('ascii', offset + 4, offset + 8);
        if (type === 'IHDR') {
            width = data.readUInt32BE(offset + 8);
            height = data.readUInt32BE(offset + 12);
        } else if (type === 'IDAT') {
            idatBuffers.push(data.slice(offset + 8, offset + 8 + length));
        }
        offset += 12 + length;
    }

    const compressed = Buffer.concat(idatBuffers);
    const uncompressed = zlib.inflateSync(compressed);

    // PNG scanlines (RGBA 4 bytes per pixel, 1 byte filter per row)
    const stride = width * 4 + 1;
    let minX = width, maxX = 0, minY = height, maxY = 0;

    for (let y = 0; y < height; y++) {
        const rowStart = y * stride + 1;
        for (let x = 0; x < width; x++) {
            const a = uncompressed[rowStart + x * 4 + 3];
            if (a > 10) { // non-transparent
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    return { filePath, width, height, minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

['building-structure.png', 'building-platform.png', 'building-roof.png', 'ladder.png', 'bridge.png', 'tent.png', 'rocks-high.png', 'rocks-low.png'].forEach(f => {
    try {
        const res = decodePNG('assets/env/' + f);
        console.log(`${f.padEnd(24)}: X: [${res.minX}..${res.maxX}] (w=${res.w}) | Y: [${res.minY}..${res.maxY}] (h=${res.h})`);
    } catch(e) {
        console.error(f, e.message);
    }
});
