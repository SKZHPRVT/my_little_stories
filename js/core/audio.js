/* ============================================
   ЗВУКИ (простая обёртка через Web Audio API)
   ============================================ */

window.Audio = {
    ctx: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('⚠️ Web Audio не поддерживается');
        }
    },

    // Простой "бип" — можно заменить на реальные звуки
    beep(freq = 440, duration = 0.1, type = 'sine') {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    // Готовые эффекты
    click() { this.beep(600, 0.05, 'triangle'); },
    success() { this.beep(880, 0.15, 'sine'); setTimeout(() => this.beep(1100, 0.1), 100); },
    error() { this.beep(200, 0.2, 'sawtooth'); },
    magic() { this.beep(1200, 0.3, 'sine'); }
};
