/* ============================================
   ИНВЕНТАРЬ ИГРОКА
   ============================================ */

window.Inventory = {
    open() {
        window.Router.go('inventory');
        this.render();
    },

    render() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        const items = window.State.player.inventory || [];

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="portfolio-empty" style="grid-column: 1/-1;">
                    <div class="icon">🎒</div>
                    <p>Инвентарь пуст</p>
                    <p style="font-size:13px;margin-top:8px;">Пройди сказку, чтобы получить предметы</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        items.forEach(itemId => {
            const item = window.ITEMS[itemId];
            if (!item) return;

            const el = document.createElement('div');
            el.className = 'inv-item';
            el.innerHTML = `
                <div class="inv-emoji">${item.emoji}</div>
                <div class="inv-name">${item.name}</div>
            `;
            grid.appendChild(el);
        });
    },

    add(itemId) {
        if (!window.State.player.inventory) window.State.player.inventory = [];
        if (!window.State.player.inventory.includes(itemId)) {
            window.State.player.inventory.push(itemId);
            window.Storage.save();
            const item = window.ITEMS[itemId];
            if (item) {
                window.Toast.reward(`${item.emoji} ${item.name}`);
            }
        }
    },

    has(itemId) {
        return (window.State.player.inventory || []).includes(itemId);
    }
};
