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

        const found = Object.values(this.screens).filter(el => el).length;
        const missing = Object.entries(this.screens).filter(([_, el]) => !el).map(([k]) => k);
        console.log(`🚦 Роутер: ${found}/${Object.keys(this.screens).length}`);
        if (missing.length) console.warn('⚠️ Не найдены:', missing.join(', '));

        document.querySelectorAll('[data-back]').forEach(btn => {
            btn.addEventListener('click', () => this.back());
        });
    },

    go(name) {
        const screen = this.screens[name];
        if (!screen) return console.warn('⚠️ Экран не найден:', name);

        if (window.State.currentScreen === 'minigame' && name !== 'minigame') {
            window.MiniGame?.stop();
        }

        Object.values(this.screens).forEach(s => s && s.classList.remove('active'));
        screen.classList.add('active');
        window.State.currentScreen = name;
        window.scrollTo(0, 0);

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
