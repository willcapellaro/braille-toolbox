export class AudioFeedback {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        
        this.initAudioContext();
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not available:', error);
            this.enabled = false;
        }
    }

    createTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.enabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Error creating tone:', error);
        }
    }

    playStart() {
        // Ascending tone sequence for game start
        this.createTone(440, 0.2, 'sine', 0.15);
        setTimeout(() => this.createTone(554, 0.2, 'sine', 0.15), 100);
        setTimeout(() => this.createTone(659, 0.3, 'sine', 0.15), 200);
    }

    playGameOver() {
        // Descending tone sequence for game over
        this.createTone(659, 0.3, 'sine', 0.2);
        setTimeout(() => this.createTone(554, 0.3, 'sine', 0.2), 200);
        setTimeout(() => this.createTone(440, 0.5, 'sine', 0.2), 400);
    }

    playTurn() {
        // Quick beep for turning
        this.createTone(800, 0.1, 'square', 0.08);
    }

    playAccelerate() {
        // Rising pitch for acceleration
        if (!this.enabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
            oscillator.type = 'sawtooth';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
            console.warn('Error playing acceleration sound:', error);
        }
    }

    playBrake() {
        // Lower pitch for braking
        this.createTone(150, 0.2, 'sawtooth', 0.06);
    }

    playCollision() {
        // Harsh noise for collision
        if (!this.enabled || !this.audioContext) return;

        try {
            const bufferSize = this.audioContext.sampleRate * 0.3; // 0.3 seconds
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

            source.start(this.audioContext.currentTime);
        } catch (error) {
            console.warn('Error playing collision sound:', error);
        }
    }

    enable() {
        this.enabled = true;
        if (!this.audioContext) {
            this.initAudioContext();
        }
    }

    disable() {
        this.enabled = false;
    }

    toggle() {
        this.enabled = !this.enabled;
    }
}