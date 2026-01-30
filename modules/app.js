/* ------------------------------------------------
   APP CONTROLLER (Main Entry)
   ------------------------------------------------ */
const App = {
    init() {
        StateManager.init();
        AudioManager.init(); // Pre-init audio context
        UIManager.init();
        this.bindEvents();

        // New Feature Init
        if (window.HypnoticCanvas) HypnoticCanvas.init();
        if (window.SoundscapePlus) SoundscapePlus.init();
        if (window.SleepJournal) SleepJournal.init();
        if (window.CookieConsent) CookieConsent.init();

        // Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
    },

    bindEvents() {
        // Twilight Mode
        const btnTwilight = document.getElementById('btn-twilight');
        if (btnTwilight) {
            btnTwilight.addEventListener('click', (e) => {
                AudioManager.vibrate(20);
                const isTwilight = StateManager.toggleTwilight();
                e.currentTarget.classList.toggle('active', isTwilight);
            });
        }

        // Noise (Generic toggle, now using SoundscapePlus if available)
        const btnNoise = document.getElementById('btn-noise');
        if (btnNoise) {
            btnNoise.addEventListener('click', () => {
                AudioManager.vibrate(20);
                const isPlaying = AudioManager.toggleNoise();
                UIManager.updateNoiseIcon(isPlaying);
            });
        }

        // Soundscape Buttons
        document.querySelectorAll('.btn-sound').forEach(btn => {
            btn.addEventListener('click', (e) => {
                AudioManager.vibrate(20);
                const sound = e.currentTarget.dataset.sound;
                const isPlaying = SoundscapePlus.play(sound);

                // Update UI state
                document.querySelectorAll('.btn-sound').forEach(b => b.classList.remove('active'));
                if (isPlaying) {
                    e.currentTarget.classList.add('active');
                    // If playing soundscape, turn off the general brown noise
                    if (AudioManager.isPlaying) {
                        AudioManager.fadeOut();
                        UIManager.updateNoiseIcon(false);
                    }
                }
            });
        });

        // Worry Burner Events
        const btnBurn = document.getElementById('btn-worry-burn');
        if (btnBurn) {
            btnBurn.addEventListener('click', () => {
                AudioManager.vibrate(50);
                if (window.WorryBurner) WorryBurner.start();
                setTimeout(() => {
                    UIManager.showScreen('permission');
                }, 3500);
            });
        }

        const btnWorrySkip = document.getElementById('btn-worry-skip');
        if (btnWorrySkip) {
            btnWorrySkip.addEventListener('click', () => {
                UIManager.showScreen('rescue');
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
                    // Randomize initial breathing intervention
                    if (Math.random() > 0.5 && window.Breath478) {
                        UIManager.showScreen('rescue');
                        TechniqueManager.startRescue({ title: "4-7-8 Breathing", text: "" });
                    } else {
                        UIManager.showScreen('breathe');
                        TechniqueManager.startBoxBreathing();
                    }
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

        // Journal Events
        const btnJournal = document.getElementById('btn-journal');
        if (btnJournal) {
            btnJournal.addEventListener('click', () => {
                AudioManager.vibrate(20);
                UIManager.showScreen('journal');
                if (window.SleepJournal) {
                    const savedText = SleepJournal.load();
                    const input = document.getElementById('journal-input');
                    if (input) input.value = savedText;
                }
            });
        }

        const btnJournalSave = document.getElementById('btn-journal-save');
        if (btnJournalSave) {
            btnJournalSave.addEventListener('click', () => {
                AudioManager.vibrate(50);
                const input = document.getElementById('journal-input');
                if (input && window.SleepJournal) {
                    SleepJournal.save(input.value);
                }
                // Reuse the 'permission' screen flow or go to end
                UIManager.showScreen('permission');
            });
        }

        const btnJournalClear = document.getElementById('btn-journal-clear');
        if (btnJournalClear) {
            btnJournalClear.addEventListener('click', () => {
                AudioManager.vibrate(20);
                const input = document.getElementById('journal-input');
                if (input) input.value = '';
                if (window.SleepJournal) SleepJournal.clear();
            });
        }

        const btnJournalBack = document.getElementById('btn-journal-back');
        if (btnJournalBack) {
            btnJournalBack.addEventListener('click', () => {
                AudioManager.vibrate(20);
                UIManager.showScreen('home');
            });
        }

        // Fade to Black Timer Init
        this.startInactivityTimer();
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
