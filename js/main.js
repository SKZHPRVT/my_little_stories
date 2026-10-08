/* ============================================
   ТОЧКА ВХОДА
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Запускаем Мои маленькие истории...');

    // 1. Инициализируем Telegram
    window.TG.init();

    // 2. Загружаем сохранённое состояние
    window.Storage.load();

    // 3. Инициализируем роутер
    window.Router.init();

    // 4. Инициализируем звук
    window.Audio.init();

    // 5. Инициализируем UI (модалки, тосты, кнопки)
    window.Modal.init();
    window.Toast.init();
    window.Buttons.init();

    // 6. Привязываем кнопки главного меню
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            window.Audio.click();
            window.TG.haptic('light');

            switch (action) {
                case 'avatar':
                    window.Avatar.open();
                    break;
                case 'stories':
                    window.StoryEngine.openList();
                    break;
                case 'inventory':
                    window.Inventory.open();
                    break;
                case 'portfolio':
                    window.Portfolio.open();
                    break;
            }
        });
    });

    console.log('✅ Приложение готово!');
});
