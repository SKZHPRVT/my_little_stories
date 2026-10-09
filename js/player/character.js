/* ============================================
   ЭКРАН ПЕРСОНАЖА — перерисовка + имя
   ============================================ */

window.Character = {
    canvasInited: false,

    open() {
        window.Router.go('character');

        // Имя
        document.getElementById('character-name').value = window.State.player.name || '';

        // Холст
        if (!this.canvasInited) {
            window.CanvasTool.init('character-canvas', 'character-brush-size');
            window.CanvasTool.bindToolsPanel('#screen-character .tools-panel');
            this.canvasInited = true;
        }

        // Загружаем текущий аватар
        const saved = window.State.player.avatar;
        if (saved) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('character-canvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = saved;
        } else {
            window.CanvasTool.clear();
        }

        // Сохранение
        const saveBtn = document.getElementById('character-save');
        if (saveBtn && !saveBtn.dataset.bound) {
            saveBtn.dataset.bound = true;
            window.Buttons.onTap(saveBtn, () => this.save());
        }
    },

    save() {
        const name = document.getElementById('character-name')?.value?.trim();
        if (!name || name.length < 2) {
            window.Toast.error('Имя слишком короткое');
            return;
        }

        const avatar = window.CanvasTool.export();

        window.State.player.avatar = avatar;
        window.State.player.name = name;
        window.Storage.save();

        window.Audio.success();
        window.TG.haptic('medium');
        window.Toast.success('Сохранено!');

        // Обновляем главный экран
        window.Menu.refresh();

        setTimeout(() => {
            window.Router.back();
        }, 600);
    }
};
