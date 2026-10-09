/* ============================================
   ГЛАВНАЯ ТОЧКА ВХОДА
   ============================================ */

window.Menu = {
    refresh() {
        const name = window.State.player.name;

        // Имя
        const heroName = document.getElementById('hero-name');
        if (heroName) heroName.textContent = name || 'Герой';

        // Стопка персонажа
        const stack = document.getElementById('hero-avatar-stack');
        if (stack) {
            window.Avatar.renderStack(stack, { scale: 0.333 });
            // Применяем масштаб через CSS класс
            stack.querySelectorAll('.avatar-part').forEach(img => {
                img.style.width = '600px';
                img.style.height = '600px';
                img.style.transform = 'scale(0.333)';
                img.style.transformOrigin = 'top left';
            });
        }

        // Анимация при тапе
        const heroDisplay = document.getElementById('hero-display');
        if (heroDisplay && !heroDisplay.dataset.bound) {
            heroDisplay.dataset.bound = 'true';
            window.Buttons.onTap(heroDisplay, () => {
                window.Avatar.animateRandom(heroDisplay);
                window.Audio.beep(800, 0.1);
                window.TG.haptic('light');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Запуск Мои маленькие истории');

    const init = (name, fn) => {
        try { fn(); console.log(`✅ ${name}`); }
        catch (e) { console.error(`❌ ${name}:`, e); }
    };

    init('TG', () => window.TG.init());
    init('Storage', () => window.Storage.load());
    init('Router', () => window.Router.init());
    init('Audio', () => window.Audio.init());
    init('Modal', () => window.Modal.init());
    init('Toast', () => window.Toast.init());
    init('Buttons', () => window.Buttons.init());
    init('BottomNav', () => window.BottomNav.init());

    if (!window.State.settings) {
        window.State.settings = { sound: true, vibration: true };
    }

    // Кнопка Истории
    const storiesBtn = document.getElementById('btn-stories');
    if (storiesBtn) {
        window.Buttons.onTap(storiesBtn, () => {
            window.Audio.click();
            window.StoryEngine.openList();
        });
    }

    // Логика запуска
    init('Запуск', () => {
        if (window.Onboarding.needs()) {
            window.Onboarding.start();
        } else {
            window.Menu.refresh();
            window.Router.go('menu');
        }
    });

    console.log('🏁 Готово');
});
