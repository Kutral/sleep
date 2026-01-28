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
// ============================================
// DATA: SCRIPTS
// ============================================
// (Moved to data.js)


// ============================================
// DATA: MICRO ACTIONS
// ============================================
// ============================================
// DATA: MICRO ACTIONS
// ============================================
// (Moved to data.js)


// ============================================
// DATA: RESCUE METHODS (10 Scientific)
// ============================================
// ============================================
// DATA: RESCUE METHODS (10 Scientific)
// ============================================
// (Moved to data.js)


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
// BOX BREATHING LOGIC (Modular)
// ============================================
function startBoxBreathing() {
    BoxBreathing.start();
}

function stopBoxBreathing() {
    BoxBreathing.stop();
}

// ============================================
// LOGIC HANDLERS
// ============================================
// Randomizer State
let usedRescueIndices = [];

function getRandomRescueIndex() {
    if (usedRescueIndices.length >= RESCUE_METHODS.length) {
        usedRescueIndices = [];
    }

    // Pick specific valid index
    let available = [];
    RESCUE_METHODS.forEach((_, index) => {
        if (!usedRescueIndices.includes(index)) available.push(index);
    });

    const randomIndex = available[Math.floor(Math.random() * available.length)];
    usedRescueIndices.push(randomIndex);
    return randomIndex;
}

let currentRescueIndex = 0; // Keeping for reference if needed, but driven by random now


function showRescueMethod() {
    // Stop any active visualizers first
    Breath478.stop();

    const method = RESCUE_METHODS[currentRescueIndex];
    elements.rescueTitle.textContent = method.title;
    elements.rescueContent.innerHTML = method.text;

    // Special Handling for Interactive Modules
    if (method.title === "4-7-8 Breathing") {
        document.getElementById('rescue-content').style.display = 'none'; // Hide text if visualizer is better? Or keep both?
        // Let's keep text for instruction, add button to "Start Guide"? 
        // For now, auto-start visualizer for seamlessness as requested ("interactive animations")
        Breath478.start();
    } else {
        document.getElementById('rescue-content').style.display = 'block';
    }

    showScreen('rescue');
    showScreen('rescue');
    // Prepare next random index for when "Try Something Else" is clicked next time
    // Actually, we should just generate it on demand when button clicked. 
    // Logic moved to start of function or call.
}

// Wrapper to handle random call
function triggerRescueMethod() {
    currentRescueIndex = getRandomRescueIndex();
    showRescueMethod();
}

function showScreen(screenName) {
    // Stop all techniques when leaving screens
    stopBoxBreathing();
    if (typeof Breath478 !== 'undefined') Breath478.stop();

    Object.values(screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        state.currentScreen = screenName;

        // Randomize End Message
        if (screenName === 'end' && typeof CLOSING_MESSAGES !== 'undefined') {
            const msg = CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)];
            const msgEl = document.querySelector('.end-message');
            if (msgEl) msgEl.innerHTML = msg;
        }
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
        triggerRescueMethod(); // Go to Randomized Rescue Toolkit
    });

    // 5. Rescue Toolkit Flow
    elements.btnRescueNext.addEventListener('click', () => {
        vibrate(50);
        triggerRescueMethod();
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
