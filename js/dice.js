/**
 * PENAKHLUKAN KERAJAAN - 3D Medieval Dice System
 * Mendukung:
 * 1. MedievalDice (Dadu Utama Angka 1-6)
 * 2. ThematicModalDice (Dadu 3D Khusus untuk Petak Dadu Special & Dadu Weird)
 */

class MedievalDice {
    constructor(containerElement, onRollComplete) {
        this.container = containerElement;
        this.onRollComplete = onRollComplete;
        this.isRolling = false;
        this.currentValue = 1;
        this.setupDOM();
    }

    setupDOM() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="dice-3d-scene" id="diceScene">
                <div class="dice-3d-cube" id="diceCube">
                    <div class="dice-face front" data-face="1">
                        <span class="pip center"></span>
                    </div>
                    <div class="dice-face back" data-face="6">
                        <span class="pip top-left"></span>
                        <span class="pip top-right"></span>
                        <span class="pip mid-left"></span>
                        <span class="pip mid-right"></span>
                        <span class="pip bot-left"></span>
                        <span class="pip bot-right"></span>
                    </div>
                    <div class="dice-face right" data-face="3">
                        <span class="pip top-left"></span>
                        <span class="pip center"></span>
                        <span class="pip bot-right"></span>
                    </div>
                    <div class="dice-face left" data-face="4">
                        <span class="pip top-left"></span>
                        <span class="pip top-right"></span>
                        <span class="pip bot-left"></span>
                        <span class="pip bot-right"></span>
                    </div>
                    <div class="dice-face top" data-face="5">
                        <span class="pip top-left"></span>
                        <span class="pip top-right"></span>
                        <span class="pip center"></span>
                        <span class="pip bot-left"></span>
                        <span class="pip bot-right"></span>
                    </div>
                    <div class="dice-face bottom" data-face="2">
                        <span class="pip top-left"></span>
                        <span class="pip bot-right"></span>
                    </div>
                </div>
                <div class="dice-shadow" id="diceShadow"></div>
            </div>
            <button class="btn-royal-roll" id="btnRollDice">
                <span class="btn-shine"></span>
                <span class="btn-icon">🎲</span>
                <span class="btn-text">LEMPAR DADU</span>
            </button>
        `;

        this.cube = this.container.querySelector('#diceCube');
        this.shadow = this.container.querySelector('#diceShadow');
        this.btn = this.container.querySelector('#btnRollDice');

        if (this.btn) {
            this.btn.addEventListener('click', () => this.roll());
        }
        if (this.cube) {
            this.cube.addEventListener('click', () => this.roll());
        }
    }

    setDisabled(disabled) {
        if (this.btn) {
            this.btn.disabled = disabled;
            if (disabled) {
                this.btn.classList.add('disabled');
            } else {
                this.btn.classList.remove('disabled');
            }
        }
    }

    roll(forcedValue = null) {
        if (this.isRolling) return;
        this.isRolling = true;
        this.setDisabled(true);

        const targetValue = forcedValue !== null ? forcedValue : Math.floor(Math.random() * 6) + 1;
        this.currentValue = targetValue;

        if (window.soundEngine) {
            window.soundEngine.playDiceRoll();
        }

        const faceRotations = {
            1: { x: 0, y: 0 },
            2: { x: 90, y: 0 },
            3: { x: 0, y: -90 },
            4: { x: 0, y: 90 },
            5: { x: -90, y: 0 },
            6: { x: 180, y: 0 }
        };

        const target = faceRotations[targetValue];
        const extraSpinsX = (3 + Math.floor(Math.random() * 2)) * 360;
        const extraSpinsY = (3 + Math.floor(Math.random() * 2)) * 360;

        const finalX = extraSpinsX + target.x;
        const finalY = extraSpinsY + target.y;

        this.cube.style.transition = 'none';
        this.cube.style.transform = `translateZ(-50px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        void this.cube.offsetWidth;

        this.cube.style.transition = 'transform 1.4s cubic-bezier(0.15, 0.9, 0.25, 1.15)';
        this.cube.style.transform = `translateZ(-50px) rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${Math.random() > 0.5 ? 360 : -360}deg)`;

        if (this.shadow) {
            this.shadow.classList.add('bouncing');
        }

        setTimeout(() => {
            if (window.soundEngine) {
                window.soundEngine.playDiceLand();
            }
            if (this.shadow) {
                this.shadow.classList.remove('bouncing');
            }

            this.cube.style.transition = 'none';
            this.cube.style.transform = `translateZ(-50px) rotateX(${target.x}deg) rotateY(${target.y}deg)`;

            this.isRolling = false;
            if (typeof this.onRollComplete === 'function') {
                this.onRollComplete(targetValue);
            }
        }, 1450);
    }
}

/**
 * ThematicModalDice - Dadu 3D dengan sisi bergambar item / kekuatan khusus
 * Digunakan pada Petak SPECIAL DICE dan WEIRD DICE.
 */
class ThematicModalDice {
    constructor(containerElement, type = 'special', items = [], onRollComplete) {
        this.container = containerElement;
        this.type = type; // 'special' atau 'weird'
        this.items = items; // Array of 6 item objects: { id, icon, title, desc }
        this.onRollComplete = onRollComplete;
        this.isRolling = false;
        this.setupDOM();
    }

    setupDOM() {
        if (!this.container) return;

        const cubeThemeClass = this.type === 'special' ? 'theme-gold-cube' : 'theme-weird-cube';
        const buttonThemeClass = this.type === 'special' ? 'btn-roll-gold' : 'btn-roll-weird';
        const buttonText = this.type === 'special' ? '🎲 PUTAR DADU EMAS KERASAAN!' : '🌀 PUTAR DADU MISTERI ANEH!';

        this.container.innerHTML = `
            <div class="thematic-dice-wrapper">
                <div class="dice-3d-scene thematic-scene">
                    <div class="dice-3d-cube ${cubeThemeClass}" id="thematicCube">
                        <div class="dice-face thematic-face front" data-face="1" style="${this.items[0].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[0].icon}</span>
                            <span class="face-label">${this.items[0].title}</span>
                        </div>
                        <div class="dice-face thematic-face back" data-face="6" style="${this.items[5].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[5].icon}</span>
                            <span class="face-label">${this.items[5].title}</span>
                        </div>
                        <div class="dice-face thematic-face right" data-face="3" style="${this.items[2].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[2].icon}</span>
                            <span class="face-label">${this.items[2].title}</span>
                        </div>
                        <div class="dice-face thematic-face left" data-face="4" style="${this.items[3].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[3].icon}</span>
                            <span class="face-label">${this.items[3].title}</span>
                        </div>
                        <div class="dice-face thematic-face top" data-face="5" style="${this.items[4].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[4].icon}</span>
                            <span class="face-label">${this.items[4].title}</span>
                        </div>
                        <div class="dice-face thematic-face bottom" data-face="2" style="${this.items[1].style || ''}">
                            <span class="face-icon" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${this.items[1].icon}</span>
                            <span class="face-label">${this.items[1].title}</span>
                        </div>
                    </div>
                    <div class="dice-shadow thematic-shadow" id="thematicShadow"></div>
                </div>
                <div class="thematic-controls">
                    <button class="btn-thematic-roll ${buttonThemeClass}" id="btnThematicRoll">
                        ${buttonText}
                    </button>
                </div>
                <div class="thematic-result-card hidden" id="thematicResultCard"></div>
            </div>
        `;

        this.cube = this.container.querySelector('#thematicCube');
        this.shadow = this.container.querySelector('#thematicShadow');
        this.btn = this.container.querySelector('#btnThematicRoll');
        this.resultCard = this.container.querySelector('#thematicResultCard');

        if (this.btn) this.btn.onclick = () => this.roll();
        if (this.cube) this.cube.onclick = () => this.roll();
    }

    roll() {
        if (this.isRolling) return;
        this.isRolling = true;
        if (this.btn) {
            this.btn.disabled = true;
            this.btn.style.opacity = '0.5';
        }

        const faceIndex = Math.floor(Math.random() * 6); // 0 to 5
        const chosenItem = this.items[faceIndex];

        if (window.soundEngine) {
            window.soundEngine.playDiceRoll();
        }

        // Face rotation mapping (1=front/0, 2=bottom/1, 3=right/2, 4=left/3, 5=top/4, 6=back/5)
        const faceRotations = {
            0: { x: 0, y: 0 },
            1: { x: 90, y: 0 },
            2: { x: 0, y: -90 },
            3: { x: 0, y: 90 },
            4: { x: -90, y: 0 },
            5: { x: 180, y: 0 }
        };

        const target = faceRotations[faceIndex];
        const extraSpinsX = (3 + Math.floor(Math.random() * 2)) * 360;
        const extraSpinsY = (3 + Math.floor(Math.random() * 2)) * 360;

        const finalX = extraSpinsX + target.x;
        const finalY = extraSpinsY + target.y;

        this.cube.style.transition = 'none';
        this.cube.style.transform = `translateZ(-50px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        void this.cube.offsetWidth;

        this.cube.style.transition = 'transform 1.4s cubic-bezier(0.15, 0.9, 0.25, 1.15)';
        this.cube.style.transform = `translateZ(-50px) rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${Math.random() > 0.5 ? 360 : -360}deg)`;

        if (this.shadow) this.shadow.classList.add('bouncing');

        setTimeout(() => {
            if (window.soundEngine) window.soundEngine.playDiceLand();
            if (this.shadow) this.shadow.classList.remove('bouncing');

            this.cube.style.transition = 'none';
            this.cube.style.transform = `translateZ(-50px) rotateX(${target.x}deg) rotateY(${target.y}deg)`;

            this.isRolling = false;
            if (this.btn) this.btn.classList.add('hidden');

            // Tampilkan kartu hasil item yang mendarat
            if (this.resultCard) {
                this.resultCard.innerHTML = `
                    <div class="result-banner">
                        <span class="r-icon">${chosenItem.icon}</span>
                        <h3 class="r-title">${chosenItem.title}</h3>
                        <p class="r-desc">${chosenItem.desc}</p>
                        <button class="btn-royal-action" id="btnExecuteThematic">Aktifkan Efek!</button>
                    </div>
                `;
                this.resultCard.classList.remove('hidden');

                const execBtn = this.resultCard.querySelector('#btnExecuteThematic');
                if (execBtn) {
                    execBtn.onclick = () => {
                        if (typeof this.onRollComplete === 'function') {
                            this.onRollComplete(chosenItem);
                        }
                    };
                }
            }
        }, 1450);
    }
}

window.MedievalDice = MedievalDice;
window.ThematicModalDice = ThematicModalDice;
