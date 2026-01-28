/* ============================================
   TECHNIQUE: Candle Flicker
   ============================================ */

window.CandleFlicker = {
    start: function () {
        const container = document.getElementById('candle-container');
        if (container) {
            container.style.display = 'flex';
            // Animation is handled purely by CSS for performance
        }
    },

    stop: function () {
        const container = document.getElementById('candle-container');
        if (container) {
            container.style.display = 'none';
        }
    }
};
