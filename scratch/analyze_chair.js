const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('assets/tiles/center-chair.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

let pos = 8;
const idatChunks = [];
while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    pos += 12 + len;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
const stride = 1 + width * 4;

console.log('Sample content from top to bottom:');
for (let y = 5; y < height; y += 20) {
    let rowMinX = width, rowMaxX = 0;
    for (let x = 0; x < width; x++) {
        if (decompressed[y * stride + 1 + x * 4 + 3] > 20) {
            if (x < rowMinX) rowMinX = x;
            if (x > rowMaxX) rowMaxX = x;
        }
    }
    if (rowMinX <= rowMaxX) {
        console.log('y=' + y + ': width=' + (rowMaxX - rowMinX + 1) + ' (x=' + rowMinX + '..' + rowMaxX + ') center=' + ((rowMinX + rowMaxX)/2));
    }
}
