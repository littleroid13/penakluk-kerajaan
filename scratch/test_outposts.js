const trackCoords = [
    { gx: -1, gy: -2 }, { gx: -1, gy: -3 }, { gx: -1, gy: -4 }, { gx: -1, gy: -5 }, { gx: -1, gy: -6 },
    { gx: 0, gy: -6 }, { gx: 1, gy: -6 }, { gx: 1, gy: -5 }, { gx: 1, gy: -4 }, { gx: 1, gy: -3 }, { gx: 1, gy: -2 },
    { gx: 2, gy: -1 }, { gx: 3, gy: -1 }, { gx: 4, gy: -1 }, { gx: 5, gy: -1 }, { gx: 6, gy: -1 },
    { gx: 6, gy: 0 }, { gx: 6, gy: 1 }, { gx: 5, gy: 1 }, { gx: 4, gy: 1 }, { gx: 3, gy: 1 }, { gx: 2, gy: 1 },
    { gx: 1, gy: 2 }, { gx: 1, gy: 3 }, { gx: 1, gy: 4 }, { gx: 1, gy: 5 }, { gx: 1, gy: 6 },
    { gx: 0, gy: 6 }, { gx: -1, gy: 6 }, { gx: -1, gy: 5 }, { gx: -1, gy: 4 }, { gx: -1, gy: 3 }, { gx: -1, gy: 2 },
    { gx: -2, gy: 1 }, { gx: -3, gy: 1 }, { gx: -4, gy: 1 }, { gx: -5, gy: 1 }, { gx: -6, gy: 1 },
    { gx: -6, gy: 0 }, { gx: -6, gy: -1 }, { gx: -5, gy: -1 }, { gx: -4, gy: -1 }, { gx: -3, gy: -1 }, { gx: -2, gy: -1 }
];

const encampments = [
    { tent: { gx: -8.0, gy: -4.5 }, flags: [{ gx: -6.6, gy: -3.6 }, { gx: -9.0, gy: -5.8 }] },
    { tent: { gx: 8.0, gy: -4.5 }, flags: [{ gx: 6.6, gy: -3.6 }, { gx: 9.0, gy: -5.8 }] },
    { tent: { gx: 8.0, gy: 4.5 }, flags: [{ gx: 6.6, gy: 3.6 }, { gx: 9.0, gy: 5.8 }] },
    { tent: { gx: -8.0, gy: 4.5 }, flags: [{ gx: -6.6, gy: 3.6 }, { gx: -9.0, gy: 5.8 }] }
];

const cornerHillCenters = [
    { gx: -9.2, gy: -9.2 },
    { gx: 9.2, gy: -9.2 },
    { gx: 9.2, gy: 9.2 },
    { gx: -9.2, gy: 9.2 }
];

// Proposed Watchtower Outpost Props
function getOutpostProps() {
    return [
        // === POS PENGAWAS TIMUR (East Watchtower Outpost) ===
        // Tower 1 (with ladder):
        { assetKey: 'building-structure', gx: 8.0,  gy: -0.7, gz: 0,    scaleMod: 1.0 },
        { assetKey: 'building-platform',  gx: 8.0,  gy: -0.7, gz: 1.0,  scaleMod: 1.0 },
        { assetKey: 'ladder',             gx: 8.25, gy: -0.45, gz: 0,   scaleMod: 1.0 },
        { assetKey: 'flag',               gx: 7.8,  gy: -0.9, gz: 1.45, scaleMod: 0.9 },
        // Suspension Bridge connecting Tower 1 to Tower 2:
        { assetKey: 'bridge',             gx: 8.65, gy: -0.7, gz: 1.0,  scaleMod: 1.05 },
        // Tower 2 (with roof):
        { assetKey: 'building-structure', gx: 9.3,  gy: -0.7, gz: 0,    scaleMod: 1.0 },
        { assetKey: 'building-platform',  gx: 9.3,  gy: -0.7, gz: 1.0,  scaleMod: 1.0 },
        { assetKey: 'building-roof',      gx: 9.3,  gy: -0.7, gz: 1.75, scaleMod: 1.05 },
        // Outpost rocky base & foliage:
        { assetKey: 'rocks-low',          gx: 9.5,  gy: 0.3,  gz: 0,    scaleMod: 0.9 },
        { assetKey: 'plant',              gx: 7.4,  gy: 0.2,  gz: 0,    scaleMod: 0.85 },
        { assetKey: 'tree-high',          gx: 9.8,  gy: -1.6, gz: 0,    scaleMod: 1.1 },

        // === POS PENGAWAS BARAT (West Watchtower Outpost) ===
        // Tower 1 (with ladder):
        { assetKey: 'building-structure', gx: -8.0,  gy: 0.7, gz: 0,    scaleMod: 1.0 },
        { assetKey: 'building-platform',  gx: -8.0,  gy: 0.7, gz: 1.0,  scaleMod: 1.0 },
        { assetKey: 'ladder',             gx: -7.75, gy: 0.95, gz: 0,   scaleMod: 1.0 },
        { assetKey: 'flag',               gx: -8.2,  gy: 0.5, gz: 1.45, scaleMod: 0.9 },
        // Suspension Bridge connecting Tower 1 to Tower 2:
        { assetKey: 'bridge',             gx: -8.65, gy: 0.7, gz: 1.0,  scaleMod: 1.05 },
        // Tower 2 (with roof):
        { assetKey: 'building-structure', gx: -9.3,  gy: 0.7, gz: 0,    scaleMod: 1.0 },
        { assetKey: 'building-platform',  gx: -9.3,  gy: 0.7, gz: 1.0,  scaleMod: 1.0 },
        { assetKey: 'building-roof',      gx: -9.3,  gy: 0.7, gz: 1.75, scaleMod: 1.05 },
        // Outpost rocky base & foliage:
        { assetKey: 'rocks-low',          gx: -9.5,  gy: -0.3, gz: 0,   scaleMod: 0.9 },
        { assetKey: 'plant',              gx: -7.4,  gy: -0.2, gz: 0,   scaleMod: 0.85 },
        { assetKey: 'tree-high',          gx: -9.8,  gy: 1.6,  gz: 0,   scaleMod: 1.1 }
    ];
}

const outpostProps = getOutpostProps();
let collisions = 0;

outpostProps.forEach(p => {
    // Check vs track
    for (const t of trackCoords) {
        const d = Math.hypot(p.gx - t.gx, p.gy - t.gy);
        if (d < 1.3) {
            console.error(`COLLISION! Outpost prop ${p.assetKey} at (${p.gx}, ${p.gy}) too close to track (${t.gx}, ${t.gy}) dist: ${d.toFixed(2)}`);
            collisions++;
        }
    }
    // Check vs encampments
    for (const e of encampments) {
        const dt = Math.hypot(p.gx - e.tent.gx, p.gy - e.tent.gy);
        if (dt < 2.0) {
            console.error(`COLLISION! Outpost prop ${p.assetKey} at (${p.gx}, ${p.gy}) too close to tent (${e.tent.gx}, ${e.tent.gy}) dist: ${dt.toFixed(2)}`);
            collisions++;
        }
        for (const f of e.flags) {
            const df = Math.hypot(p.gx - f.gx, p.gy - f.gy);
            if (df < 1.5) {
                console.error(`COLLISION! Outpost prop ${p.assetKey} at (${p.gx}, ${p.gy}) too close to flag (${f.gx}, ${f.gy}) dist: ${df.toFixed(2)}`);
                collisions++;
            }
        }
    }
    // Check vs corner hills
    for (const c of cornerHillCenters) {
        const dc = Math.hypot(p.gx - c.gx, p.gy - c.gy);
        if (dc < 2.3) {
            console.error(`COLLISION! Outpost prop ${p.assetKey} at (${p.gx}, ${p.gy}) too close to corner hill (${c.gx}, ${c.gy}) dist: ${dc.toFixed(2)}`);
            collisions++;
        }
    }
    // Check diamond boundary
    const dDiamond = Math.abs(p.gx) + Math.abs(p.gy);
    if (dDiamond > 19.5) {
        console.warn(`WARNING: Outpost prop ${p.assetKey} at (${p.gx}, ${p.gy}) dDiamond: ${dDiamond.toFixed(2)} outside 19.5`);
    }
});

console.log(`Total outpost collisions: ${collisions}`);
