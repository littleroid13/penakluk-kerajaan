/**
 * PENAKHLUKAN KERAJAAN - UI Manager & Modal Controllers
 * Mengatur Lobby, HUD, Interaksi Soal (5 tipe), Tantangan Dare, Piagam Skor, dan Bank Soal.
 */

class UIManager {
    constructor() {
        this.gameState = null;
        this.dice = null;
        this.selectedFactions = ['elves', 'dragon', 'crown', 'wolves']; // Default 4 factions: Atas (Green), Kanan (Red), Bawah (Yellow), Kiri (Blue)
        this.initDOM();
    }

    setGameInstances(gameState, dice) {
        this.gameState = gameState;
        if (this.gameState) this.gameState.ui = this;
        window.ui = this;
        this.dice = dice;
        this.bindGameEvents();
    }

    initDOM() {
        // Cache DOM elements
        this.lobbyScreen = document.getElementById('lobbyScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.btnStartGame = document.getElementById('btnStartGame');
        this.pawnCountSelect = document.getElementById('pawnCountSelect');

        // Modals
        this.truthModal = document.getElementById('truthModal');
        this.dareModal = document.getElementById('dareModal');
        this.specialDiceModal = document.getElementById('specialDiceModal');
        this.weirdDiceModal = document.getElementById('weirdDiceModal');
        this.actionChoiceModal = document.getElementById('actionChoiceModal');
        this.questionBankModal = document.getElementById('questionBankModal');
        this.pawnPickerModal = document.getElementById('pawnPickerModal');
        this.leaderboardModal = document.getElementById('leaderboardModal');
        this.endGameConfirmModal = document.getElementById('endGameConfirmModal');
        this.rulesModal = document.getElementById('rulesModal');

        this.setupLobbyFactions();
        this.setupEventListeners();
    }

    setupLobbyFactions() {
        const container = document.getElementById('teamsSetupContainer');
        if (!container) return;

        const defaultNames = [
            '1 - Naga Api',
            '2 - Benteng Baja',
            '3 - Hutan Zamrud',
            '4 - Ordo Sihir'
        ];

        container.innerHTML = '';

        for (let t = 0; t < 4; t++) {
            const teamCard = document.createElement('div');
            teamCard.className = `team-setup-card team-card-${t}`;
            teamCard.dataset.teamIndex = t;

            teamCard.innerHTML = `
                <div class="team-setup-header">
                    <span class="team-badge-num">${t + 1}</span>
                    <input type="text" class="input-team-name" id="teamName_${t}" value="${defaultNames[t]}" maxlength="20">
                </div>
                <div class="faction-picker-label">Pilih Faksi Kerajaan:</div>
                <div class="faction-options-grid" id="factionGrid_${t}">
                    ${FACTIONS.map(f => `
                        <div class="faction-option-btn ${f.id === this.selectedFactions[t] ? 'selected' : ''}" 
                             data-team="${t}" data-faction="${f.id}" style="--faction-color: ${f.color}">
                            <span class="f-icon">${f.icon}</span>
                            <span class="f-name">${f.shortName}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="faction-preview" id="factionPreview_${t}"></div>
            `;

            container.appendChild(teamCard);
            this.updateFactionPreview(t, this.selectedFactions[t]);
        }

        // Handle faction clicking
        container.querySelectorAll('.faction-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const teamIdx = parseInt(btn.dataset.team);
                const factionId = btn.dataset.faction;

                if (window.soundEngine) window.soundEngine.playClick();

                // Swap if already used by another team
                const existingOwner = this.selectedFactions.indexOf(factionId);
                if (existingOwner !== -1 && existingOwner !== teamIdx) {
                    // Swap factions
                    const oldFaction = this.selectedFactions[teamIdx];
                    this.selectedFactions[existingOwner] = oldFaction;
                    this.updateFactionPreview(existingOwner, oldFaction);
                    this.refreshFactionButtons(existingOwner);
                }

                this.selectedFactions[teamIdx] = factionId;
                this.updateFactionPreview(teamIdx, factionId);
                this.refreshFactionButtons(teamIdx);
            });
        });
    }

    refreshFactionButtons(teamIdx) {
        const grid = document.getElementById(`factionGrid_${teamIdx}`);
        if (!grid) return;
        grid.querySelectorAll('.faction-option-btn').forEach(b => {
            if (b.dataset.faction === this.selectedFactions[teamIdx]) {
                b.classList.add('selected');
            } else {
                b.classList.remove('selected');
            }
        });
    }

    updateFactionPreview(teamIdx, factionId) {
        const faction = getFactionById(factionId);
        const preview = document.getElementById(`factionPreview_${teamIdx}`);
        if (!preview) return;

        preview.innerHTML = `
            <div class="preview-unit">
                <span class="preview-unit-name" style="color: ${faction.color}">${faction.unitName}</span>
                <span class="preview-motto">${faction.motto}</span>
            </div>
        `;
    }

    setupEventListeners() {
        // Start game button
        if (this.btnStartGame) {
            this.btnStartGame.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                this.startGameFromLobby();
            });
        }

        // Sound mute buttons (Icon Only: 🔊 / 🔇)
        document.querySelectorAll('.btn-toggle-sound').forEach(btn => {
            btn.addEventListener('click', () => {
                const muted = window.soundEngine.toggleMute();
                document.querySelectorAll('.btn-toggle-sound').forEach(b => {
                    b.innerHTML = muted ? '🔇' : '🔊';
                });
            });
        });

        // Rules modal buttons (Icon Only: 📜)
        const btnRules = document.getElementById('btnRules');
        if (btnRules) {
            btnRules.addEventListener('click', () => {
                if (this.rulesModal) this.rulesModal.classList.remove('hidden');
            });
        }
        document.querySelectorAll('.btn-open-rules').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.rulesModal) this.rulesModal.classList.remove('hidden');
            });
        });

        // Back to Lobby button (🏰)
        const btnBackToLobby = document.getElementById('btnBackToLobby');
        if (btnBackToLobby) {
            btnBackToLobby.addEventListener('click', () => {
                if (confirm('Kembali ke Lobby pemilihan tim?')) {
                    window.location.href = 'index.html';
                }
            });
        }

        // Question Bank buttons (in Lobby)
        document.querySelectorAll('.btn-open-question-bank').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openQuestionBankModal();
            });
        });

        // Modal Close buttons
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.add('hidden');
            });
        });

        // Export Excel button (dengan fallback ke CSV)
        const btnExportExcel = document.getElementById('btnExportExcel') || document.getElementById('btnExportCSV');
        if (btnExportExcel) {
            btnExportExcel.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                if (this.gameState) {
                    if (typeof this.gameState.exportToExcel === 'function') {
                        this.gameState.exportToExcel();
                    } else if (typeof this.gameState.exportToCSV === 'function') {
                        this.gameState.exportToCSV();
                    }
                }
            });
        }

        // Pengaturan Suara (Audio Options Modal)
        const btnGameOptions = document.getElementById('btnGameOptions');
        const audioSettingsModal = document.getElementById('audioSettingsModal');
        const closeAudioSettingsBtn = document.getElementById('closeAudioSettingsBtn');
        const btnCloseAudioSettings = document.getElementById('btnCloseAudioSettings');
        const bgmSlider = document.getElementById('bgmVolumeSlider');
        const sfxSlider = document.getElementById('sfxVolumeSlider');
        const bgmVal = document.getElementById('bgmVolumeVal');
        const sfxVal = document.getElementById('sfxVolumeVal');

        const syncAudioUI = () => {
            if (window.soundEngine) {
                const bgmPct = Math.round((window.soundEngine.bgmVolume !== undefined ? window.soundEngine.bgmVolume : 0.7) * 100);
                const sfxPct = Math.round((window.soundEngine.sfxVolume !== undefined ? window.soundEngine.sfxVolume : 0.8) * 100);
                if (bgmSlider) bgmSlider.value = bgmPct;
                if (sfxSlider) sfxSlider.value = sfxPct;
                if (bgmVal) bgmVal.textContent = `${bgmPct}%`;
                if (sfxVal) sfxVal.textContent = `${sfxPct}%`;
            }
        };

        if (btnGameOptions && audioSettingsModal) {
            btnGameOptions.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                syncAudioUI();
                audioSettingsModal.classList.remove('hidden');
            });
        }
        if (closeAudioSettingsBtn && audioSettingsModal) {
            closeAudioSettingsBtn.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                audioSettingsModal.classList.add('hidden');
            });
        }
        if (btnCloseAudioSettings && audioSettingsModal) {
            btnCloseAudioSettings.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                audioSettingsModal.classList.add('hidden');
            });
        }
        if (bgmSlider) {
            bgmSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                if (bgmVal) bgmVal.textContent = `${val}%`;
                if (window.soundEngine) window.soundEngine.setBGMVolume(val / 100);
            });
        }
        if (sfxSlider) {
            sfxSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                if (sfxVal) sfxVal.textContent = `${val}%`;
                if (window.soundEngine) window.soundEngine.setSFXVolume(val / 100);
            });
        }

        // Leaderboard Action buttons
        const btnBackLobbyLeaderboard = document.getElementById('btnBackLobbyLeaderboard');
        if (btnBackLobbyLeaderboard) {
            btnBackLobbyLeaderboard.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                window.location.href = 'index.html';
            });
        }

        // Play Again button (Restarts Match)
        const btnPlayAgain = document.getElementById('btnPlayAgain');
        if (btnPlayAgain) {
            btnPlayAgain.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                window.location.reload();
            });
        }

        // Tombol End Game & Konfirmasi
        const btnEndGame = document.getElementById('btnEndGame');
        if (btnEndGame) {
            btnEndGame.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                if (this.endGameConfirmModal) {
                    this.endGameConfirmModal.classList.remove('hidden');
                }
            });
        }

        const btnCancelEndGame = document.getElementById('btnCancelEndGame');
        if (btnCancelEndGame) {
            btnCancelEndGame.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                if (this.endGameConfirmModal) {
                    this.endGameConfirmModal.classList.add('hidden');
                }
            });
        }

        const btnConfirmEndGame = document.getElementById('btnConfirmEndGame');
        if (btnConfirmEndGame) {
            btnConfirmEndGame.addEventListener('click', () => {
                if (window.soundEngine) window.soundEngine.playClick();
                if (this.endGameConfirmModal) {
                    this.endGameConfirmModal.classList.add('hidden');
                }
                this.handleForceEndGame();
            });
        }
    }

    initGameplay() {
        if (!this.gameState) return;

        let teamConfigs = [
            { name: '1 - Hutan Zamrud', factionId: 'elves' },
            { name: '2 - Naga Api', factionId: 'dragon' },
            { name: '3 - Mahkota Emas', factionId: 'crown' },
            { name: '4 - Serigala Es', factionId: 'wolves' }
        ];

        let pawnsPerTeam = 4;
        try {
            const raw = localStorage.getItem('penakhlukan_game_config');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.teams && parsed.teams.length === 4) {
                    teamConfigs = parsed.teams.map((t, idx) => ({
                        ...t,
                        name: (t.name || `${idx + 1}`).replace(/^Tim\s*(\d+)/i, '$1')
                    }));
                }
                if (parsed.pawnsPerTeam) {
                    pawnsPerTeam = parsed.pawnsPerTeam;
                }
            }
        } catch(e) {}

        this.gameState.setupGame(teamConfigs, pawnsPerTeam);
        this.updateHUD(this.gameState.getCurrentTeam());
        this.updateTeamsScoreboard();

        if (window.renderer) {
            setTimeout(() => window.renderer.resize(), 50);
        }
    }

    bindGameEvents() {
        this.gameState.onTurnChange = (team) => {
            this.updateHUD(team);
            this.updateTeamsScoreboard();
            if (this.dice) this.dice.setDisabled(false);
        };

        this.gameState.onScoreUpdate = () => {
            this.updateTeamsScoreboard();
        };

        this.gameState.onPawnSelectionNeeded = (team, eligiblePawns, roll) => {
            this.showPawnPicker(team, eligiblePawns, roll);
        };

        this.gameState.onClashDuel = (attackerPawn, defenderPawn, attackerTeam, defenderTeam) => {
            this.showClashDuelModal(attackerPawn, defenderPawn, attackerTeam, defenderTeam);
        };

        this.gameState.onTileEvent = (typeId, pawn, team) => {
            switch (typeId) {
                case 'truth':
                    this.showTruthModal(pawn, team);
                    break;
                case 'dare':
                    this.showDareModal(pawn, team);
                    break;
                case 'special_dice':
                    this.showSpecialDiceModal(pawn, team);
                    break;
                case 'weird_dice':
                    this.showWeirdDiceModal(pawn, team);
                    break;
            }
        };

        this.gameState.onGameOver = (winnerTeam) => {
            setTimeout(() => {
                this.showLeaderboardModal();
            }, 1200);
        };
    }

    // Update Top Turn Banner & HUD
    updateHUD(currentTeam) {
        const turnTeamName = document.getElementById('turnTeamName');
        const turnTeamIcon = document.getElementById('turnTeamIcon');
        const turnRoundBadge = document.getElementById('turnRoundBadge');
        const turnMotto = document.getElementById('turnMotto');
        const hudTurnBar = document.getElementById('hudTurnBar');

        if (turnTeamName) turnTeamName.textContent = currentTeam.name;
        if (turnTeamIcon) turnTeamIcon.textContent = currentTeam.faction.icon;
        if (turnRoundBadge) turnRoundBadge.textContent = `RONDE ${this.gameState.turnCount}`;
        if (turnMotto) turnMotto.textContent = currentTeam.faction.motto;

        if (hudTurnBar) {
            hudTurnBar.style.borderColor = currentTeam.faction.color;
            hudTurnBar.style.boxShadow = `0 4px 20px ${currentTeam.faction.glowColor}`;
        }
    }

    // Update 4 Team scorecards
    updateTeamsScoreboard() {
        const container = document.getElementById('teamsScoreList');
        if (!container || !this.gameState) return;

        container.innerHTML = this.gameState.teams.map(team => {
            const isCurrent = this.gameState.currentTeamIndex === team.index;
            const finishedPawns = team.pawns.filter(p => p.state === 'throne').length;
            const isAllDone = (finishedPawns === this.gameState.pawnsPerTeam);

            return `
                <div class="team-score-card ${isCurrent ? 'active-turn' : ''} ${isAllDone ? 'team-done' : ''}" style="--t-color: ${team.faction.color}">
                    <div class="tsc-header">
                        <span class="tsc-icon">${team.faction.icon}</span>
                        <span class="tsc-name">${team.name}</span>
                    </div>
                    <div class="tsc-body">
                        <div class="tsc-score">${team.score} <small>Poin</small></div>
                        <div class="tsc-pawns">${isAllDone ? '👑 LENGKAP!' : `👑 Finish: ${finishedPawns}/${this.gameState.pawnsPerTeam}`}</div>
                    </div>
                    ${team.skipNextTurn ? '<div class="tsc-status-badge skip">💤 Skip Giliran</div>' : ''}
                    ${isAllDone ? '<div class="tsc-status-badge finished" style="background:#10b981; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; margin-top:3px; display:inline-block;">🏆 Selesai Finish</div>' : ''}
                </div>
            `;
        }).join('');
    }

    // Pawn Selection Modal
    showPawnPicker(team, eligiblePawns, roll) {
        if (!this.pawnPickerModal) return;

        const listContainer = document.getElementById('pawnPickerList');
        const rollInfo = document.getElementById('pawnPickerRollInfo');
        if (rollInfo) rollInfo.textContent = `Hasil Dadu: ${roll}`;

        listContainer.innerHTML = eligiblePawns.map(p => {
            const stateText = p.state === 'base' ? 'Di Base Camp (Siap Keluar ke Pintu)' :
                              p.state === 'gate' ? 'Di Pintu Keluar (Siap Masuk Arena)' :
                              p.state === 'track' ? `Di Petak Batu ${p.trackIndex + 1}` :
                              `Di Tangga Tahta (Langkah ${p.laneStep})`;
            return `
                <button class="btn-pick-pawn" data-pawn-id="${p.id}">
                    <span class="p-num">Pion ${p.pawnNumber}</span>
                    <span class="p-state">${stateText}</span>
                </button>
            `;
        }).join('');

        this.pawnPickerModal.classList.remove('hidden');

        listContainer.querySelectorAll('.btn-pick-pawn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pawnId = btn.dataset.pawnId;
                const chosenPawn = eligiblePawns.find(p => p.id === pawnId);
                this.pawnPickerModal.classList.add('hidden');
                if (chosenPawn) {
                    this.gameState.selectPawnToMove(chosenPawn);
                }
            });
        });
    }

    // ==========================================
    // TRUTH QUESTION MODAL (5 SOAL EDUKASI LENGKAP)
    // ==========================================
    showTruthModal(pawn, team, isTrickOrTreat = false) {
        if (!this.truthModal) return;

        const question = window.questionBank.getRandomQuestion();
        const categoryElem = document.getElementById('truthCategory');
        const questionElem = document.getElementById('truthQuestionText');
        const contentContainer = document.getElementById('truthQuestionContent');
        const feedbackContainer = document.getElementById('truthFeedback');
        const btnSubmit = document.getElementById('btnTruthSubmit');

        if (isTrickOrTreat) {
            categoryElem.textContent = `🎃 TRICK OR TREAT - ${question.category} (${this.getQuestionTypeLabel(question.type)})`;
        } else {
            categoryElem.textContent = `📜 TRUTH - ${question.category} (${this.getQuestionTypeLabel(question.type)})`;
        }
        questionElem.textContent = question.question;
        feedbackContainer.className = 'truth-feedback hidden';
        feedbackContainer.innerHTML = '';
        btnSubmit.classList.remove('hidden');
        btnSubmit.disabled = false;

        contentContainer.innerHTML = '';

        // Render based on Question Type
        switch (question.type) {
            case 'multiple_choice':
                this.renderMultipleChoice(contentContainer, question);
                break;
            case 'true_false':
                this.renderTrueFalse(contentContainer, question);
                break;
            case 'matching':
                this.renderMatching(contentContainer, question);
                break;
            case 'drag_drop':
                this.renderDragDrop(contentContainer, question);
                break;
            case 'short_answer':
                this.renderShortAnswer(contentContainer, question);
                break;
        }

        this.truthModal.classList.remove('hidden');
        this.renderKaTeX(this.truthModal);

        // Clean previous listener
        const newSubmitBtn = btnSubmit.cloneNode(true);
        btnSubmit.parentNode.replaceChild(newSubmitBtn, btnSubmit);

        newSubmitBtn.addEventListener('click', () => {
            const result = this.verifyTruthAnswer(question, contentContainer);
            this.handleTruthFeedback(result, question, pawn, isTrickOrTreat);
        });
    }

    getQuestionTypeLabel(type) {
        const labels = {
            multiple_choice: 'Pilihan Ganda',
            true_false: 'Benar / Salah',
            matching: 'Menjodohkan',
            drag_drop: 'Urutkan Kata / Kasta',
            short_answer: 'Isian Singkat'
        };
        return labels[type] || 'Uji Soal';
    }

    // 1. Pilihan Ganda UI (Pilihan Jawaban Selalu Diacak)
    renderMultipleChoice(container, q) {
        // Acak posisi pilihan jawaban dengan Fisher-Yates shuffle
        const mapped = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
        for (let i = mapped.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
        }

        container.innerHTML = `
            <div class="mc-options-grid">
                ${mapped.map((item, displayIdx) => `
                    <label class="mc-option-card">
                        <input type="radio" name="truth_mc" value="${item.originalIndex}">
                        <span class="mc-letter">${['A', 'B', 'C', 'D'][displayIdx]}</span>
                        <span class="mc-text">${item.text}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    // 2. Benar / Salah UI
    renderTrueFalse(container, q) {
        container.innerHTML = `
            <div class="tf-statement-box">"${q.statement}"</div>
            <div class="tf-options-grid">
                <button type="button" class="btn-tf btn-tf-true" data-value="true">
                    <span>✅ BENAR (TRUE)</span>
                </button>
                <button type="button" class="btn-tf btn-tf-false" data-value="false">
                    <span>❌ SALAH (FALSE)</span>
                </button>
            </div>
        `;
        let selectedVal = null;
        container.querySelectorAll('.btn-tf').forEach(b => {
            b.addEventListener('click', () => {
                container.querySelectorAll('.btn-tf').forEach(btn => btn.classList.remove('selected'));
                b.classList.add('selected');
                selectedVal = b.dataset.value === 'true';
                container.dataset.selectedValue = selectedVal;
            });
        });
    }

    // 3. Menjodohkan UI (Pasangan Kiri & Kanan Selalu Diacak)
    renderMatching(container, q) {
        const shuffle = (arr) => {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        };

        const leftItems = shuffle(q.pairs);
        let rightItems = shuffle(q.pairs);

        // Jika ada lebih dari 1 pasang dan urutan kanan sama persis dengan kiri, putar posisinya
        if (q.pairs.length > 1 && rightItems.every((item, idx) => item.id === leftItems[idx].id)) {
            rightItems.push(rightItems.shift());
        }

        container.innerHTML = `
            <div class="matching-container">
                <p class="matching-guide">💡 Klik satu item di kiri, lalu klik pasangannya di sebelah kanan:</p>
                <div class="matching-columns">
                    <div class="matching-col left-col">
                        ${leftItems.map(p => `
                            <div class="matching-item match-left" data-id="${p.id}">${p.left}</div>
                        `).join('')}
                    </div>
                    <div class="matching-col right-col">
                        ${rightItems.map(p => `
                            <div class="matching-item match-right" data-id="${p.id}">${p.right}</div>
                        `).join('')}
                    </div>
                </div>
                <div class="matched-pairs-list" id="matchedPairsList"></div>
            </div>
        `;

        let selectedLeft = null;
        const pairsMap = {}; // leftId -> rightId

        const leftElems = container.querySelectorAll('.match-left');
        const rightElems = container.querySelectorAll('.match-right');

        leftElems.forEach(el => {
            el.addEventListener('click', () => {
                leftElems.forEach(e => e.classList.remove('active-select'));
                el.classList.add('active-select');
                selectedLeft = el.dataset.id;
            });
        });

        rightElems.forEach(el => {
            el.addEventListener('click', () => {
                if (!selectedLeft) {
                    alert('Pilih item di kolom kiri terlebih dahulu!');
                    return;
                }
                const rightId = el.dataset.id;
                
                // Clear any previous pair that used this rightId
                for (const lId in pairsMap) {
                    if (pairsMap[lId] === rightId && lId !== selectedLeft) {
                        delete pairsMap[lId];
                        const oldLeft = container.querySelector(`.match-left[data-id="${lId}"]`);
                        if (oldLeft) oldLeft.classList.remove('paired');
                    }
                }

                pairsMap[selectedLeft] = rightId;

                // Mark visuals
                const leftTarget = container.querySelector(`.match-left[data-id="${selectedLeft}"]`);
                if (leftTarget) leftTarget.classList.add('paired');
                el.classList.add('paired');

                selectedLeft = null;
                leftElems.forEach(e => e.classList.remove('active-select'));

                // Save to container
                container.dataset.pairsMap = JSON.stringify(pairsMap);
                this.updateMatchedPairsBadge(container, pairsMap, q.pairs);
            });
        });
    }

    updateMatchedPairsBadge(container, pairsMap, originalPairs) {
        const list = container.querySelector('#matchedPairsList');
        const count = Object.keys(pairsMap).length;
        list.innerHTML = `<span class="badge-matched">Pasangan Terpilih: ${count} / ${originalPairs.length}</span>`;
    }

    // 4. Drag & Drop / Urutkan UI
    renderDragDrop(container, q) {
        // Shuffle items initially
        const shuffled = [...q.items].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="dragdrop-container">
                <p class="dragdrop-guide">${q.instruction || 'Gunakan tombol panah ⬆️ ⬇️ untuk menyusun urutan yang benar:'}</p>
                <div class="reorder-list" id="reorderList">
                    ${shuffled.map((item, idx) => `
                        <div class="reorder-item" data-text="${item}">
                            <span class="reorder-text">${item}</span>
                            <div class="reorder-controls">
                                <button type="button" class="btn-arrow btn-up">⬆️</button>
                                <button type="button" class="btn-arrow btn-down">⬇️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const list = container.querySelector('#reorderList');
        const bindArrows = () => {
            list.querySelectorAll('.btn-up').forEach(btn => {
                btn.onclick = () => {
                    const row = btn.closest('.reorder-item');
                    if (row.previousElementSibling) {
                        list.insertBefore(row, row.previousElementSibling);
                    }
                };
            });
            list.querySelectorAll('.btn-down').forEach(btn => {
                btn.onclick = () => {
                    const row = btn.closest('.reorder-item');
                    if (row.nextElementSibling) {
                        list.insertBefore(row.nextElementSibling, row);
                    }
                };
            });
        };
        bindArrows();
    }

    // 5. Isian Singkat UI
    renderShortAnswer(container, q) {
        container.innerHTML = `
            <div class="short-answer-container">
                <p class="sa-prompt">${q.prompt || 'Tuliskan jawaban singkat Anda di bawah ini:'}</p>
                <input type="text" class="input-short-answer" id="saInput" placeholder="Ketik jawabanmu di sini..." autocomplete="off">
            </div>
        `;
        setTimeout(() => {
            const input = container.querySelector('#saInput');
            if (input) input.focus();
        }, 150);
    }

    // Verify Truth answers
    verifyTruthAnswer(question, container) {
        switch (question.type) {
            case 'multiple_choice': {
                const selected = container.querySelector('input[name="truth_mc"]:checked');
                if (!selected) return { valid: false, error: 'Silakan pilih salah satu jawaban!' };
                const ansIdx = parseInt(selected.value);
                return { valid: true, isCorrect: ansIdx === question.correctIndex };
            }
            case 'true_false': {
                if (container.dataset.selectedValue === undefined) {
                    return { valid: false, error: 'Silakan klik Benar atau Salah!' };
                }
                const val = container.dataset.selectedValue === 'true';
                return { valid: true, isCorrect: val === question.correctAnswer };
            }
            case 'matching': {
                if (!container.dataset.pairsMap) {
                    return { valid: false, error: 'Silakan pasangkan semua item terlebih dahulu!' };
                }
                const pairs = JSON.parse(container.dataset.pairsMap);
                if (Object.keys(pairs).length < question.pairs.length) {
                    return { valid: false, error: 'Pasangkan semua item di sebelah kiri dan kanan!' };
                }
                let correctCount = 0;
                const totalPairs = question.pairs.length;
                for (const leftId in pairs) {
                    if (leftId === pairs[leftId]) {
                        correctCount++;
                    }
                }
                const ratio = totalPairs > 0 ? (correctCount / totalPairs) : 0;
                const scoreEarned = Math.round(ratio * 100);
                const isCorrect = (correctCount === totalPairs);
                const mustRetreat = (ratio < 0.5); // Jika kurang dari 50% harus mundur
                return {
                    valid: true,
                    isCorrect,
                    scoreEarned,
                    mustRetreat,
                    correctCount,
                    totalPairs,
                    isMatching: true
                };
            }
            case 'drag_drop': {
                const items = Array.from(container.querySelectorAll('.reorder-item')).map(el => el.dataset.text);
                let isCorrect = true;
                for (let i = 0; i < question.correctOrder.length; i++) {
                    if (items[i] !== question.correctOrder[i]) {
                        isCorrect = false;
                        break;
                    }
                }
                return { valid: true, isCorrect };
            }
            case 'short_answer': {
                const input = container.querySelector('#saInput');
                const userVal = input ? input.value.trim().toLowerCase() : '';
                if (!userVal) return { valid: false, error: 'Ketikkan jawaban terlebih dahulu!' };
                const accepted = question.acceptedAnswers.map(a => a.toLowerCase().trim());
                const isCorrect = accepted.includes(userVal);
                return { valid: true, isCorrect };
            }
        }
        return { valid: false, error: 'Tipe soal tidak dikenali' };
    }

    handleTruthFeedback(result, question, pawn, isTrickOrTreat = false) {
        if (!result.valid) {
            alert(result.error);
            return;
        }

        const feedbackContainer = document.getElementById('truthFeedback');
        const btnSubmit = document.getElementById('btnTruthSubmit');
        btnSubmit.classList.add('hidden');

        let feedbackClass = 'correct';
        let feedbackTitle = '🎉 JAWABAN TEPAT! (+100 POIN)';
        let feedbackPenalty = 'Prajurit tetap aman di petak ini.';

        if (isTrickOrTreat) {
            if (result.isCorrect) {
                feedbackClass = 'correct';
                feedbackTitle = '🎉 JAWABAN TEPAT! (+100 POIN)';
                feedbackPenalty = 'Selamat! Anda berhasil lolos dari jebakan Trick or Treat!';
            } else {
                feedbackClass = 'wrong';
                if (pawn.hasShield) {
                    feedbackTitle = '🛡️ IMMUNITY SHIELD MENAHAN PENALTI!';
                    feedbackPenalty = 'Jawaban salah, namun Immunity Shield Anda aktif menahan penalti -20 poin! Poin tetap aman.';
                } else {
                    feedbackTitle = '❌ JEBAKAN TRICK OR TREAT!';
                    feedbackPenalty = 'Jawaban salah! Poin tim Anda berkurang -20 poin dan mundur ke petak asal!';
                }
            }
        } else if (result.isMatching) {
            if (result.isCorrect) {
                feedbackClass = 'correct';
                feedbackTitle = `🎉 SEMPURNA! SEMUA PASANGAN BENAR (+100 POIN)`;
                feedbackPenalty = 'Prajurit tetap aman bertahan di petak ini.';
            } else if (!result.mustRetreat) {
                feedbackClass = 'correct';
                feedbackTitle = `👍 BAGUS! ${result.correctCount}/${result.totalPairs} Pasangan Benar (+${result.scoreEarned} Poin)`;
                feedbackPenalty = 'Karena berhasil mencocokkan ≥ 50%, prajurit tetap bertahan di petak ini!';
            } else {
                feedbackClass = 'wrong';
                if (pawn.hasShield) {
                    feedbackTitle = `🛡️ IMMUNITY SHIELD MENAHAN KESALAHAN!`;
                    feedbackPenalty = `Hanya ${result.correctCount}/${result.totalPairs} Pasangan Benar, namun Immunity Shield menahan kesalahan. Prajurit tidak mundur!`;
                } else {
                    feedbackTitle = `⚠️ HANYA ${result.correctCount}/${result.totalPairs} Pasangan Benar (+${result.scoreEarned} Poin)`;
                    feedbackPenalty = 'Karena benar kurang dari 50%, prajurit harus mundur ke petak sebelumnya!';
                }
            }
        } else {
            feedbackClass = result.isCorrect ? 'correct' : 'wrong';
            if (result.isCorrect) {
                feedbackTitle = '🎉 JAWABAN TEPAT! (+100 POIN)';
                feedbackPenalty = 'Prajurit tetap aman di petak ini.';
            } else {
                if (pawn.hasShield) {
                    feedbackTitle = '🛡️ IMMUNITY SHIELD MENAHAN KESALAHAN!';
                    feedbackPenalty = 'Jawaban kurang tepat, tetapi Immunity Shield aktif menahan kesalahan. Prajurit tidak mundur!';
                } else {
                    feedbackTitle = '❌ JAWABAN KURANG TEPAT!';
                    feedbackPenalty = 'Prajurit harus mundur ke petak sebelum lemparan dadu!';
                }
            }
        }

        feedbackContainer.className = `truth-feedback ${feedbackClass}`;
        feedbackContainer.innerHTML = `
            <div class="feedback-title">${feedbackTitle}</div>
            <div class="feedback-explanation">${question.explanation}</div>
            <div class="feedback-penalty">${feedbackPenalty}</div>
            <button class="btn-royal-proceed" id="btnContinueTruth">Lanjut Melangkah ➡️</button>
        `;
        this.renderKaTeX(feedbackContainer);

        document.getElementById('btnContinueTruth').addEventListener('click', () => {
            this.truthModal.classList.add('hidden');
            this.gameState.handleTruthResult(pawn, result, isTrickOrTreat);
        });
    }

    // ==========================================
    // DARE CHALLENGE MODAL (TANTANGAN KELAS)
    // ==========================================
    showDareModal(pawn, team) {
        if (!this.dareModal) return;

        const dare = window.dareManager.getRandomDare();
        const titleElem = document.getElementById('dareTitle');
        const badgeElem = document.getElementById('dareBadge');
        const instructElem = document.getElementById('dareInstruction');
        const promptElem = document.getElementById('darePromptText');
        const timerElem = document.getElementById('dareTimer');

        titleElem.textContent = dare.title;
        badgeElem.textContent = dare.badge;
        instructElem.textContent = dare.instruction;
        promptElem.textContent = dare.promptText;

        // Dare countdown timer
        let timeLeft = dare.timeLimit || 20;
        timerElem.textContent = `${timeLeft}s`;
        timerElem.className = 'dare-timer';

        if (this.dareInterval) clearInterval(this.dareInterval);
        this.dareInterval = setInterval(() => {
            timeLeft--;
            timerElem.textContent = `${timeLeft}s`;
            if (timeLeft <= 5) timerElem.classList.add('urgent');
            if (timeLeft <= 0) {
                clearInterval(this.dareInterval);
            }
        }, 1000);

        this.dareModal.classList.remove('hidden');

        // Teacher judgment buttons
        const btnSuccess = document.getElementById('btnDareSuccess');
        const btnFail = document.getElementById('btnDareFail');

        const newSuccess = btnSuccess.cloneNode(true);
        const newFail = btnFail.cloneNode(true);
        btnSuccess.parentNode.replaceChild(newSuccess, btnSuccess);
        btnFail.parentNode.replaceChild(newFail, btnFail);

        newSuccess.addEventListener('click', () => {
            if (this.dareInterval) clearInterval(this.dareInterval);
            this.dareModal.classList.add('hidden');
            this.gameState.handleDareResult(true, dare);
        });

        newFail.addEventListener('click', () => {
            if (this.dareInterval) clearInterval(this.dareInterval);
            this.dareModal.classList.add('hidden');
            this.gameState.handleDareResult(false, dare);
        });
    }

    // ==========================================
    // SPECIAL DICE MODAL (DADU 3D EMAS INTERAKTIF)
    // ==========================================
    showSpecialDiceModal(pawn, team) {
        if (!this.specialDiceModal) return;

        const specialItems = [
            {
                id: 'LUCKY_DICE',
                icon: '🍀',
                title: 'Lucky Dice',
                desc: 'Boleh mengocok dadu lagi namun bebas memilih angka dadu (1 - 6)!',
                style: 'background: linear-gradient(135deg, #a7f3d0 0%, #10b981 60%, #047857 100%); color: #ffffff;'
            },
            {
                id: 'IMMUNITY',
                icon: '🛡️',
                title: 'Immunity',
                desc: 'Mendapatkan Shield pelindung kebal 1x dari tendangan, kesalahan, mind control, dan swap place!',
                style: 'background: linear-gradient(135deg, #bae6fd 0%, #0284c7 60%, #0369a1 100%); color: #ffffff;'
            },
            {
                id: 'STEAL_TURN',
                icon: '⏳',
                title: 'Steal Turn',
                desc: 'Mencuri turn lawan! Pilih tim lawan mana yang ingin diambil turn-nya!',
                style: 'background: linear-gradient(135deg, #fde68a 0%, #d97706 60%, #92400e 100%); color: #ffffff;'
            },
            {
                id: 'MIND_CONTROL',
                icon: '🧠',
                title: 'Mind Control',
                desc: 'Memundurkan pion lawan 3 langkah ke belakang. Bebas memilih tim lawan!',
                style: 'background: linear-gradient(135deg, #fbcfe8 0%, #db2777 60%, #9d174d 100%); color: #ffffff;'
            },
            {
                id: 'EXTRA_ROLL',
                icon: '🎲',
                title: 'Extra Roll',
                desc: 'Mendapatkan 1 kali lagi roll dadu kerajaan!',
                style: 'background: linear-gradient(135deg, #fef08a 0%, #ca8a04 60%, #854d0e 100%); color: #ffffff;'
            },
            {
                id: 'STEAL_POINT',
                icon: '💰',
                title: 'Steal Point',
                desc: 'Mencuri 50 Poin lawan, boleh memilih lawan yang memiliki poin (> 0)!',
                style: 'background: linear-gradient(135deg, #fed7aa 0%, #ea580c 60%, #9a3412 100%); color: #ffffff;'
            }
        ];

        const content = document.getElementById('specialDiceContent');
        this.specialDiceModal.classList.remove('hidden');

        new ThematicModalDice(content, 'special', specialItems, (chosenItem) => {
            this.specialDiceModal.classList.add('hidden');
            this.gameState.applySpecialItem(pawn, chosenItem.id);
        });
    }

    // ==========================================
    // WEIRD DICE MODAL (DADU 3D MISTERI ANEH)
    // ==========================================
    showWeirdDiceModal(pawn, team) {
        if (!this.weirdDiceModal) return;

        const weirdEffects = [
            {
                id: 'OUCH_BANANA',
                icon: '🍌',
                title: 'Ouch Banana',
                desc: 'Mundur 2 langkah akibat terpeleset kulit pisang licin!',
                style: 'background: linear-gradient(135deg, #fef08a 0%, #eab308 60%, #a16207 100%); color: #422006;'
            },
            {
                id: 'BEAR_TRAP',
                icon: '🪤',
                title: 'Bear Trap',
                desc: 'Pengurangan poin 20 akibat terjepit perangkap beruang besi!',
                style: 'background: linear-gradient(135deg, #e4e4e7 0%, #71717a 60%, #3f3f46 100%); color: #ffffff;'
            },
            {
                id: 'SWAP_PLACE',
                icon: '🔄',
                title: 'Swap Place',
                desc: 'Bertukar tempat dengan pion lawan aktif (kebal pada lawan yang memiliki active Shield)!',
                style: 'background: linear-gradient(135deg, #a5f3fc 0%, #0891b2 60%, #155e75 100%); color: #ffffff;'
            },
            {
                id: 'TRICK_OR_TREAT',
                icon: '🎃',
                title: 'Trick or Treat',
                desc: 'Menjawab Soal Pertanyaan, jika salah mendapat pengurangan -20 poin!',
                style: 'background: linear-gradient(135deg, #ffedd5 0%, #f97316 60%, #c2410c 100%); color: #ffffff;'
            },
            {
                id: 'REVERSE',
                icon: '⏪',
                title: 'Reverse',
                desc: 'Mengocok dadu lagi namun akan mundur sesuai angka dadu yang didapatkan!',
                style: 'background: linear-gradient(135deg, #ddd6fe 0%, #7c3aed 60%, #5b21b6 100%); color: #ffffff;'
            },
            {
                id: 'MAGNET',
                icon: '🧲',
                title: 'Magnet',
                desc: 'Akan berpindah ke tile lawan terdekat. Memaksa challenge dengan lawan di tile tersebut!',
                style: 'background: linear-gradient(135deg, #fecaca 0%, #dc2626 60%, #991b1b 100%); color: #ffffff;'
            }
        ];

        const content = document.getElementById('weirdDiceContent');
        this.weirdDiceModal.classList.remove('hidden');

        new ThematicModalDice(content, 'weird', weirdEffects, (chosenItem) => {
            this.weirdDiceModal.classList.add('hidden');
            this.gameState.applyWeirdEffect(pawn, chosenItem.id);
        });
    }

    // ==========================================
    // ACTION CHOICE PICKERS (SPECIAL & WEIRD DICE)
    // ==========================================
    showActionChoiceModal(options) {
        const modal = document.getElementById('actionChoiceModal') || this.actionChoiceModal;
        if (!modal) return;

        const iconEl = document.getElementById('actionChoiceIcon');
        const titleEl = document.getElementById('actionChoiceTitle');
        const subEl = document.getElementById('actionChoiceSubtitle');
        const bodyEl = document.getElementById('actionChoiceBody');

        if (iconEl) iconEl.textContent = options.icon || '✨';
        if (titleEl) titleEl.textContent = options.title || 'PILIHAN TAKTIS';
        if (subEl) subEl.textContent = options.subtitle || '';

        if (bodyEl) {
            bodyEl.innerHTML = '';
            if (options.contentHtml) {
                bodyEl.innerHTML = options.contentHtml;
            } else if (Array.isArray(options.items)) {
                const grid = document.createElement('div');
                grid.className = options.gridClass || 'action-choice-grid';
                options.items.forEach(item => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `action-choice-btn ${item.className || ''}`;
                    if (item.disabled) btn.disabled = true;
                    btn.innerHTML = `
                        ${item.icon ? `<span class="ac-icon">${item.icon}</span>` : ''}
                        <strong class="ac-title">${item.title}</strong>
                        ${item.desc ? `<span class="ac-desc">${item.desc}</span>` : ''}
                        ${item.badge ? `<small class="badge-matched" style="margin-top:4px;">${item.badge}</small>` : ''}
                    `;
                    btn.onclick = () => {
                        modal.classList.add('hidden');
                        if (typeof item.onClick === 'function') item.onClick();
                    };
                    grid.appendChild(btn);
                });
                bodyEl.appendChild(grid);
            }
        }

        modal.classList.remove('hidden');
    }

    showLuckyDicePicker(pawn, onSelect) {
        const dicePips = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const modal = document.getElementById('actionChoiceModal') || this.actionChoiceModal;
        const iconEl = document.getElementById('actionChoiceIcon');
        const titleEl = document.getElementById('actionChoiceTitle');
        const subEl = document.getElementById('actionChoiceSubtitle');
        const bodyEl = document.getElementById('actionChoiceBody');

        if (iconEl) iconEl.textContent = '🍀';
        if (titleEl) titleEl.textContent = 'LUCKY DICE: PILIH ANGKA DADU';
        if (subEl) subEl.textContent = 'Bebas tentukan angka dadu 1 sampai 6 yang ingin Anda gunakan untuk melangkah:';

        if (bodyEl) {
            bodyEl.innerHTML = `
                <div class="lucky-dice-grid">
                    ${[1, 2, 3, 4, 5, 6].map(num => `
                        <button type="button" class="lucky-dice-num-btn" data-value="${num}">
                            <span class="pip-icon">${dicePips[num - 1]}</span>
                            <span>${num}</span>
                        </button>
                    `).join('')}
                </div>
            `;

            bodyEl.querySelectorAll('.lucky-dice-num-btn').forEach(btn => {
                btn.onclick = () => {
                    const val = parseInt(btn.dataset.value, 10);
                    if (modal) modal.classList.add('hidden');
                    if (typeof onSelect === 'function') onSelect(val);
                };
            });
        }

        if (modal) modal.classList.remove('hidden');
    }

    showStealTurnPicker(teams, currentTeam, onSelect) {
        const enemyTeams = teams.filter(t => t.index !== currentTeam.index);
        this.showActionChoiceModal({
            icon: '⏳',
            title: 'STEAL TURN: PILIH TIM LAWAN',
            subtitle: 'Pilih tim lawan yang ingin diambil jatah gilirannya (giliran mereka akan dilewati):',
            items: enemyTeams.map(t => ({
                icon: t.faction.icon,
                title: t.name,
                desc: `Skor: ${t.score} Poin • Pion di arena: ${t.pawns.filter(p => p.state === 'track').length}`,
                badge: t.skipNextTurn ? '⚠️ Sudah Terlewat' : 'Giliran Aktif',
                onClick: () => onSelect(t)
            }))
        });
    }

    showMindControlPicker(enemyPawns, onSelect) {
        this.showActionChoiceModal({
            icon: '🧠',
            title: 'MIND CONTROL: MUNDURKAN PION LAWAN',
            subtitle: 'Pilih 1 pion lawan di arena untuk dipaksa mundur 3 langkah ke belakang:',
            items: enemyPawns.map(item => ({
                icon: item.pawn.hasShield ? '🛡️' : item.team.faction.icon,
                title: `${item.team.name} (Pion ${item.pawn.pawnNumber})`,
                desc: `Posisi: Petak ${item.pawn.trackIndex + 1} ${item.pawn.hasShield ? '• 🛡️ Memiliki Shield' : ''}`,
                badge: item.pawn.hasShield ? 'Kebal Shield' : 'Dapat Dimundurkan',
                onClick: () => onSelect(item)
            }))
        });
    }

    showStealPointPicker(validTeams, onSelect) {
        this.showActionChoiceModal({
            icon: '💰',
            title: 'STEAL POINT: CURI 50 POIN LAWAN',
            subtitle: 'Pilih tim lawan yang ingin Anda rampas 50 poinnya:',
            items: validTeams.map(t => ({
                icon: t.faction.icon,
                title: t.name,
                desc: `Total Skor Saat Ini: ${t.score} Poin`,
                badge: `Curi ${Math.min(50, t.score)} Poin`,
                onClick: () => onSelect(t)
            }))
        });
    }

    showSwapPlacePicker(validPawns, onSelect) {
        this.showActionChoiceModal({
            icon: '🔄',
            title: 'SWAP PLACE: TUKAR POSISI DENGAN PION LAWAN',
            subtitle: 'Pilih pion lawan aktif yang ingin Anda tukar posisinya (Lawan ber-Shield tidak dapat dipilih):',
            items: validPawns.map(item => ({
                icon: item.team.faction.icon,
                title: `${item.team.name} (Pion ${item.pawn.pawnNumber})`,
                desc: `Posisi: Petak ${item.pawn.trackIndex + 1}`,
                badge: 'Siap Bertukar',
                onClick: () => onSelect(item)
            }))
        });
    }

    // ==========================================
    // DUEL CLASH MODAL (ADU CEPAT JAWAB SOAL)
    // ==========================================
    showClashDuelModal(attackerPawn, defenderPawn, attackerTeam, defenderTeam) {
        const modal = document.getElementById('duelModal');
        if (!modal) return;

        const attackerIcon = document.getElementById('duelAttackerIcon');
        const attackerName = document.getElementById('duelAttackerName');
        const defenderIcon = document.getElementById('duelDefenderIcon');
        const defenderName = document.getElementById('duelDefenderName');
        const duelCat = document.getElementById('duelCategory');
        const duelQText = document.getElementById('duelQuestionText');
        const buzzerStage = document.getElementById('duelBuzzerStage');
        const answerStage = document.getElementById('duelAnswerStage');
        const resultStage = document.getElementById('duelResultStage');
        const answerContent = document.getElementById('duelAnswerContent');
        const answeringBanner = document.getElementById('duelAnsweringBanner');
        const answeringTeamText = document.getElementById('duelAnsweringTeam');
        const timerElem = document.getElementById('duelTimer');
        const resultBanner = document.getElementById('duelResultBanner');
        const btnContinue = document.getElementById('btnContinueDuel');

        const btnBuzzerAttacker = document.getElementById('btnBuzzerAttacker');
        const btnBuzzerDefender = document.getElementById('btnBuzzerDefender');
        const lblBuzzerAttacker = document.getElementById('lblBuzzerAttacker');
        const lblBuzzerDefender = document.getElementById('lblBuzzerDefender');

        if (attackerIcon) attackerIcon.textContent = attackerTeam.faction.icon;
        if (attackerName) attackerName.textContent = `${attackerTeam.name} (Pion ${attackerPawn.pawnNumber})`;
        if (lblBuzzerAttacker) lblBuzzerAttacker.textContent = `BEL ${attackerTeam.name}`;

        if (defenderIcon) defenderIcon.textContent = defenderTeam.faction.icon;
        if (defenderName) defenderName.textContent = `${defenderTeam.name} (Pion ${defenderPawn.pawnNumber})`;
        if (lblBuzzerDefender) lblBuzzerDefender.textContent = `BEL ${defenderTeam.name}`;

        const question = window.questionBank.getRandomQuestion();
        if (duelCat) duelCat.textContent = `⚔️ ${question.category} (${this.getQuestionTypeLabel(question.type)})`;
        if (duelQText) duelQText.textContent = question.question;

        buzzerStage.classList.remove('hidden');
        answerStage.classList.add('hidden');
        resultStage.classList.add('hidden');
        modal.classList.remove('hidden');
        if (duelQText) this.renderKaTeX(duelQText);

        let buzzedTeam = null;
        let otherTeam = null;
        let duelTimer = null;
        let hasStealChance = false;

        const startAnswering = (team, opposite) => {
            buzzedTeam = team;
            otherTeam = opposite;
            buzzerStage.classList.add('hidden');
            answerStage.classList.remove('hidden');

            if (answeringTeamText) {
                answeringTeamText.innerHTML = `🔔 Giliran Menjawab: <strong style="color: ${team.faction.highlightColor || '#ffd700'}">${team.name}</strong>`;
            }
            if (answeringBanner) {
                answeringBanner.style.background = team.faction.secondaryColor;
            }

            answerContent.innerHTML = '';
            switch (question.type) {
                case 'multiple_choice':
                    this.renderMultipleChoice(answerContent, question);
                    break;
                case 'true_false':
                    this.renderTrueFalse(answerContent, question);
                    break;
                case 'matching':
                    this.renderMatching(answerContent, question);
                    break;
                case 'drag_drop':
                    this.renderDragDrop(answerContent, question);
                    break;
                case 'short_answer':
                    this.renderShortAnswer(answerContent, question);
                    break;
            }

            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn-royal-submit';
            submitBtn.textContent = 'KUNCI JAWABAN DUEL ✨';
            answerContent.appendChild(submitBtn);

            this.renderKaTeX(answerContent);

            let timeLeft = 12;
            if (timerElem) timerElem.textContent = `${timeLeft}s`;
            if (duelTimer) clearInterval(duelTimer);
            duelTimer = setInterval(() => {
                timeLeft--;
                if (timerElem) timerElem.textContent = `${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(duelTimer);
                    handleAnswer(false, true);
                }
            }, 1000);

            submitBtn.onclick = () => {
                const res = this.verifyTruthAnswer(question, answerContent);
                if (!res.valid) {
                    alert(res.error);
                    return;
                }
                if (duelTimer) clearInterval(duelTimer);
                handleAnswer(res.isCorrect, false);
            };
        };

        const handleAnswer = (isCorrect, timeout = false) => {
            if (duelTimer) clearInterval(duelTimer);

            if (isCorrect) {
                finishDuel(buzzedTeam === attackerTeam ? 'attacker_won' : 'defender_won', buzzedTeam, otherTeam);
            } else {
                if (!hasStealChance) {
                    hasStealChance = true;
                    alert(`❌ Jawaban ${buzzedTeam.name} salah! Kesempatan merebut untuk ${otherTeam.name}!`);
                    startAnswering(otherTeam, buzzedTeam);
                } else {
                    finishDuel('both_wrong', attackerTeam, defenderTeam);
                }
            }
        };

        const finishDuel = (outcome, winnerTeam, loserTeam) => {
            answerStage.classList.add('hidden');
            resultStage.classList.remove('hidden');

            if (outcome === 'attacker_won') {
                resultBanner.className = 'duel-result-banner win';
                resultBanner.innerHTML = `
                    <div style="font-size:1.5rem;">🏆 ${winnerTeam.name} MENANG DUEL!</div>
                    <p style="margin-top:6px;">Prajurit lawan tertendang kembali ke Base Camp! (+70 Poin)</p>
                    <small>Penjelasan: ${question.explanation || ''}</small>
                `;
            } else if (outcome === 'defender_won') {
                resultBanner.className = 'duel-result-banner win';
                resultBanner.innerHTML = `
                    <div style="font-size:1.5rem;">🛡️ ${winnerTeam.name} BERHASIL BERTAHAN!</div>
                    <p style="margin-top:6px;">Prajurit penyerang gagal dan tertendang kembali ke Base Camp! (+70 Poin)</p>
                    <small>Penjelasan: ${question.explanation || ''}</small>
                `;
            } else {
                resultBanner.className = 'duel-result-banner draw';
                resultBanner.innerHTML = `
                    <div style="font-size:1.5rem;">⚔️ KEDUA TIM SALAH / WAKTU HABIS!</div>
                    <p style="margin-top:6px;">Kedua prajurit sama-sama mundur ke posisi terakhir masing-masing!</p>
                    <small>Kunci Jawaban: ${question.explanation || ''}</small>
                `;
            }

            btnContinue.onclick = () => {
                modal.classList.add('hidden');
                this.gameState.resolveDuelResult(attackerPawn, defenderPawn, attackerTeam, defenderTeam, outcome);
            };
        };

        btnBuzzerAttacker.onclick = () => {
            if (window.soundEngine) window.soundEngine.playPawnHop();
            startAnswering(attackerTeam, defenderTeam);
        };

        btnBuzzerDefender.onclick = () => {
            if (window.soundEngine) window.soundEngine.playPawnHop();
            startAnswering(defenderTeam, attackerTeam);
        };
    }

    // ==========================================
    // QUESTION BANK MANAGER MODAL
    // ==========================================
    openQuestionBankModal() {
        if (!this.questionBankModal) return;

        this.renderQuestionBankList();
        this.setupQuestionBankForms();
        this.questionBankModal.classList.remove('hidden');
    }

    renderQuestionBankList() {
        const listContainer = document.getElementById('qbQuestionList');
        const qCount = document.getElementById('qbCountBadge');
        const allQuestions = window.questionBank.getAll();

        if (qCount) qCount.textContent = `${allQuestions.length} Soal Tersedia`;

        if (!listContainer) return;

        listContainer.innerHTML = allQuestions.map((q, idx) => `
            <div class="qb-question-card">
                <div class="qb-q-header">
                    <span class="qb-idx">#${idx + 1}</span>
                    <span class="qb-type-tag">${this.getQuestionTypeLabel(q.type)}</span>
                    <span class="qb-cat-tag">${q.category || 'Umum'}</span>
                    <button class="btn-delete-q" data-qid="${q.id}">🗑️ Hapus</button>
                </div>
                <div class="qb-q-text">${q.question}</div>
                <div class="qb-q-exp"><small>Kunci/Penjelasan: ${q.explanation || '-'}</small></div>
            </div>
        `).join('');

        listContainer.querySelectorAll('.btn-delete-q').forEach(btn => {
            btn.addEventListener('click', () => {
                const qid = btn.dataset.qid;
                if (confirm('Hapus soal ini dari Bank Soal?')) {
                    window.questionBank.deleteQuestion(qid);
                    this.renderQuestionBankList();
                }
            });
        });
    }

    setupQuestionBankForms() {
        // Tab switching
        const tabs = document.querySelectorAll('.qb-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                document.getElementById('qbTabList').classList.toggle('hidden', target !== 'list');
                document.getElementById('qbTabAdd').classList.toggle('hidden', target !== 'add');
                document.getElementById('qbTabJSON').classList.toggle('hidden', target !== 'json');
            });
        });

        // Dynamic Add Question Form Type Selector
        const typeSelect = document.getElementById('newQType');
        const dynamicInputs = document.getElementById('newQDynamicFields');

        const updateFields = () => {
            const type = typeSelect ? typeSelect.value : 'multiple_choice';
            if (!dynamicInputs) return;

            if (type === 'multiple_choice') {
                dynamicInputs.innerHTML = `
                    <label>Pilihan A: <input type="text" id="add_opt_0" required></label>
                    <label>Pilihan B: <input type="text" id="add_opt_1" required></label>
                    <label>Pilihan C: <input type="text" id="add_opt_2" required></label>
                    <label>Pilihan D: <input type="text" id="add_opt_3" required></label>
                    <label>Kunci Jawaban Benar:
                        <select id="add_mc_correct">
                            <option value="0">Pilihan A</option>
                            <option value="1">Pilihan B</option>
                            <option value="2">Pilihan C</option>
                            <option value="3">Pilihan D</option>
                        </select>
                    </label>
                `;
            } else if (type === 'true_false') {
                dynamicInputs.innerHTML = `
                    <label>Pernyataan Kalimat: <input type="text" id="add_tf_statement" required></label>
                    <label>Kunci Kebenaran:
                        <select id="add_tf_correct">
                            <option value="true">Benar (TRUE)</option>
                            <option value="false">Salah (FALSE)</option>
                        </select>
                    </label>
                `;
            } else if (type === 'matching') {
                dynamicInputs.innerHTML = `
                    <p><small>Masukkan 3 pasang kata kiri & kanan:</small></p>
                    <div class="row-pair"><input type="text" id="add_m_l1" placeholder="Kiri 1"> ➡️ <input type="text" id="add_m_r1" placeholder="Kanan 1"></div>
                    <div class="row-pair"><input type="text" id="add_m_l2" placeholder="Kiri 2"> ➡️ <input type="text" id="add_m_r2" placeholder="Kanan 2"></div>
                    <div class="row-pair"><input type="text" id="add_m_l3" placeholder="Kiri 3"> ➡️ <input type="text" id="add_m_r3" placeholder="Kanan 3"></div>
                `;
            } else if (type === 'drag_drop') {
                dynamicInputs.innerHTML = `
                    <label>Urutan Elemen Benar (Pisahkan dengan tanda koma ','):
                        <input type="text" id="add_dd_items" placeholder="Raja, Bangsawan, Ksatria, Rakyat" required>
                    </label>
                `;
            } else if (type === 'short_answer') {
                dynamicInputs.innerHTML = `
                    <label>Jawaban yang Diterima (Pisahkan dengan tanda koma ',' untuk alternatif):
                        <input type="text" id="add_sa_answers" placeholder="istana, benteng, castle" required>
                    </label>
                `;
            }
        };

        if (typeSelect) {
            typeSelect.addEventListener('change', updateFields);
            updateFields();
        }

        // Add question submit
        const formAdd = document.getElementById('formAddNewQuestion');
        if (formAdd) {
            formAdd.onsubmit = (e) => {
                e.preventDefault();
                const type = document.getElementById('newQType').value;
                const cat = document.getElementById('newQCategory').value;
                const questionText = document.getElementById('newQText').value;
                const explanation = document.getElementById('newQExplanation').value;

                let newQ = {
                    type,
                    category: cat,
                    question: questionText,
                    explanation
                };

                if (type === 'multiple_choice') {
                    newQ.options = [
                        document.getElementById('add_opt_0').value,
                        document.getElementById('add_opt_1').value,
                        document.getElementById('add_opt_2').value,
                        document.getElementById('add_opt_3').value
                    ];
                    newQ.correctIndex = parseInt(document.getElementById('add_mc_correct').value);
                } else if (type === 'true_false') {
                    newQ.statement = document.getElementById('add_tf_statement').value;
                    newQ.correctAnswer = document.getElementById('add_tf_correct').value === 'true';
                } else if (type === 'matching') {
                    newQ.pairs = [
                        { id: 'p1', left: document.getElementById('add_m_l1').value, right: document.getElementById('add_m_r1').value },
                        { id: 'p2', left: document.getElementById('add_m_l2').value, right: document.getElementById('add_m_r2').value },
                        { id: 'p3', left: document.getElementById('add_m_l3').value, right: document.getElementById('add_m_r3').value }
                    ];
                } else if (type === 'drag_drop') {
                    const raw = document.getElementById('add_dd_items').value;
                    const items = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    newQ.items = items;
                    newQ.correctOrder = [...items];
                } else if (type === 'short_answer') {
                    const raw = document.getElementById('add_sa_answers').value;
                    newQ.acceptedAnswers = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
                }

                window.questionBank.addQuestion(newQ);
                alert('Soal baru berhasil ditambahkan ke Bank Soal!');
                formAdd.reset();
                updateFields();
                this.renderQuestionBankList();
            };
        }

        // Export JSON button
        const btnExportJSON = document.getElementById('btnExportJSON');
        if (btnExportJSON) {
            btnExportJSON.onclick = () => {
                const data = window.questionBank.exportJSON();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bank_soal_penakhlukan_kerajaan.json';
                a.click();
            };
        }

        // Import JSON button
        const btnImportJSON = document.getElementById('btnImportJSON');
        const jsonArea = document.getElementById('jsonImportArea');
        if (btnImportJSON && jsonArea) {
            btnImportJSON.onclick = () => {
                const text = jsonArea.value.trim();
                if (!text) {
                    alert('Tempelkan (paste) teks JSON ke kolom terlebih dahulu!');
                    return;
                }
                const res = window.questionBank.importJSON(text);
                if (res.success) {
                    alert(`Berhasil mengimpor ${res.count} soal ke Bank Soal!`);
                    jsonArea.value = '';
                    this.renderQuestionBankList();
                } else {
                    alert(`Gagal impor JSON: ${res.error}`);
                }
            };
        }

        // Reset to Default button
        const btnResetQB = document.getElementById('btnResetQuestions');
        if (btnResetQB) {
            btnResetQB.onclick = () => {
                if (confirm('Kembalikan bank soal ke soal bawaan default (15+ soal)?')) {
                    window.questionBank.resetToDefault();
                    this.renderQuestionBankList();
                }
            };
        }
    }

    // ==========================================
    // END-GAME PIAGAM LEADERBOARD MODAL & FORCE END GAME
    // ==========================================
    handleForceEndGame() {
        if (!this.gameState) return;
        this.gameState.isGameOver = true;
        const leaderboard = this.gameState.getLeaderboard();
        if (!this.gameState.winnerTeam && leaderboard && leaderboard.length > 0) {
            this.gameState.winnerTeam = leaderboard[0].team;
        }
        if (window.soundEngine) window.soundEngine.playVictory();
        this.showLeaderboardModal();
    }

    showLeaderboardModal() {
        if (!this.leaderboardModal || !this.gameState) return;

        const container = document.getElementById('leaderboardRows');
        const winnerBanner = document.getElementById('leaderboardWinnerBanner');
        const leaderboard = this.gameState.getLeaderboard();
        let winner = this.gameState.winnerTeam;
        if (!winner && leaderboard && leaderboard.length > 0) {
            winner = leaderboard[0].team;
        }

        if (winnerBanner && winner) {
            winnerBanner.innerHTML = `
                <div class="winner-crown">👑</div>
                <h2 class="winner-title">RULER OF THE REALM!</h2>
                <div class="winner-team-name" style="color: ${winner.faction.color}">${winner.name}</div>
                <div class="winner-subtitle">"Menaklukkan Tahta Besi Emas Abadi dengan Skor Gemilang!"</div>
            `;
        }

        if (container) {
            container.innerHTML = leaderboard.map(item => {
                const t = item.team;
                const totalQ = t.stats.questionsCorrect + t.stats.questionsWrong;
                const acc = totalQ > 0 ? Math.round((t.stats.questionsCorrect / totalQ) * 100) : 0;

                return `
                    <div class="parchment-row rank-${item.rank}">
                        <div class="p-rank">
                            <span class="p-rank-num">${item.rank}</span>
                        </div>
                        <div class="p-team">
                            <span class="p-name">${t.name}</span>
                            <small class="p-unit">${t.faction.icon} ${t.faction.title}</small>
                        </div>
                        <div class="p-stats">
                            <span class="p-stat-badge score" title="Total Skor Kerajaan">🏆 <strong>${t.score}</strong> Poin</span>
                            <span class="p-stat-badge correct" title="Soal yang Berhasil Dikerjakan & Benar">🎯 Soal Benar: <strong>${t.stats.questionsCorrect}</strong> / ${totalQ} (${acc}%)</span>
                            <span class="p-stat-badge" title="Tantangan Dare Selesai">🎭 ${t.stats.daresCompleted} Dare</span>
                            <span class="p-stat-badge" title="Prajurit Masuk Tahta">👑 ${t.stats.pawnsFinished} Finish</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        this.leaderboardModal.classList.remove('hidden');
    }

    // ==========================================
    // KATEX FORMULA RENDERING HELPER (MATH & SCIENCE)
    // ==========================================
    renderKaTeX(element) {
        if (!element) return;
        const doRender = () => {
            if (typeof renderMathInElement === 'function') {
                try {
                    renderMathInElement(element, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true }
                        ],
                        throwOnError: false
                    });
                } catch (err) {
                    console.warn('[KaTeX] Error saat merender formula matematika:', err);
                }
            }
        };

        if (typeof renderMathInElement === 'function') {
            doRender();
        } else {
            setTimeout(doRender, 150);
            setTimeout(doRender, 500);
        }
    }
}

window.renderKaTeX = function(element) {
    if (!element) return;
    if (typeof renderMathInElement === 'function') {
        try {
            renderMathInElement(element, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        } catch (err) {
            console.warn('[KaTeX] Error saat merender formula:', err);
        }
    }
};

window.UIManager = UIManager;
