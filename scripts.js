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
    end: document.getElementById('screen-end')
};

const elements = {
    btnAnxious: document.getElementById('btn-anxious'),
    btnDone: document.getElementById('btn-done'),
    btnTry: document.getElementById('btn-try'),
    btnSkip: document.getElementById('btn-skip'),
    btnBreatheDone: document.getElementById('btn-breathe-done'),
    scriptText: document.getElementById('script-text'),
    actionText: document.getElementById('action-text'),
    logButtons: document.querySelectorAll('.btn-log')
};

// ============================================
// SCREEN NAVIGATION
// ============================================
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
// EVENT HANDLERS
// ============================================
function initEventListeners() {
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
