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
