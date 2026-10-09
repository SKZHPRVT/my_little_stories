/* ============================================
   НИЖНЯЯ НАВИГАЦИЯ
   ============================================ */

window.BottomNav = {
    init() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            window.Buttons.onTap(btn, () => {
                const nav = btn.dataset.nav;
                window.Audio.click();
                window.TG.haptic('light');
                this.go(nav);
            });
        });
    },

    go(nav) {
        switch (nav) {
            case 'character':  window.Character.open(); break;
            case 'inventory':  window.Inventory.open(); break;
            case 'activities': window.Activities.open(); break;
            case 'progress':   window.ProgressScreen.open(); break;
            case 'settings':   window.Settings.open(); break;
        }
    }
};
