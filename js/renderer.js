/**
 * PENAKHLUKAN KERAJAAN - Canvas 3D Isometric Low-Poly Renderer
 * High-performance 60FPS procedural rendering of the medieval realm,
 * characters, the Golden Iron Throne, animations, and particle effects.
 */

// ==========================================
// 1. ASSET LOADER SYSTEM (PRELOADER)
// ==========================================
const ENV_ASSET_PATHS = {
    // Base/Tanah
    'patch-grass': 'assets/env/patch-grass.png',
    'patch-dirt': 'assets/env/patch-dirt.png',
    'platform': 'assets/env/platform.png',
    // Alam/Foliage
    'tree': 'assets/env/tree.png',
    'tree-high': 'assets/env/tree-high.png',
    'plant': 'assets/env/plant.png',
    // Bebatuan
    'rocks-high': 'assets/env/rocks-high.png',
    'rocks-low': 'assets/env/rocks-low.png',
    'rocks-ramp': 'assets/env/rocks-ramp.png',
    'stones': 'assets/env/stones.png',
    // Properti & Bangunan Menara
    'tent': 'assets/env/tent.png',
    'bridge': 'assets/env/bridge.png',
    'flag': 'assets/env/flag.png',
    'building-structure': 'assets/env/building-structure.png',
    'building-platform': 'assets/env/building-platform.png',
    'building-roof': 'assets/env/building-roof.png',
    'ladder': 'assets/env/ladder.png',
    // 3D Isometric Center Throne (The Champion's Chair / Piala Tahta)
    'center-chair': 'assets/tiles/center-chair.png',
    'center-cup': 'assets/tiles/center-chair.png',
    'center_chair': 'assets/tiles/center-chair.png',
    'center_cup': 'assets/tiles/center-chair.png',
    // 3D Isometric Board Tiles (Jalur Papan Ludo 3D)
    'tile_normal': 'assets/tiles/tile_normal.png',
    'tile_special': 'assets/tiles/tile_special.png',
    'tile_weird': 'assets/tiles/tile_weird.png',
    'tile_truth': 'assets/tiles/tile_truth.png',
    'tile_dare': 'assets/tiles/tile_dare.png',
    // Aliases nama hyphen
    'tile-normal': 'assets/tiles/tile-normal.png',
    'tile-special': 'assets/tiles/tile-special.png',
    'tile-weird': 'assets/tiles/tile-weird.png',
    'tile-truth': 'assets/tiles/tile-truth.png',
    'tile-dare': 'assets/tiles/tile-dare.png',
    // 3D Faction Entrance & Ended Tiles (Pintu Keluar & Jalur Menuju Tahta 4 Tim)
    'tile-entrance-red': 'assets/tiles/tile-entrance-red.png',
    'tile-entrance-blue': 'assets/tiles/tile-entrance-blue.png',
    'tile-entrance-green': 'assets/tiles/tile-entrance-green.png',
    'tile-entrance-yellow': 'assets/tiles/tile-entrance-yellow.png',
    'tile-ended-red': 'assets/tiles/tile-ended-red.png',
    'tile-ended-blue': 'assets/tiles/tile-ended-blue.png',
    'tile-ended-green': 'assets/tiles/tile-ended-green.png',
    'tile-ended-yellow': 'assets/tiles/tile-ended-yellow.png',
    // Aliases nama 'tile-ende-' (tanpa 'd')
    'tile-ende-red': 'assets/tiles/tile-ended-red.png',
    'tile-ende-blue': 'assets/tiles/tile-ended-blue.png',
    'tile-ende-green': 'assets/tiles/tile-ended-green.png',
    'tile-ende-yellow': 'assets/tiles/tile-ended-yellow.png',
    // Aliases underscore
    'tile_entrance_red': 'assets/tiles/tile-entrance-red.png',
    'tile_entrance_blue': 'assets/tiles/tile-entrance-blue.png',
    'tile_entrance_green': 'assets/tiles/tile-entrance-green.png',
    'tile_entrance_yellow': 'assets/tiles/tile-entrance-yellow.png',
    'tile_ended_red': 'assets/tiles/tile-ended-red.png',
    'tile_ended_blue': 'assets/tiles/tile-ended-blue.png',
    'tile_ended_green': 'assets/tiles/tile-ended-green.png',
    'tile_ended_yellow': 'assets/tiles/tile-ended-yellow.png',
    'tile_ende_red': 'assets/tiles/tile-ended-red.png',
    'tile_ende_blue': 'assets/tiles/tile-ended-blue.png',
    'tile_ende_green': 'assets/tiles/tile-ended-green.png',
    'tile_ende_yellow': 'assets/tiles/tile-ended-yellow.png',
    // 24 Variasi 3D Base Platform Faksi & Warna
    'base-dragon-green': 'assets/base/base-dragon-green.png',
    'base-dragon-red': 'assets/base/base-dragon-red.png',
    'base-dragon-yellow': 'assets/base/base-dragon-yellow.png',
    'base-dragon-blue': 'assets/base/base-dragon-blue.png',
    'base-citadel-green': 'assets/base/base-citadel-green.png',
    'base-citadel-red': 'assets/base/base-citadel-red.png',
    'base-citadel-yellow': 'assets/base/base-citadel-yellow.png',
    'base-citadel-blue': 'assets/base/base-citadel-blue.png',
    'base-elf-green': 'assets/base/base-elf-green.png',
    'base-elf-red': 'assets/base/base-elf-red.png',
    'base-elf-yellow': 'assets/base/base-elf-yellow.png',
    'base-elf-blue': 'assets/base/base-elf-blue.png',
    'base-crown-green': 'assets/base/base-crown-green.png',
    'base-crown-red': 'assets/base/base-crown-red.png',
    'base-crown-yellow': 'assets/base/base-crown-yellow.png',
    'base-crown-blue': 'assets/base/base-crown-blue.png',
    'base-wolf-green': 'assets/base/base-wolf-green.png',
    'base-wolf-red': 'assets/base/base-wolf-red.png',
    'base-wolf-yellow': 'assets/base/base-wolf-yellow.png',
    'base-wolf-blue': 'assets/base/base-wolf-blue.png',
    'base-arcane-green': 'assets/base/base-arcane-green.png',
    'base-arcane-red': 'assets/base/base-arcane-red.png',
    'base-arcane-yellow': 'assets/base/base-arcane-yellow.png',
    'base-arcane-blue': 'assets/base/base-arcane-blue.png',
    // 3D Miniature Character Pawns (24 Variasi: 6 Faksi x 4 Warna)
    'pawn-dragon-green': 'assets/pawns/pawn-dragon-green.png',
    'pawn-dragon-red': 'assets/pawns/pawn-dragon-red.png',
    'pawn-dragon-yellow': 'assets/pawns/pawn-dragon-yellow.png',
    'pawn-dragon-blue': 'assets/pawns/pawn-dragon-blue.png',
    'pawn-citadel-green': 'assets/pawns/pawn-citadel-green.png',
    'pawn-citadel-red': 'assets/pawns/pawn-citadel-red.png',
    'pawn-citadel-yellow': 'assets/pawns/pawn-citadel-yellow.png',
    'pawn-citadel-blue': 'assets/pawns/pawn-citadel-blue.png',
    'pawn-elf-green': 'assets/pawns/pawn-elf-green.png',
    'pawn-elf-red': 'assets/pawns/pawn-elf-red.png',
    'pawn-elf-yellow': 'assets/pawns/pawn-elf-yellow.png',
    'pawn-elf-blue': 'assets/pawns/pawn-elf-blue.png',
    'pawn-crown-green': 'assets/pawns/pawn-crown-green.png',
    'pawn-crown-red': 'assets/pawns/pawn-crown-red.png',
    'pawn-crown-yellow': 'assets/pawns/pawn-crown-yellow.png',
    'pawn-crown-blue': 'assets/pawns/pawn-crown-blue.png',
    'pawn-wolf-green': 'assets/pawns/pawn-wolf-green.png',
    'pawn-wolf-red': 'assets/pawns/pawn-wolf-red.png',
    'pawn-wolf-yellow': 'assets/pawns/pawn-wolf-yellow.png',
    'pawn-wolf-blue': 'assets/pawns/pawn-wolf-blue.png',
    'pawn-arcane-green': 'assets/pawns/pawn-arcane-green.png',
    'pawn-arcane-red': 'assets/pawns/pawn-arcane-red.png',
    'pawn-arcane-yellow': 'assets/pawns/pawn-arcane-yellow.png',
    'pawn-arcane-blue': 'assets/pawns/pawn-arcane-blue.png'
};

// ==========================================
// KONFIGURASI ISOMETRIC TILE 3D (ANCHOR & OFFSET)
// ==========================================
// Konstanta ukuran & pergeseran anchor balok petak isometris.
// Ubah nilai di bawah ini untuk mengatur ukuran dan pergeseran susunan balok:
const TILE_WIDTH = 88;    // Lebar gambar petak (px) - Default 88px (menghasilkan lebar diamond 76px sesuai grid papan ludo)
const TILE_HEIGHT = 55;   // Tinggi gambar petak (px) - Default 55px (menghasilkan tinggi diamond 38px sesuai grid papan ludo)
const OFFSET_X = 0;       // Geser horizontal (px)
const OFFSET_Y = 0;       // Geser vertikal (px) - sesuaikan jika susunan balok renggang/tumpang tindih

window.TILE_WIDTH = TILE_WIDTH;
window.TILE_HEIGHT = TILE_HEIGHT;
window.OFFSET_X = OFFSET_X;
window.OFFSET_Y = OFFSET_Y;

// ==========================================
// KONFIGURASI 3D BASE PLATFORM (ANCHOR & OFFSET)
// ==========================================
// Variabel offset manual per sudut agar posisi base dan pion dapat di-fine-tune:
const BASE_OFFSETS = {
    top: { x: 0, y: 0 },
    right: { x: -25, y: 0 },
    bottom: { x: 0, y: 0 },
    left: { x: 22, y: 0 }
};
const BASE_SCALE = 0.55; // Skala rendering base platform (512x382 native)
const BASE_ELEVATION_GZ = 0.4; // Ketinggian elevasi Base Platform
const PAWN_SPREAD = 0.7; // Sebaran pion di dalam platform base

window.BASE_OFFSETS = BASE_OFFSETS;
window.BASE_SCALE = BASE_SCALE;
window.BASE_ELEVATION_GZ = BASE_ELEVATION_GZ;
window.PAWN_SPREAD = PAWN_SPREAD;

// ==========================================
// KONFIGURASI 3D MINIATURE PAWN KARAKTER
// ==========================================
// Dimensi native aset gambar pion: 160 x 200 px (dudukan bulat berada di baris y = 149)
const PAWN_SCALE = 0.30;         // Skala render miniatur pion 3D (~56x70px proporsional terhadap tile 88px)
const PAWN_ANCHOR_X = 0.50;      // Titik jangkar tengah horizontal (50% dari lebar 160px = 80px)
const PAWN_ANCHOR_Y = 0.951;     // Titik jangkar dasar dudukan bulat (149 / 200 = 74.5%)
const PAWN_OFFSET_X = 0;         // Fine-tune manual offset X pion
const PAWN_OFFSET_Y = -1;         // Fine-tune manual offset Y pion
const PAWN_IDLE_AMPLITUDE = 2; // Amplitudo naik-turun animasi idle tim aktif (pixel)

window.PAWN_SCALE = PAWN_SCALE;
window.PAWN_ANCHOR_X = PAWN_ANCHOR_X;
window.PAWN_ANCHOR_Y = PAWN_ANCHOR_Y;
window.PAWN_OFFSET_X = PAWN_OFFSET_X;
window.PAWN_OFFSET_Y = PAWN_OFFSET_Y;
window.PAWN_IDLE_AMPLITUDE = PAWN_IDLE_AMPLITUDE;

// ==========================================
// KONFIGURASI 3D CENTER THRONE (THE CHAMPION'S CHAIR)
// ==========================================
const THRONE_SCALE = 0.45;          // Skala rendering The Champion's Chair (250x250 native, proporsional tile 76x38)
const THRONE_ANCHOR_X = 0.532;       // Titik tengah horizontal pedestal (133/250 = 53.2%)
const THRONE_ANCHOR_Y = 0.984;       // Titik dasar dudukan pedestal di lantai (246/250 = 98.4%)
const THRONE_OFFSET_X = 0;          // Fine-tune manual offset X (px)
const THRONE_OFFSET_Y = 0;          // Fine-tune manual offset Y (px)
const THRONE_ELEVATION_GZ = 1.25;   // Elevasi tahta di pusat (sejajar ujung 4 jalur finish)

window.THRONE_SCALE = THRONE_SCALE;
window.THRONE_ANCHOR_X = THRONE_ANCHOR_X;
window.THRONE_ANCHOR_Y = THRONE_ANCHOR_Y;
window.THRONE_OFFSET_X = THRONE_OFFSET_X;
window.THRONE_OFFSET_Y = THRONE_OFFSET_Y;
window.THRONE_ELEVATION_GZ = THRONE_ELEVATION_GZ;

function loadEnvironmentAssets() {
    const assets = {};
    const promises = Object.entries(ENV_ASSET_PATHS).map(([key, src]) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                assets[key] = img;
                resolve(img);
            };
            img.onerror = (err) => {
                console.warn(`[AssetLoader] Gagal memuat aset lingkungan: ${src}`, err);
                resolve(null);
            };
            img.src = src;
        });
    });
    return Promise.all(promises).then(() => assets);
}
window.loadEnvironmentAssets = loadEnvironmentAssets;

class IsometricRenderer {
    constructor(canvas, board) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.board = board;

        // Isometric tile dimensions
        this.tileW = 76;
        this.tileH = 38;
        this.tileZ = 24;

        // Camera, Zoom & Pan system
        this.originX = 0;
        this.originY = 0;
        this.baseZoom = 1.0;
        this.userZoom = 1.0;
        this.zoom = 1.0;
        this.targetZoom = 1.0;

        this.panX = 0;
        this.panY = 0;
        this.targetPanX = 0;
        this.targetPanY = 0;

        // Offscreen island buffer tracking for zoom & pan
        this.offscreenZoom = 1.0;
        this.offscreenOriginX = 0;
        this.offscreenOriginY = 0;
        this.offscreenPanX = 0;
        this.offscreenPanY = 0;
        this.offscreenDirty = false;

        // Animated particles & floaters
        this.particles = [];
        this.floatingTexts = [];

        // Animation clock
        this.time = 0;
        this.lastTimestamp = performance.now();

        // Active highlighted tile or pawn
        this.highlightTile = null;

        // 4. OPTIMASI OFFSCREEN CANVAS (UNTUK PERFORMA SMART TV 60 FPS)
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.envAssets = null;
        this.tileAssets = null;
        this.islandData = null;

        // Konfigurasi ukuran tile 3D & offset (bisa diubah dari instance)
        this.TILE_WIDTH = TILE_WIDTH;
        this.TILE_HEIGHT = TILE_HEIGHT;
        this.OFFSET_X = OFFSET_X;
        this.OFFSET_Y = OFFSET_Y;

        // Konfigurasi 3D Center Throne (The Champion's Chair)
        this.THRONE_SCALE = THRONE_SCALE;
        this.THRONE_ANCHOR_X = THRONE_ANCHOR_X;
        this.THRONE_ANCHOR_Y = THRONE_ANCHOR_Y;
        this.THRONE_OFFSET_X = THRONE_OFFSET_X;
        this.THRONE_OFFSET_Y = THRONE_OFFSET_Y;
        this.THRONE_ELEVATION_GZ = THRONE_ELEVATION_GZ;

        // Muat kalibrasi tahta dari localStorage jika ada
        try {
            if (typeof localStorage !== 'undefined') {
                const savedThrone = localStorage.getItem('penakhlukan_throne_config');
                if (savedThrone) {
                    const cfg = JSON.parse(savedThrone);
                    if (cfg.scale !== undefined) this.THRONE_SCALE = parseFloat(cfg.scale);
                    if (cfg.anchorX !== undefined) this.THRONE_ANCHOR_X = parseFloat(cfg.anchorX);
                    if (cfg.anchorY !== undefined) this.THRONE_ANCHOR_Y = parseFloat(cfg.anchorY);
                    if (cfg.offsetX !== undefined) this.THRONE_OFFSET_X = parseFloat(cfg.offsetX);
                    if (cfg.offsetY !== undefined) this.THRONE_OFFSET_Y = parseFloat(cfg.offsetY);
                    if (cfg.elevationGZ !== undefined) this.THRONE_ELEVATION_GZ = parseFloat(cfg.elevationGZ);
                }
            }
        } catch (e) {
            console.warn('[IsometricRenderer] Gagal memuat kalibrasi tahta dari localStorage:', e);
        }

        // Awan bergerak tipis-tipis di langit
        this.clouds = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    initClouds() {
        this.clouds = [];
        const cloudCount = 11;
        const width = this.width || 1200;
        const height = this.height || 800;

        for (let i = 0; i < cloudCount; i++) {
            const isFore = i >= 8; // 3 awan kabut tipis di depan tebing pulau
            this.clouds.push({
                x: (i / cloudCount) * (width + 360) - 180 + (Math.random() - 0.5) * 80,
                y: isFore ? (height * 0.70 + Math.random() * (height * 0.22)) : (height * 0.06 + Math.random() * (height * 0.58)),
                w: isFore ? (200 + Math.random() * 150) : (140 + Math.random() * 140),
                h: 28 + Math.random() * 26,
                speed: (isFore ? 10 : 8) + Math.random() * 14,
                opacity: isFore ? (0.16 + Math.random() * 0.12) : (0.22 + Math.random() * 0.16),
                bobSpeed: 0.8 + Math.random() * 0.7,
                bobAmp: 3 + Math.random() * 5,
                phase: Math.random() * Math.PI * 2,
                isFore: isFore,
                lobes: [
                    { ox: -0.36, oy: 0.08, r: 0.32 },
                    { ox: -0.16, oy: -0.14, r: 0.44 },
                    { ox: 0.08, oy: -0.12, r: 0.40 },
                    { ox: 0.30, oy: 0.06, r: 0.34 },
                    { ox: 0.0, oy: 0.10, r: 0.30 }
                ]
            });
        }
    }

    updateAndDrawClouds(ctx, dt, isForegroundOnly = false) {
        if (!this.clouds || this.clouds.length === 0) return;

        this.clouds.forEach(cloud => {
            if (!isForegroundOnly) {
                // Update posisi awan saat pass background
                cloud.x += cloud.speed * dt;
                if (cloud.x > this.width + 220) {
                    cloud.x = -220 - cloud.w;
                    cloud.y = cloud.isFore ? (this.height * 0.70 + Math.random() * (this.height * 0.22)) : (this.height * 0.06 + Math.random() * (this.height * 0.58));
                }
            }

            // Filter pass background vs foreground
            if (isForegroundOnly && !cloud.isFore) return;
            if (!isForegroundOnly && cloud.isFore) return;

            const bobY = Math.sin(this.time * cloud.bobSpeed + cloud.phase) * cloud.bobAmp;

            ctx.save();
            ctx.translate(cloud.x, cloud.y + bobY);

            // Gradasi lembut pada awan: putih terang di atas, biru lembut di bawah
            const grad = ctx.createLinearGradient(0, -cloud.h * 0.7, 0, cloud.h * 0.7);
            grad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 1.3})`);
            grad.addColorStop(0.65, `rgba(240, 249, 255, ${cloud.opacity})`);
            grad.addColorStop(1, `rgba(186, 230, 253, ${cloud.opacity * 0.45})`);
            ctx.fillStyle = grad;

            ctx.beginPath();
            cloud.lobes.forEach(l => {
                const lx = l.ox * cloud.w;
                const ly = l.oy * cloud.h;
                const lr = l.r * cloud.w;
                ctx.moveTo(lx + lr, ly);
                ctx.arc(lx, ly, lr, 0, Math.PI * 2);
            });
            ctx.fill();

            ctx.restore();
        });
    }

    renderSkyBackground(dt) {
        const ctx = this.ctx;

        // 1. Warna Biru Langit Gradasi (Vibrant Kingdom Azure to Golden Horizon)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, '#12478a');     // Biru langit agung di atas
        skyGrad.addColorStop(0.26, '#1d6fd1');  // Biru cerah dinamis
        skyGrad.addColorStop(0.56, '#38bdf8');  // Azure jernih kerajaan
        skyGrad.addColorStop(0.82, '#93c5fd');  // Kabut atmosferik pegunungan
        skyGrad.addColorStop(1.0, '#e0f2fe');   // Pendar cahaya keemasan ufuk timur

        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. Metrik Langit Abstract (Sinar Geometris & Kilau Magis Kerajaan)
        ctx.save();
        const sunX = this.originX * 0.85;
        const sunY = -40;
        const rayCount = 14;
        const maxLen = Math.max(this.width, this.height) * 1.5;

        for (let i = 0; i < rayCount; i++) {
            const baseAngle = (i / rayCount) * Math.PI + Math.sin(this.time * 0.05 + i) * 0.015;
            const raySpread = 0.05 + (i % 2 === 0 ? 0.025 : 0.0);
            ctx.beginPath();
            ctx.moveTo(sunX, sunY);
            ctx.lineTo(sunX + Math.cos(baseAngle - raySpread) * maxLen, sunY + Math.sin(baseAngle - raySpread) * maxLen);
            ctx.lineTo(sunX + Math.cos(baseAngle + raySpread) * maxLen, sunY + Math.sin(baseAngle + raySpread) * maxLen);
            ctx.closePath();
            ctx.fillStyle = (i % 2 === 0) ? 'rgba(255, 255, 255, 0.045)' : 'rgba(254, 240, 138, 0.035)';
            ctx.fill();
        }

        // Cincin metrik geometris angkasa (Celestial Halos)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 260, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sunX, sunY, 460, 0, Math.PI * 2);
        ctx.stroke();

        // Kilauan debu magis melayang di udara (Airborne Kingdom Sparkles)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        for (let i = 0; i < 20; i++) {
            const sparkX = (Math.sin(i * 47.3 + this.time * 0.12) * 0.5 + 0.5) * this.width;
            const sparkY = ((Math.cos(i * 83.1 + this.time * 0.08) * 0.5 + 0.5) * (this.height * 0.65));
            const sparkSize = (Math.sin(this.time * 2.5 + i) * 0.5 + 0.5) * 2.5 + 1.2;
            ctx.beginPath();
            ctx.moveTo(sparkX, sparkY - sparkSize);
            ctx.lineTo(sparkX + sparkSize, sparkY);
            ctx.lineTo(sparkX, sparkY + sparkSize);
            ctx.lineTo(sparkX - sparkSize, sparkY);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // 3. Awan yang Bergerak Tipis-tipis di Latar Belakang
        this.updateAndDrawClouds(ctx, dt, false);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width || window.innerWidth;
        this.height = rect.height || (window.innerHeight - 100);

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        // Center origin with room for HUD and dice panel
        this.originX = this.width / 2;
        this.originY = this.height / 2 + 30;

        // Responsive base zoom level
        if (this.width < 600) {
            this.baseZoom = 0.52;
            this.originY = this.height / 2;
        } else if (this.width < 900) {
            this.baseZoom = 0.68;
            this.originY = this.height / 2;
        } else if (this.width < 1400) {
            this.baseZoom = 0.82;
            this.originY = this.height / 2;
        } else {
            this.baseZoom = 0.94;
            this.originY = this.height / 2;
        }
        this.targetZoom = this.baseZoom * this.userZoom;
        this.zoom = this.targetZoom;

        // Inisialisasi sebaran awan sesuai resolusi
        this.initClouds();

        // Perbarui offscreen canvas saat ukuran layar berubah
        if (this.islandData && this.envAssets) {
            this.renderOffscreenIsland();
        }
    }

    // Navigasi Peta (Zoom In / Out & Pan)
    zoomIn() {
        this.userZoom = Math.min(2.5, Math.round((this.userZoom + 0.25) * 100) / 100);
        this.targetZoom = this.baseZoom * this.userZoom;
        this.offscreenDirty = true;
    }

    zoomOut() {
        this.userZoom = Math.max(0.5, Math.round((this.userZoom - 0.25) * 100) / 100);
        this.targetZoom = this.baseZoom * this.userZoom;
        this.offscreenDirty = true;
    }

    setZoomDelta(delta) {
        this.userZoom = Math.max(0.5, Math.min(2.5, Math.round((this.userZoom + delta) * 100) / 100));
        this.targetZoom = this.baseZoom * this.userZoom;
        this.offscreenDirty = true;
    }

    resetView() {
        this.userZoom = 1.0;
        this.targetZoom = this.baseZoom;
        this.targetPanX = 0;
        this.targetPanY = 0;
        this.offscreenDirty = true;
    }

    panBy(dx, dy) {
        const maxPanX = Math.max(350, (this.width * 0.9) * (this.zoom / (this.baseZoom || 1)));
        const maxPanY = Math.max(280, (this.height * 0.8) * (this.zoom / (this.baseZoom || 1)));

        this.targetPanX = Math.max(-maxPanX, Math.min(maxPanX, this.targetPanX + dx));
        this.targetPanY = Math.max(-maxPanY, Math.min(maxPanY, this.targetPanY + dy));
        this.offscreenDirty = true;
    }

    setEnvironmentAssets(assets) {
        this.envAssets = assets;
        this.tileAssets = {};
        const colors = ['red', 'blue', 'green', 'yellow'];
        ['normal', 'special', 'weird', 'truth', 'dare'].forEach(k => {
            const img = assets[`tile-${k}`] || assets[`tile_${k}`];
            if (img) {
                this.tileAssets[`tile-${k}`] = img;
                this.tileAssets[`tile_${k}`] = img;
            }
        });
        colors.forEach(c => {
            const entImg = assets[`tile-entrance-${c}`] || assets[`tile_entrance_${c}`];
            if (entImg) {
                this.tileAssets[`tile-entrance-${c}`] = entImg;
                this.tileAssets[`tile_entrance_${c}`] = entImg;
            }
            const endImg = assets[`tile-ended-${c}`] || assets[`tile_ended_${c}`] || assets[`tile-ende-${c}`] || assets[`tile_ende_${c}`];
            if (endImg) {
                this.tileAssets[`tile-ended-${c}`] = endImg;
                this.tileAssets[`tile_ended_${c}`] = endImg;
                this.tileAssets[`tile-ende-${c}`] = endImg;
                this.tileAssets[`tile_ende_${c}`] = endImg;
            }
        });

        // 24 Base 3D Platform Assets
        this.baseAssets = {};
        const baseFactions = ['dragon', 'citadel', 'elf', 'crown', 'wolf', 'arcane'];
        const baseColors = ['green', 'red', 'yellow', 'blue'];
        baseFactions.forEach(f => {
            baseColors.forEach(c => {
                const key = `base-${f}-${c}`;
                const img = assets[key] || assets[key.replace(/-/g, '_')];
                if (img) {
                    this.baseAssets[key] = img;
                    this.baseAssets[key.replace(/-/g, '_')] = img;
                }
            });
        });

        // 24 Pawn 3D Miniature Character Assets (6 Faksi x 4 Warna)
        this.pawnAssets = {};
        baseFactions.forEach(f => {
            baseColors.forEach(c => {
                const key = `pawn-${f}-${c}`;
                const img = assets[key] || assets[key.replace(/-/g, '_')];
                if (img) {
                    this.pawnAssets[key] = img;
                    this.pawnAssets[key.replace(/-/g, '_')] = img;
                }
            });
        });

        if (this.islandData && this.envAssets) {
            this.renderOffscreenIsland();
        }
    }

    // Helper untuk mengambil aset base yang tepat:
    // teamIndex 0 (Atas)   -> color = 'blue'
    // teamIndex 1 (Kanan)  -> color = 'green'
    // teamIndex 2 (Bawah)  -> color = 'red'
    // teamIndex 3 (Kiri)   -> color = 'yellow'
    getBaseImage(teamIndex, selectedFaction) {
        const TEAM_COLORS = ['blue', 'green', 'red', 'yellow'];
        const color = TEAM_COLORS[Math.max(0, Math.min(3, parseInt(teamIndex, 10) || 0))] || 'blue';

        let fId = '';
        if (typeof selectedFaction === 'string') {
            fId = selectedFaction.toLowerCase();
        } else if (selectedFaction && (selectedFaction.id || selectedFaction.name)) {
            fId = (selectedFaction.id || selectedFaction.name).toLowerCase();
        }

        let faction = 'dragon';
        if (fId.includes('dragon')) faction = 'dragon';
        else if (fId.includes('citadel') || fId.includes('iron') || fId.includes('knight')) faction = 'citadel';
        else if (fId.includes('elf') || fId.includes('elves')) faction = 'elf';
        else if (fId.includes('crown')) faction = 'crown';
        else if (fId.includes('wolf') || fId.includes('wolves')) faction = 'wolf';
        else if (fId.includes('arcane') || fId.includes('wizard')) faction = 'arcane';

        const assetKey = `base-${faction}-${color}`;

        if (this.baseAssets && this.baseAssets[assetKey]) return this.baseAssets[assetKey];
        if (this.envAssets && this.envAssets[assetKey]) return this.envAssets[assetKey];
        if (this.envAssets && this.envAssets[assetKey.replace(/-/g, '_')]) return this.envAssets[assetKey.replace(/-/g, '_')];

        const fallbackKey = `base-dragon-${color}`;
        return (this.baseAssets && this.baseAssets[fallbackKey]) ||
               (this.envAssets && this.envAssets[fallbackKey]) || null;
    }

    // Helper untuk mengambil aset gambar pion 3D yang tepat:
    // teamIndex 0 (Atas)   -> color = 'blue'
    // teamIndex 1 (Kanan)  -> color = 'green'
    // teamIndex 2 (Bawah)  -> color = 'red'
    // teamIndex 3 (Kiri)   -> color = 'yellow'
    getPawnImage(teamIndex, selectedFaction) {
        const TEAM_COLORS = ['blue', 'green', 'red', 'yellow'];
        const color = TEAM_COLORS[Math.max(0, Math.min(3, parseInt(teamIndex, 10) || 0))] || 'blue';

        let fId = '';
        if (typeof selectedFaction === 'string') {
            fId = selectedFaction.toLowerCase();
        } else if (selectedFaction && (selectedFaction.id || selectedFaction.name)) {
            fId = (selectedFaction.id || selectedFaction.name).toLowerCase();
        }

        let faction = 'dragon';
        if (fId.includes('dragon')) faction = 'dragon';
        else if (fId.includes('citadel') || fId.includes('iron') || fId.includes('knight')) faction = 'citadel';
        else if (fId.includes('elf') || fId.includes('elves')) faction = 'elf';
        else if (fId.includes('crown') || fId.includes('prince')) faction = 'crown';
        else if (fId.includes('wolf') || fId.includes('wolves')) faction = 'wolf';
        else if (fId.includes('arcane') || fId.includes('wizard')) faction = 'arcane';

        const assetKey = `pawn-${faction}-${color}`;

        if (this.pawnAssets && this.pawnAssets[assetKey]) return this.pawnAssets[assetKey];
        if (this.envAssets && this.envAssets[assetKey]) return this.envAssets[assetKey];
        if (this.envAssets && this.envAssets[assetKey.replace(/-/g, '_')]) return this.envAssets[assetKey.replace(/-/g, '_')];

        const fallbackKey = `pawn-dragon-${color}`;
        return (this.pawnAssets && this.pawnAssets[fallbackKey]) ||
               (this.envAssets && this.envAssets[fallbackKey]) || null;
    }

    // Helper untuk mengambil aset gambar tile dengan dukungan berbagai format penamaan alias
    getTileImage(assetKey) {
        if (!assetKey) return null;
        const variants = [
            assetKey,
            assetKey.replace(/-/g, '_'),
            assetKey.replace('tile-ended-', 'tile-ende-'),
            assetKey.replace('tile_ended_', 'tile_ende_'),
            assetKey.replace('tile-ende-', 'tile-ended-'),
            assetKey.replace('tile_ende_', 'tile_ended_')
        ];
        for (const v of variants) {
            if (this.tileAssets && this.tileAssets[v]) return this.tileAssets[v];
            if (this.envAssets && this.envAssets[v]) return this.envAssets[v];
        }
        return (this.tileAssets && (this.tileAssets['tile-normal'] || this.tileAssets['tile_normal'])) ||
               (this.envAssets && (this.envAssets['tile-normal'] || this.envAssets['tile_normal'])) || null;
    }

    // Helper untuk mengambil aset gambar 3D Center Throne (The Champion's Chair)
    getThroneImage() {
        if (!this.envAssets) return null;
        return this.envAssets['center-chair'] ||
               this.envAssets['center-cup'] ||
               this.envAssets['center_chair'] ||
               this.envAssets['center_cup'] || null;
    }

    // Warna baku 4 jalur kuadran papan Ludo:
    // teamIndex 0 (Atas)   -> 'blue'   (Base Biru & Entrance Biru)
    // teamIndex 1 (Kanan)  -> 'green'  (Base Hijau & Entrance Hijau)
    // teamIndex 2 (Bawah)  -> 'red'    (Base Merah & Entrance Merah)
    // teamIndex 3 (Kiri)   -> 'yellow' (Base Kuning & Entrance Kuning)
    getArmTrackColor(armIdx) {
        const ARM_COLORS = ['blue', 'green', 'red', 'yellow'];
        const idx = Math.max(0, Math.min(3, parseInt(armIdx, 10) || 0));
        return ARM_COLORS[idx] || 'blue';
    }

    // Ambil nama warna zona faksi ('blue', 'green', 'red', 'yellow') untuk tim tertentu
    getTeamFactionColor(teamIdx) {
        return this.getArmTrackColor(teamIdx);
    }

    // ==========================================
    // 2. PROCEDURAL ENVIRONMENT GENERATION (PEMBUATAN PULAU - BERSIH & TIDAK RAMAI)
    // ==========================================
    generateIsland() {
        const trackCoords = this.board.track.map(t => ({ gx: t.gx, gy: t.gy }));
        const baseCenters = this.board.bases.map(slots => {
            let sx = 0, sy = 0;
            slots.forEach(s => { sx += s.gx; sy += s.gy; });
            return { gx: sx / slots.length, gy: sy / slots.length };
        });

        // Area terlarang untuk dekorasi (agar lintasan Ludo & tahta tetap bersih dan lapang)
        const isLudoReserved = (gx, gy) => {
            if (Math.hypot(gx, gy) < 1.8) return true; // Tahta tengah
            for (const t of trackCoords) {
                if (Math.hypot(gx - t.gx, gy - t.gy) < 1.3) return true; // Jalur track ludo
            }
            if (Math.abs(gx) === 0 && Math.abs(gy) <= 6.0) return true; // Jalur finish
            if (Math.abs(gy) === 0 && Math.abs(gx) <= 6.0) return true;
            for (const b of baseCenters) {
                if (Math.hypot(gx - b.gx, gy - b.gy) < 2.1) return true; // Markas pion
            }
            if (this.board.exitGates) {
                for (const g of this.board.exitGates) {
                    if (Math.hypot(gx - g.gx, gy - g.gy) < 1.4) return true; // Pintu Keluar
                }
            }
            return false;
        };

        // Seeded Pseudo-Random Generator untuk hasil pulau konsisten, rapi, dan estetis
        let seed = 54321;
        const rnd = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        const groundTiles = [];
        const props = [];

        // 4 Titik Ujung Map untuk Formasi Perbukitan Bebatuan (North, East, South, West)
        const cornerHillCenters = [
            { gx: -9.2, gy: -9.2, name: 'Bukit Utara' },
            { gx: 9.2, gy: -9.2, name: 'Bukit Timur' },
            { gx: 9.2, gy: 9.2, name: 'Bukit Selatan' },
            { gx: -9.2, gy: 9.2, name: 'Bukit Barat' }
        ];

        // Titik Kompleks Pos Menara Pengawas & Jembatan Gantung (Watchtower Outposts - Hanya Pos Barat)
        const outpostCenters = [
            { gx: -8.6, gy: 0.7, name: 'Pos Barat' }
        ];

        // 1. Matriks grid isometris 25x25 (gx: -12 s/d 12, gy: -12 s/d 12)
        for (let gy = -12; gy <= 12; gy++) {
            for (let gx = -12; gx <= 12; gx++) {
                const d = Math.abs(gx) + Math.abs(gy);
                // Kontur pulau melayang rounded-diamond
                if (d > 19) continue;

                // Tepi luar pulau: Gunakan platform.png untuk tebing pulau melayang
                const isEdge = (d >= 18) || Math.abs(gx) === 12 || Math.abs(gy) === 12;

                let isNearCornerHill = false;
                for (const c of cornerHillCenters) {
                    if (Math.hypot(gx - c.gx, gy - c.gy) < 2.1) {
                        isNearCornerHill = true;
                        break;
                    }
                }

                let isNearOutpost = false;
                for (const o of outpostCenters) {
                    if (Math.hypot(gx - o.gx, gy - o.gy) < 2.2) {
                        isNearOutpost = true;
                        break;
                    }
                }

                let groundKey = 'patch-grass';

                if (isEdge || isNearCornerHill || isNearOutpost) {
                    groundKey = (isNearCornerHill && rnd() < 0.65) ? 'patch-dirt' : (isNearOutpost && rnd() < 0.5) ? 'patch-dirt' : 'platform';
                } else {
                    let isNearBase = false;
                    for (const b of baseCenters) {
                        if (Math.hypot(gx - b.gx, gy - b.gy) < 2.2) {
                            isNearBase = true;
                            break;
                        }
                    }
                    // Sisipkan patch-dirt.png hanya di area perkemahan markas agar bersih & tertata
                    if (isNearBase && rnd() < 0.5) {
                        groundKey = 'patch-dirt';
                    } else if (rnd() < 0.06) {
                        groundKey = 'patch-dirt';
                    }
                }

                groundTiles.push({ gx, gy, assetKey: groundKey });
            }
        }

        // Helper untuk mencegah penumpukan (Collision / Minimum Distance Buffer)
        const canPlaceProp = (gx, gy, minDist = 1.85) => {
            if (isLudoReserved(gx, gy)) return false;
            // Beri zona bersih di sekitar bukit ujung map
            for (const c of cornerHillCenters) {
                if (Math.hypot(gx - c.gx, gy - c.gy) < 2.3) return false;
            }
            // Beri zona bersih di sekitar pos menara pengawas
            for (const o of outpostCenters) {
                if (Math.hypot(gx - o.gx, gy - o.gy) < 2.4) return false;
            }
            for (const p of props) {
                const d = Math.hypot(gx - p.gx, gy - p.gy);
                // Beri jarak ekstra di sekitar tenda & bangunan agar tidak tertimpa pohon/batu
                const requiredDist = (p.assetKey === 'tent' || p.assetKey === 'building-structure' || p.assetKey === 'bridge') ? 2.3 : minDist;
                if (d < requiredDist) return false;
            }
            return true;
        };

        // 2. Properti Khusus (Points of Interest) - Tempatkan lebih dulu dengan zona bersih:
        // 4 Tenda Perkemahan (tent.png) & Bendera (flag.png) di markas 4 tim dengan jarak yang lapang
        const encampments = [
            // Tim 1 (NW)
            { tent: { gx: -8.0, gy: -4.5 }, flags: [{ gx: -6.6, gy: -3.6 }, { gx: -9.0, gy: -5.8 }] },
            // Tim 2 (NE)
            { tent: { gx: 8.0, gy: -4.5 }, flags: [{ gx: 6.6, gy: -3.6 }, { gx: 9.0, gy: -5.8 }] },
            // Tim 3 (SE)
            { tent: { gx: 8.0, gy: 4.5 }, flags: [{ gx: 6.6, gy: 3.6 }, { gx: 9.0, gy: 5.8 }] },
            // Tim 4 (SW)
            { tent: { gx: -8.0, gy: 4.5 }, flags: [{ gx: -6.6, gy: 3.6 }, { gx: -9.0, gy: 5.8 }] }
        ];

        encampments.forEach(e => {
            props.push({ gx: e.tent.gx, gy: e.tent.gy, assetKey: 'tent', scaleMod: 1.1 });
            e.flags.forEach(f => {
                props.push({ gx: f.gx, gy: f.gy, assetKey: 'flag', scaleMod: 1.0 });
            });
        });

        // 2c. POS MENARA PENGAWAS & JEMBATAN GANTUNG (Watchtower Outpost Compounds)
        // Memadukan building-structure, building-platform, building-roof, ladder, dan bridge
        // seperti pada preview referensi Kenney (hanya di sisi Barat agar sisi Timur/Kanan bersih tanpa tumpang tindih)
        const outpostCompounds = [
            // Pos Pengawas Benteng Barat (West Watchtower Outpost)
            {
                baseX: -8.0, baseY: 0.7,
                props: [
                    // Menara 1 (Menara tangga pengintai)
                    { assetKey: 'building-structure', gx: -8.0, gy: 0.7, gz: 0, scaleMod: 1.0 },
                    { assetKey: 'building-platform', gx: -8.0, gy: 0.7, gz: 2.1, scaleMod: 1.0 },
                    { assetKey: 'ladder', gx: -7.75, gy: 0.95, gz: 0, scaleMod: 1.0 },
                    { assetKey: 'flag', gx: -8.2, gy: 0.5, gz: 2.9, scaleMod: 0.9 },
                    // Jembatan Gantung yang menghubungkan Menara 1 dan Menara 2
                    { assetKey: 'bridge', gx: -8.65, gy: 0.7, gz: 2.1, scaleMod: 1.05 },
                    // Menara 2 (Menara atap beratap biru pelindung)
                    { assetKey: 'building-structure', gx: -9.3, gy: 0.7, gz: 0, scaleMod: 1.0 },
                    { assetKey: 'building-platform', gx: -9.3, gy: 0.7, gz: 2.1, scaleMod: 1.0 },
                    { assetKey: 'building-roof', gx: -9.3, gy: 0.7, gz: 3.55, scaleMod: 1.05 },
                    // Aksen bebatuan & pepohonan pos
                    { assetKey: 'rocks-low', gx: -9.5, gy: -0.3, gz: 0, scaleMod: 0.9 },
                    { assetKey: 'plant', gx: -7.4, gy: -0.2, gz: 0, scaleMod: 0.85 },
                    { assetKey: 'tree-high', gx: -9.8, gy: 1.6, gz: 0, scaleMod: 1.1 }
                ]
            }
        ];

        outpostCompounds.forEach(comp => {
            comp.props.forEach(p => props.push(p));
        });

        // 2b. FORMASI PERBUKITAN ALAMI DI 4 UJUNG MAP (Smooth Hills: rocks-high + rocks-ramp + rocks-low)
        // Mengkreasikan ketiga aset batu bertingkat secara bertahap agar lereng bukit mengalir smooth dan tidak kaku
        cornerHillCenters.forEach(c => {
            const sgnX = Math.sign(c.gx);
            const sgnY = Math.sign(c.gy);

            // 1. Puncak Tebing Batu Tertinggi (Summit Peak)
            props.push({ gx: c.gx, gy: c.gy, assetKey: 'rocks-high', scaleMod: 1.15 });
            // 2. Puncak Samping / Punggung Bukit (Ridge Crest)
            props.push({ gx: c.gx - sgnX * 0.7, gy: c.gy - sgnY * 0.7, assetKey: 'rocks-high', scaleMod: 1.05 });
            // 3. Lereng Miring Halus Kiri (Left Incline Ramp)
            props.push({ gx: c.gx - 0.7, gy: c.gy + 0.7, assetKey: 'rocks-ramp', scaleMod: 1.0 });
            // 4. Lereng Miring Halus Kanan (Right Incline Ramp)
            props.push({ gx: c.gx + 0.7, gy: c.gy - 0.7, assetKey: 'rocks-ramp', scaleMod: 1.0 });
            // 5. Kaki Bebatuan Rendah Kiri (Left Foot Outcrop)
            props.push({ gx: c.gx - 1.4, gy: c.gy + 1.2, assetKey: 'rocks-low', scaleMod: 0.9 });
            // 6. Kaki Bebatuan Rendah Kanan (Right Foot Outcrop)
            props.push({ gx: c.gx + 1.2, gy: c.gy - 1.4, assetKey: 'rocks-low', scaleMod: 0.9 });
            // 7. Pohon Pinus Pegunungan di Celah Puncak Bukit
            props.push({ gx: c.gx + sgnX * 0.4, gy: c.gy + sgnY * 0.4, assetKey: 'tree-high', scaleMod: 1.1 });
            // 8. Tumbuhan Semak Alpin di Kaki Bukit
            props.push({ gx: c.gx - 1.8, gy: c.gy + 0.8, assetKey: 'plant', scaleMod: 0.85 });
            // 9. Kerikil Bebatuan Pegunungan (Mountain Scree)
            props.push({ gx: c.gx + 0.8, gy: c.gy - 1.8, assetKey: 'stones', scaleMod: 0.85 });
        });

        // 3. Lapisan Dekorasi Alami Terukur (Tidak Ramai & Tidak Menumpuk)
        // Kumpulkan kandidat petak yang valid
        const candidateTiles = [];
        for (let gy = -11; gy <= 11; gy++) {
            for (let gx = -11; gx <= 11; gx++) {
                const d = Math.abs(gx) + Math.abs(gy);
                if (d > 17 || d < 3) continue;
                if (d >= 16 || Math.abs(gx) >= 11 || Math.abs(gy) >= 11) continue;
                candidateTiles.push({ gx, gy });
            }
        }

        // Acak urutan kandidat
        for (let i = candidateTiles.length - 1; i > 0; i--) {
            const j = Math.floor(rnd() * (i + 1));
            [candidateTiles[i], candidateTiles[j]] = [candidateTiles[j], candidateTiles[i]];
        }

        let treeCount = 0;
        let floraCount = 0;

        for (const c of candidateTiles) {
            const gx = c.gx + (rnd() - 0.5) * 0.22;
            const gy = c.gy + (rnd() - 0.5) * 0.22;

            // Pastikan jarak minimal 1.85 grid unit agar tidak berdempetan
            if (!canPlaceProp(gx, gy, 1.85)) continue;

            const dist = Math.hypot(gx, gy);
            const r = rnd();

            if (dist >= 7.0) {
                // Di lingkar hutan luar: Tempatkan pohon-pohon yang terpisah rapi
                if (treeCount < 18 && r < 0.60) {
                    const type = (rnd() < 0.5) ? 'tree' : 'tree-high';
                    props.push({ gx, gy, assetKey: type, scaleMod: 0.95 + rnd() * 0.15 });
                    treeCount++;
                } else if (floraCount < 8 && r < 0.80) {
                    const floraType = (rnd() < 0.6) ? 'plant' : 'stones';
                    props.push({ gx, gy, assetKey: floraType, scaleMod: 0.85 });
                    floraCount++;
                }
            } else if (dist >= 3.2) {
                // Di padang rumput tengah: Aksen minimalis & lapang
                if (treeCount < 22 && r < 0.42) {
                    props.push({ gx, gy, assetKey: 'tree', scaleMod: 0.9 });
                    treeCount++;
                } else if (floraCount < 12 && r < 0.72) {
                    const floraType = (rnd() < 0.6) ? 'plant' : 'stones';
                    props.push({ gx, gy, assetKey: floraType, scaleMod: 0.82 });
                    floraCount++;
                }
            }
        }

        this.islandData = { groundTiles, props };

        // Render seluruh pulau sekali ke Offscreen Canvas
        this.renderOffscreenIsland();
    }

    // ====================================================================
    // 3. ALGORITMA Z-INDEXING & 4. OPTIMASI RENDER KE OFFSCREEN CANVAS
    // ====================================================================
    renderOffscreenIsland() {
        if (!this.islandData || !this.envAssets) return;

        const ctx = this.offscreenCtx;
        const dpr = window.devicePixelRatio || 1;

        // Catat koordinat & zoom saat offscreen island digambar
        this.offscreenZoom = this.zoom;
        this.offscreenOriginX = this.originX;
        this.offscreenOriginY = this.originY;
        this.offscreenPanX = this.panX;
        this.offscreenPanY = this.panY;

        this.offscreenCanvas.width = this.width * dpr;
        this.offscreenCanvas.height = this.height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Bayangan Tebing Bawah Pulau Melayang di Langit
        const center = this.isoToScreen(0, 0, -1.8);
        const w = this.tileW * 12 * this.zoom;
        const h = this.tileH * 12 * this.zoom;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(center.sx, center.sy + 120 * this.zoom, w * 0.65, h * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.fill();
        ctx.restore();

        const baseScale = (this.tileW / 48) * this.zoom;
        const groundZ = -0.55; // Posisi pulau tepat di BAWAH papan ludo (gz = 0)

        // 3. Lapisan Dasar: Render Ground Tiles (Urutkan dari belakang ke depan gx + gy)
        const sortedGround = [...this.islandData.groundTiles].sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));
        sortedGround.forEach(tile => {
            const img = this.envAssets[tile.assetKey];
            if (!img) return;

            const { sx, sy } = this.isoToScreen(tile.gx, tile.gy, groundZ);
            const sprW = 64 * baseScale;
            const sprH = 64 * baseScale;
            const drawX = sx - 32 * baseScale;
            const drawY = sy - 34 * baseScale;

            ctx.drawImage(img, drawX, drawY, sprW, sprH);
        });

        // 4. Lapisan Dekorasi: Z-INDEXING BERDASARKAN KOORDINAT Y & KETINGGIAN ELEVASI
        const PROP_ANCHORS = {
            'tree': { ax: 32, ay: 48, scaleMult: 1.15 },
            'tree-high': { ax: 32, ay: 48, scaleMult: 1.25 },
            'plant': { ax: 32, ay: 40, scaleMult: 0.95 },
            'rocks-high': { ax: 32, ay: 54, scaleMult: 1.15 },
            'rocks-low': { ax: 32, ay: 48, scaleMult: 1.0 },
            'rocks-ramp': { ax: 32, ay: 48, scaleMult: 1.0 },
            'stones': { ax: 32, ay: 48, scaleMult: 0.9 },
            'tent': { ax: 32, ay: 48, scaleMult: 1.15 },
            'flag': { ax: 32, ay: 48, scaleMult: 1.0 },
            'bridge': { ax: 32, ay: 42, scaleMult: 1.05 },
            'building-structure': { ax: 32, ay: 60, scaleMult: 1.0 },
            'building-platform': { ax: 32, ay: 60, scaleMult: 1.0 },
            'building-roof': { ax: 32, ay: 60, scaleMult: 1.05 },
            'ladder': { ax: 32, ay: 60, scaleMult: 1.0 }
        };

        const renderableProps = this.islandData.props.map(p => {
            const z = groundZ + (p.gz || 0);
            const { sx, sy } = this.isoToScreen(p.gx, p.gy, z);
            // Kedalaman isometris Painter's Algorithm berbobot elevasi untuk stacking akurat
            const depth = (p.gx + p.gy) + (p.gz || 0) * 0.15;
            return {
                ...p,
                sx,
                sy,
                depth
            };
        });

        // ALGORITMA Z-INDEXING: Urutkan objek dari latar belakang ke latar depan
        // Struktur bawah digambar lebih dulu, kemudian platform, lalu atap di atasnya
        renderableProps.sort((a, b) => a.depth - b.depth);

        renderableProps.forEach(prop => {
            const img = this.envAssets[prop.assetKey];
            if (!img) return;

            const anchor = PROP_ANCHORS[prop.assetKey] || { ax: 32, ay: 48, scaleMult: 1.0 };
            const s = baseScale * (anchor.scaleMult || 1.0) * (prop.scaleMod || 1.0);
            const sprW = 64 * s;
            const sprH = 64 * s;
            const drawX = prop.sx - anchor.ax * s;
            const drawY = prop.sy - anchor.ay * s;

            // Bayangan halus hanya untuk objek yang menempel di tanah (bukan struktur melayang/atap)
            if (!prop.gz && prop.assetKey !== 'ladder') {
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(prop.sx, prop.sy + 2 * this.zoom, (sprW * 0.22), (sprH * 0.1), 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                ctx.fill();
                ctx.restore();
            }

            ctx.drawImage(img, drawX, drawY, sprW, sprH);
        });
    }

    // Generate surrounding props like pine trees, floating rocks, castle banners
    generateSceneryProps() {
        const props = [];
        const sceneryPositions = [
            // North-west trees
            { gx: -7.5, gy: -2, type: 'tree', scale: 0.9 },
            { gx: -8.0, gy: -3.5, type: 'tree', scale: 1.1 },
            { gx: -6.8, gy: -7.2, type: 'rock', scale: 1.0 },
            // North-east trees & rocks
            { gx: 2, gy: -7.5, type: 'tree', scale: 1.0 },
            { gx: 3.5, gy: -8.0, type: 'tree', scale: 0.8 },
            { gx: 7.2, gy: -6.8, type: 'rock', scale: 1.2 },
            // South-east trees
            { gx: 7.5, gy: 2, type: 'tree', scale: 1.1 },
            { gx: 8.0, gy: 3.5, type: 'tree', scale: 0.9 },
            { gx: 6.8, gy: 7.2, type: 'rock', scale: 1.0 },
            // South-west trees
            { gx: -2, gy: 7.5, type: 'tree', scale: 0.85 },
            { gx: -3.5, gy: 8.0, type: 'tree', scale: 1.05 },
            { gx: -7.2, gy: 6.8, type: 'rock', scale: 1.1 }
        ];
        return sceneryPositions;
    }

    // Isometric 3D to Screen projection
    isoToScreen(gx, gy, gz = 0) {
        const sx = (gx - gy) * (this.tileW / 2) * this.zoom + this.originX + this.panX;
        const sy = (gx + gy) * (this.tileH / 2) * this.zoom - (gz * this.tileZ * this.zoom) + this.originY + this.panY;
        return { sx, sy };
    }

    // Add floating combat/event text
    addFloatingText(gx, gy, gz, text, color = '#ffd700', size = 18) {
        this.floatingTexts.push({
            gx, gy, gz,
            text,
            color,
            size,
            yOffset: 0,
            alpha: 1.0,
            duration: 1.5,
            elapsed: 0
        });
    }

    // Add particle burst
    addParticleBurst(gx, gy, gz, count = 12, color = '#ffb703') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            this.particles.push({
                gx, gy, gz,
                vx: Math.cos(angle) * speed * 0.05,
                vy: Math.sin(angle) * speed * 0.05,
                vz: (0.8 + Math.random() * 1.2) * 0.08,
                color,
                size: 3 + Math.random() * 3,
                alpha: 1.0,
                duration: 0.8 + Math.random() * 0.4,
                elapsed: 0
            });
        }
    }

    // Main render loop
    render(gameState) {
        const now = performance.now();
        const dt = Math.min(0.1, (now - this.lastTimestamp) / 1000);
        this.lastTimestamp = now;
        this.time += dt;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Smooth camera zoom & pan
        this.zoom += (this.targetZoom - this.zoom) * 0.12;
        this.panX += (this.targetPanX - this.panX) * 0.15;
        this.panY += (this.targetPanY - this.panY) * 0.15;

        // 1. Langit Biru Gradasi Dinamis dengan Metrik Abstrak & Awan Bergerak
        this.renderSkyBackground(dt);

        // 2. OPTIMASI OFFSCREEN CANVAS: Render pulau melayang, perbukitan & dekorasi dalam 1x drawImage dengan sinkronisasi zoom & pan
        if (this.offscreenCanvas && this.offscreenCanvas.width > 0 && this.islandData) {
            const curX = this.originX + this.panX;
            const curY = this.originY + this.panY;
            const oldX = this.offscreenOriginX + (this.offscreenPanX || 0);
            const oldY = this.offscreenOriginY + (this.offscreenPanY || 0);
            const scale = this.zoom / (this.offscreenZoom || this.zoom);

            this.ctx.save();
            this.ctx.translate(curX, curY);
            this.ctx.scale(scale, scale);
            this.ctx.drawImage(this.offscreenCanvas, -oldX, -oldY, this.width, this.height);
            this.ctx.restore();

            // Refresh buffer saat pergerakan kamera mereda agar selalu tajam 1:1
            if (this.offscreenDirty && Math.abs(this.targetZoom - this.zoom) < 0.005 && Math.abs(this.targetPanX - this.panX) < 0.5) {
                this.renderOffscreenIsland();
                this.offscreenDirty = false;
            }
        } else {
            this.renderFloatingIslandBase();
        }

        // 3. Awan kabut tipis di depan tebing pulau melayang
        this.updateAndDrawClouds(this.ctx, dt, true);

        // 4. Kalkulasi Penumpukan Pion (Stacking & Depth micro-offsets)
        this.calculatePawnStacking(gameState);

        // Collect all renderable entities for isometric depth sorting
        // Depth formula: (gx + gy) + gz * 0.1
        const entities = [];

        // 1. Base camps (4 corner 3D platforms)
        for (let t = 0; t < 4; t++) {
            const team = gameState.teams[t];
            const slots = this.board.bases[t];
            // Tentukan kedalaman paling belakang dari semua slot pion base ini.
            // Platform base HARUS SELALU dirender LEBIH AWAL (depth lebih kecil)
            // daripada SELURUH pion yang berdiri di atas lantainya!
            let minSlotDepth = 0;
            if (slots && slots.length > 0) {
                minSlotDepth = Math.min(...slots.map(s => s.gx + s.gy));
            } else {
                minSlotDepth = -10;
            }

            entities.push({
                depth: minSlotDepth - 1.2,
                type: 'base_camp',
                teamIdx: t,
                teamData: team
            });
        }

        // 2. Exit Gates (Platform Pintu Keluar di luar jalur sejajar base)
        if (this.board.exitGates) {
            this.board.exitGates.forEach((gate, teamIdx) => {
                entities.push({
                    depth: (gate.gx + gate.gy) - 0.05,
                    type: 'exit_gate',
                    data: gate,
                    teamIdx: teamIdx
                });
            });
        }

        // 3. Outer track tiles
        this.board.track.forEach(tile => {
            entities.push({
                depth: tile.gx + tile.gy,
                type: 'tile',
                data: tile,
                isTrack: true
            });
        });

        // 4. Finish lane tiles
        this.board.finishLanes.forEach((lane, teamIdx) => {
            lane.forEach(tile => {
                entities.push({
                    depth: tile.gx + tile.gy + tile.gz * 0.2,
                    type: 'tile',
                    data: tile,
                    isLane: true,
                    teamIdx
                });
            });
        });

        // 5. Central Iron Throne / The Champion's Chair
        // Z-INDEXING: Pastikan The Champion's Chair dirender setelah semua petak jalur ludo
        // agar bagian bawah/pedestal menutupi ujung-ujung petak dari keempat jalur faksi secara natural!
        const THRONE_DEPTH = 100;
        entities.push({
            depth: THRONE_DEPTH,
            type: 'throne',
            data: this.board.throne
        });

        // 6. Pawns (dengan depth sorting akurat berdasarkan sumbu Y/kedalaman)
        gameState.teams.forEach(team => {
            team.pawns.forEach(pawn => {
                const pPos = pawn.getInterpolatedPos();
                const stackYDepth = (pawn.stackOffsetY || 0) * 0.05;
                const isoDepth = (pPos.gx + pPos.gy) + pPos.gz * 0.2 + stackYDepth;
                let pawnDepth;

                if (pawn.state === 'throne') {
                    // Jaminan mutlak: Pion yang sedang menduduki tahta dirender DI ATAS kursi tahta
                    pawnDepth = THRONE_DEPTH + 1;
                } else if (pawn.state === 'base') {
                    // Jaminan mutlak: Pion yang berada di base selalu dirender di atas platform base
                    const slots = this.board.bases[team.index];
                    let basePlatformDepth = -10;
                    if (slots && slots.length > 0) {
                        const minSlot = Math.min(...slots.map(s => s.gx + s.gy));
                        basePlatformDepth = minSlot - 1.2;
                    }
                    pawnDepth = Math.max(basePlatformDepth + 0.5, 50 + isoDepth);
                } else {
                    // Di lintasan jalan atau finish lane:
                    // Jika pion berada di belakang kursi tengah (gx + gy < 0):
                    // pawnDepth berada di bawah THRONE_DEPTH (100) sehingga kursi menutup pion di belakangnya.
                    // Jika pion berada di depan kursi tengah (gx + gy >= 0):
                    // pawnDepth berada di atas THRONE_DEPTH (100) sehingga pion berada di depan kursi.
                    if ((pPos.gx + pPos.gy) < 0) {
                        pawnDepth = 50 + isoDepth;
                    } else {
                        pawnDepth = 150 + isoDepth;
                    }
                }

                entities.push({
                    depth: pawnDepth,
                    type: 'pawn',
                    pawn,
                    team
                });
            });
        });

        // Sort by isometric depth (Painter's Algorithm)
        entities.sort((a, b) => a.depth - b.depth);

        // Render each entity
        entities.forEach(ent => {
            switch (ent.type) {
                case 'scenery':
                    this.renderScenery(ent.data);
                    break;
                case 'base_camp':
                    this.renderBaseCamp(ent.teamIdx, ent.teamData);
                    break;
                case 'exit_gate':
                    this.renderExitGate(ent.data, ent.teamIdx);
                    break;
                case 'tile':
                    this.renderTile(ent.data, ent.isLane, ent.teamIdx);
                    break;
                case 'throne':
                    this.renderThrone(ent.data);
                    break;
                case 'pawn':
                    this.renderPawn(ent.pawn, ent.team);
                    break;
            }
        });

        // Render particles & floating texts on top
        this.renderParticles(dt);
        this.renderFloatingTexts(dt);
    }

    renderBackground() {
        this.renderSkyBackground(0.016);
    }

    renderFloatingIslandBase() {
        const center = this.isoToScreen(0, 0, -1.8);
        const w = this.tileW * 10 * this.zoom;
        const h = this.tileH * 10 * this.zoom;

        this.ctx.save();
        // Lower cliff shadow
        this.ctx.beginPath();
        this.ctx.ellipse(center.sx, center.sy + 100 * this.zoom, w * 0.6, h * 0.5, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.filter = 'blur(15px)';
        this.ctx.fill();
        this.ctx.filter = 'none';

        // Floating island underbody rock facets
        const pTop = this.isoToScreen(0, -6.5, -0.6);
        const pRight = this.isoToScreen(6.5, 0, -0.6);
        const pBottom = this.isoToScreen(0, 6.5, -0.6);
        const pLeft = this.isoToScreen(-6.5, 0, -0.6);
        const pCliff = this.isoToScreen(0, 0, -2.6);

        // Left cliff
        this.ctx.fillStyle = '#1b1d28';
        this.ctx.beginPath();
        this.ctx.moveTo(pLeft.sx, pLeft.sy);
        this.ctx.lineTo(pBottom.sx, pBottom.sy);
        this.ctx.lineTo(pCliff.sx, pCliff.sy);
        this.ctx.closePath();
        this.ctx.fill();

        // Right cliff
        this.ctx.fillStyle = '#222533';
        this.ctx.beginPath();
        this.ctx.moveTo(pBottom.sx, pBottom.sy);
        this.ctx.lineTo(pRight.sx, pRight.sy);
        this.ctx.lineTo(pCliff.sx, pCliff.sy);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    // Render Exit Gate Platform (Platform Pintu Keluar Faksi)
    renderExitGate(gate, teamIdx) {
        const { sx, sy } = this.isoToScreen(gate.gx, gate.gy, gate.gz);
        const trackColor = this.getArmTrackColor(teamIdx);
        const assetKey = `tile-entrance-${trackColor}`;
        const img = this.getTileImage(assetKey);

        const tw = (this.TILE_WIDTH !== undefined ? this.TILE_WIDTH : TILE_WIDTH);
        const th = (this.TILE_HEIGHT !== undefined ? this.TILE_HEIGHT : TILE_HEIGHT);
        const ox = (this.OFFSET_X !== undefined ? this.OFFSET_X : OFFSET_X);
        const oy = (this.OFFSET_Y !== undefined ? this.OFFSET_Y : OFFSET_Y);

        const drawW = (tw || 88) * this.zoom;
        const drawH = (th || 55) * this.zoom;
        const drawX = sx - drawW / 2 + (ox * this.zoom);
        const drawY = sy - drawH / 2 + (oy * this.zoom);
        const h2 = (this.tileH / 2) * this.zoom;

        const team = window.gameState && window.gameState.teams[teamIdx];
        const faction = team ? team.faction : null;
        const highlight = faction ? faction.highlightColor : '#ffd700';

        this.ctx.save();

        if (img) {
            // Render Balok 3D Entrance Faksi
            this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else {
            const w2 = (this.tileW / 2) * this.zoom;
            const thickness = (this.tileZ * 0.7) * this.zoom;
            const pTop = { x: sx, y: sy - h2 };
            const pRight = { x: sx + w2, y: sy };
            const pBottom = { x: sx, y: sy + h2 };
            const pLeft = { x: sx - w2, y: sy };
            const secColor = faction ? faction.secondaryColor : '#2b2d42';

            this.ctx.fillStyle = '#1c1e28';
            this.ctx.beginPath();
            this.ctx.moveTo(pLeft.x, pLeft.y);
            this.ctx.lineTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pBottom.x, pBottom.y + thickness);
            this.ctx.lineTo(pLeft.x, pLeft.y + thickness);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#262936';
            this.ctx.beginPath();
            this.ctx.moveTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pRight.x, pRight.y);
            this.ctx.lineTo(pRight.x, pRight.y + thickness);
            this.ctx.lineTo(pBottom.x, pBottom.y + thickness);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = secColor;
            this.ctx.beginPath();
            this.ctx.moveTo(pTop.x, pTop.y);
            this.ctx.lineTo(pRight.x, pRight.y);
            this.ctx.lineTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pLeft.x, pLeft.y);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Render an Isometric 3D Tile using 3D Tile Images
    renderTile(tile, isLane = false, laneTeamIdx = null) {
        const { sx, sy } = this.isoToScreen(tile.gx, tile.gy, tile.gz);

        // 1. Tentukan jenis gambar balok petak berdasarkan properti tipe petak & zona faksi
        const type = tile.type || TILE_TYPES.BLANK;
        const typeId = (typeof type === 'string') ? type : (type ? (type.id || type.name) : 'blank');

        let assetKey = 'tile-normal';

        if (isLane) {
            // Jalur Lurus menuju Tahta (Home stretch/Safe zone / Finish Lane)
            // Seluruh jalur masuk ke finish WAJIB sesuai dengan warna jalurnya:
            // Jalur 0 (Utara): Red | Jalur 1 (Timur): Yellow | Jalur 2 (Selatan): Blue | Jalur 3 (Barat): Green
            const laneTeam = (laneTeamIdx !== null && laneTeamIdx !== undefined) ? laneTeamIdx : (tile.team !== undefined ? tile.team : 0);
            const trackColor = this.getArmTrackColor(laneTeam);
            assetKey = `tile-ended-${trackColor}`;
        } else if (typeId === 'start' || (tile.teamStart !== undefined && tile.teamStart !== null)) {
            // Titik Keluar Base (Start point) sesuai warna jalurnya
            const team = (tile.teamStart !== undefined && tile.teamStart !== null) ? tile.teamStart : 0;
            const trackColor = this.getArmTrackColor(team);
            assetKey = `tile-entrance-${trackColor}`;
        } else {
            // Petak umum, truth, dare, special, weird
            switch (typeId) {
                case 'truth':
                    assetKey = 'tile-truth';
                    break;
                case 'dare':
                    assetKey = 'tile-dare';
                    break;
                case 'special_dice':
                case 'special':
                    assetKey = 'tile-special';
                    break;
                case 'weird_dice':
                case 'weird':
                    assetKey = 'tile-weird';
                    break;
                default:
                    assetKey = 'tile-normal';
                    break;
            }
        }

        const img = this.getTileImage(assetKey);

        this.ctx.save();

        // 2. Variabel Ukuran & Offset Balok (Anchor Adjustment)
        const tw = (this.TILE_WIDTH !== undefined ? this.TILE_WIDTH : TILE_WIDTH);
        const th = (this.TILE_HEIGHT !== undefined ? this.TILE_HEIGHT : TILE_HEIGHT);
        const ox = (this.OFFSET_X !== undefined ? this.OFFSET_X : OFFSET_X);
        const oy = (this.OFFSET_Y !== undefined ? this.OFFSET_Y : OFFSET_Y);

        const drawW = (tw || (img ? img.width : 88)) * this.zoom;
        const drawH = (th || (img ? img.height : 55)) * this.zoom;

        // Rumus drawImage dengan offset penyesuaian anchor
        const drawX = sx - drawW / 2 + (ox * this.zoom);
        const drawY = sy - drawH / 2 + (oy * this.zoom);

        if (img) {
            // Render Balok 3D menggunakan ctx.drawImage()
            this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else {
            // Fallback jika aset belum selesai dimuat
            const w2 = (this.tileW / 2) * this.zoom;
            const h2 = (this.tileH / 2) * this.zoom;
            const thickness = (this.tileZ * 0.65) * this.zoom;
            const pTop = { x: sx, y: sy - h2 };
            const pRight = { x: sx + w2, y: sy };
            const pBottom = { x: sx, y: sy + h2 };
            const pLeft = { x: sx - w2, y: sy };

            this.ctx.fillStyle = '#242738';
            this.ctx.beginPath();
            this.ctx.moveTo(pLeft.x, pLeft.y);
            this.ctx.lineTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pBottom.x, pBottom.y + thickness);
            this.ctx.lineTo(pLeft.x, pLeft.y + thickness);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#2c2f42';
            this.ctx.beginPath();
            this.ctx.moveTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pRight.x, pRight.y);
            this.ctx.lineTo(pRight.x, pRight.y + thickness);
            this.ctx.lineTo(pBottom.x, pBottom.y + thickness);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#3a3d52';
            this.ctx.beginPath();
            this.ctx.moveTo(pTop.x, pTop.y);
            this.ctx.lineTo(pRight.x, pRight.y);
            this.ctx.lineTo(pBottom.x, pBottom.y);
            this.ctx.lineTo(pLeft.x, pLeft.y);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Render 3D Base/Platform Faksi di 4 Sudut (Pengganti Base Lingkaran Lama)
    renderBaseCamp(teamIdx, teamData) {
        const slots = this.board.bases[teamIdx];
        if (!slots || slots.length === 0) return;

        const avgGx = (slots[0].gx + slots[1].gx + slots[2].gx + slots[3].gx) / 4;
        const avgGy = (slots[0].gy + slots[1].gy + slots[2].gy + slots[3].gy) / 4;
        const baseGz = (this.BASE_ELEVATION_GZ !== undefined ? this.BASE_ELEVATION_GZ : BASE_ELEVATION_GZ);
        let { sx, sy } = this.isoToScreen(avgGx, avgGy, baseGz);

        // Ambil offset manual per sudut ({ top, right, bottom, left })
        const offsets = (this.BASE_OFFSETS || window.BASE_OFFSETS || BASE_OFFSETS);
        const cornerKeys = ['top', 'right', 'bottom', 'left'];
        const cornerKey = cornerKeys[teamIdx % 4];
        if (offsets && offsets[cornerKey]) {
            sx += (offsets[cornerKey].x || 0) * this.zoom;
            sy += (offsets[cornerKey].y || 0) * this.zoom;
        }

        const faction = teamData ? teamData.faction : null;
        const img = this.getBaseImage(teamIdx, faction);

        const baseScale = (this.BASE_SCALE !== undefined ? this.BASE_SCALE : BASE_SCALE) * this.zoom;

        this.ctx.save();

        if (img) {
            const bw = (img.width || 512) * baseScale;
            const bh = (img.height || 382) * baseScale;
            // Native floor center diamond is at x=256, y=195
            const anchorX = (256 / 512) * bw;
            const anchorY = (195 / 382) * bh;

            this.ctx.drawImage(img, sx - anchorX, sy - anchorY, bw, bh);
        }

        this.ctx.restore();
    }

    renderTorch(tx, ty) {
        // Torch bracket
        this.ctx.fillStyle = '#343a40';
        this.ctx.fillRect(tx - 2 * this.zoom, ty, 4 * this.zoom, 14 * this.zoom);

        // Flame flicker
        const flicker1 = Math.sin(this.time * 12 + tx) * 2 * this.zoom;
        const flicker2 = Math.cos(this.time * 15 + ty) * 2 * this.zoom;

        // Outer orange flame
        this.ctx.fillStyle = '#f77f00';
        this.ctx.beginPath();
        this.ctx.ellipse(tx, ty - 6 * this.zoom + flicker1, 5 * this.zoom, 9 * this.zoom, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Inner yellow core
        this.ctx.fillStyle = '#fcbf49';
        this.ctx.beginPath();
        this.ctx.ellipse(tx, ty - 4 * this.zoom + flicker2, 3 * this.zoom, 5 * this.zoom, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Render Scenery (Trees, Rocks)
    renderScenery(prop) {
        const { sx, sy } = this.isoToScreen(prop.gx, prop.gy, 0);
        this.ctx.save();
        const s = (prop.scale || 1.0) * this.zoom;

        if (prop.type === 'tree') {
            // Low-poly Pine Tree
            // Trunk
            this.ctx.fillStyle = '#582f0e';
            this.ctx.fillRect(sx - 3 * s, sy - 10 * s, 6 * s, 12 * s);

            // Foliage Tiers (Low-poly pine cones)
            const tiers = [
                { y: sy - 8 * s, w: 22 * s, h: 16 * s, c: '#1b4332' },
                { y: sy - 18 * s, w: 17 * s, h: 14 * s, c: '#2d6a4f' },
                { y: sy - 26 * s, w: 12 * s, h: 12 * s, c: '#40916c' }
            ];
            tiers.forEach(t => {
                this.ctx.fillStyle = t.c;
                this.ctx.beginPath();
                this.ctx.moveTo(sx, t.y - t.h);
                this.ctx.lineTo(sx + t.w / 2, t.y);
                this.ctx.lineTo(sx - t.w / 2, t.y);
                this.ctx.closePath();
                this.ctx.fill();
            });
        } else if (prop.type === 'rock') {
            // Low-poly Crystal/Rock formation
            this.ctx.fillStyle = '#495057';
            this.ctx.beginPath();
            this.ctx.moveTo(sx - 12 * s, sy);
            this.ctx.lineTo(sx - 4 * s, sy - 16 * s);
            this.ctx.lineTo(sx + 10 * s, sy - 8 * s);
            this.ctx.lineTo(sx + 14 * s, sy);
            this.ctx.closePath();
            this.ctx.fill();

            // Facet highlight
            this.ctx.fillStyle = '#6c757d';
            this.ctx.beginPath();
            this.ctx.moveTo(sx - 4 * s, sy - 16 * s);
            this.ctx.lineTo(sx + 10 * s, sy - 8 * s);
            this.ctx.lineTo(sx + 2 * s, sy);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    // Render Central Summit: TAHTA BESI EMAS (The Champion's Chair 3D Asset)
    renderThrone(throneData) {
        const gz = (this.THRONE_ELEVATION_GZ !== undefined ? this.THRONE_ELEVATION_GZ : THRONE_ELEVATION_GZ);
        const { sx, sy } = this.isoToScreen(throneData.gx, throneData.gy, gz);
        this.ctx.save();

        const s = this.zoom;

        // Shimmering Golden Radiant Light Aura
        const auraAlpha = 0.22 + 0.12 * Math.sin(this.time * 2.5);
        const auraGrad = this.ctx.createRadialGradient(sx, sy - 28 * s, 6 * s, sx, sy - 28 * s, 72 * s);
        auraGrad.addColorStop(0, `rgba(255, 215, 0, ${auraAlpha})`);
        auraGrad.addColorStop(0.55, `rgba(255, 183, 3, ${auraAlpha * 0.35})`);
        auraGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = auraGrad;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy - 28 * s, 72 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // 3D Isometric Center Throne / The Champion's Chair (drawImage)
        const img = this.getThroneImage();
        if (img) {
            const scale = (this.THRONE_SCALE !== undefined ? this.THRONE_SCALE : THRONE_SCALE);
            const anchorX = (this.THRONE_ANCHOR_X !== undefined ? this.THRONE_ANCHOR_X : THRONE_ANCHOR_X);
            const anchorY = (this.THRONE_ANCHOR_Y !== undefined ? this.THRONE_ANCHOR_Y : THRONE_ANCHOR_Y);
            const ox = (this.THRONE_OFFSET_X !== undefined ? this.THRONE_OFFSET_X : THRONE_OFFSET_X);
            const oy = (this.THRONE_OFFSET_Y !== undefined ? this.THRONE_OFFSET_Y : THRONE_OFFSET_Y);

            const drawW = img.width * scale * s;
            const drawH = img.height * scale * s;
            const drawX = sx - drawW * anchorX + (ox * s);
            const drawY = sy - drawH * anchorY + (oy * s);

            this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }

        this.ctx.restore();
    }

    // 5. LOGIKA PENUMPUKAN PION (STACKING):
    // Jika ada lebih dari satu pion di petak yang sama (atau saat berada di Base),
    // geser sedikit offset X/Y-nya dan urutkan rendering berdasarkan sumbu Y (depth sorting)
    // agar pion depan menutupi pion belakang secara natural.
    calculatePawnStacking(gameState) {
        if (!gameState || !gameState.teams) return;

        const groups = {};
        gameState.teams.forEach(team => {
            team.pawns.forEach(pawn => {
                pawn.stackOffsetX = 0;
                pawn.stackOffsetY = 0;

                let key = '';
                if (pawn.state === 'base') {
                    key = `base_${pawn.team}_${pawn.homeBase ? (pawn.homeBase.gx.toFixed(1) + '_' + pawn.homeBase.gy.toFixed(1)) : pawn.pawnNumber}`;
                } else if (pawn.state === 'gate') {
                    key = `gate_${pawn.team}`;
                } else if (pawn.state === 'lane') {
                    key = `lane_${pawn.team}_${pawn.laneStep}`;
                } else if (pawn.state === 'throne') {
                    key = 'throne';
                } else if (pawn.state === 'track') {
                    key = `track_${pawn.trackIndex}`;
                } else {
                    key = `coord_${pawn.renderGx.toFixed(1)}_${pawn.renderGy.toFixed(1)}`;
                }

                if (!groups[key]) groups[key] = [];
                groups[key].push(pawn);
            });
        });

        const s = this.zoom;
        Object.values(groups).forEach(pawnsOnTile => {
            if (pawnsOnTile.length <= 1) return;

            // Urutkan konsisten berdasarkan tim dan nomor pion
            pawnsOnTile.sort((a, b) => (a.team * 10 + a.pawnNumber) - (b.team * 10 + b.pawnNumber));

            const n = pawnsOnTile.length;
            if (n === 2) {
                // 2 Pion: Pion pertama kiri-belakang (-Y), pion kedua kanan-depan (+Y)
                pawnsOnTile[0].stackOffsetX = -9 * s;
                pawnsOnTile[0].stackOffsetY = -5 * s;
                pawnsOnTile[1].stackOffsetX = 9 * s;
                pawnsOnTile[1].stackOffsetY = 5 * s;
            } else if (n === 3) {
                // 3 Pion: Formasi segitiga (1 puncak belakang, 2 depan)
                pawnsOnTile[0].stackOffsetX = 0;
                pawnsOnTile[0].stackOffsetY = -7 * s;
                pawnsOnTile[1].stackOffsetX = -10 * s;
                pawnsOnTile[1].stackOffsetY = 4 * s;
                pawnsOnTile[2].stackOffsetX = 10 * s;
                pawnsOnTile[2].stackOffsetY = 4 * s;
            } else if (n >= 4) {
                // 4+ Pion: Formasi 4 sudut belah ketupat diamond
                const offsets = [
                    { x: 0, y: -9 },   // Belakang
                    { x: -11, y: 0 },  // Kiri
                    { x: 11, y: 0 },   // Kanan
                    { x: 0, y: 8 }     // Depan
                ];
                pawnsOnTile.forEach((p, idx) => {
                    const off = offsets[idx % 4];
                    p.stackOffsetX = off.x * s;
                    p.stackOffsetY = off.y * s;
                });
            }
        });
    }

    // Koordinat layar pion dengan memperhitungkan offset base dan offset penumpukan (stacking)
    getPawnScreenPos(pawn) {
        const pos = pawn.getInterpolatedPos();
        let { sx, sy } = this.isoToScreen(pos.gx, pos.gy, pos.gz);
        if (pawn.state === 'base') {
            const offsets = (this.BASE_OFFSETS || window.BASE_OFFSETS || BASE_OFFSETS);
            const cornerKeys = ['top', 'right', 'bottom', 'left'];
            const cornerKey = cornerKeys[pawn.team % 4];
            if (offsets && offsets[cornerKey]) {
                sx += (offsets[cornerKey].x || 0) * this.zoom;
                sy += (offsets[cornerKey].y || 0) * this.zoom;
            }
        }
        if (pawn.stackOffsetX) sx += pawn.stackOffsetX;
        if (pawn.stackOffsetY) sy += pawn.stackOffsetY;
        return { sx, sy };
    }

    // Render 3D Low-Poly Miniature Character Pawns (Dudukan Bulat Miniatur)
    renderPawn(pawn, team) {
        const { sx, sy } = this.getPawnScreenPos(pawn);
        const faction = team.faction;
        const s = this.zoom;

        const isCurrentTurn = window.gameState && window.gameState.currentTeamIndex === team.index;

        // 1. Animasi Idle (Bernapas / Bobbing)
        // Gelombang sinus matematika: const idleOffset = Math.sin(Date.now() * 0.004) * 3;
        // Naik-turun 2-3 pixel secara vertikal agar pion terasa hidup dan tidak kaku
        let idleBob = 0;
        if (!pawn.isMoving && (pawn.jumpY || 0) === 0) {
            const idleAmp = (this.PAWN_IDLE_AMPLITUDE !== undefined ? this.PAWN_IDLE_AMPLITUDE : PAWN_IDLE_AMPLITUDE);
            if (isCurrentTurn) {
                // Tim yang gilirannya sedang aktif: bobbing 2.5 - 3 pixel
                idleBob = Math.sin(Date.now() * 0.004 + (pawn.pawnNumber || 0) * 1.5) * idleAmp * s;
            } else {
                // Tim yang sedang menunggu giliran: bernapas lembut 1 pixel
                idleBob = Math.sin(Date.now() * 0.0025 + (pawn.pawnNumber || 0)) * (idleAmp * 0.35) * s;
            }
        }

        // Jump height extra Y offset (parabolic hop)
        const jumpY = (pawn.jumpY || 0) * s;

        // Titik Y dasar dudukan pion saat ini (terangkat oleh idleBob dan jumpY)
        // idleBob positif = pion terangkat ke atas (-idleBob pada kanvas)
        const currentBaseY = sy - idleBob - jumpY;

        this.ctx.save();

        // 2. Bayangan Oval Tipis Transparan di Bawah Dudukan Pion
        // Bayangan di tanah mengecil saat pion di udara dan membesar pekat saat mendarat (squash)
        // serta membesar/mengecil mengikuti ritme naik-turun idle
        const isAirborne = (pawn.jumpY || 0) > 0;
        let shadowScaleX = 1.0;
        let shadowScaleY = 1.0;
        let shadowAlpha = 0.40;

        if (isAirborne) {
            // Di udara: Bayangan mengecil dan memudar
            const airFactor = Math.max(0.2, 1.0 - (pawn.jumpY || 0) / 45);
            shadowScaleX = Math.max(0.35, airFactor);
            shadowScaleY = Math.max(0.35, airFactor);
            shadowAlpha = 0.15 + 0.25 * airFactor;
        } else if ((pawn.scaleX || 1.0) > 1.02) {
            // Mendarat (Squash impact): Bayangan membesar pekat
            const squashRatio = Math.min(1.0, (pawn.scaleX - 1.0) / 0.15);
            shadowScaleX = 1.0 + 0.22 * squashRatio;
            shadowScaleY = 1.0 + 0.15 * squashRatio;
            shadowAlpha = 0.40 + 0.25 * squashRatio; // membesar pekat hingga ~0.65
        } else {
            // Idle bobbing ritmis: membesar/mengecil halus mengikuti naik-turun
            const idleShadowFactor = Math.max(0.75, Math.min(1.25, 1.0 - (idleBob / (12 * s))));
            shadowScaleX = idleShadowFactor;
            shadowScaleY = idleShadowFactor;
            shadowAlpha = 0.40 * idleShadowFactor;
        }

        // Gambar bayangan oval tipis transparan tepat di lantai dasar (sx, sy)
        const baseShadowRx = 16 * s;
        const baseShadowRy = 8 * s;
        this.ctx.beginPath();
        this.ctx.ellipse(sx, sy, baseShadowRx * shadowScaleX, baseShadowRy * shadowScaleY, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        this.ctx.fill();

        // 3. Selection / Turn Indicator Ring under pawn (Lantai dasar di bawah pion)
        if (isCurrentTurn && pawn.isSelectable) {
            const ringPulse = Math.sin(this.time * 6) * 3 * s;
            this.ctx.beginPath();
            this.ctx.ellipse(sx, sy, 18 * s + ringPulse, 9 * s + ringPulse * 0.5, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 2.5 * s;
            this.ctx.stroke();
        }

        // 4. Render 3D Miniature Character Pawn PNG Image (Dudukan Bulat Miniatur)
        const img = this.getPawnImage(team.index, faction);
        const pScale = (this.PAWN_SCALE !== undefined ? this.PAWN_SCALE : PAWN_SCALE) * s;
        const anchorRatioX = (this.PAWN_ANCHOR_X !== undefined ? this.PAWN_ANCHOR_X : PAWN_ANCHOR_X);
        const anchorRatioY = (this.PAWN_ANCHOR_Y !== undefined ? this.PAWN_ANCHOR_Y : PAWN_ANCHOR_Y);
        const offX = (this.PAWN_OFFSET_X !== undefined ? this.PAWN_OFFSET_X : PAWN_OFFSET_X) * s;
        const offY = (this.PAWN_OFFSET_Y !== undefined ? this.PAWN_OFFSET_Y : PAWN_OFFSET_Y) * s;

        const scaleX = (pawn.scaleX !== undefined ? pawn.scaleX : 1.0);
        const scaleY = (pawn.scaleY !== undefined ? pawn.scaleY : 1.0);

        if (img) {
            const bw = (img.width || 160) * pScale;
            const bh = (img.height || 200) * pScale;
            const anchorX = bw * anchorRatioX;
            const anchorY = bh * anchorRatioY;

            this.ctx.save();
            // Transformasi berpusat di titik jangkar TENGAH BAWAH (bottom-center) dudukan bulat
            this.ctx.translate(sx + offX, currentBaseY + offY);
            this.ctx.scale(scaleX, scaleY);
            this.ctx.drawImage(img, -anchorX, -anchorY, bw, bh);
            this.ctx.restore();
        } else {
            // Fallback gambar prosedural jika aset belum dimuat
            this.drawFactionCharacter(sx, currentBaseY - 14 * s, faction, s, pawn);
        }

        // 5. Active Aegis Shield Sphere (Melindungi & Menyelimuti Seluruh Tubuh Pion 3D)
        const pawnMidY = currentBaseY - 30 * s * scaleY;
        if (pawn.hasShield) {
            const shieldRadius = 36 * s;
            const shieldPulse = Math.sin(this.time * 4) * 0.15 + 0.85; // 0.70 to 1.0

            this.ctx.save();
            // Lapisan Aura Bola Energi Pelindung
            const shieldGrad = this.ctx.createRadialGradient(
                sx, pawnMidY - 6 * s, 4 * s,
                sx, pawnMidY, shieldRadius
            );
            shieldGrad.addColorStop(0, `rgba(180, 245, 255, ${0.40 * shieldPulse})`);
            shieldGrad.addColorStop(0.65, `rgba(0, 180, 240, ${0.30 * shieldPulse})`);
            shieldGrad.addColorStop(0.92, `rgba(0, 119, 182, ${0.45 * shieldPulse})`);
            shieldGrad.addColorStop(1.0, `rgba(202, 240, 248, ${0.85 * shieldPulse})`);

            this.ctx.beginPath();
            this.ctx.arc(sx, pawnMidY, shieldRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = shieldGrad;
            this.ctx.fill();

            // Garis Tepi Perisai Berpendar (Glow Border)
            this.ctx.strokeStyle = `rgba(202, 240, 248, ${0.9 * shieldPulse})`;
            this.ctx.lineWidth = 2.5 * s;
            this.ctx.stroke();

            // Cincin Orbit Energi Perisai
            this.ctx.beginPath();
            this.ctx.ellipse(sx, pawnMidY, shieldRadius + 3 * s, (shieldRadius * 0.45), this.time * 1.5, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(144, 224, 239, ${0.6 * shieldPulse})`;
            this.ctx.lineWidth = 1.5 * s;
            this.ctx.stroke();

            this.ctx.restore();
        }

        // 6. Pawn Label / ID Badge (Melayang di atas kepala pion / perisai)
        const pawnTopY = pawn.hasShield ? (pawnMidY - 39 * s) : (currentBaseY - 56 * s * scaleY);
        this.ctx.font = `bold ${Math.round(10 * s)}px sans-serif`;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2.5 * s;
        const label = `${pawn.pawnNumber}`;
        this.ctx.strokeText(label, sx, pawnTopY);
        this.ctx.fillText(label, sx, pawnTopY);

        this.ctx.restore();
    }

    // Draw the procedural cute 3D low-poly figurines
    drawFactionCharacter(x, y, faction, s, pawn) {
        const type = faction.pawnType;
        const idleBounce = Math.sin(this.time * 4 + pawn.pawnNumber) * 1.5 * s;
        const cy = y + idleBounce;

        // Base Pedestal for Pawn Figurine (Miniature tabletop miniature look)
        this.ctx.fillStyle = faction.secondaryColor;
        this.ctx.beginPath();
        this.ctx.ellipse(x, cy + 12 * s, 11 * s, 5 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = faction.highlightColor;
        this.ctx.lineWidth = 1.5 * s;
        this.ctx.stroke();

        // Distinct character bodies
        switch (type) {
            case 'dragon':
                this.drawCuteDragon(x, cy, faction, s);
                break;
            case 'knight':
                this.drawCuteKnight(x, cy, faction, s);
                break;
            case 'elf':
                this.drawCuteElf(x, cy, faction, s);
                break;
            case 'wizard':
                this.drawCuteWizard(x, cy, faction, s);
                break;
            case 'wolf':
                this.drawCuteWolf(x, cy, faction, s);
                break;
            case 'crown':
                this.drawCutePrince(x, cy, faction, s);
                break;
            default:
                this.drawCuteKnight(x, cy, faction, s);
        }
    }

    // 1. Cute Mini Armored Dragon
    drawCuteDragon(x, y, f, s) {
        // Red chubby body
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 2 * s, 9 * s, 10 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Golden belly plates
        this.ctx.fillStyle = f.highlightColor;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 4 * s, 5 * s, 6 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Dragon Mini Wings
        const wingFlap = Math.sin(this.time * 8) * 3 * s;
        this.ctx.fillStyle = f.secondaryColor;
        // Left wing
        this.ctx.beginPath();
        this.ctx.moveTo(x - 6 * s, y);
        this.ctx.lineTo(x - 16 * s, y - 6 * s + wingFlap);
        this.ctx.lineTo(x - 9 * s, y + 5 * s);
        this.ctx.closePath();
        this.ctx.fill();
        // Right wing
        this.ctx.beginPath();
        this.ctx.moveTo(x + 6 * s, y);
        this.ctx.lineTo(x + 16 * s, y - 6 * s - wingFlap);
        this.ctx.lineTo(x + 9 * s, y + 5 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Golden Horns
        this.ctx.fillStyle = '#ffb703';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 5 * s, y - 8 * s);
        this.ctx.lineTo(x - 9 * s, y - 16 * s);
        this.ctx.lineTo(x - 3 * s, y - 9 * s);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 5 * s, y - 8 * s);
        this.ctx.lineTo(x + 9 * s, y - 16 * s);
        this.ctx.lineTo(x + 3 * s, y - 9 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Cute Big Cartoon Eyes
        this.drawCuteEyes(x, y - 3 * s, s);
    }

    // 2. Cute Full Plate Knight
    drawCuteKnight(x, y, f, s) {
        // Steel Armor Torso
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.roundRect(x - 8 * s, y - 3 * s, 16 * s, 14 * s, 4 * s);
        this.ctx.fill();

        // Greathelm
        this.ctx.fillStyle = f.highlightColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y - 8 * s, 8 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Dark Visor Slit
        this.ctx.fillStyle = '#111111';
        this.ctx.fillRect(x - 6 * s, y - 9 * s, 12 * s, 3 * s);

        // Red Plume Feather on Helmet
        this.ctx.fillStyle = '#e63946';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 16 * s);
        this.ctx.quadraticCurveTo(x + 8 * s, y - 20 * s, x + 6 * s, y - 12 * s);
        this.ctx.lineTo(x, y - 14 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Heater Shield
        this.ctx.fillStyle = f.secondaryColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 13 * s, y - 2 * s);
        this.ctx.lineTo(x - 5 * s, y - 2 * s);
        this.ctx.lineTo(x - 9 * s, y + 10 * s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 1 * s;
        this.ctx.stroke();

        // Tiny Sword
        this.ctx.fillStyle = '#adb5bd';
        this.ctx.fillRect(x + 8 * s, y - 5 * s, 3 * s, 14 * s);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillRect(x + 6 * s, y - 2 * s, 7 * s, 2 * s);
    }

    // 3. Cute Elf Archer
    drawCuteElf(x, y, f, s) {
        // Emerald Cloak
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 6 * s);
        this.ctx.lineTo(x + 10 * s, y + 10 * s);
        this.ctx.lineTo(x - 10 * s, y + 10 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Face
        this.ctx.fillStyle = '#ffdfba';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 7 * s, 7 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Pointy Elf Ears
        this.ctx.fillStyle = '#ffdfba';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 6 * s, y - 7 * s);
        this.ctx.lineTo(x - 13 * s, y - 11 * s);
        this.ctx.lineTo(x - 6 * s, y - 4 * s);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 6 * s, y - 7 * s);
        this.ctx.lineTo(x + 13 * s, y - 11 * s);
        this.ctx.lineTo(x + 6 * s, y - 4 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Green Robin Hood Feather Cap
        this.ctx.fillStyle = f.secondaryColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 7 * s, y - 9 * s);
        this.ctx.lineTo(x + 7 * s, y - 9 * s);
        this.ctx.lineTo(x, y - 18 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Wooden Longbow
        this.ctx.strokeStyle = '#8c5a2b';
        this.ctx.lineWidth = 2 * s;
        this.ctx.beginPath();
        this.ctx.arc(x + 9 * s, y + 1 * s, 9 * s, -Math.PI * 0.4, Math.PI * 0.4);
        this.ctx.stroke();

        this.drawCuteEyes(x, y - 7 * s, s);
    }

    // 4. Cute Arcane Wizard
    drawCuteWizard(x, y, f, s) {
        // Purple Mystic Robe
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 5 * s);
        this.ctx.lineTo(x + 10 * s, y + 10 * s);
        this.ctx.lineTo(x - 10 * s, y + 10 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Fluffy White Wizard Beard
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 1 * s, 6 * s, 7 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Face
        this.ctx.fillStyle = '#ffdfba';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 7 * s, 6 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Tall Pointy Wizard Hat with Star
        this.ctx.fillStyle = f.secondaryColor;
        // Brim
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 9 * s, 11 * s, 4 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();
        // Cone
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8 * s, y - 9 * s);
        this.ctx.lineTo(x + 2 * s, y - 24 * s);
        this.ctx.lineTo(x + 8 * s, y - 9 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Crystal Staff
        this.ctx.strokeStyle = '#582f0e';
        this.ctx.lineWidth = 2 * s;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10 * s, y + 10 * s);
        this.ctx.lineTo(x + 10 * s, y - 14 * s);
        this.ctx.stroke();

        // Glowing Violet Orb on staff
        const orbGlow = Math.sin(this.time * 6) * 0.2 + 0.8;
        this.ctx.fillStyle = f.accentColor;
        this.ctx.beginPath();
        this.ctx.arc(x + 10 * s, y - 16 * s, 4 * s * orbGlow, 0, Math.PI * 2);
        this.ctx.fill();

        this.drawCuteEyes(x, y - 7 * s, s);
    }

    // 5. Cute Northern Wolf Warrior
    drawCuteWolf(x, y, f, s) {
        // Icy Armor
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.roundRect(x - 8 * s, y - 2 * s, 16 * s, 13 * s, 3 * s);
        this.ctx.fill();

        // Wolf Head Fur Cowl
        this.ctx.fillStyle = '#e9ecef';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 8 * s, 8 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Wolf Ears
        this.ctx.fillStyle = f.secondaryColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 7 * s, y - 12 * s);
        this.ctx.lineTo(x - 10 * s, y - 18 * s);
        this.ctx.lineTo(x - 3 * s, y - 13 * s);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 7 * s, y - 12 * s);
        this.ctx.lineTo(x + 10 * s, y - 18 * s);
        this.ctx.lineTo(x + 3 * s, y - 13 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Viking Battleaxe
        this.ctx.strokeStyle = '#6c757d';
        this.ctx.lineWidth = 2.5 * s;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10 * s, y + 8 * s);
        this.ctx.lineTo(x + 10 * s, y - 12 * s);
        this.ctx.stroke();

        // Axe crescent blade
        this.ctx.fillStyle = '#00b4d8';
        this.ctx.beginPath();
        this.ctx.arc(x + 13 * s, y - 8 * s, 5 * s, -Math.PI * 0.5, Math.PI * 0.5);
        this.ctx.fill();

        this.drawCuteEyes(x, y - 7 * s, s);
    }

    // 6. Cute Golden Prince / King
    drawCutePrince(x, y, f, s) {
        // Royal Mantle & Ermine Collar
        this.ctx.fillStyle = '#9e2a2b';
        this.ctx.beginPath();
        this.ctx.roundRect(x - 9 * s, y - 2 * s, 18 * s, 13 * s, 4 * s);
        this.ctx.fill();

        // White Ermine fur collar
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x - 8 * s, y - 3 * s, 16 * s, 4 * s);

        // Face
        this.ctx.fillStyle = '#ffdfba';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 8 * s, 7 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Sparkling Royal Crown
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 8 * s, y - 12 * s);
        this.ctx.lineTo(x - 7 * s, y - 18 * s);
        this.ctx.lineTo(x - 3 * s, y - 14 * s);
        this.ctx.lineTo(x, y - 20 * s);
        this.ctx.lineTo(x + 3 * s, y - 14 * s);
        this.ctx.lineTo(x + 7 * s, y - 18 * s);
        this.ctx.lineTo(x + 8 * s, y - 12 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Ruby in Crown
        this.ctx.fillStyle = '#e63946';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 15 * s, 1.5 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Golden Scepter
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2 * s;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10 * s, y + 8 * s);
        this.ctx.lineTo(x + 10 * s, y - 10 * s);
        this.ctx.stroke();

        this.ctx.fillStyle = '#e09f3e';
        this.ctx.beginPath();
        this.ctx.arc(x + 10 * s, y - 12 * s, 3.5 * s, 0, Math.PI * 2);
        this.ctx.fill();

        this.drawCuteEyes(x, y - 8 * s, s);
    }

    // Helper for cute cartoon eyes
    drawCuteEyes(x, y, s) {
        this.ctx.fillStyle = '#111111';
        this.ctx.beginPath();
        this.ctx.arc(x - 3 * s, y, 1.8 * s, 0, Math.PI * 2);
        this.ctx.arc(x + 3 * s, y, 1.8 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Eye glint
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x - 3.5 * s, y - 0.7 * s, 0.7 * s, 0, Math.PI * 2);
        this.ctx.arc(x + 2.5 * s, y - 0.7 * s, 0.7 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Render floating score/effect texts
    renderFloatingTexts(dt) {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.elapsed += dt;
            ft.yOffset += 40 * dt;
            ft.alpha = Math.max(0, 1 - (ft.elapsed / ft.duration));

            const { sx, sy } = this.isoToScreen(ft.gx, ft.gy, ft.gz);
            const drawY = sy - ft.yOffset * this.zoom;

            this.ctx.save();
            this.ctx.globalAlpha = ft.alpha;
            this.ctx.font = `900 ${Math.round(ft.size * this.zoom)}px "Cinzel", "Trajan Pro", Georgia, serif`;
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = ft.color;
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3.5 * this.zoom;
            this.ctx.strokeText(ft.text, sx, drawY);
            this.ctx.fillText(ft.text, sx, drawY);
            this.ctx.restore();

            if (ft.elapsed >= ft.duration) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // Render animated particles
    renderParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.elapsed += dt;
            p.gx += p.vx;
            p.gy += p.vy;
            p.gz += p.vz;
            p.vz -= 0.15 * dt; // gravity
            p.alpha = Math.max(0, 1 - (p.elapsed / p.duration));

            const { sx, sy } = this.isoToScreen(p.gx, p.gy, p.gz);

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, p.size * this.zoom, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            if (p.elapsed >= p.duration) {
                this.particles.splice(i, 1);
            }
        }
    }
}

window.IsometricRenderer = IsometricRenderer;
window.getBaseImage = function(teamIndex, selectedFaction) {
    if (window.renderer && typeof window.renderer.getBaseImage === 'function') {
        return window.renderer.getBaseImage(teamIndex, selectedFaction);
    }
    return null;
};
window.getPawnImage = function(teamIndex, selectedFaction) {
    if (window.renderer && typeof window.renderer.getPawnImage === 'function') {
        return window.renderer.getPawnImage(teamIndex, selectedFaction);
    }
    return null;
};
