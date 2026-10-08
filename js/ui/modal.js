/* ============================================
   МОДАЛЬНЫЕ ОКНА
   ============================================ */

window.Modal = {
    el: null,
    titleEl: null,
    textEl: null,
    closeBtn: null,

    init() {
        this.el = document.getElementById('modal');
        this.titleEl = document.getElementById('modal-title');
        this.textEl = document.getElementById('modal-text');
        this.closeBtn = document.getElementById('modal-close');

        this.closeBtn.addEventListener('click', () => this.close());
        this.el.addEventListener('click', (e) => {
            if (e.target === this.el) this.close();
        });
    },

    open(title, text, buttonText = 'Понятно') {
        this.titleEl.textContent = title;
        this.textEl.textContent = text;
        this.closeBtn.textContent = buttonText;
        this.el.classList.add('active');
    },

    close() {
        this.el.classList.remove('active');
    }
};
