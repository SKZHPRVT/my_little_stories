/* ============================================
   СОЗДАНИЕ И РЕДАКТИРОВАНИЕ АВАТАРА
   ============================================ */

window.Avatar = {
    canvasTool: null,

    open() {
        window.Router.go('avatar');

        // Инициализируем холст, если ещё не инициализирован
        if (!this.canvasTool) {
            window.CanvasTool.init('avatar-canvas', 'brush-size');
            window.CanvasTool.bindToolsPanel('#screen-avatar .tools-panel');
            this.canvasTool = true;
        }

        // Если уже есть сохранённый аватар — показываем
        const saved = window.State.player.avatar;
        if (saved) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('avatar-canvas');
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = saved;
        }

        // Обработчик сохранения
        const saveBtn = document.getElementById('save-avatar');
        if (saveBtn && !saveBtn.dataset.bound) {
            saveBtn.dataset.bound = 'true';
            window.Buttons.onTap(saveBtn, () => {
                const dataUrl = window.CanvasTool.export();
                window.Storage.saveAvatar(dataUrl);
                window.Toast.success('Персонаж сохранён!');
                window.Audio.success();
                setTimeout(() => window.Router.go('menu'), 800);
            });
        }
    },

    // Получить аватар как img-элемент для сцены
    getAsImg(size = 100) {
        if (!window.State.player.avatar) return null;
        const img = new Image();
        img.src = window.State.player.avatar;
        img.className = 'actor';
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        return img;
    }
};
