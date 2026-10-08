/* ============================================
   TELEGRAM WEBAPP ОБЁРТКА
   ============================================ */

window.TG = {
    app: null,
    isActive: false,

    init() {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
            console.log('ℹ️ Не в Telegram — работаем как обычно');
            return;
        }

        this.app = tg;
        this.isActive = true;

        tg.ready();
        tg.expand();

        // Помечаем body
        document.body.classList.add('telegram-env');

        // Применяем тему
        if (tg.themeParams) {
            const p = tg.themeParams;
            if (p.bg_color) document.documentElement.style.setProperty('--bg', p.bg_color);
            if (p.text_color) document.documentElement.style.setProperty('--text', p.text_color);
            if (p.hint_color) document.documentElement.style.setProperty('--hint', p.hint_color);
            if (p.button_color) document.documentElement.style.setProperty('--accent', p.button_color);
        }

        // Свайп-жест для «назад»
        tg.BackButton?.onClick(() => {
            window.Router.back();
        });

        // Показываем кнопку «назад» когда не на меню
        this.updateBackButton();

        console.log('✅ Telegram WebApp активен');
    },

    updateBackButton() {
        if (!this.isActive) return;
        if (window.State.currentScreen === 'menu') {
            this.app.BackButton?.hide();
        } else {
            this.app.BackButton?.show();
        }
    },

    // Вибрация (тактильный отклик)
    haptic(type = 'light') {
        if (!this.isActive) return;
        this.app.HapticFeedback?.impactOccurred(type);
    },

    // Уведомление
    notify(message) {
        if (!this.isActive) return;
        this.app.showAlert(message);
    }
};
