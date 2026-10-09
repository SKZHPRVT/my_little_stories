/* ============================================
   ОНБОРДИНГ — пошаговое создание персонажа
   ============================================ */

window.Onboarding = {
    currentStep: 0,
    bound: false,
    canvasTool: null,

    needs() {
        return !window.Avatar.isComplete() || !window.State.player.name;
    },

    start() {
        console.log('🚀 Onboarding.start()');
        this.currentStep = 0;
        window.Router.go('onboarding');
        this.render();
        if (!this.bound) {
            this.bound = true;
        }
    },

    // ===== Рендер =====
    render() {
        const body = document.querySelector('.onboarding-body');
        if (!body) {
            console.error('❌ Нет .onboarding-body');
            return;
        }

        if (this.currentStep === 0) {
            this.renderWelcome(body);
        } else if (this.currentStep >= 1 && this.currentStep <= window.AVATAR_ORDER.length) {
            this.renderPart(body, this.currentStep - 1);
        } else {
            this.renderName(body);
        }
    },

    // ===== Приветствие =====
    renderWelcome(body) {
        body.innerHTML = `
            <div class="onboarding-step active">
                <div class="onboarding-icon">🎨</div>
                <h1>Привет!</h1>
                <p class="onboarding-text">
                    Сейчас мы <b>создадим твоего героя</b>.<br>
                    Будем рисовать по частям:<br>
                    голову, лицо, туловище, руки и ноги.
                </p>
                <button class="btn-primary" id="onboarding-start">Давай начнём →</button>
            </div>
        `;

        // Привязываем клик
        const btn = document.getElementById('onboarding-start');
        if (btn) {
            btn.onclick = () => {
                console.log('👆 Клик по «Давай начнём»');
                window.Audio.click();
                this.currentStep = 1;
                this.render();
            };
        }
    },

    // ===== Шаг рисования части =====
    renderPart(body, partIndex) {
        const partId = window.AVATAR_ORDER[partIndex];
        const part = window.AVATAR_PARTS[partId];
        const total = window.AVATAR_ORDER.length;
        const current = partIndex + 1;

        console.log(`🎨 Рисуем часть ${current}/${total}:`, partId);

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

                <div class="tools-panel" id="onboarding-tools">
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

        // Даём браузеру отрисовать HTML, потом инициализируем canvas
        setTimeout(() => {
            this.initCanvasForPart(partId);
        }, 100);
    },

    // ===== Инициализация canvas для текущей части =====
    initCanvasForPart(partId) {
        const canvasEl = document.getElementById('part-canvas');
        if (!canvasEl) {
            console.error('❌ Нет #part-canvas');
            return;
        }

        // Инициализируем CanvasTool на конкретном элементе
        const ctx = canvasEl.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        // Создаём локальный объект рисования (не глобальный)
        this.canvasTool = {
            canvas: canvasEl,
            ctx: ctx,
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            color: '#1a1a1a',
            size: 8,
            tool: 'brush'
        };

        const tool = this.canvasTool;

        // Получаем координаты на canvas
        const getPos = (e) => {
            const rect = canvasEl.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (canvasEl.width / rect.width),
                y: (clientY - rect.top) * (canvasEl.height / rect.height)
            };
        };

        const start = (e) => {
            e.preventDefault();
            const p = getPos(e);
            tool.isDrawing = true;
            tool.lastX = p.x;
            tool.lastY = p.y;
        };

        const move = (e) => {
            if (!tool.isDrawing) return;
            e.preventDefault();
            const p = getPos(e);
            ctx.beginPath();
            ctx.moveTo(tool.lastX, tool.lastY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = tool.tool === 'eraser' ? '#ffffff' : tool.color;
            ctx.lineWidth = tool.tool === 'eraser' ? tool.size * 3 : tool.size;
            ctx.stroke();
            tool.lastX = p.x;
            tool.lastY = p.y;
        };

        const stop = (e) => {
            if (e) e.preventDefault();
            tool.isDrawing = false;
        };

        // Mouse
        canvasEl.addEventListener('mousedown', start);
        canvasEl.addEventListener('mousemove', move);
        canvasEl.addEventListener('mouseup', stop);
        canvasEl.addEventListener('mouseleave', stop);

        // Touch
        canvasEl.addEventListener('touchstart', start, { passive: false });
        canvasEl.addEventListener('touchmove', move, { passive: false });
        canvasEl.addEventListener('touchend', stop, { passive: false });

        // Slider толщины
        const slider = document.getElementById('part-brush-size');
        if (slider) {
            slider.oninput = (e) => tool.size = parseInt(e.target.value);
        }

        // Палитра цветов
        document.querySelectorAll('#onboarding-tools .color').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('#onboarding-tools .color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tool.color = btn.dataset.color;
                tool.tool = 'brush';
            };
        });
        // Активируем первый цвет
        document.querySelector('#onboarding-tools .color')?.classList.add('active');

        // Кнопки инструментов
        document.querySelectorAll('#onboarding-tools .tool').forEach(btn => {
            btn.onclick = () => {
                const t = btn.dataset.tool;
                if (t === 'clear') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
                    return;
                }
                document.querySelectorAll('#onboarding-tools .tool').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tool.tool = t;
            };
        });

        // Кнопка «Готово»
        const doneBtn = document.getElementById('onboarding-part-done');
        if (doneBtn) {
            doneBtn.onclick = () => {
                console.log('👆 Клик по «Готово» для части:', partId);
                this.finishPart(partId, canvasEl);
            };
        }

        console.log('✅ Canvas готов для:', partId);
    },

    // ===== Завершение части =====
    finishPart(partId, canvasEl) {
        // Проверяем — пустой ли холст
        const ctx = canvasEl.getContext('2d');
        const data = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        let hasContent = false;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            // Непрозрачный и не белый
            if (a > 20 && !(r > 240 && g > 240 && b > 240)) {
                hasContent = true;
                break;
            }
        }

        if (!hasContent) {
            window.Toast.error('Нарисуй хоть что-нибудь!');
            return;
        }

        const dataUrl = canvasEl.toDataURL('image/png');
        window.Avatar.savePart(partId, dataUrl);
        window.Audio.success();
        window.TG.haptic('light');
        window.Toast.success(`${window.AVATAR_PARTS[partId].title} сохранена!`);

        console.log('💾 Сохранено:', partId);
        this.currentStep++;
        this.render();
    },

    // ===== Финальный шаг: имя =====
    renderName(body) {
        console.log('📝 Финальный шаг: имя');

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
            }
            const nameInput = document.getElementById('onboarding-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.onkeydown = (e) => {
                    if (e.key === 'Enter') this.finish();
                };
            }
        }, 100);

        // Кнопка «Начать приключение»
        const finishBtn = document.getElementById('onboarding-finish');
        if (finishBtn) {
            finishBtn.onclick = () => this.finish();
        }
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
