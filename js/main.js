/**
 * PENAKHLUKAN KERAJAAN - Main Entry Point
 */

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Board Topology
    const board = new GameBoard();
    window.board = board;

    // 2. Initialize Canvas & Renderer
    const canvas = document.getElementById('gameCanvas');
    const renderer = new IsometricRenderer(canvas, board);
    window.renderer = renderer;

    // 3. Initialize Game State Engine
    const gameState = new GameState(board);
    window.gameState = gameState;

    // 4. Initialize 3D Medieval Dice in Container
    const diceContainer = document.getElementById('diceContainer');
    const dice = new MedievalDice(diceContainer, (rollValue) => {
        gameState.handleDiceRoll(rollValue);
    });
    window.dice = dice;

    // 5. Initialize UI Manager & Start Gameplay
    const ui = new UIManager();
    ui.setGameInstances(gameState, dice);
    window.ui = ui;
    ui.initGameplay();

    // 6. Fullscreen & Map Navigation Controls
    const btnFullscreen = document.getElementById('btnFullscreen');
    if (btnFullscreen) {
        const updateFsIcon = () => {
            const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            btnFullscreen.innerHTML = isFs ? '🗗' : '⛶';
            btnFullscreen.title = isFs ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)';
        };

        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                const docEl = document.documentElement;
                if (docEl.requestFullscreen) docEl.requestFullscreen();
                else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
                else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
                else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', updateFsIcon);
        document.addEventListener('webkitfullscreenchange', updateFsIcon);
        document.addEventListener('mozfullscreenchange', updateFsIcon);
    }

    const btnZoomIn = document.getElementById('btnZoomIn');
    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playClick();
            renderer.zoomIn();
        });
    }

    const btnZoomOut = document.getElementById('btnZoomOut');
    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playClick();
            renderer.zoomOut();
        });
    }

    const btnResetView = document.getElementById('btnResetView');
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.playClick();
            renderer.resetView();
        });
    }

    // Interactive Map Pan & Dragging with Mouse & Touch
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragDistance = 0;

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragDistance = 0;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragDistance += Math.hypot(dx, dy);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        renderer.panBy(dx, dy);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchDragDist = 0;

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchDragDist = 0;
        }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const dx = e.touches[0].clientX - touchStartX;
            const dy = e.touches[0].clientY - touchStartY;
            touchDragDist += Math.hypot(dx, dy);
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            renderer.panBy(dx, dy);
        }
    }, { passive: true });

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        renderer.setZoomDelta(delta);
    }, { passive: false });

    // 7. Interactive Canvas Click / Tap for Pawn Selection
    canvas.addEventListener('click', (e) => {
        if (!gameState || gameState.isGameOver || !gameState.teams.length) return;
        if (dragDistance > 6 || touchDragDist > 6) return; // Abaikan klik jika pengguna sedang menggeser peta

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check if user clicked on a selectable pawn
        const curTeam = gameState.getCurrentTeam();
        const selectablePawns = curTeam.pawns.filter(p => p.isSelectable);

        for (const p of selectablePawns) {
            const pPos = p.getInterpolatedPos();
            const { sx, sy } = (renderer.getPawnScreenPos ? renderer.getPawnScreenPos(p) : renderer.isoToScreen(pPos.gx, pPos.gy, pPos.gz));
            const dist = Math.hypot(clickX - sx, clickY - (sy - 16 * renderer.zoom));
            if (dist < 32 * renderer.zoom) {
                // Clicked pawn!
                if (window.soundEngine) window.soundEngine.playClick();
                // Dismiss modal if open
                const pawnPicker = document.getElementById('pawnPickerModal');
                if (pawnPicker) pawnPicker.classList.add('hidden');
                gameState.selectPawnToMove(p);
                break;
            }
        }
    });

    // 7. Load Environment Assets & Start 60FPS Game Loop
    // Pastikan loop render baru dimulai setelah semua gambar selesai dimuat (Preloader)
    loadEnvironmentAssets().then((envAssets) => {
        renderer.setEnvironmentAssets(envAssets);
        renderer.generateIsland();

        function gameLoop() {
            if (gameState && gameState.teams && gameState.teams.length > 0) {
                renderer.render(gameState);
            }
            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
    }).catch(err => {
        console.error('Error memuat aset lingkungan:', err);
        // Fallback jika terjadi error
        renderer.generateIsland();
        function gameLoop() {
            if (gameState && gameState.teams && gameState.teams.length > 0) {
                renderer.render(gameState);
            }
            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
    });

    // Initial audio resume on first user interaction anywhere
    const enableAudio = () => {
        if (window.soundEngine) {
            window.soundEngine.init();
            window.soundEngine.playBGM('gameplay');
        }
        window.removeEventListener('click', enableAudio);
        window.removeEventListener('keydown', enableAudio);
    };
    window.addEventListener('click', enableAudio);
    window.addEventListener('keydown', enableAudio);
});
