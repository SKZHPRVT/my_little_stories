/* ============================================
   АКТИВНОСТИ — пройденные мини-игры
   ============================================ */

window.Activities = {
    open() {
        window.Router.go('activities');
        this.render();
    },

    render() {
        const grid = document.getElementById('activities-grid');
        if (!grid) return;

        const games = window.State.player.games || {};
        const gameList = [
            { id: 'gravity', emoji: '🏍', name: 'Гонка' },
            { id: 'angry_birds', emoji: '🐦', name: 'Angry Birds' },
            { id: 'fighting', emoji: '⚔️', name: 'Файтинг' },
            { id: 'puzzle', emoji: '🧩', name: 'Пазл' },
            { id: 'platformer', emoji: '🦘', name: 'Платформер' },
            { id: 'racing', emoji: '🏁', name: 'Гонка сверху' }
        ];

        const unlocked = gameList.filter(g => games[g.id]?.played || window.State.player.cheats);

        if (unlocked.length === 0) {
            grid.innerHTML = `
                <div class="portfolio-empty" style="grid-column:1/-1;">
                    <div class="icon">🎮</div>
                    <p>Пока нет игр</p>
                    <p style="font-size:13px;margin-top:8px;">Пройди сказку — откроются мини-игры</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        unlocked.forEach(g => {
            const score = games[g.id]?.bestScore || 0;
            const card = document.createElement('div');
            card.className = 'activity-card';
            card.innerHTML = `
                <span class="act-emoji">${g.emoji}</span>
                <div class="act-name">${g.name}</div>
                <div class="act-score">${score > 0 ? `Лучший: ${score}` : 'Не играли'}</div>
            `;
            window.Buttons.onTap(card, () => {
                window.Toast.info('Скоро!');
            });
            grid.appendChild(card);
        });
    }
};
