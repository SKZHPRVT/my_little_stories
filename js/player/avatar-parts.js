/* ============================================
   ОПИСАНИЕ ЧАСТЕЙ ПЕРСОНАЖА
   Слоты, позиции, контуры-подсказки
   ============================================ */

window.AVATAR_PARTS = {
    // ===== ГОЛОВА =====
    head: {
        id: 'head',
        title: 'Голова',
        hint: 'Нарисуй глаза, нос, рот',
        order: 1,
        // Позиция на холсте персонажа (600×600)
        slot: { x: 200, y: 40, w: 200, h: 200 },
        zIndex: 4,
        // Контур-подсказка (SVG path)
        guide: `
            <ellipse cx="300" cy="140" rx="80" ry="100" 
                     fill="none" stroke="#999" stroke-width="2" 
                     stroke-dasharray="8,6" opacity="0.4"/>
            <ellipse cx="270" cy="120" rx="12" ry="8" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
            <ellipse cx="330" cy="120" rx="12" ry="8" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
            <path d="M 290 160 Q 300 175 310 160" 
                  fill="none" stroke="#999" stroke-width="1.5" 
                  stroke-dasharray="4,4" opacity="0.3"/>
            <path d="M 270 195 Q 300 210 330 195" 
                  fill="none" stroke="#999" stroke-width="1.5" 
                  stroke-dasharray="4,4" opacity="0.3"/>
        `
    },

    // ===== ЛИЦО (эмоции - накладка) =====
    face: {
        id: 'face',
        title: 'Лицо',
        hint: 'Нарисуй глаза, нос и рот отдельно',
        order: 2,
        slot: { x: 220, y: 100, w: 160, h: 100 },
        zIndex: 5,
        guide: `
            <ellipse cx="300" cy="150" rx="60" ry="50" 
                     fill="none" stroke="#999" stroke-width="2" 
                     stroke-dasharray="8,6" opacity="0.4"/>
            <ellipse cx="275" cy="140" rx="10" ry="7" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
            <ellipse cx="325" cy="140" rx="10" ry="7" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
            <path d="M 290 160 Q 300 172 310 160" 
                  fill="none" stroke="#999" stroke-width="1.5" 
                  stroke-dasharray="4,4" opacity="0.3"/>
            <path d="M 275 185 Q 300 195 325 185" 
                  fill="none" stroke="#999" stroke-width="1.5" 
                  stroke-dasharray="4,4" opacity="0.3"/>
        `
    },

    // ===== ТУЛОВИЩЕ =====
    torso: {
        id: 'torso',
        title: 'Туловище',
        hint: 'Нарисуй тело — плечи, грудь, живот',
        order: 3,
        slot: { x: 220, y: 230, w: 160, h: 180 },
        zIndex: 3,
        guide: `
            <path d="M 240 240 L 360 240 L 370 400 L 230 400 Z" 
                  fill="none" stroke="#999" stroke-width="2" 
                  stroke-dasharray="8,6" opacity="0.4"/>
            <line x1="300" y1="240" x2="300" y2="400" 
                  stroke="#999" stroke-width="1" 
                  stroke-dasharray="4,4" opacity="0.2"/>
        `
    },

    // ===== ЛЕВАЯ РУКА =====
    armL: {
        id: 'armL',
        title: 'Левая рука',
        hint: 'Нарисуй левую руку от плеча до кисти',
        order: 4,
        slot: { x: 140, y: 240, w: 100, h: 180 },
        zIndex: 2,
        guide: `
            <path d="M 200 240 Q 170 320 160 400" 
                  fill="none" stroke="#999" stroke-width="2" 
                  stroke-dasharray="8,6" opacity="0.4"/>
            <circle cx="160" cy="410" r="15" 
                    fill="none" stroke="#999" stroke-width="1.5" 
                    stroke-dasharray="4,4" opacity="0.3"/>
        `
    },

    // ===== ПРАВАЯ РУКА =====
    armR: {
        id: 'armR',
        title: 'Правая рука',
        hint: 'Нарисуй правую руку от плеча до кисти',
        order: 5,
        slot: { x: 360, y: 240, w: 100, h: 180 },
        zIndex: 2,
        guide: `
            <path d="M 400 240 Q 430 320 440 400" 
                  fill="none" stroke="#999" stroke-width="2" 
                  stroke-dasharray="8,6" opacity="0.4"/>
            <circle cx="440" cy="410" r="15" 
                    fill="none" stroke="#999" stroke-width="1.5" 
                    stroke-dasharray="4,4" opacity="0.3"/>
        `
    },

    // ===== НОГИ =====
    legs: {
        id: 'legs',
        title: 'Ноги',
        hint: 'Нарисуй обе ноги от бедра до стоп',
        order: 6,
        slot: { x: 220, y: 400, w: 160, h: 180 },
        zIndex: 1,
        guide: `
            <path d="M 270 410 Q 260 500 250 570" 
                  fill="none" stroke="#999" stroke-width="2" 
                  stroke-dasharray="8,6" opacity="0.4"/>
            <path d="M 330 410 Q 340 500 350 570" 
                  fill="none" stroke="#999" stroke-width="2" 
                  stroke-dasharray="8,6" opacity="0.4"/>
            <ellipse cx="250" cy="580" rx="20" ry="8" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
            <ellipse cx="350" cy="580" rx="20" ry="8" 
                     fill="none" stroke="#999" stroke-width="1.5" 
                     stroke-dasharray="4,4" opacity="0.3"/>
        `
    }
};

// Порядок прохождения онбординга
window.AVATAR_ORDER = ['head', 'face', 'torso', 'armL', 'armR', 'legs'];

console.log('📐 avatar-parts.js загружен:', window.AVATAR_ORDER.length, 'частей');
