/* ============================================
   SAT - Sleep Anxiety Tracker
   Core Logic & Anxiety Interruption Engine
   ============================================ */

// ============================================
// GROUNDING SCRIPTS (The Heart of the App)
// ============================================
const SCRIPTS = [
    {
        id: 1,
        text: "Your body is resting right now, even if your mind isn't. Lying still provides 80% of the physical recovery of sleep. You are rebuilding energy just by being here. You are okay."
    },
    {
        id: 2,
        text: "Tomorrow will happen, and you will get through it. You have survived tired days before. Your adrenaline will carry you. For now, you don't need to solve tomorrow. You just need to be."
    },
    {
        id: 3,
        text: "Trying to sleep is the best way to stay awake. Give up the goal of sleeping. Your only goal right now is to rest your eyes. Sleep is a visitor; you can't force it to arrive, but you can leave the door open."
    },
    {
        id: 4,
        text: "It is okay to be awake. Millions of people are awake with you right now. You are not broken. You are just a human with an active mind. This moment will pass."
    },
    {
        id: 5,
        text: "In the grand scheme of your life, this one rough night is a tiny speck. It will not break you. It will not ruin your health. Let go of the pressure to be perfect at sleeping."
    },
    {
        id: 6,
        text: "Feel the weight of your body on the mattress. Gravity is holding you. You don't need to hold yourself up. Let the bed do the work. Release your jaw. Release your shoulders."
    },
    {
        id: 7,
        text: "Your brain is spinning because it thinks there is a problem to solve. There is no problem. This is just a false alarm. You are safe in bed. There is no tiger. You can stand down."
    },
    {
        id: 8,
        text: "Say to yourself: 'I am awake, and that is fine.' Fighting it creates tension. Accepting it creates space. Be a watcher of your wakefulness, not a judge."
    },
    {
        id: 9,
        text: "Imagine you are drifting on a boat in a calm lake. Thoughts are just clouds passing overhead. You don't need to chase them or push them away. Just let them float by."
    },
    {
        id: 10,
        text: "You are warm. You are safe. You have nowhere to be for hours. This is your time to just exist. Nothing is required of you right now."
    }
];

// ============================================
// MICRO ACTIONS
// ============================================
const MICRO_ACTIONS = [
    "Put the phone face down for 5 minutes.",
    "Read something boring — anything at all.",
    "Lie still and rest your eyes. No pressure.",
    "Get a glass of water, then return to bed.",
    "Stretch your arms above your head, then relax.",
    "Listen to the silence around you."
];

// ============================================
// APP STATE
// ============================================
const state = {
    currentScreen: 'home',
    selectedScript: null,
    selectedAction: null,
    sessionStart: null,
    usedScriptIds: []
};

// ============================================
// DOM ELEMENTS
// ============================================
const screens = {
    home: document.getElementById('screen-home'),
    script: document.getElementById('screen-script'),
    action: document.getElementById('screen-action'),
    log: document.getElementById('screen-log'),
    breathe: document.getElementById('screen-breathe'),
    distraction: document.getElementById('screen-distraction'),
    end: document.getElementById('screen-end')
};

const elements = {
    btnAnxious: document.getElementById('btn-anxious'),
    btnDone: document.getElementById('btn-done'),
    btnTry: document.getElementById('btn-try'),
    btnSkip: document.getElementById('btn-skip'),
    btnBreatheDone: document.getElementById('btn-breathe-done'),
    btnBreatheFail: document.getElementById('btn-breathe-fail'),
    btnDistractionDone: document.getElementById('btn-distraction-done'),
    scriptText: document.getElementById('script-text'),
    actionText: document.getElementById('action-text'),
    // breatheText: document.getElementById('breathe-text'), // REMOVED
    labels: [
        document.querySelector('.label-top'),    // Inhale (Phase 0)
        document.querySelector('.label-right'),  // Hold (Phase 1) - Visual flow is Top->Right->Bottom->Left? 
        // Wait, animation goes: Top-Left -> Top-Right (Top edge).
        // Then Top-Right -> Bottom-Right (Right edge).
        // So Phase 0 = Top Edge. Phase 1 = Right Edge.
        document.querySelector('.label-bottom'), // Exhale (Phase 2) ?? Wait. 
        // Box Path: 
        // 0-25%: Top Edge (Left to Right). Label: Top (Inhale)
        // 25-50%: Right Edge (Top to Bottom). Label: Right (Hold)
        // 50-75%: Bottom Edge (Right to Left). Label: Bottom (Exhale)
        // 75-100%: Left Edge (Bottom to Top). Label: Left (Hold)
        document.querySelector('.label-left')
    ],
    logButtons: document.querySelectorAll('.btn-log')
};

// ... [Screen Navigation / Random Logic] ...

// ============================================
// BOX BREATHING LOGIC
// ============================================
let breathingInterval;

function startBoxBreathing() {
    clearInterval(breathingInterval);

    // Cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
    let phase = 0; // 0=Top, 1=Right, 2=Bottom, 3=Left

    const updateLabels = () => {
        // Reset all
        // Re-query to be safe or use static? Static is fine if elements exist.
        // Actually elements.labels array isn't fully safe if I just querySelector'd it at top.
        // Let's re-query to ensure they are found.
        const labels = [
            document.querySelector('.label-top'),
            document.querySelector('.label-right'),
            document.querySelector('.label-bottom'),
            document.querySelector('.label-left')
        ];

        labels.forEach((el, index) => {
            if (index === phase) {
                el.classList.add('active');
                vibrate(20); // Subtle tick for phase change
            } else {
                el.classList.remove('active');
            }
        });

        phase = (phase + 1) % 4;
    };

    updateLabels(); // Initial
    breathingInterval = setInterval(updateLabels, 4000); // Update every 4s
}

function stopBoxBreathing() {
    clearInterval(breathingInterval);
}

// ============================================
// EVENT HANDLERS
// ============================================
function initEventListeners() {
    // ... [Previous handlers] ...

    // Log -> Logic
    elements.logButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            logSession(feeling);

            if (feeling === 'better') {
                showScreen('end');
                setTimeout(() => showScreen('home'), 5000);
            } else {
                showScreen('breathe');
                startBoxBreathing();
            }
        });
    });

    // Breathe -> Done
    elements.btnBreatheDone.addEventListener('click', () => {
        vibrate(50);
        stopBoxBreathing();
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });

    // Breathe -> Fail (Still not well)
    elements.btnBreatheFail.addEventListener('click', () => {
        vibrate(50);
        stopBoxBreathing();
        showScreen('distraction');
    });

    // Distraction -> Done
    elements.btnDistractionDone.addEventListener('click', () => {
        vibrate(50);
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });
}
function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        state.currentScreen = screenName;
    }
}

// ============================================
// RANDOM SELECTION (Avoid Repeats)
// ============================================
function getRandomScript() {
    // Reset if all scripts have been used
    if (state.usedScriptIds.length >= SCRIPTS.length) {
        state.usedScriptIds = [];
    }

    // Filter out used scripts
    const availableScripts = SCRIPTS.filter(s => !state.usedScriptIds.includes(s.id));

    // Pick random
    const script = availableScripts[Math.floor(Math.random() * availableScripts.length)];
    state.usedScriptIds.push(script.id);

    return script;
}

function getRandomAction() {
    return MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
}

// ============================================
// LOCAL STORAGE (Gentle Logging)
// ============================================
function logSession(feeling = null) {
    const sessions = JSON.parse(localStorage.getItem('sat_sessions') || '[]');

    const session = {
        timestamp: state.sessionStart,
        scriptId: state.selectedScript?.id,
        actionTaken: state.selectedAction !== null,
        feeling: feeling,
        endTime: new Date().toISOString()
    };

    sessions.push(session);

    // Keep only last 30 sessions
    if (sessions.length > 30) {
        sessions.shift();
    }

    localStorage.setItem('sat_sessions', JSON.stringify(sessions));
}

// ============================================
// MONETIZATION CHECK (Free = 1 per night)
// ============================================
function checkFreeLimit() {
    const today = new Date().toDateString();
    const lastUse = localStorage.getItem('sat_last_use_date');
    const usesToday = parseInt(localStorage.getItem('sat_uses_today') || '0');
    const isPremium = localStorage.getItem('sat_premium') === 'true';

    if (isPremium) return true;

    if (lastUse !== today) {
        // New day, reset counter
        localStorage.setItem('sat_last_use_date', today);
        localStorage.setItem('sat_uses_today', '1');
        return true;
    }

    if (usesToday < 1) {
        localStorage.setItem('sat_uses_today', String(usesToday + 1));
        return true;
    }

    return false; // Limit reached
}

function showPaywall() {
    elements.scriptText.innerHTML = `
        <span style="color: var(--text-secondary);">You've used your free session tonight.</span>
        <br><br>
        <span style="font-size: 0.9em;">Unlock unlimited nighttime support for just ₹99/month or ₹499/year.</span>
        <br><br>
        <button onclick="unlockPremium()" style="
            background: var(--accent-warm);
            color: var(--bg-primary);
            border: none;
            padding: 12px 24px;
            border-radius: 20px;
            font-family: var(--font-ui);
            cursor: pointer;
        ">Unlock Now</button>
    `;
    showScreen('script');
    elements.btnDone.style.display = 'none';
}

// Placeholder for payment integration
function unlockPremium() {
    // In real app: Redirect to Stripe/Razorpay
    alert('Payment integration coming soon!\n\nFor testing, premium is now enabled.');
    localStorage.setItem('sat_premium', 'true');
    location.reload();
}

// ============================================
// AUDIO ENGINE (Brown Noise)
// ============================================
let audioCtx;
let noiseSource;
let noiseGain;
let isPlaying = false;

function toggleNoise() {
    // Resume context if suspended (browser autoplay policy)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (!audioCtx) {
        // Init Audio Context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Create Brown Noise Buffer
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds loop
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            // Brown noise integration algorithm
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate for gain loss
        }

        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        noiseGain = audioCtx.createGain();
        noiseGain.gain.value = 0.4; // Volume

        // Ramp up volume
        noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 2);

        noiseSource.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseSource.start();

        isPlaying = true;
    } else {
        if (isPlaying) {
            // Ramp down
            noiseGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
            setTimeout(() => audioCtx.suspend(), 500);
            isPlaying = false;
        } else {
            audioCtx.resume();
            // Ramp up
            noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 1);
            isPlaying = true;
        }
    }

    updateNoiseIcon();
}

function updateNoiseIcon() {
    const btn = document.getElementById('btn-noise');
    if (isPlaying) {
        btn.textContent = '🔊';
        btn.classList.add('active');
    } else {
        btn.textContent = '🔇';
        btn.classList.remove('active');
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
function initEventListeners() {
    // Noise Toggle
    document.getElementById('btn-noise').addEventListener('click', () => {
        vibrate(20);
        toggleNoise();
    });

    // Home -> Script
    elements.btnAnxious.addEventListener('click', () => {
        vibrate(50);
        state.sessionStart = new Date().toISOString();

        if (!checkFreeLimit()) {
            showPaywall();
            return;
        }

        state.selectedScript = getRandomScript();
        typeWriter(state.selectedScript.text, elements.scriptText, 35);

        showScreen('script');
    });

    // Script -> Action
    elements.btnDone.addEventListener('click', () => {
        vibrate(50);
        state.selectedAction = getRandomAction();
        elements.actionText.textContent = state.selectedAction;
        showScreen('action');
    });

    // Action -> Log
    elements.btnTry.addEventListener('click', () => {
        vibrate(50);
        showScreen('log');
    });

    elements.btnSkip.addEventListener('click', () => {
        vibrate(50);
        state.selectedAction = null;
        showScreen('log');
    });

    // Log -> End
    // Log -> Logic (Rescue vs End)
    elements.logButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            logSession(feeling);

            if (feeling === 'better') {
                showScreen('end');
                setTimeout(() => showScreen('home'), 5000);
            } else {
                // Rescue Flow for Same/Worse
                showScreen('breathe');
            }
        });
    });

    // Breathe -> End
    elements.btnBreatheDone.addEventListener('click', () => {
        vibrate(50);
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });
}

// ============================================
// UI HELPERS (Haptics & Typewriter)
// ============================================
function vibrate(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

function typeWriter(text, element, speed = 30) {
    element.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            elements.btnDone.style.display = 'block'; // Show button only after typing
            elements.btnDone.style.opacity = '0';
            setTimeout(() => elements.btnDone.style.opacity = '1', 100);
        }
    }

    elements.btnDone.style.display = 'none'; // Hide initially
    type();
}

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed:', err));
    }
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    registerServiceWorker();
});

// Expose for paywall button
window.unlockPremium = unlockPremium;
