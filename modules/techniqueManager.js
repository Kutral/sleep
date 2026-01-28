/* ------------------------------------------------
   TECHNIQUE MANAGER
   Handles Interactive Modules (Breathing, Candle, etc.)
   ------------------------------------------------ */
const TechniqueManager = {
    startBoxBreathing() {
        if (window.BoxBreathing) BoxBreathing.start();
    },

    startRescue(method) {
        // Reset UI
        if (typeof UIManager === 'undefined') return;
        this.stopAll();

        UIManager.elements.rescueTitle.textContent = method.title;
        UIManager.elements.rescueContent.innerHTML = method.text;
        UIManager.elements.rescueContent.style.display = 'block';

        // Interactive Triggers
        if (method.title === "4-7-8 Breathing" && window.Breath478) {
            UIManager.elements.rescueContent.style.display = 'none';
            Breath478.start();
        } else if (method.title === "Worry Burner" && window.WorryBurner) {
            UIManager.showScreen('worry');
            // WorryBurner.start() is called by button in bindEvents
        } else if (method.title.includes("Candle") || method.text.includes("candle")) {
            if (window.CandleFlicker) {
                const candleContainer = document.getElementById('candle-container');
                if (candleContainer) candleContainer.style.display = 'flex';
                CandleFlicker.start();
            }
        }
    },

    stopAll() {
        if (window.BoxBreathing) BoxBreathing.stop();
        if (window.Breath478) Breath478.stop();
        if (window.CandleFlicker) {
            CandleFlicker.stop();
            const candleContainer = document.getElementById('candle-container');
            if (candleContainer) candleContainer.style.display = 'none';
        }
        if (window.WorryBurner) WorryBurner.stop();
    }
};
