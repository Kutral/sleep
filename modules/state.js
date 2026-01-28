/* ------------------------------------------------
   STATE MANAGER
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
        return script || SCRIPTS[0];
    },

    getRandomRescueMethod() {
        if (typeof RESCUE_METHODS === 'undefined') return null;
        if (!this.data.usedRescueIndices) this.data.usedRescueIndices = []; // Ensure init

        if (this.data.usedRescueIndices.length >= RESCUE_METHODS.length) {
            this.data.usedRescueIndices = [];
        }

        // Filter valid indices
        const availableIndices = RESCUE_METHODS.map((_, i) => i)
            .filter(i => !this.data.usedRescueIndices.includes(i));

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.data.usedRescueIndices.push(randomIndex);

        return RESCUE_METHODS[randomIndex];
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
