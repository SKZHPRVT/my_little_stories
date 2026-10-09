/* ============================================
   НАСТРОЙКИ
   ============================================ */

window.Settings = {
    open() {
        window.Router.go('settings');

        // Применяем сохранённые настройки
        document.getElementById('setting-sound').checked = window.State.settings?.sound !== false;
        document.getElementById('setting-vibration').checked = window.State.settings?.vibration !== false;

        // Привязываем события
        if (!this.bound) {
            this.bound = true;
            this.bindEvents();
        }
    },

    bindEvents() {
        // Звук
        document.getElementById('setting-sound')?.addEventListener('change', (e) => {
            if (!window.State.settings) window.State.settings = {};
            window.State.settings.sound = e.target.checked;
            window.Storage.save();
            window.Toast.info(e.target.checked ? '🔊 Звук включён' : '🔇 Звук выключен');
        });

        // Вибрация
        document.getElementById('setting-vibration')?.addEventListener('change', (e) => {
            if (!window.State.settings) window.State.settings = {};
            window.State.settings.vibration = e.target.checked;
            window.Storage.save();
            window.TG.haptic('light');
            window.Toast.info(e.target.checked ? '📳 Вибрация включена' : '🔕 Вибрация выключена');
        });

        // Сброс прогресса
        window.Buttons.onTap(document.getElementById('setting-reset'), () => {
            window.Modal.open(
                '⚠️ Сброс прогресса',
                'Ты уверен? Все рисунки и достижения удалятся. Это необратимо.',
                'Да, сбросить'
            );
            document.getElementById('modal-close').onclick = () => {
                window.Storage.reset();
            };
        });

        // Чит-код
        const cheatInput = document.getElementById('setting-cheat');
        cheatInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.checkCheat(e.target.value.trim());
                e.target.value = '';
            }
        });
    },

    checkCheat(code) {
        if (code === 'sv_cheats 1') {
            window.State.player.cheats = true;
            window.Storage.save();
            window.Audio.magic();
            window.TG.haptic('heavy');
            window.Toast.success('🎁 Всё разблокировано!');
        } else if (code === 'sv_cheats 0') {
            window.State.player.cheats = false;
            window.Storage.save();
            window.Toast.info('Читы выключены');
        } else {
            window.Toast.error('Неизвестный код');
        }
    }
};
