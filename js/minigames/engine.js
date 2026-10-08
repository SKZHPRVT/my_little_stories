/* ============================================
   ДВИЖОК МИНИ-ИГР
   Управляет запуском, паузой, завершением игр
   ============================================ */

window.MiniGame = {
    current: null,
    canvas: null,
    ctx: null,
    running: false,
    rafId: null,
    lastTime: 0,

    // ===== Запуск мини-игры =====
    start(config) {
        console.log('🎮 Запуск мини-игры:', config.type);

        // Проверяем, есть ли уже холст, если нет — создаём
        let canvas = document.getElementById('minigame-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'minigame-canvas';
            canvas.width = 800;
            canvas.height = 500;
            canvas.style.cssText = 'width:100%;max-width:800px;display:block;margin:0 auto;background:#f0ebe3;border-radius:12px;';
            document.getElementById('minigame-container')?.appendChild(canvas);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = true;
        this.lastTime = performance.now();

        // Показываем контейнер мини-игры
        window.Router.go('minigame');

        // Выбираем нужную игру
        switch (config.type) {
            case 'gravity':
                window.GravityGame.init(this.canvas, config, () => this.win(config), () => this.lose(config));
                break;
            case 'angry_birds':
                window.AngryBirdsGame?.init(this.canvas, config, () => this.win(config), () => this.lose(config));
                break;
            case 'fighting':
                window.FightingGame?.init(this.canvas, config, () => this.win(config), () => this.lose(config));
                break;
            default:
                console.warn('⚠️ Неизвестный тип игры:', config.type);
        }

        // Запускаем игровой цикл
        this.loop();
    },

    // ===== Игровой цикл =====
    loop() {
        if (!this.running) return;

        const now = performance.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.05); // макс 50мс
        this.lastTime = now;

        // Обновляем текущую игру
        if (window.GravityGame?.active) window.GravityGame.update(dt);
        if (window.GravityGame?.active) window.GravityGame.render(this.ctx);

        this.rafId = requestAnimationFrame(() => this.loop());
    },

    // ===== Победа =====
    win(config) {
        console.log('🏆 Победа!');
        this.stop();
        window.Audio.success();
        window.Toast.success('Победа!');

        setTimeout(() => {
            if (config.reward) {
                window.Inventory.add(config.reward);
            }
            window.Router.go('story');
            if (config.onWin) {
                window.StoryEngine.showChapter(config.onWin);
            }
        }, 1500);
    },

    // ===== Поражение =====
    lose(config) {
        console.log('💀 Поражение');
        this.stop();
        window.Audio.error();

        // Показываем модалку
        window.Modal.open(
            '💀 Попробуй снова!',
            'Не расстраивайся — художники тоже иногда ошибаются.',
            'Ещё раз'
        );
        document.getElementById('modal-close').onclick = () => {
            window.Modal.close();
            this.start(config);
        };
    },

    // ===== Остановка =====
    stop() {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
    }
};

console.log('🎮 engine.js загружен');
