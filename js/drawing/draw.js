/* ============================================
   ЭКРАН РИСОВАНИЯ (для сказки)
   ============================================ */

window.Draw = {
    canvasTool: null,
    onSaveNext: null,
    currentKey: null,

    open(taskType, key, nextChapter) {
        this.currentKey = key;
        this.onSaveNext = nextChapter;

        // Заголовок и подсказка
        const hints = {
            avatar: 'Нарисуй персонажа. Начни с большого круга — это голова.',
            object: 'Нарисуй предмет. Не бойся, если получится не идеально!'
        };
        document.getElementById('draw-title').textContent = 'Рисуем: ' + key;
        document.getElementById('draw-hint').textContent = hints[taskType] || 'Нарисуй что-нибудь!';

        window.Router.go('draw');

        // Инициализация холста
        if (!this.canvasTool) {
            window.CanvasTool.clear();
            window.CanvasTool.init('draw-canvas', 'draw-brush-size');
            window.CanvasTool.bindToolsPanel('#screen-draw .tools-panel');
            this.canvasTool = true;
        } else {
            window.CanvasTool.clear();
        }

        // Обработчик сохранения
        const saveBtn = document.getElementById('save-drawing');
        if (saveBtn && !saveBtn.dataset.bound) {
            saveBtn.dataset.bound = 'true';
            window.Buttons.onTap(saveBtn, () => this.save());
        }
    },

    save() {
        const dataUrl = window.CanvasTool.export();

        // Сохраняем в портфолио
        window.Storage.saveDrawing(this.currentKey, dataUrl);

        window.Toast.success('Рисунок сохранён!');
        window.Audio.success();

        // Возвращаемся в сказку и идём дальше
        setTimeout(() => {
            const next = this.onSaveNext;
            window.Router.go('story');
            if (next) {
                window.StoryEngine.showChapter(next);
            } else {
                window.StoryEngine.showChapter(window.State.story.currentChapter);
            }
        }, 800);
    }
};
