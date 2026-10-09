/* ============================================
   TELEGRAM WEBAPP ОБЁРТКА
   ============================================ */

window.TG = {
    app: null,
    isActive: false,

    init() {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
            console.log('ℹ️ Не в Telegram');
            return;
        }

        this.app = tg;
        this.isActive = true;

        tg.ready();
        tg.expand();

        // Полноэкранный режим (если доступен)
        if (tg.requestFullscreen) {
            try { tg.requestFullscreen(); } catch (e) {}
        }

        // Отключаем вертикальные свайпы Telegram
        if (tg.disableVerticalSwipes) {
            try { tg.disableVerticalSwipes(); } catch (e) {}
        }

        document.body.classList.add('telegram-env');

        // Тема
        if (tg.themeParams) {
            const p = tg.themeParams;
            if (p.bg_color) document.documentElement.style.setProperty('--bg', p.bg_color);
            if (p.text_color) document.documentElement.style.setProperty('--text', p.text_color);
            if (p.hint_color) document.documentElement.style.setProperty('--hint', p.hint_color);
            if (p.button_color) document.documentElement.style.setProperty('--accent', p.button_color);
        }

        // BackButton
        tg.BackButton?.onClick(() => window.Router.back());

        // Отслеживаем изменение viewport (клавиатура и т.д.)
        tg.onEvent?.('viewportChanged', () => {
            console.log('📐 Viewport:', tg.viewportHeight);
        });

        console.log('✅ Telegram WebApp активен');
    },

    haptic(type = 'light') {
        if (!this.isActive) return;
        try { this.app.HapticFeedback?.impactOccurred(type); } catch (e) {}
    },

    notify(message) {
        if (!this.isActive) return;
        try { this.app.showAlert(message); } catch (e) {}
    }
};
