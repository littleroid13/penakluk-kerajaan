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

function generateCornerHills() {
    const centers = [
        { gx: -9.2, gy: -9.2, name: 'Bukit Utara' },
        { gx: 9.2, gy: -9.2, name: 'Bukit Timur' },
        { gx: 9.2, gy: 9.2, name: 'Bukit Selatan' },
        { gx: -9.2, gy: 9.2, name: 'Bukit Barat' }
    ];

    const allHills = [];

    centers.forEach(c => {
        const sgnX = Math.sign(c.gx);
        const sgnY = Math.sign(c.gy);

        const props = [
            { key: 'rocks-high', gx: c.gx, gy: c.gy, scaleMod: 1.15 },
            { key: 'rocks-high', gx: c.gx - sgnX * 0.7, gy: c.gy - sgnY * 0.7, scaleMod: 1.05 },
            { key: 'rocks-ramp', gx: c.gx - 0.7, gy: c.gy + 0.7, scaleMod: 1.0 },
            { key: 'rocks-ramp', gx: c.gx + 0.7, gy: c.gy - 0.7, scaleMod: 1.0 },
            { key: 'rocks-low',  gx: c.gx - 1.4, gy: c.gy + 1.2, scaleMod: 0.9 },
            { key: 'rocks-low',  gx: c.gx + 1.2, gy: c.gy - 1.4, scaleMod: 0.9 },
            { key: 'tree-high',  gx: c.gx + sgnX * 0.4, gy: c.gy + sgnY * 0.4, scaleMod: 1.1 },
            { key: 'plant',      gx: c.gx - 1.8, gy: c.gy + 0.8, scaleMod: 0.85 },
            { key: 'stones',     gx: c.gx + 0.8, gy: c.gy - 1.8, scaleMod: 0.85 }
        ];

        allHills.push({ name: c.name, props });
    });

    return allHills;
}

const hills = generateCornerHills();
let collisions = 0;

hills.forEach(h => {
    console.log(`Checking ${h.name}...`);
    h.props.forEach(p => {
        for (const t of trackCoords) {
            const d = Math.hypot(p.gx - t.gx, p.gy - t.gy);
            if (d < 1.3) {
                console.error(`COLLISION! ${h.name} (${p.gx}, ${p.gy}) track dist: ${d}`);
                collisions++;
            }
        }
        for (const e of encampments) {
            const dt = Math.hypot(p.gx - e.tent.gx, p.gy - e.tent.gy);
            if (dt < 2.0) {
                console.error(`COLLISION! ${h.name} (${p.gx}, ${p.gy}) tent dist: ${dt}`);
                collisions++;
            }
            for (const f of e.flags) {
                const df = Math.hypot(p.gx - f.gx, p.gy - f.gy);
                if (df < 1.5) {
                    console.error(`COLLISION! ${h.name} (${p.gx}, ${p.gy}) flag dist: ${df}`);
                    collisions++;
                }
            }
        }
        for (const b of bridges) {
            const db = Math.hypot(p.gx - b.gx, p.gy - b.gy);
            if (db < 2.0) {
                console.error(`COLLISION! ${h.name} (${p.gx}, ${p.gy}) bridge dist: ${db}`);
                collisions++;
            }
        }
    });
});

console.log(`Total collisions: ${collisions}`);
