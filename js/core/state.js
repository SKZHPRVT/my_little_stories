/* ============================================
   ГЛОБАЛЬНОЕ СОСТОЯНИЕ
   ============================================ */

window.State = {
    currentScreen: 'menu',

    player: {
        name: null,
        avatar: {},              // { head, face, torso, armL, armR, legs }
        inventory: [],
        portfolio: {},
        games: {},
        achievements: [],
        cheats: false
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
