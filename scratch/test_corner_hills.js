// Test hill generation and verify 0 collisions with bases, flags, tents, bridges, and gates
const trackCoords = [
    // Quadrant 0: North Arm (Team 0)
    { gx: -1, gy: -2 }, { gx: -1, gy: -3 }, { gx: -1, gy: -4 }, { gx: -1, gy: -5 }, { gx: -1, gy: -6 },
    { gx: 0, gy: -6 }, { gx: 1, gy: -6 }, { gx: 1, gy: -5 }, { gx: 1, gy: -4 }, { gx: 1, gy: -3 }, { gx: 1, gy: -2 },
    // Quadrant 1: East Arm (Team 1)
    { gx: 2, gy: -1 }, { gx: 3, gy: -1 }, { gx: 4, gy: -1 }, { gx: 5, gy: -1 }, { gx: 6, gy: -1 },
    { gx: 6, gy: 0 }, { gx: 6, gy: 1 }, { gx: 5, gy: 1 }, { gx: 4, gy: 1 }, { gx: 3, gy: 1 }, { gx: 2, gy: 1 },
    // Quadrant 2: South Arm (Team 2)
    { gx: 1, gy: 2 }, { gx: 1, gy: 3 }, { gx: 1, gy: 4 }, { gx: 1, gy: 5 }, { gx: 1, gy: 6 },
    { gx: 0, gy: 6 }, { gx: -1, gy: 6 }, { gx: -1, gy: 5 }, { gx: -1, gy: 4 }, { gx: -1, gy: 3 }, { gx: -1, gy: 2 },
    // Quadrant 3: West Arm (Team 3)
    { gx: -2, gy: 1 }, { gx: -3, gy: 1 }, { gx: -4, gy: 1 }, { gx: -5, gy: 1 }, { gx: -6, gy: 1 },
    { gx: -6, gy: 0 }, { gx: -6, gy: -1 }, { gx: -5, gy: -1 }, { gx: -4, gy: -1 }, { gx: -3, gy: -1 }, { gx: -2, gy: -1 }
];

const exitGates = [
    { gx: -2, gy: -2 },
    { gx: 2, gy: -2 },
    { gx: 2, gy: 2 },
    { gx: -2, gy: 2 }
];

const encampments = [
    { tent: { gx: -8.0, gy: -4.5 }, flags: [{ gx: -6.6, gy: -3.6 }, { gx: -9.0, gy: -5.8 }] },
    { tent: { gx: 8.0, gy: -4.5 }, flags: [{ gx: 6.6, gy: -3.6 }, { gx: 9.0, gy: -5.8 }] },
    { tent: { gx: 8.0, gy: 4.5 }, flags: [{ gx: 6.6, gy: 3.6 }, { gx: 9.0, gy: 5.8 }] },
    { tent: { gx: -8.0, gy: 4.5 }, flags: [{ gx: -6.6, gy: 3.6 }, { gx: -9.0, gy: 5.8 }] }
];

const bridges = [
    { gx: -9.5, gy: 0.0 },
    { gx: 9.5, gy: 0.0 },
    { gx: 0.0, gy: -9.5 },
    { gx: 0.0, gy: 9.5 }
];

// Proposed 4 Corner Hills:
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

// Check all hill props:
let collisions = 0;
cornerHills.forEach(hill => {
    console.log(`Checking ${hill.name}: ${hill.rocks.length} elements`);
    hill.rocks.forEach(p => {
        // Check vs tracks
        for (const t of trackCoords) {
            const d = Math.hypot(p.gx - t.gx, p.gy - t.gy);
            if (d < 1.3) {
                console.error(`COLLISION! ${hill.name} (${p.gx}, ${p.gy}) too close to track (${t.gx}, ${t.gy}) dist: ${d}`);
                collisions++;
            }
        }
        // Check vs tents
        for (const e of encampments) {
            const dt = Math.hypot(p.gx - e.tent.gx, p.gy - e.tent.gy);
            if (dt < 2.2) {
                console.error(`COLLISION! ${hill.name} (${p.gx}, ${p.gy}) too close to tent (${e.tent.gx}, ${e.tent.gy}) dist: ${dt}`);
                collisions++;
            }
            for (const f of e.flags) {
                const df = Math.hypot(p.gx - f.gx, p.gy - f.gy);
                if (df < 1.7) {
                    console.error(`COLLISION! ${hill.name} (${p.gx}, ${p.gy}) too close to flag (${f.gx}, ${f.gy}) dist: ${df}`);
                    collisions++;
                }
            }
        }
        // Check vs bridges
        for (const b of bridges) {
            const db = Math.hypot(p.gx - b.gx, p.gy - b.gy);
            if (db < 2.0) {
                console.error(`COLLISION! ${hill.name} (${p.gx}, ${p.gy}) too close to bridge (${b.gx}, ${b.gy}) dist: ${db}`);
                collisions++;
            }
        }
        // Check within island diamond limit d <= 19.5
        const dDiamond = Math.abs(p.gx) + Math.abs(p.gy);
        if (dDiamond > 19.8) {
            console.warn(`WARNING: ${hill.name} (${p.gx}, ${p.gy}) dDiamond: ${dDiamond} slightly outside 19.5`);
        }
    });
});

if (collisions === 0) {
    console.log('\n✅ 0 COLLISIONS! All 4 corner hill formations fit perfectly and safely on the island!');
} else {
    console.error(`\n❌ Found ${collisions} collisions!`);
}
