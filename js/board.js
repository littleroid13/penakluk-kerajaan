/**
 * PENAKHLUKAN KERAJAAN - Board Topology & Track System
 * 44 Tiles Medieval Cross Track (agak lebih kecil dari Ludo 52 standar)
 * 4 Corner Bases (4 pawn slots per team) + 4 Finish Lanes (5 stepped tiles each)
 * + Central Golden Iron Throne.
 * Tiap tim masuk ke jalur finish tepat sebelum titik keluar base mereka setelah memutari 1 putaran penuh!
 */

const TILE_TYPES = {
    BLANK: {
        id: 'blank',
        name: 'Batu Kastil',
        icon: '🛡️',
        desc: 'Petak aman tanpa efek.',
        color: '#6c757d',
        bgColor: '#3d405b',
        textColor: '#e0e1dd'
    },
    TRUTH: {
        id: 'truth',
        name: 'Kitab Kuno (TRUTH)',
        icon: '📜',
        desc: 'Uji wawasan! Benar +100 poin, salah mundur.',
        color: '#3a86ff',
        bgColor: '#1d3557',
        textColor: '#caf0f8'
    },
    DARE: {
        id: 'dare',
        name: 'Tantangan Topeng (DARE)',
        icon: '🎭',
        desc: 'Tantangan kelas seru! Berhasil +70 poin.',
        color: '#e63946',
        bgColor: '#590d22',
        textColor: '#ffccd5'
    },
    SPECIAL_DICE: {
        id: 'special_dice',
        name: 'Dadu Emas Kerajaan',
        icon: '🎲',
        desc: 'Item taktis & kekuatan magis kerajaan.',
        color: '#ffb703',
        bgColor: '#7f4f24',
        textColor: '#fff3b0'
    },
    WEIRD_DICE: {
        id: 'weird_dice',
        name: 'Dadu Misteri Aneh',
        icon: '🌀',
        desc: 'Efek tak terduga yang mengubah jalannya laga!',
        color: '#9d4edd',
        bgColor: '#3c096c',
        textColor: '#e0aaff'
    },
    TREASURE: {
        id: 'treasure',
        name: 'Peti Harta Emas',
        icon: '💎',
        desc: 'Harta karun instan +150 poin!',
        color: '#2a9d8f',
        bgColor: '#143601',
        textColor: '#d8f3dc'
    },
    START: {
        id: 'start',
        name: 'Gerbang Berangkat',
        icon: '🚩',
        desc: 'Pintu keluar faksi ke arena kerajaan.',
        color: '#e76f51',
        bgColor: '#264653',
        textColor: '#ffffff'
    },
    THRONE: {
        id: 'throne',
        name: 'Tahta Besi Emas',
        icon: '👑',
        desc: 'Puncak kejayaan kerajaan! Ruler of the Realm.',
        color: '#ffd700',
        bgColor: '#3a2e39',
        textColor: '#fff3b0'
    }
};

class GameBoard {
    constructor() {
        this.track = [];
        this.finishLanes = [[], [], [], []];
        this.bases = [[], [], [], []];
        this.exitGates = [];
        this.throne = null;
        this.trackLength = 44; // 44 tiles track (agak lebih kecil dari 52 ludo standar)
        this.initGrid();
    }

    initGrid() {
        this.track = [];
        this.finishLanes = [[], [], [], []];
        this.bases = [[], [], [], []];
        this.exitGates = [];

        // 44 Tiles Castle Cross Loop:
        // Arm length 5 tiles + corner turns
        // 4 quadrants:
        // Team 0 (North Arm): Start at 0, Finish Entry at 43
        // Team 1 (East Arm): Start at 11, Finish Entry at 10
        // Team 2 (South Arm): Start at 22, Finish Entry at 21
        // Team 3 (West Arm): Start at 33, Finish Entry at 32
        const rawTrackCoords = [
            // Quadrant 0: North Arm (Team 0)
            { gx: -1, gy: -2 }, // 0: Start Team 0
            { gx: -1, gy: -3 }, // 1
            { gx: -1, gy: -4 }, // 2
            { gx: -1, gy: -5 }, // 3
            { gx: -1, gy: -6 }, // 4
            { gx: 0, gy: -6 },  // 5: Tip North
            { gx: 1, gy: -6 },  // 6
            { gx: 1, gy: -5 },  // 7
            { gx: 1, gy: -4 },  // 8
            { gx: 1, gy: -3 },  // 9
            { gx: 1, gy: -2 },  // 10: Finish Entry Team 1 (right before 11)

            // Quadrant 1: East Arm (Team 1)
            { gx: 2, gy: -1 },  // 11: Start Team 1
            { gx: 3, gy: -1 },  // 12
            { gx: 4, gy: -1 },  // 13
            { gx: 5, gy: -1 },  // 14
            { gx: 6, gy: -1 },  // 15
            { gx: 6, gy: 0 },   // 16: Tip East
            { gx: 6, gy: 1 },   // 17
            { gx: 5, gy: 1 },   // 18
            { gx: 4, gy: 1 },   // 19
            { gx: 3, gy: 1 },   // 20
            { gx: 2, gy: 1 },   // 21: Finish Entry Team 2 (right before 22)

            // Quadrant 2: South Arm (Team 2)
            { gx: 1, gy: 2 },   // 22: Start Team 2
            { gx: 1, gy: 3 },   // 23
            { gx: 1, gy: 4 },   // 24
            { gx: 1, gy: 5 },   // 25
            { gx: 1, gy: 6 },   // 26
            { gx: 0, gy: 6 },   // 27: Tip South
            { gx: -1, gy: 6 },  // 28
            { gx: -1, gy: 5 },  // 29
            { gx: -1, gy: 4 },  // 30
            { gx: -1, gy: 3 },  // 31
            { gx: -1, gy: 2 },  // 32: Finish Entry Team 3 (right before 33)

            // Quadrant 3: West Arm (Team 3)
            { gx: -2, gy: 1 },  // 33: Start Team 3
            { gx: -3, gy: 1 },  // 34
            { gx: -4, gy: 1 },  // 35
            { gx: -5, gy: 1 },  // 36
            { gx: -6, gy: 1 },  // 37
            { gx: -6, gy: 0 },  // 38: Tip West
            { gx: -6, gy: -1 }, // 39
            { gx: -5, gy: -1 }, // 40
            { gx: -4, gy: -1 }, // 41
            { gx: -3, gy: -1 }, // 42
            { gx: -2, gy: -1 }  // 43: Finish Entry Team 0 (right before 0)
        ];

        for (let i = 0; i < 44; i++) {
            this.track.push({
                index: i,
                gx: rawTrackCoords[i].gx,
                gy: rawTrackCoords[i].gy,
                gz: 0,
                type: TILE_TYPES.BLANK,
                teamStart: null
            });
        }

        // Set 4 Start Tiles
        const startIndices = [0, 11, 22, 33];
        startIndices.forEach((idx, team) => {
            this.track[idx].type = TILE_TYPES.START;
            this.track[idx].teamStart = team;
        });

        // 4 Corner Bases (4 pawn slots each, pawn spread 0.7, platform gz 0.4, pawn gz 0.55)
        // Team 0 Base (Atas - Hijau): gx: -4.4, gy: -4.4
        // Team 1 Base (Kanan - Merah): gx: 4.3, gy: -4.3
        // Team 2 Base (Bawah - Kuning): gx: 4.4, gy: 4.4
        // Team 3 Base (Kiri - Biru): gx: -4.3, gy: 4.3
        const baseConfigs = [
            // Team 0 Base (Atas - Hijau)
            [
                { gx: -4.9, gy: -4.9, gz: 0.55 },
                { gx: -3.9, gy: -4.9, gz: 0.55 },
                { gx: -4.9, gy: -3.9, gz: 0.55 },
                { gx: -3.9, gy: -3.9, gz: 0.55 }
            ],
            // Team 1 Base (Kanan - Merah)
            [
                { gx: 3.8, gy: -4.8, gz: 0.55 },
                { gx: 4.8, gy: -4.8, gz: 0.55 },
                { gx: 3.8, gy: -3.8, gz: 0.55 },
                { gx: 4.8, gy: -3.8, gz: 0.55 }
            ],
            // Team 2 Base (Bawah - Kuning)
            [
                { gx: 3.9, gy: 3.9, gz: 0.55 },
                { gx: 4.9, gy: 3.9, gz: 0.55 },
                { gx: 3.9, gy: 4.9, gz: 0.55 },
                { gx: 4.9, gy: 4.9, gz: 0.55 }
            ],
            // Team 3 Base (Kiri - Biru)
            [
                { gx: -4.8, gy: 3.8, gz: 0.55 },
                { gx: -3.8, gy: 3.8, gz: 0.55 },
                { gx: -4.8, gy: 4.8, gz: 0.55 },
                { gx: -3.8, gy: 4.8, gz: 0.55 }
            ]
        ];

        for (let t = 0; t < 4; t++) {
            this.bases[t] = baseConfigs[t];
        }

        // 4 Exit Gates (Platform Pintu Keluar di luar jalur sejajar dengan base masing-masing)
        // Team 0: NW (-2, -2) -> Start 0 at (-1, -2)
        // Team 1: NE (2, -2) -> Start 11 at (2, -1)
        // Team 2: SE (2, 2) -> Start 22 at (1, 2)
        // Team 3: SW (-2, 2) -> Start 33 at (-2, 1)
        this.exitGates = [
            { team: 0, gx: -2, gy: -2, gz: 0, name: 'Pintu Keluar Tim 1' },
            { team: 1, gx: 2, gy: -2, gz: 0, name: 'Pintu Keluar Tim 2' },
            { team: 2, gx: 2, gy: 2, gz: 0, name: 'Pintu Keluar Tim 3' },
            { team: 3, gx: -2, gy: 2, gz: 0, name: 'Pintu Keluar Tim 4' }
        ];

        // 4 Finish Lanes (5 stepped tiles heading inward to the Central Throne)
        // Each lane enters from the middle of its corresponding arm
        const laneCoords = [
            // Team 0 (North finish lane, coming down y = -5 to -1, gx = 0 towards center)
            [
                { gx: 0, gy: -5, gz: 0.25 },
                { gx: 0, gy: -4, gz: 0.50 },
                { gx: 0, gy: -3, gz: 0.75 },
                { gx: 0, gy: -2, gz: 1.00 },
                { gx: 0, gy: -1, gz: 1.25 }
            ],
            // Team 1 (East finish lane, coming left x = 5 to 1, gy = 0 towards center)
            [
                { gx: 5, gy: 0, gz: 0.25 },
                { gx: 4, gy: 0, gz: 0.50 },
                { gx: 3, gy: 0, gz: 0.75 },
                { gx: 2, gy: 0, gz: 1.00 },
                { gx: 1, gy: 0, gz: 1.25 }
            ],
            // Team 2 (South finish lane, coming up y = 5 to 1, gx = 0 towards center)
            [
                { gx: 0, gy: 5, gz: 0.25 },
                { gx: 0, gy: 4, gz: 0.50 },
                { gx: 0, gy: 3, gz: 0.75 },
                { gx: 0, gy: 2, gz: 1.00 },
                { gx: 0, gy: 1, gz: 1.25 }
            ],
            // Team 3 (West finish lane, coming right x = -5 to -1, gy = 0 towards center)
            [
                { gx: -5, gy: 0, gz: 0.25 },
                { gx: -4, gy: 0, gz: 0.50 },
                { gx: -3, gy: 0, gz: 0.75 },
                { gx: -2, gy: 0, gz: 1.00 },
                { gx: -1, gy: 0, gz: 1.25 }
            ]
        ];

        for (let t = 0; t < 4; t++) {
            this.finishLanes[t] = laneCoords[t].map((coord, step) => ({
                step: step + 1,
                team: t,
                gx: coord.gx,
                gy: coord.gy,
                gz: coord.gz,
                type: TILE_TYPES.BLANK
            }));
        }

        // Center Throne
        this.throne = {
            gx: 0,
            gy: 0,
            gz: 1.6,
            type: TILE_TYPES.THRONE
        };

        this.randomizeSpecialTiles();
    }

    randomizeSpecialTiles() {
        const specialPool = [
            TILE_TYPES.TRUTH,
            TILE_TYPES.TRUTH,
            TILE_TYPES.TRUTH,
            TILE_TYPES.TRUTH,
            TILE_TYPES.TRUTH,
            TILE_TYPES.DARE,
            TILE_TYPES.DARE,
            TILE_TYPES.DARE,
            TILE_TYPES.DARE,
            TILE_TYPES.SPECIAL_DICE,
            TILE_TYPES.SPECIAL_DICE,
            TILE_TYPES.WEIRD_DICE,
            TILE_TYPES.WEIRD_DICE,
            TILE_TYPES.TREASURE,
            TILE_TYPES.TREASURE,
            TILE_TYPES.BLANK,
            TILE_TYPES.BLANK,
            TILE_TYPES.BLANK,
            TILE_TYPES.BLANK
        ];

        const shuffle = arr => arr.sort(() => Math.random() - 0.5);
        let shuffled = shuffle([...specialPool]);

        let poolIdx = 0;
        for (let i = 0; i < 44; i++) {
            if (this.track[i].teamStart !== null) {
                continue;
            }
            if (poolIdx >= shuffled.length) {
                shuffled = shuffle([...specialPool]);
                poolIdx = 0;
            }
            this.track[i].type = shuffled[poolIdx++];
        }
    }

    // Team start tile index on outer track
    getTeamStartIndex(team) {
        const starts = [0, 11, 22, 33];
        return starts[team];
    }

    // Team finish entry tile index: TEPAT SEBELUM TITIK KELUAR BASE MEREKA MASING-MASING!
    getTeamFinishEntryIndex(team) {
        // Team 0 starts at 0 -> finish entry is 43 (tepat sebelum 0)
        // Team 1 starts at 11 -> finish entry is 10 (tepat sebelum 11)
        // Team 2 starts at 22 -> finish entry is 21 (tepat sebelum 22)
        // Team 3 starts at 33 -> finish entry is 32 (tepat sebelum 33)
        const entries = [43, 10, 21, 32];
        return entries[team];
    }

    // Hitung jalur gerak pion:
    // Pion WAJIB memutari papan 1 kali (traveled >= 43) sebelum diizinkan belok ke Finish Lane!
    calculatePath(pawn, roll) {
        const path = [];
        const team = pawn.team;
        const startIdx = this.getTeamStartIndex(team);
        const finishEntryIdx = this.getTeamFinishEntryIndex(team);

        // 1. Pion di Base: Meluncur keluar ke Platform Pintu Keluar (Hanya jika dadu 6, stay di pintu keluar)
        if (pawn.state === 'base') {
            if (roll !== 6) return []; // Wajib dadu 6 untuk keluar base!
            const gate = this.exitGates[team];
            path.push({
                gx: gate.gx,
                gy: gate.gy,
                gz: gate.gz,
                tile: gate,
                targetState: 'gate',
                trackIndex: -1,
                tilesTraveled: 0
            });
            return path;
        }

        // 2. Pion di Pintu Keluar: Masuk ke Start Tile dan melangkah sejumlah angka dadu (Roll Kedua / Selanjutnya)
        if (pawn.state === 'gate') {
            for (let step = 1; step <= roll; step++) {
                const curIdx = (startIdx + (step - 1)) % 44;
                const traveled = step - 1;
                const t = this.track[curIdx];
                path.push({
                    gx: t.gx,
                    gy: t.gy,
                    gz: t.gz,
                    tile: t,
                    targetState: 'track',
                    trackIndex: curIdx,
                    tilesTraveled: traveled
                });
            }
            return path;
        }

        // 3. Pion di Outer Track
        if (pawn.state === 'track') {
            let curIdx = pawn.trackIndex;
            let traveled = pawn.tilesTraveled;

            for (let step = 1; step <= roll; step++) {
                // Periksa apakah pion berada di petak tepat sebelum keluar base (finishEntryIdx)
                // DAN sudah memutari 1 putaran penuh (traveled >= 35 petak)!
                if (curIdx === finishEntryIdx && traveled >= 35) {
                    // Masuk ke jalur finish tim!
                    const remainingSteps = roll - step;
                    for (let l = 0; l <= remainingSteps; l++) {
                        if (l < 5) {
                            const laneTile = this.finishLanes[team][l];
                            path.push({
                                gx: laneTile.gx,
                                gy: laneTile.gy,
                                gz: laneTile.gz,
                                tile: laneTile,
                                targetState: 'lane',
                                laneStep: l + 1,
                                tilesTraveled: traveled + 1 + l
                            });
                        } else {
                            // Mencapai Tahta Besi Emas di pusat!
                            path.push({
                                gx: this.throne.gx,
                                gy: this.throne.gy,
                                gz: this.throne.gz,
                                tile: this.throne,
                                targetState: 'throne',
                                isThrone: true,
                                tilesTraveled: traveled + 6
                            });
                            return path;
                        }
                    }
                    return path;
                }

                // Langkah normal di jalur luar
                curIdx = (curIdx + 1) % 44;
                traveled++;
                const t = this.track[curIdx];
                path.push({
                    gx: t.gx,
                    gy: t.gy,
                    gz: t.gz,
                    tile: t,
                    targetState: 'track',
                    trackIndex: curIdx,
                    tilesTraveled: traveled
                });
            }
            return path;
        }

        // 4. Pion sudah berada di Finish Lane
        if (pawn.state === 'lane') {
            let curStep = pawn.laneStep; // 1 s/d 5
            for (let step = 1; step <= roll; step++) {
                curStep++;
                if (curStep <= 5) {
                    const laneTile = this.finishLanes[team][curStep - 1];
                    path.push({
                        gx: laneTile.gx,
                        gy: laneTile.gy,
                        gz: laneTile.gz,
                        tile: laneTile,
                        targetState: 'lane',
                        laneStep: curStep,
                        tilesTraveled: pawn.tilesTraveled + step
                    });
                } else {
                    // Tahta Pusat tercapai!
                    path.push({
                        gx: this.throne.gx,
                        gy: this.throne.gy,
                        gz: this.throne.gz,
                        tile: this.throne,
                        targetState: 'throne',
                        isThrone: true,
                        tilesTraveled: pawn.tilesTraveled + step
                    });
                    return path;
                }
            }
            return path;
        }

        return path;
    }
}

window.GameBoard = GameBoard;
window.TILE_TYPES = TILE_TYPES;
