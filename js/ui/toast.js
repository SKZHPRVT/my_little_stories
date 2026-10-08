/* ============================================
   TOAST — ВСПЛЫВАЮЩИЕ СООБЩЕНИЯ
   ============================================ */

window.Toast = {
    el: null,
    timer: null,

    init() {
        this.el = document.getElementById('toast');
    },

    show(message, duration = 2500) {
        if (!this.el) return;
        this.el.textContent = message;
        this.el.classList.add('active');

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.el.classList.remove('active');
        }, duration);
    },

    success(msg) { this.show('✅ ' + msg); },
    error(msg)   { this.show('❌ ' + msg); },
    info(msg)    { this.show('ℹ️ ' + msg); },
    reward(msg)  { this.show('🎁 ' + msg, 3500); }
};
