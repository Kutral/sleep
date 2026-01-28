/* ------------------------------------------------
   APP CONTROLLER (Main Entry)
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
        const method = StateManager.getRandomRescueMethod();
        if (!method) return;

        UIManager.showScreen('rescue');
        TechniqueManager.startRescue(method);
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
