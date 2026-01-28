/* ------------------------------------------------
   AUDIO MANAGER
   Handles Web Audio API.
   ------------------------------------------------ */
const AudioManager = {
    ctx: null,
    source: null,
    gain: null,
    isPlaying: false,

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    },

    toggleNoise() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        if (this.isPlaying) {
            this.fadeOut();
        } else {
            this.playBrownNoise();
        }
        return this.isPlaying;
    },

    playBrownNoise() {
        // Create Brown Noise Buffer
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }

        this.source = this.ctx.createBufferSource();
        this.source.buffer = buffer;
        this.source.loop = true;
        this.gain = this.ctx.createGain();
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.source.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.source.start();

        this.gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1);
        this.isPlaying = true;
    },

    fadeOut() {
        if (this.gain) {
            this.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
            setTimeout(() => {
                if (this.source) { this.source.stop(); this.source = null; }
                this.isPlaying = false;
            }, 500);
        } else {
            this.isPlaying = false;
        }
    },

    vibrate(ms) {
        if (navigator.vibrate) navigator.vibrate(ms);
    }
};
