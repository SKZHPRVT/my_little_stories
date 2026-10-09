/* ============================================
   ОНБОРДИНГ — пошаговое создание персонажа
   ============================================ */

window.Onboarding = {
    currentStep: 0,
    bound: false,

    needs() {
        return !window.Avatar.isComplete() || !window.State.player.name;
    },

    start() {
        console.log('🚀 Onboarding.start()');
        this.currentStep = 0;
        window.Router.go('onboarding');
        this.render();
    },

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

    renderWelcome(body) {
        body.innerHTML = `
            <div class="onboarding-step active">
                <div class="onboarding-icon">🎨</div>
                <h1>Привет!</h1>
                <p class="onboarding-text">
                    Сейчас мы <b>создадим твоего героя</b>.<br>
                    Будем рисовать по частям.<br>
                    Серые зоны — это где рисовать.
                </p>
                <button class="btn-primary" id="onboarding-start">Давай начнём →</button>
            </div>
        `;
        document.getElementById('onboarding-start').onclick = () => {
            window.Audio.click();
            this.currentStep = 1;
            this.render();
        };
    },

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

                <div class="canvas-container">
                    <div class="canvas-layers">
                        <canvas id="part-canvas" width="600" height="600"></canvas>
                        <svg viewBox="0 0 600 600" class="canvas-guide" preserveAspectRatio="xMidYMid meet">
                            ${part.guide}
                        </svg>
                    </div>
                </div>

                <div class="tools-panel" id="onboarding-tools">
                    <div class="colors">
                        <button class="color" data-color="#1a1a1a" style="background:#1a1a1a"></button>
                        <button class="color" data-color="#e63946" style="background:#e63946"></button>
                        <button class="color" data-color="#f4a261" style="background:#f4a261"></button>
                        <button class="color" data-color="#2a9d8f" style="background:#2a9d8f"></button>
                        <button class="color" data-color="#457b9d" style="background:#457b9d"></button>
                        <button class="color" data-color="#9d4edd" style="background:#9d4edd"></button>
                        <button class="color" data-color="#ffd60a" style="background:#ffd60a"></button>
                        <button class="color" data-color="#f5c6a5" style="background:#f5c6a5"></button>
                    </div>
                    <div class="tool-buttons">
                        <button class="tool active" data-tool="brush">🖌️</button>
                        <button class="tool" data-tool="eraser">🧽</button>
                        <button class="tool" data-tool="fill">🪣 Залить</button>
                        <button class="tool" data-tool="clear">🗑️</button>
                    </div>
                    <div class="size-slider">
                        <label>Толщина: <input type="range" id="part-brush-size" min="2" max="60" value="12"></label>
                    </div>
                </div>

                <button class="btn-primary" id="onboarding-part-done">✓ Готово</button>
            </div>
        `;

        setTimeout(() => this.initCanvas(partId), 100);
    },

    initCanvas(partId) {
        window.CanvasTool.init('part-canvas', 'part-brush-size');
        window.CanvasTool.bindToolsPanel('#onboarding-tools');
        // Размер по умолчанию 12
        window.CanvasTool.currentSize = 12;

        // Кнопка "Готово"
        document.getElementById('onboarding-part-done').onclick = () => {
            this.finishPart(partId);
        };

        // Загружаем предыдущий рисунок если есть (для лица — показываем голову)
        // Опционально: можно показать предыдущую часть как фоновый слой
        const prevParts = window.State.player.avatar || {};
        
        // Для лица — показываем голову полупрозрачно
        if (partId === 'face' && prevParts.head) {
            const img = new Image();
            img.onload = () => {
                const ctx = window.CanvasTool.ctx;
                ctx.globalAlpha = 0.3;
                ctx.drawImage(img, 0, 0, 600, 600);
                ctx.globalAlpha = 1;
            };
            img.src = prevParts.head;
        }
    },

    finishPart(partId) {
        const canvas = document.getElementById('part-canvas');
        const ctx = canvas.getContext('2d');
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let hasContent = false;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i+3] > 20) {  // есть непрозрачные пиксели
                const r = data[i], g = data[i+1], b = data[i+2];
                // Не считаем белый
                if (!(r > 250 && g > 250 && b > 250)) {
                    hasContent = true;
                    break;
                }
            }
        }

        if (!hasContent) {
            window.Toast.error('Нарисуй хоть что-нибудь!');
            return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        window.Avatar.savePart(partId, dataUrl);
        window.Audio.success();
        window.TG.haptic('light');
        window.Toast.success(`${window.AVATAR_PARTS[partId].title} сохранена`);

        this.currentStep++;
        this.render();
    },

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
                    <input type="text" id="onboarding-name" class="name-input" 
                           placeholder="Введи имя..." maxlength="20" autocomplete="off">
                </div>

                <button class="btn-primary" id="onboarding-finish">Начать приключение 🚀</button>
            </div>
        `;

        setTimeout(() => {
            const preview = document.getElementById('final-preview');
            if (preview) window.Avatar.renderStack(preview);
            const input = document.getElementById('onboarding-name');
            if (input) {
                input.focus();
                input.onkeydown = (e) => { if (e.key === 'Enter') this.finish(); };
            }
        }, 100);

        document.getElementById('onboarding-finish').onclick = () => this.finish();
    },

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
