/* ============================================
   ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
   ============================================ */

window.State = {
    // Текущий экран
    currentScreen: 'menu',

    // Игрок
    player: {
        avatar: null,       // base64 PNG аватара
        inventory: [],      // массив id предметов
        achievements: [],
        level: 1,
        xp: 0
    },

    // Текущая сказка
    story: {
        id: null,
        currentChapter: null,
        path: [],           // история выборов
        pendingDrawing: null // что сейчас рисуем
    },

    // Прогресс по сказкам
    progress: {
        // { storyId: { endingsUnlocked: [], currentChapter: 'ch1' } }
    },

    // Хелперы
    set(key, value) {
        this[key] = value;
        if (window.Storage) window.Storage.save();
    },

    get(key) {
        return this[key];
    }
};
