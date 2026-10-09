/* ============================================
   ОНБОРДИНГ — первый запуск
   ============================================ */

window.Onboarding = {
    step: 1,
    canvasInited: false,
    bound: false,

    needs() {
        return !window.State.player.avatar || !window.State.player.name;
    },

    start() {
        this.step = 1;

        // Проверяем, что роутер готов
        if (!window.Router.screens.onboarding) {
            console.warn('⚠️ Экран onboarding не найден в роутере');
            return;
        }

        window.Router.go('onboarding');
        this.showStep(1);

        if (!this.bound) {
            this.bound = true;
            this.bindEvents();
        }
    },

    bindEvents() {
        const $ = (id) => document.getElementById(id);

        const next1 = $('onboarding-next-1');
        if (next1) {
            window.Buttons.onTap(next1, () => {
                window.Audio.click();
                this.showStep(2);
                this.initCanvas();
            });
        }

        const next2 = $('onboarding-next-2');
        if (next2) {
            window.Buttons.onTap(next2, () => {
                window.Audio.click();
                this.showStep(3);
                setTimeout(() => $('onboarding-name')?.focus(), 300);
            });
        }

        const finish = $('onboarding-finish');
        if (finish) {
            window.Buttons.onTap(finish, () => this.finish());
        }

        $('onboarding-name')?.addEventListener('keydown', (e) => {
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

        setTimeout(() => {
            window.Menu.refresh();
            window.Router.reset();
            window.Router.go('menu');
        }, 800);
    }
};
