/* ============================================
   ГЛОБАЛЬНОЕ СОСТОЯНИЕ
   ============================================ */

window.State = {
    currentScreen: 'menu',

    player: {
        name: null,              // Имя героя
        avatar: null,            // base64 PNG
        inventory: [],           // id предметов
        portfolio: {},           // { key: base64 }
        games: {},               // { gameId: { played, bestScore } }
        achievements: [],
        cheats: false,
        level: 1,
        xp: 0
    },

    story: {
        id: null,
        currentChapter: null,
        path: []
    },

    progress: {},

    settings: {
        sound: true,
        vibration: true
    }
};
