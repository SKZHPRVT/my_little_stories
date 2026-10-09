/* ============================================
   ОНБОРДИНГ — первый запуск
   ============================================ */

window.Onboarding = {
    step: 1,
    canvasInited: false,

    // Проверка: нужен ли онбординг
    needs() {
        return !window.State.player.avatar || !window.State.player.name;
    },

    start() {
        this.step = 1;
        window.Router.go('onboarding');
        this.showStep(1);

        // Привязываем кнопки
        if (!this.bound) {
            this.bound = true;
            this.bindEvents();
        }
    },

    bindEvents() {
        // Шаг 1 → 2
        window.Buttons.onTap(document.getElementById('onboarding-next-1'), () => {
            window.Audio.click();
            this.showStep(2);
            this.initCanvas();
        });

        // Шаг 2 → 3
        window.Buttons.onTap(document.getElementById('onboarding-next-2'), () => {
            window.Audio.click();
            this.showStep(3);
            // Фокус на поле имени
            setTimeout(() => document.getElementById('onboarding-name')?.focus(), 300);
        });

        // Финал
        window.Buttons.onTap(document.getElementById('onboarding-finish'), () => {
            this.finish();
        });

        // Enter в поле имени
        document.getElementById('onboarding-name')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.finish();
        });
    },

    showStep(n) {
        this.step = n;
        document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.onboarding-step[data-step="${n}"]`)?.classList.add('active');
    },

    initCanvas() {
        if (this.canvasInited) return;
        window.CanvasTool.init('onboarding-canvas', 'onboarding-brush-size');
        window.CanvasTool.bindToolsPanel('#screen-onboarding .tools-panel');
        this.canvasInited = true;
    },

    finish() {
        const name = document.getElementById('onboarding-name')?.value?.trim();
        if (!name) {
            window.Toast.error('Введи имя');
            return;
        }
        if (name.length < 2) {
            window.Toast.error('Имя слишком короткое');
            return;
        }

        const avatar = window.CanvasTool.export();

        window.State.player.avatar = avatar;
        window.State.player.name = name;
        window.Storage.save();

        window.Audio.success();
        window.TG.haptic('medium');

        window.Toast.success(`Привет, ${name}!`);

        // Обновляем главный экран и идём в меню
        setTimeout(() => {
            window.Menu.refresh();
            window.Router.reset();
            window.Router.go('menu');
        }, 800);
    }
};
