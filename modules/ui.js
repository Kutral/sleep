/* ------------------------------------------------
   UI MANAGER
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

        // Randomize Home Screen
        this.randomizeHomeContent();
    },

    randomizeHomeContent() {
        if (typeof OPENING_WHISPERS !== 'undefined') {
            const whisper = OPENING_WHISPERS[Math.floor(Math.random() * OPENING_WHISPERS.length)];
            const whisperEl = document.querySelector('.whisper');
            if (whisperEl) whisperEl.textContent = whisper;
        }

        if (typeof BUTTON_LABELS !== 'undefined') {
            const label = BUTTON_LABELS[Math.floor(Math.random() * BUTTON_LABELS.length)];
            const btn = document.getElementById('btn-anxious');
            if (btn) btn.textContent = label;
        }
    },

    showScreen(name) {
        // 1. Cleanup previous state
        if (typeof TechniqueManager !== 'undefined') TechniqueManager.stopAll();

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
