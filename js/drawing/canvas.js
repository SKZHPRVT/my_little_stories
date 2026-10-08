/* ============================================
   ХОЛСТ ДЛЯ РИСОВАНИЯ
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

        // Заполняем белым фоном
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.bindEvents(sizeSliderId);
        console.log('🎨 Холст готов:', canvasId);
    },

    bindEvents(sizeSliderId) {
        const canvas = this.canvas;

        // Mouse
        canvas.addEventListener('mousedown', (e) => this.start(e.offsetX, e.offsetY));
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            this.move(x, y);
        });
        canvas.addEventListener('mouseup', () => this.stop());
        canvas.addEventListener('mouseout', () => this.stop());

        // Touch
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            const x = (t.clientX - rect.left) * (canvas.width / rect.width);
            const y = (t.clientY - rect.top) * (canvas.height / rect.height);
            this.start(x, y);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            const x = (t.clientX - rect.left) * (canvas.width / rect.width);
            const y = (t.clientY - rect.top) * (canvas.height / rect.height);
            this.move(x, y);
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stop();
        }, { passive: false });

        // Slider толщины
        const slider = document.getElementById(sizeSliderId);
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.currentSize = parseInt(e.target.value);
            });
        }
    },

    start(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    },

    move(x, y) {
        if (!this.isDrawing) return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.currentColor;
        this.ctx.lineWidth = this.currentTool === 'eraser' ? this.currentSize * 3 : this.currentSize;
        this.ctx.stroke();
        this.lastX = x;
        this.lastY = y;
    },

    stop() {
        this.isDrawing = false;
    },

    setColor(color) {
        this.currentColor = color;
        this.currentTool = 'brush';
    },

    setTool(tool) {
        if (tool === 'clear') {
            this.clear();
            return;
        }
        this.currentTool = tool;
    },

    clear() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    export() {
        return this.canvas.toDataURL('image/png');
    },

    // Привязка кнопок палитры и инструментов
    bindToolsPanel(panelSelector) {
        const panel = document.querySelector(panelSelector);
        if (!panel) return;

        panel.querySelectorAll('.color').forEach(btn => {
            window.Buttons.onTap(btn, () => {
                panel.querySelectorAll('.color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setColor(btn.dataset.color);
            });
        });

        panel.querySelectorAll('.tool').forEach(btn => {
            window.Buttons.onTap(btn, () => {
                panel.querySelectorAll('.tool').forEach(b => b.classList.remove('active'));
                if (btn.dataset.tool !== 'clear') btn.classList.add('active');
                this.setTool(btn.dataset.tool);
            });
        });

        // Активируем первый цвет
        panel.querySelector('.color')?.classList.add('active');
    }
};
