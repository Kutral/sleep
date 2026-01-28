/* ============================================
   TECHNIQUE: 4-7-8 Breathing
   Standard: Inhale 4s, Hold 7s, Exhale 8s
   ============================================ */

const Breath478 = {
    interval: null,
    timer: null,

    start: function () {
        this.stop();

        const container = document.getElementById('breath-478-container');
        const textLabel = document.getElementById('breath-478-label');
        const circle = document.getElementById('breath-478-circle');

        if (!container || !textLabel || !circle) return;

        // Reset
        container.style.display = 'flex';

        const cycle = () => {
            // Inhale (4s)
            textLabel.textContent = "Inhale (4s)";
            circle.style.transition = "transform 4s ease-in-out, opacity 4s";
            circle.style.transform = "scale(1.5)";
            circle.style.opacity = "1";
            if (navigator.vibrate) navigator.vibrate(50);

            this.timer = setTimeout(() => {
                // Hold (7s)
                textLabel.textContent = "Hold (7s)";
                circle.style.transition = "none"; // Hold size
                if (navigator.vibrate) navigator.vibrate([20, 50, 20]);

                this.timer = setTimeout(() => {
                    // Exhale (8s)
                    textLabel.textContent = "Exhale (8s)";
                    circle.style.transition = "transform 8s ease-in-out, opacity 8s";
                    circle.style.transform = "scale(1)";
                    circle.style.opacity = "0.7";
                    if (navigator.vibrate) navigator.vibrate(100);

                    this.timer = setTimeout(cycle, 8000); // Loop
                }, 7000);
            }, 4000);
        };

        cycle();
    },

    stop: function () {
        if (this.timer) clearTimeout(this.timer);
        const container = document.getElementById('breath-478-container');
        if (container) container.style.display = 'none';
    }
};
