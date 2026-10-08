/* ============================================
   ПОРТФОЛИО И ПРОГРЕСС
   ============================================ */

window.Portfolio = {
    open() {
        window.Router.go('portfolio');
        this.render();
    },

    render() {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        const portfolio = window.State.player.portfolio || {};
        const keys = Object.keys(portfolio);

        if (keys.length === 0) {
            grid.innerHTML = `
                <div class="portfolio-empty">
                    <div class="icon">🎨</div>
                    <p>Пока пусто</p>
                    <p style="font-size:13px;margin-top:8px;">Твои рисунки появятся здесь</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        keys.forEach(key => {
            const el = document.createElement('div');
            el.className = 'portfolio-item';
            el.innerHTML = `<img src="${portfolio[key]}" alt="${key}">`;
            grid.appendChild(el);
        });
    }
};
