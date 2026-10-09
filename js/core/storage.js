/* ============================================
   СОХРАНЕНИЕ В LOCALSTORAGE
   ============================================ */

window.Storage = {
    KEY: 'my_little_stories_v3',

    save() {
        try {
            const data = {
                player: window.State.player,
                story: window.State.story,
                progress: window.State.progress,
                settings: window.State.settings
            };
            localStorage.setItem(this.KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('⚠️ Не сохранить:', e);
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.player) window.State.player = { ...window.State.player, ...data.player };
            if (data.story) window.State.story = { ...window.State.story, ...data.story };
            if (data.progress) window.State.progress = data.progress;
            if (data.settings) window.State.settings = data.settings;
            console.log('💾 Состояние загружено');
        } catch (e) {
            console.warn('⚠️ Не загрузить:', e);
        }
    },

    reset() {
        localStorage.removeItem(this.KEY);
        location.reload();
    },

    saveAvatar(base64) {
        window.State.player.avatar = base64;
        this.save();
    },

    saveDrawing(key, base64) {
        if (!window.State.player.portfolio) window.State.player.portfolio = {};
        window.State.player.portfolio[key] = base64;
        this.save();
    },

    getDrawing(key) {
        return window.State.player.portfolio?.[key] || null;
    }
};
