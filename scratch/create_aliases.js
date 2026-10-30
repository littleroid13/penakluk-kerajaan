const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'assets', 'tiles');
const colors = ['red', 'blue', 'green', 'yellow'];

colors.forEach(c => {
    const endedSrc = path.join(dir, `tile-ended-${c}.png`);
    if (fs.existsSync(endedSrc)) {
        fs.copyFileSync(endedSrc, path.join(dir, `tile_ended_${c}.png`));
        fs.copyFileSync(endedSrc, path.join(dir, `tile-ende-${c}.png`));
        fs.copyFileSync(endedSrc, path.join(dir, `tile_ende_${c}.png`));
    }
    const entranceSrc = path.join(dir, `tile-entrance-${c}.png`);
    if (fs.existsSync(entranceSrc)) {
        fs.copyFileSync(entranceSrc, path.join(dir, `tile_entrance_${c}.png`));
    }
});

console.log('All alias files created successfully!');
