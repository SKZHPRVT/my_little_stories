/* ============================================
   РЕДАКТОР ПЕРСОНАЖА — перерисовать части
   ============================================ */

window.Character = {
    bound: false,

    open() {
        window.Router.go('character');
        this.render();
        if (!this.bound) {
            this.bound = true;
            this.bindEvents();
        }
    },

    bindEvents() {
        // Сохранение имени
        window.Buttons.onTap(document.getElementById('character-save-name'), () => {
            const name = document.getElementById('character-name')?.value?.trim();
            if (name && name.length >= 2) {
                window.State.player.name = name;
                window.Storage.save();
                window.Toast.success('Имя сохранено');
                window.Menu.refresh();
            }
        });
    },

    render() {
        const body = document.querySelector('.character-body');
        if (!body) return;

        const parts = window.Avatar.getParts();
        const partList = window.AVATAR_ORDER.map(id => {
            const part = window.AVATAR_PARTS[id];
            const has = !!parts[id];
            return { id, part, has };
        });

        body.innerHTML = `
            <div class="character-name-row">
                <label>Имя:</label>
                <input type="text" id="character-name" class="name-input-small" maxlength="20" value="${window.State.player.name || ''}">
                <button class="mini-btn" id="character-save-name">💾</button>
            </div>

            <div class="character-preview">
                <div id="character-preview-stack" class="preview-stack"></div>
            </div>

            <p class="character-hint">Тапни на часть, чтобы перерисовать</p>

            <div class="parts-grid">
                ${partList.map(p => `
                    <button class="part-card ${p.has ? 'has' : ''}" data-part="${p.id}">
                        <span class="part-card-title">${p.part.title}</span>
                        ${p.has ? '✅' : '⭕'}
                    </button>
                `).join('')}
            </div>
        `;

        // Превью
        setTimeout(() => {
            const preview = document.getElementById('character-preview-stack');
            if (preview) {
                window.Avatar.renderStack(preview, { scale: 0.5 });
                preview.style.width = '300px';
                preview.style.height = '300px';
                preview.style.margin = '0 auto';
                preview.style.position = 'relative';
                preview.querySelectorAll('.avatar-part').forEach(img => {
                    img.style.transform = 'scale(0.5)';
                    img.style.transformOrigin = 'top left';
                });
            }

            // Клики по частям
            document.querySelectorAll('.part-card').forEach(card => {
                window.Buttons.onTap(card, () => {
                    const partId = card.dataset.part;
                    window.PartEditor.open(partId);
                });
            });
        }, 50);
    }
};

/* ============================================
   РЕДАКТОР ОДНОЙ ЧАСТИ
   ============================================ */

window.PartEditor = {
    currentPartId: null,
    bound: false,
    canvasInited: false,

    open(partId) {
        this.currentPartId = partId;
        window.Router.go('draw');

        const part = window.AVATAR_PARTS[partId];
        const canvasInitedThis = this.canvasInited;

        document.getElementById('draw-title').textContent = part.title;
        document.getElementById('draw-hint').textContent = part.hint;

        // Заменяем холст — оборачиваем в контейнер с SVG
        const container = document.querySelector('#screen-draw .canvas-container');
        container.innerHTML = `
            <div class="canvas-layers">
                <svg viewBox="0 0 600 600" class="canvas-guide" preserveAspectRatio="xMidYMid meet">
                    ${part.guide}
                </svg>
                <canvas id="draw-canvas" width="600" height="600"></canvas>
            </div>
        `;

        setTimeout(() => {
            window.CanvasTool.init('draw-canvas', 'draw-brush-size');
            window.CanvasTool.bindToolsPanel('#screen-draw .tools-panel');

            // Загружаем текущую часть если есть
            const existing = window.Avatar.getParts()[partId];
            if (existing) {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.getElementById('draw-canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = existing;
            }

            // Кнопка сохранения
            const saveBtn = document.getElementById('save-drawing');
            if (saveBtn && !saveBtn.dataset.bound) {
                saveBtn.dataset.bound = 'true';
                window.Buttons.onTap(saveBtn, () => this.save());
            }
        }, 50);
    },

    save() {
        const partId = this.currentPartId;
        if (!partId) return;

        const dataUrl = window.CanvasTool.export();
        window.Avatar.savePart(partId, dataUrl);

        window.Audio.success();
        window.TG.haptic('light');
        window.Toast.success('Сохранено!');

        setTimeout(() => {
            window.Router.back();
            // Перерисовываем экран персонажа
            if (window.State.currentScreen === 'character') {
                window.Character.render();
            }
        }, 600);
    }
};

console.log('✏️ character.js загружен');
