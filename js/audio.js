/**
 * PENAKHLUKAN KERAJAAN - Web Audio API Procedural Sound Engine
 * No external audio files needed - 100% offline & zero dependencies
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.sfxVolume = 0.7;
        this.bgmVolume = 0.5;
        this.currentBgmType = null;
        this.bgmAudio = null;

        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('penakhlukan_audio_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.sfxVolume !== undefined) this.sfxVolume = parseFloat(parsed.sfxVolume);
                if (parsed.bgmVolume !== undefined) this.bgmVolume = parseFloat(parsed.bgmVolume);
                if (parsed.muted !== undefined) this.muted = !!parsed.muted;
            }
        } catch (e) {}
    }

    saveSettings() {
        try {
            localStorage.setItem('penakhlukan_audio_settings', JSON.stringify({
                sfxVolume: this.sfxVolume,
                bgmVolume: this.bgmVolume,
                muted: this.muted
            }));
        } catch (e) {}
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.bgmAudio && !this.muted && this.bgmAudio.paused && this.currentBgmType) {
            this.bgmAudio.play().catch(() => {});
        }
    }

    setSFXVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, parseFloat(val) || 0));
        this.saveSettings();
    }

    setBGMVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, parseFloat(val) || 0));
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
        }
        this.saveSettings();
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;
        }
        this.saveSettings();
        return this.muted;
    }

    // Play Background Music (BGM)
    playBGM(type = 'lobby') {
        const bgmPaths = {
            'lobby': ['assets/sounds/bgm_lobby.ogg', 'assets/sounds/bgm_lobby.mp3'],
            'gameplay': ['assets/sounds/bgm_gameplay.mp3', 'assets/sounds/bgm_gameplay.ogg']
        };

        if (this.currentBgmType === type && this.bgmAudio) {
            if (this.bgmAudio.paused && !this.muted) {
                this.bgmAudio.play().catch(() => {});
            }
            return;
        }

        this.stopBGM();
        this.currentBgmType = type;

        const paths = bgmPaths[type] || bgmPaths['lobby'];
        this.bgmAudio = new Audio();
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = this.muted ? 0 : this.bgmVolume;

        // Try first available source
        this.bgmAudio.src = paths[0];
        this.bgmAudio.onerror = () => {
            if (paths[1] && this.bgmAudio.src !== paths[1]) {
                this.bgmAudio.src = paths[1];
                this.bgmAudio.play().catch(() => {});
            }
        };

        this.bgmAudio.play().catch(() => {
            // Autoplay might be blocked until user gesture, will be resumed in init()
        });
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio = null;
        }
        this.currentBgmType = null;
    }

    // Play a basic synthesized tone
    playTone(freq, type = 'sine', duration = 0.2, gainLevel = 0.3, pitchDrop = 0) {
        if (this.muted || this.sfxVolume <= 0.001) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            if (pitchDrop !== 0) {
                osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + pitchDrop), now + duration);
            }

            gain.gain.setValueAtTime(gainLevel * this.sfxVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn('Audio error:', e);
        }
    }

    // Button click: snappy wooden click
    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
            gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }

    // Dice rattle & roll: sequence of rapid wooden clicks and tap
    playDiceRoll() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const count = 7;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const pitch = 300 + Math.random() * 260;
                this.playTone(pitch, 'triangle', 0.06, 0.25, -120);
            }, i * 65);
        }
    }

    // Dice final hit
    playDiceLand() {
        if (this.muted) return;
        this.init();
        this.playTone(450, 'sine', 0.15, 0.4, -250);
        setTimeout(() => this.playTone(700, 'triangle', 0.2, 0.3), 50);
    }

    // Pawn hop: playful springing cartoon "boing"
    playPawnHop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
            gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.14);
        } catch (e) {}
    }

    // Correct answer: bright triumphant major chord chime
    playCorrect() {
        if (this.muted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.4, 0.35);
            }, idx * 80);
        });
    }

    // Wrong answer: low buzzer
    playWrong() {
        if (this.muted) return;
        this.init();
        this.playTone(180, 'sawtooth', 0.35, 0.35, -50);
        setTimeout(() => {
            this.playTone(140, 'sawtooth', 0.4, 0.35, -40);
        }, 150);
    }

    // Treasure chest open: sparkle chime + coin jingle
    playTreasure() {
        if (this.muted) return;
        this.init();
        const sparkles = [600, 800, 1000, 1200, 1500, 1800];
        sparkles.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.25, 0.25);
            }, i * 60);
        });
    }

    // Kick opponent: dramatic cartoon whoosh + bonk
    playKick() {
        if (this.muted) return;
        this.init();
        this.playTone(160, 'sawtooth', 0.25, 0.5, -90);
        setTimeout(() => {
            this.playTone(320, 'square', 0.2, 0.4, -200);
        }, 80);
    }

    // Special dice power-up: mystic ascending arpeggio
    playSpecialPower() {
        if (this.muted) return;
        this.init();
        const notes = [440, 554, 659, 880, 1108]; // A major
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.3, 0.25);
            }, idx * 70);
        });
    }

    // Weird dice mystery: quirky wobble
    playWeirdEvent() {
        if (this.muted) return;
        this.init();
        const notes = [650, 420, 580, 310];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sawtooth', 0.2, 0.25, -80);
            }, idx * 90);
        });
    }

    // Pawn reaches Throne finish: fanfare horn!
    playPawnFinish() {
        if (this.muted) return;
        this.init();
        const notes = [440, 440, 440, 587.33, 880];
        const times = [0, 120, 240, 360, 600];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.35, 0.4);
            }, times[idx]);
        });
    }

    // Victory: Grand Medieval Royal Fanfare
    playVictory() {
        if (this.muted) return;
        this.init();
        const fanfare = [
            { f: 523.25, t: 0, d: 0.2 },
            { f: 523.25, t: 160, d: 0.15 },
            { f: 523.25, t: 280, d: 0.15 },
            { f: 659.25, t: 420, d: 0.4 },
            { f: 523.25, t: 700, d: 0.2 },
            { f: 659.25, t: 900, d: 0.25 },
            { f: 783.99, t: 1100, d: 0.7 },
            { f: 1046.50, t: 1500, d: 1.0 }
        ];
        fanfare.forEach(item => {
            setTimeout(() => {
                this.playTone(item.f, 'triangle', item.d, 0.45);
                this.playTone(item.f * 0.5, 'sine', item.d, 0.2);
            }, item.t);
        });
    }
}

window.soundEngine = new SoundEngine();
