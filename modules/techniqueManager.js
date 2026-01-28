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
        // Depends on UIManager to be available globally
        if (typeof UIManager === 'undefined') return;

        UIManager.elements.rescueTitle.textContent = method.title;
        UIManager.elements.rescueContent.innerHTML = method.text;
        UIManager.elements.rescueContent.style.display = 'block';

        // Interactive Triggers
        if (method.title === "4-7-8 Breathing" && window.Breath478) {
            UIManager.elements.rescueContent.style.display = 'none';
            Breath478.start();
        } else if (method.text && method.text.includes("candle") && window.CandleFlicker) {
            // Trigger candle if text mentions it or title matches
        }

        // Manual override for Candle
        if (method.title.includes("Candle") || method.text.includes("candle")) {
            if (window.CandleFlicker) {
                UIManager.elements.rescueContent.style.display = 'none';
                CandleFlicker.start();
            }
        }
    },

    stopAll() {
        if (window.BoxBreathing) BoxBreathing.stop();
        if (window.Breath478) Breath478.stop();
        if (window.CandleFlicker) CandleFlicker.stop();
    }
};
