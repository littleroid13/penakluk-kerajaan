// Verify visual depth order (sy sorting) for all 4 hills
const tileW = 76;
const tileH = 38;
const isoToScreen = (gx, gy, gz = -0.55) => {
    const sx = (gx - gy) * (tileW / 2);
    const sy = (gx + gy) * (tileH / 2);
    return { sx, sy };
};

const cornerHills = [
    // 1. North Corner (Top Tip)
    {
        name: 'Bukit Utara (North Ridge)',
        rocks: [
            { gx: -9.6, gy: -9.6, assetKey: 'rocks-high', scaleMod: 1.15 },
            { gx: -9.0, gy: -9.8, assetKey: 'rocks-high', scaleMod: 1.05 },
            { gx: -9.2, gy: -9.1, assetKey: 'rocks-ramp', scaleMod: 1.0 },
            { gx: -9.8, gy: -8.8, assetKey: 'rocks-ramp', scaleMod: 0.95 },
            { gx: -8.5, gy: -8.8, assetKey: 'rocks-low', scaleMod: 0.9 },
            { gx: -8.9, gy: -8.3, assetKey: 'rocks-low', scaleMod: 0.85 },
            { gx: -10.1, gy: -9.3, assetKey: 'tree-high', scaleMod: 1.15 },
            { gx: -8.3, gy: -8.0, assetKey: 'plant', scaleMod: 0.9 },
            { gx: -8.0, gy: -8.5, assetKey: 'stones', scaleMod: 0.85 }
        ]
    },
    // 2. East Corner (Right Tip)
    {
        name: 'Bukit Timur (East Ridge)',
        rocks: [
            { gx: 9.6, gy: -9.6, assetKey: 'rocks-high', scaleMod: 1.15 },
            { gx: 9.8, gy: -9.0, assetKey: 'rocks-high', scaleMod: 1.05 },
            { gx: 9.1, gy: -9.2, assetKey: 'rocks-ramp', scaleMod: 1.0 },
            { gx: 8.8, gy: -9.8, assetKey: 'rocks-ramp', scaleMod: 0.95 },
            { gx: 8.8, gy: -8.5, assetKey: 'rocks-low', scaleMod: 0.9 },
            { gx: 8.3, gy: -8.9, assetKey: 'rocks-low', scaleMod: 0.85 },
            { gx: 9.3, gy: -10.1, assetKey: 'tree-high', scaleMod: 1.15 },
            { gx: 8.0, gy: -8.3, assetKey: 'plant', scaleMod: 0.9 },
            { gx: 8.5, gy: -8.0, assetKey: 'stones', scaleMod: 0.85 }
        ]
    },
    // 3. South Corner (Bottom Tip)
    {
        name: 'Bukit Selatan (South Ridge)',
        rocks: [
            { gx: 9.6, gy: 9.6, assetKey: 'rocks-high', scaleMod: 1.15 },
            { gx: 9.0, gy: 9.8, assetKey: 'rocks-high', scaleMod: 1.05 },
            { gx: 9.2, gy: 9.1, assetKey: 'rocks-ramp', scaleMod: 1.0 },
            { gx: 9.8, gy: 8.8, assetKey: 'rocks-ramp', scaleMod: 0.95 },
            { gx: 8.5, gy: 8.8, assetKey: 'rocks-low', scaleMod: 0.9 },
            { gx: 8.9, gy: 8.3, assetKey: 'rocks-low', scaleMod: 0.85 },
            { gx: 10.1, gy: 9.3, assetKey: 'tree-high', scaleMod: 1.15 },
            { gx: 8.3, gy: 8.0, assetKey: 'plant', scaleMod: 0.9 },
            { gx: 8.0, gy: 8.5, assetKey: 'stones', scaleMod: 0.85 }
        ]
    },
    // 4. West Corner (Left Tip)
    {
        name: 'Bukit Barat (West Ridge)',
        rocks: [
            { gx: -9.6, gy: 9.6, assetKey: 'rocks-high', scaleMod: 1.15 },
            { gx: -9.8, gy: 9.0, assetKey: 'rocks-high', scaleMod: 1.05 },
            { gx: -9.1, gy: 9.2, assetKey: 'rocks-ramp', scaleMod: 1.0 },
            { gx: -8.8, gy: 9.8, assetKey: 'rocks-ramp', scaleMod: 0.95 },
            { gx: -8.8, gy: 8.5, assetKey: 'rocks-low', scaleMod: 0.9 },
            { gx: -8.3, gy: 8.9, assetKey: 'rocks-low', scaleMod: 0.85 },
            { gx: -9.3, gy: 10.1, assetKey: 'tree-high', scaleMod: 1.15 },
            { gx: -8.0, gy: 8.3, assetKey: 'plant', scaleMod: 0.9 },
            { gx: -8.5, gy: 8.0, assetKey: 'stones', scaleMod: 0.85 }
        ]
    }
];

cornerHills.forEach(hill => {
    console.log(`\n=== ${hill.name} ===`);
    const sorted = hill.rocks.map(r => ({ ...r, ...isoToScreen(r.gx, r.gy) })).sort((a, b) => a.sy - b.sy);
    sorted.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [sy=${item.sy.toFixed(1)}] ${item.assetKey.padEnd(11)} at (${item.gx}, ${item.gy})`);
    });
});
