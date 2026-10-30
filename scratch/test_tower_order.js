function testDepthSort() {
    const props = [
        { name: 'structure A', gx: 0, gy: 0, gz: 0 },
        { name: 'platform A',  gx: 0, gy: 0, gz: 1.0 },
        { name: 'ladder A',    gx: 0.25, gy: 0.25, gz: 0 },
        { name: 'bridge A-B',  gx: 0.65, gy: 0, gz: 1.0 },
        { name: 'structure B', gx: 1.3, gy: 0, gz: 0 },
        { name: 'platform B',  gx: 1.3, gy: 0, gz: 1.0 },
        { name: 'roof B',      gx: 1.3, gy: 0, gz: 1.8 }
    ];

    // Formula: baseDepth = (gx + gy) + gz * 0.15
    const sorted = props.map(p => ({
        ...p,
        depth: (p.gx + p.gy) + (p.gz || 0) * 0.15
    })).sort((a, b) => a.depth - b.depth);

    console.log('Render Order (First to Last):');
    sorted.forEach((p, i) => {
        console.log(`  ${i+1}. depth=${p.depth.toFixed(3)}: ${p.name}`);
    });
}

testDepthSort();
