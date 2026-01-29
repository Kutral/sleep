/* ============================================
   TECHNIQUE: Box Breathing (4-4-4-4)
   ============================================ */

const BoxBreathing = {
    interval: null,

    start: function () {
        this.stop(); // Clear any existing
        let phase = 0; // 0=Top, 1=Right, 2=Bottom, 3=Left

        const labels = [
            document.querySelector('.label-top'),
            document.querySelector('.label-right'),
            document.querySelector('.label-bottom'),
            document.querySelector('.label-left')
        ];

        // Initial state
        const box = document.querySelector('.box-breathing');
        if (box) {
            box.classList.remove('is-animating');
            // Use timeout to ensure reflow/restart works reliably
            setTimeout(() => {
                box.classList.add('is-animating');
            }, 50);
        }

        if (labels[0]) labels[0].classList.add('active');

        const update = () => {
            labels.forEach((el, index) => {
                if (index === phase) {
                    el.classList.add('active');
                    if (navigator.vibrate) navigator.vibrate(20);
                } else {
                    el.classList.remove('active');
                }
            });
            phase = (phase + 1) % 4;
        };

        update(); // Run immediately
        this.interval = setInterval(update, 4000);
    },

    stop: function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        const box = document.querySelector('.box-breathing');
        if (box) box.classList.remove('is-animating');

        // Cleanup active classes
        const labels = document.querySelectorAll('.breathe-label');
        labels.forEach(el => el.classList.remove('active'));
    }
};

window.BoxBreathing = BoxBreathing;
