/* ============================================
   ХОЛСТ ДЛЯ РИСОВАНИЯ + ЗАЛИВКА
   ============================================ */

window.CanvasTool = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    currentColor: '#1a1a1a',
    currentSize: 8,
    currentTool: 'brush',

    init(canvasId, sizeSliderId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Прозрачный фон (SVG-guide видно сверху)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bindEvents(sizeSliderId);
        console.log('🎨 Холст готов:', canvasId);
    },

    bindEvents(sizeSliderId) {
        const canvas = this.canvas;
        const self = this;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        };

        const start = (e) => {
            e.preventDefault();
            const p = getPos(e);
            
            if (self.currentTool === 'fill') {
                self.floodFill(Math.floor(p.x), Math.floor(p.y), self.currentColor);
                return;
            }
            
            self.isDrawing = true;
            self.lastX = p.x;
            self.lastY = p.y;
        };

        const move = (e) => {
            if (!self.isDrawing) return;
            e.preventDefault();
            const p = getPos(e);
            self.ctx.beginPath();
            self.ctx.moveTo(self.lastX, self.lastY);
            self.ctx.lineTo(p.x, p.y);
            self.ctx.strokeStyle = self.currentTool === 'eraser' ? '#ffffff' : self.currentColor;
            self.ctx.lineWidth = self.currentTool === 'eraser' ? self.currentSize * 3 : self.currentSize;
            self.ctx.stroke();
            self.lastX = p.x;
            self.lastY = p.y;
        };

        const stop = (e) => {
            if (e) e.preventDefault();
            self.isDrawing = false;
        };

        // Mouse
        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        canvas.addEventListener('mouseup', stop);
        canvas.addEventListener('mouseleave', stop);

        // Touch
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', stop, { passive: false });

        // Slider
        const slider = document.getElementById(sizeSliderId);
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.currentSize = parseInt(e.target.value);
            });
        }
    },

    // Заливка (flood fill)
    floodFill(x, y, fillColorHex) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const W = canvas.width;
        const H = canvas.height;

        if (x < 0 || x >= W || y < 0 || y >= H) return;

        const imageData = ctx.getImageData(0, 0, W, H);
        const data = imageData.data;

        const idx = (y * W + x) * 4;
        const targetR = data[idx], targetG = data[idx+1], targetB = data[idx+2], targetA = data[idx+3];

        // Цвет заливки
        const fill = this.hexToRgb(fillColorHex);

        // Если пиксель уже такого цвета — выходим
        if (Math.abs(targetR - fill.r) < 10 && Math.abs(targetG - fill.g) < 10 &&
            Math.abs(targetB - fill.b) < 10 && targetA > 200) {
            return;
        }

        // Ограничение — не заливаем дальше "жёстких" границ (чёрных линий)
        const tolerance = 80;

        const matches = (i) => {
            const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
            return Math.abs(r - targetR) <= tolerance &&
                   Math.abs(g - targetG) <= tolerance &&
                   Math.abs(b - targetB) <= tolerance &&
                   Math.abs(a - targetA) <= tolerance;
        };

        const stack = [[x, y]];
        const visited = new Uint8Array(W * H);

        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            if (cx < 0 || cx >= W || cy < 0 || cy >= H) continue;

            const pos = cy * W + cx;
            if (visited[pos]) continue;
            visited[pos] = 1;

            const i = pos * 4;
            if (!matches(i)) continue;

            // Красим
            data[i] = fill.r;
            data[i+1] = fill.g;
            data[i+2] = fill.b;
            data[i+3] = 255;

            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }

        ctx.putImageData(imageData, 0, 0);
        window.Audio.beep(500, 0.08);
    },

    hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    },

    setColor(color) {
        this.currentColor = color;
        if (this.currentTool === 'eraser') this.currentTool = 'brush';
    },

    setTool(tool) {
        if (tool === 'clear') {
            this.clear();
            return;
        }
        this.currentTool = tool;
    },

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    export() {
        return this.canvas.toDataURL('image/png');
    },

    bindToolsPanel(panelSelector) {
        const panel = document.querySelector(panelSelector);
        if (!panel) return;

        panel.querySelectorAll('.color').forEach(btn => {
            btn.onclick = () => {
                panel.querySelectorAll('.color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setColor(btn.dataset.color);
            };
        });

        panel.querySelectorAll('.tool').forEach(btn => {
            btn.onclick = () => {
                panel.querySelectorAll('.tool').forEach(b => b.classList.remove('active'));
                if (btn.dataset.tool !== 'clear') btn.classList.add('active');
                this.setTool(btn.dataset.tool);
            };
        });

        panel.querySelector('.color')?.classList.add('active');
    }
};

console.log('🎨 canvas.js загружен');
