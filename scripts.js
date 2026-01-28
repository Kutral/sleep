/* ============================================
   SAT - Core Application Logic (Refactored)
   Architecture: SOLID (Single Responsibility)
   ============================================ */

/* ------------------------------------------------
   1. STATE MANAGER
   Handles all data and session state.
   ------------------------------------------------ */
const StateManager = {
    data: {
        currentScreen: 'home',
        sessionStart: null,
        usedScriptIds: [],
        twilightMode: false
    },

    init() {
        this.data.twilightMode = localStorage.getItem('sat_twilight') === 'true';
        if (this.data.twilightMode) document.body.classList.add('twilight-mode');
    },

    toggleTwilight() {
        this.data.twilightMode = !this.data.twilightMode;
        document.body.classList.toggle('twilight-mode');
        localStorage.setItem('sat_twilight', this.data.twilightMode);
        return this.data.twilightMode;
    },

    startSession() {
        this.data.sessionStart = new Date().toISOString();
    },

    getRandomScript() {
        if (typeof SCRIPTS === 'undefined') return { text: "Data loading error. Please refresh." };
        if (this.data.usedScriptIds.length >= SCRIPTS.length) this.data.usedScriptIds = [];
        const available = SCRIPTS.filter(s => !this.data.usedScriptIds.includes(s.id));
        const script = available[Math.floor(Math.random() * available.length)];
        this.data.usedScriptIds.push(script && script.id);
        return script || SCRIPTS[0];
    },

    logSession(feeling) {
        const sessions = JSON.parse(localStorage.getItem('sat_sessions') || '[]');
        sessions.push({
            timestamp: this.data.sessionStart,
            feeling: feeling,
            endTime: new Date().toISOString()
        });
        if (sessions.length > 30) sessions.shift();
        localStorage.setItem('sat_sessions', JSON.stringify(sessions));
    }
};

/* ------------------------------------------------
   2. AUDIO MANAGER
   Handles Web Audio API.
   ------------------------------------------------ */
const AudioManager = {
    ctx: null,
    source: null,
    gain: null,
    isPlaying: false,

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    },

    toggleNoise() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        if (this.isPlaying) {
            this.fadeOut();
        } else {
            this.playBrownNoise();
        }
        return this.isPlaying;
    },

    playBrownNoise() {
        // Create Brown Noise Buffer
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }

        this.source = this.ctx.createBufferSource();
        this.source.buffer = buffer;
        this.source.loop = true;
        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.source.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.source.start();

        this.gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1);
        this.isPlaying = true;
    },

    fadeOut() {
        if (this.gain) {
            this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
            setTimeout(() => {
                if (this.source) { this.source.stop(); this.source = null; }
                this.isPlaying = false;
            }, 500);
        } else {
            this.isPlaying = false;
        }
    },

    vibrate(ms) {
        if (navigator.vibrate) navigator.vibrate(ms);
    }
};

/* ------------------------------------------------
   3. UI MANAGER
   Handles DOM updates and Animations.
   ------------------------------------------------ */
const UIManager = {
    screens: {},
    elements: {},

    init() {
        // Cache Screens
        ['home', 'script', 'action', 'log', 'breathe', 'rescue', 'permission', 'end'].forEach(id => {
            this.screens[id] = document.getElementById(`screen-${id}`);
        });

        // Cache Elements
        this.elements = {
            scriptText: document.getElementById('script-text'),
            actionText: document.getElementById('action-text'),
            rescueTitle: document.getElementById('rescue-title'),
            rescueContent: document.getElementById('rescue-content'),
            noiseBtn: document.getElementById('btn-noise'),
            twilightBtn: document.getElementById('btn-twilight'),
            endMessage: document.querySelector('.end-message')
        };
    },

    showScreen(name) {
        // 1. Cleanup previous state
        TechniqueManager.stopAll();

        // 2. Hide all screens
        Object.values(this.screens).forEach(el => el && el.classList.remove('active'));

        // 3. Show new screen
        if (this.screens[name]) {
            this.screens[name].classList.add('active');

            // Special Entry Actions
            if (name === 'end') this.randomizeEndMessage();
        }
    },

    typeWriter(text, elementId, speed = 30) {
        const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        if (!el) return;

        el.innerHTML = '';
        let i = 0;

        // Show button hidden initially
        const btnDone = document.getElementById('btn-done');
        if (btnDone) { btnDone.style.display = 'none'; btnDone.style.opacity = '0'; }

        function type() {
            if (i < text.length) {
                el.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (btnDone) {
                    btnDone.style.display = 'block';
                    setTimeout(() => btnDone.style.opacity = '1', 100);
                }
            }
        }
        type();
    },

    updateNoiseIcon(isPlaying) {
        if (this.elements.noiseBtn) {
            this.elements.noiseBtn.textContent = isPlaying ? '🔊' : '🔇';
            this.elements.noiseBtn.classList.toggle('active', isPlaying);
        }
    },

    randomizeEndMessage() {
        if (typeof CLOSING_MESSAGES !== 'undefined' && this.elements.endMessage) {
            const msg = CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)];
            this.elements.endMessage.innerHTML = msg;
        }
    }
};

/* ------------------------------------------------
   4. TECHNIQUE MANAGER
   Handles Interactive Modules (Breathing, Candle, etc.)
   ------------------------------------------------ */
const TechniqueManager = {
    startBoxBreathing() {
        if (window.BoxBreathing) BoxBreathing.start();
    },

    startRescue(method) {
        // Reset UI
        UIManager.elements.rescueTitle.textContent = method.title;
        UIManager.elements.rescueContent.innerHTML = method.text;
        UIManager.elements.rescueContent.style.display = 'block';

        // Interactive Triggers
        if (method.title === "4-7-8 Breathing" && window.Breath478) {
            UIManager.elements.rescueContent.style.display = 'none';
            Breath478.start();
        } else if (method.text && method.text.includes("candle") && window.CandleFlicker) {
            // Trigger candle if text mentions it or title matches (Logic enhancement)
            // For now, let's look for specific title or keyword
            // Ideally we add a 'type' to the RESCUE_METHODS objects in data.js
        }

        // Manual override for Candle (since we don't have metadata yet, checking title/text)
        if (method.title.includes("Candle") || method.text.includes("candle")) {
            if (window.CandleFlicker) {
                UIManager.elements.rescueContent.style.display = 'none';
                CandleFlicker.start();
            }
        }
    },

    stopAll() {
        if (window.BoxBreathing) BoxBreathing.stop();
        if (window.Breath478) Breath478.stop();
        if (window.CandleFlicker) CandleFlicker.stop();
    }
};

/* ------------------------------------------------
   5. APP CONTROLLER (Main Entry)
   ------------------------------------------------ */
const App = {
    init() {
        StateManager.init();
        AudioManager.init(); // Pre-init audio context
        UIManager.init();
        this.bindEvents();

        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
    },

    bindEvents() {
        // Twilight Mode
        const btnTwilight = document.getElementById('btn-twilight');
        if (btnTwilight) {
            btnTwilight.addEventListener('click', () => {
                AudioManager.vibrate(20);
                StateManager.toggleTwilight();
            });
        }

        // Noise
        const btnNoise = document.getElementById('btn-noise');
        if (btnNoise) {
            btnNoise.addEventListener('click', () => {
                AudioManager.vibrate(20);
                const isPlaying = AudioManager.toggleNoise();
                UIManager.updateNoiseIcon(isPlaying);
            });
        }

        // Flow: Anxious -> Script
        document.getElementById('btn-anxious').addEventListener('click', () => {
            AudioManager.vibrate(50);
            StateManager.startSession();
            const script = StateManager.getRandomScript();
            UIManager.showScreen('script');
            UIManager.typeWriter(script.text, 'script-text');
        });

        // Flow: Script -> Action or Done
        document.getElementById('btn-done').addEventListener('click', () => {
            AudioManager.vibrate(50);
            const action = window.MICRO_ACTIONS ?
                MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)] :
                "Breathe.";
            document.getElementById('action-text').textContent = action;
            UIManager.showScreen('action');
        });

        // Log Flow
        document.getElementById('btn-try').addEventListener('click', () => UIManager.showScreen('log'));
        document.getElementById('btn-skip').addEventListener('click', () => UIManager.showScreen('log'));

        // Logging
        document.querySelectorAll('.btn-log').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feeling = e.target.dataset.feeling;
                StateManager.logSession(feeling);
                if (feeling === 'better') {
                    UIManager.showScreen('permission');
                } else {
                    UIManager.showScreen('breathe');
                    TechniqueManager.startBoxBreathing();
                }
            });
        });

        // Breathing Fail -> Rescue
        document.getElementById('btn-breathe-fail').addEventListener('click', () => {
            AudioManager.vibrate(50);
            this.triggerRandomRescue();
        });

        // Rescue Cycling
        const btnRescueNext = document.getElementById('btn-rescue-next');
        if (btnRescueNext) {
            btnRescueNext.addEventListener('click', () => {
                AudioManager.vibrate(50);
                this.triggerRandomRescue();
            });
        }

        // Common Done Buttons
        ['btn-breathe-done', 'btn-rescue-done', 'btn-permission-done'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    AudioManager.vibrate(50);
                    UIManager.showScreen('end');
                    setTimeout(() => UIManager.showScreen('home'), 5000);
                });
            }
        });
    },

    triggerRandomRescue() {
        // Logic to pick unique random rescue method
        // Using StateManager to track history
        // For simplicity in this refactor, we access global directly or through helper
        if (typeof RESCUE_METHODS === 'undefined') return;

        const method = RESCUE_METHODS[Math.floor(Math.random() * RESCUE_METHODS.length)]; // Simple random for now
        UIManager.showScreen('rescue');
        TechniqueManager.startRescue(method);
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
