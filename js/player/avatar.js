/* ============================================
   ПЕРСОНАЖ — сборка, отображение, анимация
   ============================================ */

window.Avatar = {
    // Получить все части (PNG)
    getParts() {
        return window.State.player.avatar || {};
    },

    // Сохранить одну часть
    savePart(partId, dataUrl) {
        if (!window.State.player.avatar) window.State.player.avatar = {};
        window.State.player.avatar[partId] = dataUrl;
        window.Storage.save();
    },

    // Готова ли часть
    hasPart(partId) {
        return !!window.State.player.avatar?.[partId];
    },

    // Готов ли весь персонаж
    isComplete() {
        return window.AVATAR_ORDER.every(id => this.hasPart(id));
    },

    // Собрать DOM-стопку частей персонажа
    renderStack(containerEl, options = {}) {
        if (!containerEl) return;
        const parts = this.getParts();
        const scale = options.scale || 1;
        const scaleCSS = scale !== 1 ? `transform: scale(${scale});` : '';

        containerEl.innerHTML = '';
        containerEl.style.position = 'relative';
        containerEl.style.width = '600px';
        containerEl.style.height = '600px';
        containerEl.style.cssText += scaleCSS;

        // Рендерим части в порядке z-index
        window.AVATAR_ORDER.forEach(partId => {
            const part = window.AVATAR_PARTS[partId];
            const dataUrl = parts[partId];
            if (!dataUrl) return;

            const img = document.createElement('img');
            img.src = dataUrl;
            img.className = `avatar-part part-${partId}`;
            img.style.position = 'absolute';
            img.style.left = '0';
            img.style.top = '0';
            img.style.width = '600px';
            img.style.height = '600px';
            img.style.zIndex = part.zIndex || 1;
            img.style.pointerEvents = 'none';
            img.style.objectFit = 'contain';
            containerEl.appendChild(img);
        });

        // Если ничего не загружено — показываем заглушку
        if (Object.keys(parts).length === 0) {
            containerEl.innerHTML = `
                <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:120px;opacity:0.3;">👤</div>
            `;
        }
    },

    // Показать одного персонажа (для превью в онбординге)
    renderFull(containerEl, scale = 1) {
        this.renderStack(containerEl, { scale });
    },

    // Анимация: кивок головы
    animateNod(containerEl) {
        const head = containerEl.querySelector('.part-head');
        const face = containerEl.querySelector('.part-face');
        [head, face].forEach(el => {
            if (!el) return;
            el.style.transformOrigin = '50% 25%';
            el.style.animation = 'nod 0.6s ease';
            setTimeout(() => el.style.animation = '', 600);
        });
    },

    // Анимация: прыжок
    animateJump(containerEl) {
        containerEl.style.animation = 'heroJump 0.6s ease';
        setTimeout(() => containerEl.style.animation = '', 600);
    },

    // Случайная анимация
    animateRandom(containerEl) {
        const anims = ['nod', 'jump'];
        const a = anims[Math.floor(Math.random() * anims.length)];
        this[`animate${a.charAt(0).toUpperCase() + a.slice(1)}`](containerEl);
    }
};

// CSS-анимации добавляем в head один раз
if (!document.getElementById('avatar-animations')) {
    const style = document.createElement('style');
    style.id = 'avatar-animations';
    style.textContent = `
        @keyframes nod {
            0%, 100% { transform: rotate(0deg); }
            50%      { transform: rotate(8deg); }
        }
        @keyframes heroJump {
            0%, 100% { transform: translateY(0); }
            40%      { transform: translateY(-20px); }
            70%      { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}

console.log('👤 avatar.js загружен');
