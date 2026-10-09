/* ============================================
   ОНБОРДИНГ — пошаговое создание персонажа
   ============================================ */

window.Onboarding = {
    currentStep: 0,          // 0 = приветствие, 1..6 = части, 7 = имя
    bound: false,
    canvasInited: false,

    needs() {
        return !window.Avatar.isComplete() || !window.State.player.name;
    },

    start() {
        this.currentStep = 0;
        if (!window.Router.screens.onboarding) {
            console.warn('⚠️ Экран onboarding не найден');
            return;
        }
        window.Router.go('onboarding');
        this.render();
        if (!this.bound) {
            this.bound = true;
            this.bindEvents();
        }
    },

    bindEvents() {
        const $ = id => document.getElementById(id);

        // Шаг 0: приветствие → шаг 1
        window.Buttons.onTap($('onboarding-start'), () => {
            window.Audio.click();
            this.currentStep = 1;
            this.render();
        });

        // Кнопка «Готово» на шаге рисования
        window.Buttons.onTap($('onboarding-part-done'), () => {
            this.finishPart();
        });

        // Пропустить (для опциональных частей, если будут)
        window.Buttons.onTap($('onboarding-skip'), () => {
            this.currentStep++;
            this.render();
        });

        // Финал: имя
        window.Buttons.onTap($('onboarding-finish'), () => {
            this.finish();
        });

        $('onboarding-name')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.finish();
        });
    },

    // ===== Рендер текущего шага =====
    render() {
        const body = document.querySelector('.onboarding-body');
        if (!body) return;

        if (this.currentStep === 0) {
            this.renderWelcome(body);
        } else if (this.currentStep >= 1 && this.currentStep <= window.AVATAR_ORDER.length) {
            this.renderPart(body, this.currentStep - 1);
        } else {
            this.renderName(body);
        }
    },

    // ===== Шаг 0: приветствие =====
    renderWelcome(body) {
        body.innerHTML = `
            <div class="onboarding-step active">
                <div class="onboarding-icon">🎨</div>
                <h1>Привет!</h1>
                <p class="onboarding-text">
                    Рад тебя видеть!<br><br>
                    Сейчас мы <b>создадим твоего героя</b>.<br>
                    Будем рисовать по частям: голову, лицо,<br>
                    туловище, руки и ноги.<br><br>
                    Всё, что ты нарисуешь — <b>оживёт</b> ✨
                </p>
                <button class="btn-primary" id="onboarding-start">Давай начнём →</button>
            </div>
        `;
    },

    // ===== Шаги 1-6: рисование частей =====
    renderPart(body, partIndex) {
        const partId = window.AVATAR_ORDER[partIndex];
        const part = window.AVATAR_PARTS[partId];
        const total = window.AVATAR_ORDER.length;
        const current = partIndex + 1;

        body.innerHTML = `
            <div class="onboarding-step active onboarding-part-step">
                <div class="onboarding-part-header">
                    <div class="onboarding-part-progress">${current} / ${total}</div>
                    <h2 class="onboarding-part-title">${part.title}</h2>
                    <p class="onboarding-part-hint">${part.hint}</p>
                </div>

                <div class="canvas-container onboarding-canvas-wrap">
                    <div class="canvas-layers">
                        <svg viewBox="0 0 600 600" class="canvas-guide" preserveAspectRatio="xMidYMid meet">
                            ${part.guide}
                        </svg>
                        <canvas id="part-canvas" width="600" height="600"></canvas>
                    </div>
                </div>

                <div class="tools-panel">
                    <div class="colors">
                        <button class="color" data-color="#1a1a1a" style="background:#1a1a1a"></button>
                        <button class="color" data-color="#e63946" style="background:#e63946"></button>
                        <button class="color" data-color="#f4a261" style="background:#f4a261"></button>
                        <button class="color" data-color="#2a9d8f" style="background:#2a9d8f"></button>
                        <button class="color" data-color="#457b9d" style="background:#457b9d"></button>
                        <button class="color" data-color="#9d4edd" style="background:#9d4edd"></button>
                        <button class="color" data-color="#ffd60a" style="background:#ffd60a"></button>
                        <button class="color" data-color="#ffffff" style="background:#ffffff;border:1px solid #ccc"></button>
                    </div>
                    <div class="tool-buttons">
                        <button class="tool active" data-tool="brush">🖌️ Кисть</button>
                        <button class="tool" data-tool="eraser">🧽 Ластик</button>
                        <button class="tool" data-tool="clear">🗑️ Очистить</button>
                    </div>
                    <div class="size-slider">
                        <label>Толщина: <input type="range" id="part-brush-size" min="2" max="40" value="8"></label>
                    </div>
                </div>

                <button class="btn-primary" id="onboarding-part-done">✓ Готово</button>
            </div>
        `;

        // Инициализируем холст
        setTimeout(() => {
            window.CanvasTool.init('part-canvas', 'part-brush-size');
            window.CanvasTool.bindToolsPanel('.onboarding-part-step .tools-panel');
            // Сброс флага чтобы инициализировать заново для каждой части
            this.canvasInited = false;
        }, 50);
    },

    // ===== Шаг 7: имя =====
    renderName(body) {
        body.innerHTML = `
            <div class="onboarding-step active">
                <div class="onboarding-part-header">
                    <h2 class="onboarding-part-title">Как тебя зовут?</h2>
                    <p class="onboarding-part-hint">Твоё имя будет в сказках</p>
                </div>

                <div class="onboarding-preview">
                    <div id="final-preview" class="final-preview"></div>
                </div>

                <div class="name-input-wrap">
                    <input 
                        type="text" 
                        id="onboarding-name" 
                        class="name-input" 
                        placeholder="Введи имя..." 
                        maxlength="20"
                        autocomplete="off"
                    >
                </div>

                <button class="btn-primary" id="onboarding-finish">Начать приключение 🚀</button>
            </div>
        `;

        // Показываем превью персонажа
        setTimeout(() => {
            const preview = document.getElementById('final-preview');
            if (preview) {
                window.Avatar.renderStack(preview, { scale: 0.4 });
                preview.style.width = '240px';
                preview.style.height = '240px';
                preview.style.margin = '0 auto';
                preview.style.position = 'relative';
                // Масштабируем вложенные части
                preview.querySelectorAll('.avatar-part').forEach(img => {
                    img.style.transform = 'scale(0.4)';
                    img.style.transformOrigin = 'top left';
                });
            }
            document.getElementById('onboarding-name')?.focus();
        }, 50);
    },

    // ===== Завершение части =====
    finishPart() {
        const partId = window.AVATAR_ORDER[this.currentStep - 1];
        const dataUrl = window.CanvasTool.export();

        // Проверяем — а не пустой ли холст?
        const canvas = document.getElementById('part-canvas');
        if (this.isCanvasEmpty(canvas)) {
            window.Toast.error('Нарисуй хоть что-нибудь!');
            return;
        }

        window.Avatar.savePart(partId, dataUrl);
        window.Audio.success();
        window.TG.haptic('light');

        this.currentStep++;
        this.render();
    },

    // Проверка на пустоту
    isCanvasEmpty(canvas) {
        if (!canvas) return true;
        const ctx = canvas.getContext('2d');
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        // Ищем хотя бы один непрозрачный пиксель НЕ белого цвета
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            if (a > 10 && !(r > 240 && g > 240 && b > 240)) {
                return false;
            }
        }
        return true;
    },

    // ===== Финал =====
    finish() {
        const name = document.getElementById('onboarding-name')?.value?.trim();
        if (!name || name.length < 2) {
            window.Toast.error('Введи имя (мин. 2 буквы)');
            return;
        }

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

console.log('🎨 onboarding.js загружен');
