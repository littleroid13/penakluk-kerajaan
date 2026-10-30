const tileW = 76;
const tileH = 38;
const isoToScreen = (gx, gy) => ({
    sx: (gx - gy) * (tileW / 2),
    sy: (gx + gy) * (tileH / 2)
});

// Test cluster spread for all 4 tips
function createHillCluster(centerGx, centerGy, angleName) {
    // We want a central peak with rocks-high,
    // stepping down with rocks-ramp on both flanks,
    // and finishing with rocks-low and plants at the foot!
    console.log(`\n=== Formation for ${angleName} (center: ${centerGx}, ${centerGy}) ===`);
    
    // Calculate offsets based on corner quadrant
    const sgnX = Math.sign(centerGx);
    const sgnY = Math.sign(centerGy);

    const cluster = [
        // Main summit peak (tallest cliff)
        { key: 'rocks-high', gx: centerGx, gy: centerGy, scale: 1.15 },
        // Secondary peak
        { key: 'rocks-high', gx: centerGx - sgnX * 0.7, gy: centerGy - sgnY * 0.7, scale: 1.05 },
        // Left ramp slope
        { key: 'rocks-ramp', gx: centerGx - 0.7, gy: centerGy + 0.7, scale: 1.0 },
        // Right ramp slope
        { key: 'rocks-ramp', gx: centerGx + 0.7, gy: centerGy - 0.7, scale: 1.0 },
        // Left foothill
        { key: 'rocks-low',  gx: centerGx - 1.4, gy: centerGy + 1.2, scale: 0.9 },
        // Right foothill
        { key: 'rocks-low',  gx: centerGx + 1.2, gy: centerGy - 1.4, scale: 0.9 },
        // Mountain pine tree nestled behind peak
        { key: 'tree-high',  gx: centerGx + sgnX * 0.4, gy: centerGy + sgnY * 0.4, scale: 1.1 },
        // Alpine shrub
        { key: 'plant',      gx: centerGx - 1.8, gy: centerGy + 0.8, scale: 0.85 },
        // Pebble scree
        { key: 'stones',     gx: centerGx + 0.8, gy: centerGy - 1.8, scale: 0.85 }
    ];

    const projected = cluster.map(p => ({
        ...p,
        ...isoToScreen(p.gx, p.gy)
    })).sort((a, b) => a.sy - b.sy);

    projected.forEach(p => {
        console.log(`  [sy=${p.sy.toFixed(1).padStart(6)}, sx=${p.sx.toFixed(1).padStart(6)}] ${p.key.padEnd(11)} at (${p.gx.toFixed(1)}, ${p.gy.toFixed(1)})`);
    });
}

createHillCluster(-9.2, -9.2, 'Utara (North)');
createHillCluster(9.2, -9.2, 'Timur (East)');
createHillCluster(9.2, 9.2, 'Selatan (South)');
createHillCluster(-9.2, 9.2, 'Barat (West)');
