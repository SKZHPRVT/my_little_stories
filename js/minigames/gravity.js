/* ============================================
   МИНИ-ИГРА: ГОНКА (Gravity Defied)
   Транспорт едет по холмам, собирает звёзды
   ============================================ */

window.GravityGame = {
    canvas: null,
    ctx: null,
    active: false,
    config: null,
    onWin: null,
    onLose: null,

    // Игровые объекты
    vehicle: null,
    terrain: [],
    stars: [],
    collectedStars: 0,
    totalStars: 5,

    // Управление
    pressing: false,
    // Физика
    gravity: 900,
    groundY: 0,

    // Спрайт (нарисованный игроком транспорт)
    vehicleSprite: null,

    init(canvas, config, onWin, onLose) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.onWin = onWin;
        this.onLose = onLose;
        this.active = true;

        // Загружаем спрайт, если есть
        const assetKey = config.assetKey || 'vehicle';
        const dataUrl = window.Storage.getDrawing(assetKey);
        if (dataUrl) {
            const img = new Image();
            img.onload = () => { this.vehicleSprite = img; };
            img.src = dataUrl;
        }

        // Настраиваем мир
        this.groundY = canvas.height * 0.75;
        this.collectedStars = 0;
        this.totalStars = config.goal?.count || 5;
        this.vehicle = {
            x: 100, y: this.groundY - 60,
            vx: 0, vy: 0,
            angle: 0,
            speed: 180,
            width: 100, height: 60
        };

        // Генерируем холмы
        this.generateTerrain();
        // Расставляем звёзды
        this.generateStars();

        // Управление
        this.bindControls();

        console.log('🏍 Гонка запущена');
    },

    generateTerrain() {
        this.terrain = [];
        const w = this.canvas.width;
        const segments = 20;
        const segW = w / segments;

        for (let i = 0; i <= segments; i++) {
            const x = i * segW;
            const y = this.groundY + Math.sin(i * 0.8) * 40 + Math.sin(i * 1.7) * 20;
            this.terrain.push({ x, y });
        }
    },

    generateStars() {
        this.stars = [];
        const w = this.canvas.width;
        for (let i = 0; i < this.totalStars; i++) {
            const t = (i + 1) / (this.totalStars + 1);
            const x = 200 + t * (w - 250);
            const y = this.groundY - 100 - Math.sin(i * 1.5) * 40;
            this.stars.push({ x, y, collected: false });
        }
    },

    bindControls() {
        const self = this;

        const onStart = (e) => { e.preventDefault(); self.pressing = true; };
        const onEnd = (e) => { e.preventDefault(); self.pressing = false; };

        // Touch
        this.canvas.addEventListener('touchstart', onStart, { passive: false });
        this.canvas.addEventListener('touchend', onEnd, { passive: false });

        // Mouse
        this.canvas.addEventListener('mousedown', onStart);
        this.canvas.addEventListener('mouseup', onEnd);
        this.canvas.addEventListener('mouseleave', onEnd);
    },

    update(dt) {
        if (!this.active) return;

        const v = this.vehicle;

        // Физика движения
        v.vx = v.speed;
        if (this.pressing) {
            v.vy -= 1200 * dt;  // подскок при нажатии
        }

        // Гравитация
        v.vy += this.gravity * dt;

        // Обновляем позицию
        v.x += v.vx * dt;
        v.y += v.vy * dt;

        // Находим высоту земли под колёсами
        const groundH = this.getGroundHeight(v.x);

        // Столкновение с землёй
        if (v.y + v.height / 2 > groundH) {
            v.y = groundH - v.height / 2;
            v.vy = 0;
            // Угол наклона по рельефу
            v.angle = this.getTerrainAngle(v.x);
        }

        // Проверка сбора звёзд
        this.stars.forEach(star => {
            if (star.collected) return;
            const dx = v.x - star.x;
            const dy = v.y - star.y;
            if (Math.sqrt(dx * dx + dy * dy) < 50) {
                star.collected = true;
                this.collectedStars++;
                window.Audio.beep(900, 0.1);
                window.TG.haptic('light');
            }
        });

        // Победа
        if (this.collectedStars >= this.totalStars) {
            this.active = false;
            this.onWin();
            return;
        }

        // Поражение (уехали за пределы канваса)
        if (v.x > this.canvas.width + 100) {
            this.active = false;
            this.onLose();
            return;
        }

        // Обновляем прогресс в UI
        const progressEl = document.getElementById('minigame-progress');
        if (progressEl) {
            progressEl.textContent = `⭐ ${this.collectedStars}/${this.totalStars}`;
        }
    },

    getGroundHeight(x) {
        for (let i = 0; i < this.terrain.length - 1; i++) {
            const p1 = this.terrain[i];
            const p2 = this.terrain[i + 1];
            if (x >= p1.x && x <= p2.x) {
                const t = (x - p1.x) / (p2.x - p1.x);
                return p1.y + (p2.y - p1.y) * t;
            }
        }
        return this.groundY;
    },

    getTerrainAngle(x) {
        const h1 = this.getGroundHeight(x - 20);
        const h2 = this.getGroundHeight(x + 20);
        return Math.atan2(h2 - h1, 40);
    },

    render(ctx) {
        if (!this.active) return;
        const c = ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Фон — небо
        const skyGrad = c.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#a8d8ff');
        skyGrad.addColorStop(1, '#f0e6d8');
        c.fillStyle = skyGrad;
        c.fillRect(0, 0, w, h);

        // Солнце
        c.fillStyle = '#ffd60a';
        c.beginPath();
        c.arc(w - 100, 80, 40, 0, Math.PI * 2);
        c.fill();

        // Земля (холмы)
        c.fillStyle = '#7a9e6c';
        c.beginPath();
        c.moveTo(0, this.terrain[0].y);
        this.terrain.forEach(p => c.lineTo(p.x, p.y));
        c.lineTo(w, h);
        c.lineTo(0, h);
        c.closePath();
        c.fill();

        // Тёмная линия земли
        c.strokeStyle = '#4d6b3d';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(this.terrain[0].x, this.terrain[0].y);
        this.terrain.forEach(p => c.lineTo(p.x, p.y));
        c.stroke();

        // Звёзды
        this.stars.forEach(star => {
            if (star.collected) return;
            this.drawStar(c, star.x, star.y, 20);
        });

        // Транспорт (спрайт или запасной)
        this.drawVehicle(c);

        // Прогресс в углу
        c.fillStyle = '#2b2b2b';
        c.font = 'bold 20px Georgia';
        c.fillText(`⭐ ${this.collectedStars}/${this.totalStars}`, 20, 40);
    },

    drawStar(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#ffd60a';
        ctx.strokeStyle = '#c96d3a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * size;
            const py = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    },

    drawVehicle(ctx) {
        const v = this.vehicle;
        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate(v.angle || 0);

        if (this.vehicleSprite) {
            // Рисунок игрока
            ctx.drawImage(
                this.vehicleSprite,
                -v.width / 2, -v.height / 2,
                v.width, v.height
            );
        } else {
            // Заглушка
            ctx.fillStyle = '#c96d3a';
            ctx.fillRect(-v.width / 2, -v.height / 2, v.width, v.height);
            ctx.fillStyle = '#2b2b2b';
            ctx.fillRect(-v.width / 2 + 10, -v.height / 2 - 10, v.width - 20, 15);
        }

        ctx.restore();
    }
};

console.log('🏍 gravity.js загружен');
