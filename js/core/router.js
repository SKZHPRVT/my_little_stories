/* ============================================
   РОУТЕР ЭКРАНОВ
   ============================================ */

window.Router = {
    screens: {},
    history: [],

    init() {
        this.screens = {
            onboarding:  document.getElementById('screen-onboarding'),
            menu:        document.getElementById('screen-menu'),
            character:   document.getElementById('screen-character'),
            stories:     document.getElementById('screen-stories'),
            story:       document.getElementById('screen-story'),
            draw:        document.getElementById('screen-draw'),
            inventory:   document.getElementById('screen-inventory'),
            activities:  document.getElementById('screen-activities'),
            progress:    document.getElementById('screen-progress'),
            settings:    document.getElementById('screen-settings'),
            minigame:    document.getElementById('screen-minigame')
        };

        // Считаем, сколько экранов нашли
        const found = Object.entries(this.screens).filter(([_, el]) => el).length;
        const missing = Object.entries(this.screens).filter(([_, el]) => !el).map(([k]) => k);

        console.log(`🚦 Роутер: ${found}/${Object.keys(this.screens).length} экранов найдено`);
        if (missing.length > 0) {
            console.warn('⚠️ Не найдены:', missing.join(', '));
        }

        // Кнопки «назад»
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.back());
        });
    },

    go(name, data = {}) {
        const screen = this.screens[name];
        if (!screen) {
            console.warn('⚠️ Экран не найден:', name);
            return;
        }

        // Останавливаем мини-игру, если уходим с неё
        if (window.State.currentScreen === 'minigame' && name !== 'minigame') {
            window.MiniGame?.stop();
        }

        // Скрываем все
        Object.values(this.screens).forEach(s => s && s.classList.remove('active'));

        // Показываем нужный
        screen.classList.add('active');
        window.State.currentScreen = name;
        window.scrollTo(0, 0);

        // История
        if (this.history[this.history.length - 1] !== name) {
            this.history.push(name);
        }

        console.log('📍 Экран:', name);
    },

    back() {
        this.history.pop();
        const prev = this.history.pop() || 'menu';
        this.go(prev);
    },

    reset() {
        this.history = ['menu'];
    }
};
