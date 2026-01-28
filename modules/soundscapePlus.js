/* ------------------------------------------------
   SOUNDSCAPE PLUS
   Extended audio library with nature sounds
   ------------------------------------------------ */
window.SoundscapePlus = {
    ctx: null,
    currentSource: null,
    currentGain: null,
    currentType: null,

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    },

    play(type) {
        if (this.currentType === type) {
            this.stop();
            return false;
        }

        this.stop();

        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        switch (type) {
            case 'rain':
                this.playRain();
                break;
            case 'fire':
                this.playFire();
                break;
            case 'thunder':
                this.playThunder();
                break;
            default:
                return false;
        }

        this.currentType = type;
        return true;
    },

    playRain() {
        // Generate pink noise (rain-like)
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
        }

        this.playBuffer(buffer, 0.3);
    },

    playFire() {
        // Generate crackly brown noise
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 2.5;

            // Add occasional crackles
            if (Math.random() > 0.998) {
                data[i] += (Math.random() - 0.5) * 3;
            }
        }

        this.playBuffer(buffer, 0.25);
    },

    playThunder() {
        // Low rumble with occasional booms
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.01 * white)) / 1.01;
            lastOut = data[i];
            data[i] *= 1.8;
        }

        this.playBuffer(buffer, 0.2);
    },

    playBuffer(buffer, volume) {
        this.currentSource = this.ctx.createBufferSource();
        this.currentSource.buffer = buffer;
        this.currentSource.loop = true;

        this.currentGain = this.ctx.createGain();
        this.currentGain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.currentSource.connect(this.currentGain);
        this.currentGain.connect(this.ctx.destination);
        this.currentSource.start();

        this.currentGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 1);
    },

    stop() {
        if (this.currentGain) {
            this.currentGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
            setTimeout(() => {
                if (this.currentSource) {
                    this.currentSource.stop();
                    this.currentSource = null;
                }
                this.currentGain = null;
                this.currentType = null;
            }, 500);
        }
    }
};
