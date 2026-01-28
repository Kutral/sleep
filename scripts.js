/* ============================================
   SAT - Sleep Anxiety Tracker
   Core Logic & Anxiety Interruption Engine
   ============================================ */

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
    rescue: document.getElementById('screen-rescue'),
    permission: document.getElementById('screen-permission'),
    end: document.getElementById('screen-end')
};

const elements = {
    btnAnxious: document.getElementById('btn-anxious'),
    btnDone: document.getElementById('btn-done'),
    btnTry: document.getElementById('btn-try'),
    btnSkip: document.getElementById('btn-skip'),
    btnBreatheDone: document.getElementById('btn-breathe-done'),
    btnBreatheFail: document.getElementById('btn-breathe-fail'),
    scriptText: document.getElementById('script-text'),
    actionText: document.getElementById('action-text'),
    // Rescue elements
    rescueId: document.getElementById('rescue-id'),
    rescueTitle: document.getElementById('rescue-title'),
    rescueContent: document.getElementById('rescue-content'),
    btnRescueNext: document.getElementById('btn-rescue-next'),
    btnRescueDone: document.getElementById('btn-rescue-done'),
    // Permission elements
    btnPermissionDone: document.getElementById('btn-permission-done'),

    logButtons: document.querySelectorAll('.btn-log'),
    noiseBtn: document.getElementById('btn-noise')
};

// ============================================
// DATA: SCRIPTS
// ============================================
const SCRIPTS = [
    { id: 1, text: "Your body is resting right now, even if your mind isn't. Lying still provides 80% of the physical recovery of sleep. You are rebuilding energy just by being here. You are okay." },
    { id: 2, text: "Tomorrow will happen, and you will get through it. You have survived tired days before. Your adrenaline will carry you. For now, you don't need to solve tomorrow. You just need to be." },
    { id: 3, text: "Trying to sleep is the best way to stay awake. Give up the goal of sleeping. Your only goal right now is to rest your eyes. Sleep is a visitor; you can't force it to arrive, but you can leave the door open." },
    { id: 4, text: "It is okay to be awake. Millions of people are awake with you right now. You are not broken. You are just a human with an active mind. This moment will pass." },
    { id: 5, text: "In the grand scheme of your life, this one rough night is a tiny speck. It will not break you. It will not ruin your health. Let go of the pressure to be perfect at sleeping." },
    { id: 6, text: "Feel the weight of your body on the mattress. Gravity is holding you. You don't need to hold yourself up. Let the bed do the work. Release your jaw. Release your shoulders." },
    { id: 7, text: "Your brain is spinning because it thinks there is a problem to solve. There is no problem. This is just a false alarm. You are safe in bed. There is no tiger. You can stand down." },
    { id: 8, text: "Say to yourself: 'I am awake, and that is fine.' Fighting it creates tension. Accepting it creates space. Be a watcher of your wakefulness, not a judge." },
    { id: 9, text: "Imagine you are drifting on a boat in a calm lake. Thoughts are just clouds passing overhead. You don't need to chase them or push them away. Just let them float by." },
    { id: 10, text: "You are warm. You are safe. You have nowhere to be for hours. This is your time to just exist. Nothing is required of you right now." }
];

// ============================================
// DATA: MICRO ACTIONS
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
// DATA: RESCUE METHODS (10 Scientific)
// ============================================
const RESCUE_METHODS = [
    { title: "Cognitive Shuffling", text: "Visualize random objects that start with the same letter. <br><br>Example: Letter 'B'.<br><span class='text-highlight'>Ball... Bear... Boat... Bread...</span><br><br>When you run out, pick a new letter." },
    { title: "4-7-8 Breathing", text: "A natural tranquilizer for the nervous system.<br><br>1. Inhale through nose for <b>4s</b>.<br>2. Hold breath for <b>7s</b>.<br>3. Exhale forcefully through mouth for <b>8s</b>." },
    { title: "The 5-4-3-2-1 Grounding", text: "Identify specifically:<br><br>5 things you see.<br>4 things you can touch.<br>3 things you hear.<br>2 things you can smell.<br>1 thing you can taste." },
    { title: "Progressive Relaxation", text: "Squeeze your toes hard for 5 seconds. Then release completely.<br><br>Now move to your calves. Squeeze, release.<br><br>Slowly work your way up to your face." },
    { title: "Paradoxical Intention", text: "Stop trying to sleep. Instead, <span class='text-highlight'>try to stay awake.</span><br><br>Keep your eyes open in the dark. Tell yourself 'I will not sleep.'<br><br>This removes the performance anxiety of sleeping." },
    { title: "The Physiological Sigh", text: "Reset your CO2 levels instantly.<br><br>1. Double inhale through nose (one long, one short).<br>2. Very long exhale through mouth.<br><br>Repeat 3 times." },
    { title: "Cognitive Distraction", text: "Engage your logical brain to dampen the emotional brain.<br><br>Count backwards from <b>100</b> by <b>7s</b>.<br><span class='text-highlight'>100... 93... 86... 79...</span>" },
    { title: "The 'Grateful 3'", text: "Find three tiny, specific things from the last 24 hours designed just for you.<br><br>1. The warmth of coffee.<br>2. A text from a friend.<br>3. The cool pillow side." },
    { title: "Temperature Drop", text: "Your body needs to cool down to sleep.<br><br>Visualize your body sinking into a pool of cool, heavy mercury.<br><br>Feel the heat draining out of your hands and feet." },
    { title: "Mental Walk", text: "Retrace your steps from this morning in excruciating detail.<br><br>Woke up. Feet on floor. Cold tile. Walked to door. Turned handle...<br><br>Don't skip a single micro-movement." }
];

// ============================================
// AUDIO ENGINE (Brown Noise)
// ============================================
let audioCtx;
let noiseSource;
let noiseGain;
let isPlaying = false;

function toggleNoise() {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }

        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        noiseGain = audioCtx.createGain();
        noiseGain.gain.value = 0.4;

        noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 2);

        noiseSource.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseSource.start();
        isPlaying = true;
    } else {
        if (isPlaying) {
            noiseGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
            setTimeout(() => audioCtx.suspend(), 500);
            isPlaying = false;
        } else {
            audioCtx.resume();
            noiseGain.gain.setValueAtTime(0, audioCtx.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 1);
            isPlaying = true;
        }
    }
    updateNoiseIcon();
}

function updateNoiseIcon() {
    if (isPlaying) {
        elements.noiseBtn.textContent = '🔊';
        elements.noiseBtn.classList.add('active');
    } else {
        elements.noiseBtn.textContent = '🔇';
        elements.noiseBtn.classList.remove('active');
    }
}

// ============================================
// BOX BREATHING LOGIC
// ============================================
let breathingInterval;

function startBoxBreathing() {
    clearInterval(breathingInterval);
    let phase = 0; // 0=Top, 1=Right, 2=Bottom, 3=Left

    // Labels array matching phases
    const updateLabels = () => {
        const labels = [
            document.querySelector('.label-top'),
            document.querySelector('.label-right'),
            document.querySelector('.label-bottom'),
            document.querySelector('.label-left')
        ];

        labels.forEach((el, index) => {
            if (index === phase) {
                el.classList.add('active');
                vibrate(20);
            } else {
                el.classList.remove('active');
            }
        });
        phase = (phase + 1) % 4;
    };

    updateLabels();
    breathingInterval = setInterval(updateLabels, 4000);
}

function stopBoxBreathing() {
    clearInterval(breathingInterval);
}

// ============================================
// LOGIC HANDLERS
// ============================================
let currentRescueIndex = 0;

function showRescueMethod() {
    const method = RESCUE_METHODS[currentRescueIndex];
    elements.rescueId.textContent = currentRescueIndex + 1;
    elements.rescueTitle.textContent = method.title;
    elements.rescueContent.innerHTML = method.text;

    showScreen('rescue');
    currentRescueIndex = (currentRescueIndex + 1) % RESCUE_METHODS.length;
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        state.currentScreen = screenName;
    }
}

function getRandomScript() {
    if (state.usedScriptIds.length >= SCRIPTS.length) state.usedScriptIds = [];
    const availableScripts = SCRIPTS.filter(s => !state.usedScriptIds.includes(s.id));
    const script = availableScripts[Math.floor(Math.random() * availableScripts.length)];
    state.usedScriptIds.push(script.id);
    return script;
}

function getRandomAction() {
    return MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
}

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
    if (sessions.length > 30) sessions.shift();
    localStorage.setItem('sat_sessions', JSON.stringify(sessions));
}

function checkFreeLimit() {
    const today = new Date().toDateString();
    const lastUse = localStorage.getItem('sat_last_use_date');
    const usesToday = parseInt(localStorage.getItem('sat_uses_today') || '0');
    const isPremium = localStorage.getItem('sat_premium') === 'true';

    if (isPremium) return true;
    if (lastUse !== today) {
        localStorage.setItem('sat_last_use_date', today);
        localStorage.setItem('sat_uses_today', '1');
        return true;
    }
    if (usesToday < 1) { // 1 free session
        localStorage.setItem('sat_uses_today', String(usesToday + 1));
        return true;
    }
    return false;
}

function showPaywall() {
    elements.scriptText.innerHTML = `
        <span style="color: var(--text-secondary);">You've used your free session tonight.</span>
        <br><br>
        <span style="font-size: 0.9em;">Unlock unlimited nighttime support for just ₹99/month.</span>
        <br><br>
        <button onclick="unlockPremium()" style="
            background: var(--accent-warm); color: var(--bg-primary); border: none;
            padding: 12px 24px; border-radius: 20px; font-family: var(--font-ui); cursor: pointer;
        ">Unlock Now</button>
    `;
    showScreen('script');
    elements.btnDone.style.display = 'none';
}

function unlockPremium() {
    alert('Premium unlocked for testing session!');
    localStorage.setItem('sat_premium', 'true');
    location.reload();
}
window.unlockPremium = unlockPremium;

// ============================================
// UI HELPERS
// ============================================
function vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
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
            elements.btnDone.style.display = 'block';
            elements.btnDone.style.opacity = '0';
            setTimeout(() => elements.btnDone.style.opacity = '1', 100);
        }
    }
    elements.btnDone.style.display = 'none';
    type();
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
    // 1. Noise Toggle
    if (elements.noiseBtn) {
        elements.noiseBtn.addEventListener('click', () => {
            vibrate(20);
            toggleNoise();
        });
    }

    // 2. Main Logic
    elements.btnAnxious.addEventListener('click', () => {
        vibrate(50);
        state.sessionStart = new Date().toISOString();
        if (!checkFreeLimit()) { showPaywall(); return; }

        state.selectedScript = getRandomScript();
        typeWriter(state.selectedScript.text, elements.scriptText, 35);
        showScreen('script');
    });

    elements.btnDone.addEventListener('click', () => {
        vibrate(50);
        state.selectedAction = getRandomAction();
        elements.actionText.textContent = state.selectedAction;
        showScreen('action');
    });

    elements.btnTry.addEventListener('click', () => {
        vibrate(50);
        showScreen('log');
    });

    elements.btnSkip.addEventListener('click', () => {
        vibrate(50);
        state.selectedAction = null;
        showScreen('log');
    });

    elements.logButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            logSession(feeling);

            if (feeling === 'better') {
                showScreen('permission');
            } else {
                showScreen('breathe');
                startBoxBreathing();
            }
        });
    });

    // 3. Permission Flow
    elements.btnPermissionDone.addEventListener('click', () => {
        vibrate(50);
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });

    // 4. Breathing Flow
    elements.btnBreatheDone.addEventListener('click', () => {
        vibrate(50);
        stopBoxBreathing();
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });

    elements.btnBreatheFail.addEventListener('click', () => {
        vibrate(50);
        stopBoxBreathing();
        showRescueMethod(); // Go to Rescue Toolkit
    });

    // 5. Rescue Toolkit Flow
    elements.btnRescueNext.addEventListener('click', () => {
        vibrate(50);
        showRescueMethod();
    });

    elements.btnRescueDone.addEventListener('click', () => {
        vibrate(50);
        showScreen('end');
        setTimeout(() => showScreen('home'), 5000);
    });
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    registerServiceWorker();
});
