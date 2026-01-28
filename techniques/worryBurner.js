/* ------------------------------------------------
   WORRY BURNER
   Interactive journaling with burning animation
   ------------------------------------------------ */
window.WorryBurner = {
    active: false,
    particles: [],
    animationFrame: null,

    start() {
        this.active = true;
        const input = document.getElementById('worry-input');
        const canvas = document.getElementById('burn-canvas');

        if (!input || !canvas) return;

        // Get the worry text
        const worryText = input.value.trim();
        if (!worryText) return;

        // Setup canvas
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Hide input, show canvas
        input.style.opacity = '0';
        canvas.style.display = 'block';

        // Create particles from text
        this.createTextParticles(ctx, worryText, canvas.width, canvas.height);

        // Start burning animation
        this.animate(ctx, canvas);

        // Clear input after 3 seconds
        setTimeout(() => {
            input.value = '';
            input.style.opacity = '1';
            canvas.style.display = 'none';
        }, 3000);
    },

    createTextParticles(ctx, text, width, height) {
        // Draw text on canvas to create particles
        ctx.font = 'bold 32px serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = text.split('\n');
        const startY = height / 2 - (lines.length * 40) / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, startY + i * 40);
        });

        // Get image data to create particles
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Sample pixels for particles
        for (let y = 0; y < height; y += 4) {
            for (let x = 0; x < width; x += 4) {
                const i = (y * width + x) * 4;
                if (data[i + 3] > 128) { // If pixel is opaque enough
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 3 - 1,
                        life: 1.0,
                        color: `rgba(255, ${100 + Math.random() * 100}, 0, ${Math.random()})`
                    });
                }
            }
        }

        ctx.clearRect(0, 0, width, height);
    },

    animate(ctx, canvas) {
        if (!this.active) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.015;

            if (p.life > 0) {
                ctx.fillStyle = p.color.replace(/[\d.]+\)$/g, p.life + ')');
                ctx.fillRect(p.x, p.y, 3, 3);
                return true;
            }
            return false;
        });

        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(() => this.animate(ctx, canvas));
        } else {
            this.stop();
        }
    },

    stop() {
        this.active = false;
        this.particles = [];
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
};
