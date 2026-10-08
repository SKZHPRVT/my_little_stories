/* ============================================
   УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ТАПОВ
   Работает и на мобильных, и в Telegram
   ============================================ */

window.Buttons = {
    init() {
        console.log('👆 Кнопочные обработчики готовы');
    },

    // Универсальный onTap
    onTap(el, handler) {
        if (!el) return;
        let touched = false;

        el.addEventListener('touchstart', (e) => {
            touched = true;
            e.preventDefault();
            handler(e);
        }, { passive: false });

        el.addEventListener('click', (e) => {
            if (touched) {
                touched = false;
                return;
            }
            handler(e);
        });
    }
};
