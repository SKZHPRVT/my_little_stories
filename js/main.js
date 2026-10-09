/* ============================================
   ГЛАВНАЯ ТОЧКА ВХОДА
   ============================================ */

window.Menu = {
    // Обновить главный экран
    refresh() {
        const avatar = window.State.player.avatar;
        const name = window.State.player.name;

        const heroImg = document.getElementById('hero-avatar');
        const heroName = document.getElementById('hero-name');

        if (heroImg && avatar) heroImg.src = avatar;
        if (heroName) heroName.textContent = name || 'Герой';

        // Анимация при тапе
        const heroDisplay = document.getElementById('hero-display');
        if (heroDisplay && !heroDisplay.dataset.bound) {
            heroDisplay.dataset.bound = 'true';
            window.Buttons.onTap(heroDisplay, () => {
                const animations = ['bounce', 'spin', 'jump'];
                const anim = animations[Math.floor(Math.random() * animations.length)];
                heroDisplay.classList.add(anim);
                window.Audio.beep(800, 0.1);
                window.TG.haptic('light');
                setTimeout(() => heroDisplay.classList.remove(anim), 800);
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Запускаем Мои маленькие истории...');

    // Инициализация
    window.TG.init();
    window.Storage.load();
    window.Router.init();
    window.Audio.init();
    window.Modal.init();
    window.Toast.init();
    window.Buttons.init();
    window.BottomNav.init();

    // Загружаем настройки в State
    if (!window.State.settings) {
        window.State.settings = { sound: true, vibration: true };
    }

    // Кнопка «Истории»
    window.Buttons.onTap(document.getElementById('btn-stories'), () => {
        window.Audio.click();
        window.StoryEngine.openList();
    });

    // Логика запуска
    if (window.Onboarding.needs()) {
        // Первый запуск — онбординг
        window.Onboarding.start();
    } else {
        // Уже есть персонаж — в меню
        window.Menu.refresh();
        window.Router.go('menu');
    }

    console.log('✅ Готово!');
});
