/* ============================================
   ЭКРАН ПРОГРЕССА — метрики и ачивки
   ============================================ */

window.ProgressScreen = {
    open() {
        window.Router.go('progress');
        this.render();
    },

    render() {
        const body = document.getElementById('progress-body');
        if (!body) return;

        const player = window.State.player;
        const progress = window.State.progress || {};
        const stories = window.STORIES || {};

        // Считаем статистику
        let totalEndings = 0;
        let unlockedEndings = 0;
        Object.values(stories).forEach(s => {
            totalEndings += Object.keys(s.endings || {}).length;
            const p = progress[s.id] || {};
            unlockedEndings += (p.endingsUnlocked || []).length;
        });

        const gamesPlayed = Object.keys(player.games || {}).filter(k => player.games[k]?.played).length;
        const itemsCount = (player.inventory || []).length;
        const drawingsCount = Object.keys(player.portfolio || {}).length;

        body.innerHTML = `
            <div class="progress-section">
                <h3>📊 Статистика</h3>
                <div class="stat-row">
                    <span class="stat-label">Сказок пройдено</span>
                    <span class="stat-value">${unlockedEndings}/${totalEndings}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Мини-игр</span>
                    <span class="stat-value">${gamesPlayed}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Предметов</span>
                    <span class="stat-value">${itemsCount}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Рисунков</span>
                    <span class="stat-value">${drawingsCount}</span>
                </div>
            </div>
            
            <div class="progress-section">
                <h3>🏆 Достижения</h3>
                ${this.renderAchievements()}
            </div>
        `;
    },

    renderAchievements() {
        const player = window.State.player;
        const achievements = [
            { id: 'first_avatar', emoji: '🎨', name: 'Художник', desc: 'Нарисуй себя', check: () => !!player.avatar },
            { id: 'first_story', emoji: '📖', name: 'Сказочник', desc: 'Пройди первую сказку', check: () => Object.keys(window.State.progress).length > 0 },
            { id: 'first_game', emoji: '🎮', name: 'Игрок', desc: 'Пройди первую игру', check: () => Object.keys(player.games || {}).length > 0 },
            { id: 'collector', emoji: '🎒', name: 'Коллекционер', desc: 'Собери 5 предметов', check: () => (player.inventory || []).length >= 5 }
        ];

        const unlocked = achievements.filter(a => a.check());

        if (unlocked.length === 0) {
            return '<p style="font-size:13px;color:var(--hint);">Пока нет достижений</p>';
        }

        return unlocked.map(a => `
            <div class="stat-row">
                <span>${a.emoji} <b>${a.name}</b></span>
                <span style="font-size:12px;color:var(--hint);">${a.desc}</span>
            </div>
        `).join('');
    }
};
