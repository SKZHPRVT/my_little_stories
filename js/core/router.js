/* ============================================
   РОУТЕР ЭКРАНОВ
   ============================================ */

window.Router = {
    screens: {},
    history: [],

    init() {
        this.screens = {
            menu: document.getElementById('screen-menu'),
            avatar: document.getElementById('screen-avatar'),
            stories: document.getElementById('screen-stories'),
            story: document.getElementById('screen-story'),
            draw: document.getElementById('screen-draw'),
            inventory: document.getElementById('screen-inventory'),
            portfolio: document.getElementById('screen-portfolio'),
            minigame: document.getElementById('screen-minigame')
        };

        // Кнопки «назад»
        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.back());
        });

        console.log('🚦 Роутер готов. Экранов:', Object.keys(this.screens).length);
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

        // История для «назад»
        if (this.history[this.history.length - 1] !== name) {
            this.history.push(name);
        }

        console.log('📍 Экран:', name);
    },

    back() {
        this.history.pop(); // текущий
        const prev = this.history.pop() || 'menu';
        this.go(prev);
    },

    reset() {
        this.history = ['menu'];
    }
};
