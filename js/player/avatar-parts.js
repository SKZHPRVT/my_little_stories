/* ============================================
   ОПИСАНИЕ ЧАСТЕЙ ПЕРСОНАЖА
   Слоты, позиции, контуры-подсказки (толстые серые зоны)
   ============================================ */

window.AVATAR_PARTS = {
    // ===== ГОЛОВА (форма головы, овал волос) =====
    head: {
        id: 'head',
        title: 'Голова',
        hint: 'Нарисуй форму головы — овал лица и волосы',
        order: 1,
        slot: { x: 200, y: 30, w: 200, h: 220 },
        zIndex: 4,
        guide: `
            <!-- Форма головы — большая серая зона -->
            <ellipse cx="300" cy="140" rx="90" ry="110" 
                     fill="rgba(160, 160, 160, 0.35)" stroke="#888" 
                     stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Метки на будущее: где глаза, нос, рот -->
            <circle cx="265" cy="120" r="14" 
                    fill="rgba(200, 200, 200, 0.4)" stroke="none"/>
            <circle cx="335" cy="120" r="14" 
                    fill="rgba(200, 200, 200, 0.4)" stroke="none"/>
            <ellipse cx="300" cy="165" rx="10" ry="14" 
                     fill="rgba(200, 200, 200, 0.4)" stroke="none"/>
            <ellipse cx="300" cy="200" rx="30" ry="12" 
                     fill="rgba(200, 200, 200, 0.4)" stroke="none"/>
        `
    },

    // ===== ЛИЦО (черты внутри головы) =====
    face: {
        id: 'face',
        title: 'Лицо',
        hint: 'Нарисуй глаза, нос и рот — они внутри головы',
        order: 2,
        slot: { x: 220, y: 80, w: 160, h: 150 },
        zIndex: 5,
        guide: `
            <!-- Контур головы (напоминание) -->
            <ellipse cx="300" cy="140" rx="90" ry="110" 
                     fill="none" stroke="#ccc" 
                     stroke-width="2" stroke-dasharray="4,8"/>
            <!-- Зоны для глаз -->
            <ellipse cx="265" cy="120" rx="18" ry="14" 
                     fill="rgba(160, 160, 160, 0.35)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
            <ellipse cx="335" cy="120" rx="18" ry="14" 
                     fill="rgba(160, 160, 160, 0.35)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
            <!-- Зона для носа -->
            <ellipse cx="300" cy="160" rx="12" ry="16" 
                     fill="rgba(160, 160, 160, 0.3)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
            <!-- Зона для рта -->
            <ellipse cx="300" cy="198" rx="35" ry="14" 
                     fill="rgba(160, 160, 160, 0.3)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
        `
    },

    // ===== ТУЛОВИЩЕ =====
    torso: {
        id: 'torso',
        title: 'Туловище',
        hint: 'Нарисуй торс — плечи, грудь, живот',
        order: 3,
        slot: { x: 190, y: 250, w: 220, h: 170 },
        zIndex: 3,
        guide: `
            <!-- Форма туловища -->
            <path d="M 210 260 
                     Q 220 250 240 250
                     L 360 250
                     Q 380 250 390 260
                     L 390 410
                     L 210 410 Z" 
                  fill="rgba(160, 160, 160, 0.35)" 
                  stroke="#888" stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Центральная линия -->
            <line x1="300" y1="255" x2="300" y2="405" 
                  stroke="#aaa" stroke-width="1" stroke-dasharray="4,4"/>
        `
    },

    // ===== ЛЕВАЯ РУКА (толстая) =====
    armL: {
        id: 'armL',
        title: 'Левая рука',
        hint: 'Нарисуй руку от плеча до кисти',
        order: 4,
        slot: { x: 100, y: 260, w: 130, h: 200 },
        zIndex: 2,
        guide: `
            <!-- Толстая рука -->
            <path d="M 230 260 
                     Q 200 340 170 400
                     Q 160 420 155 430" 
                  fill="none" stroke="rgba(160,160,160,0.35)" 
                  stroke-width="55" stroke-linecap="round"/>
            <!-- Обводка -->
            <path d="M 230 260 
                     Q 200 340 170 400
                     Q 160 420 155 430" 
                  fill="none" stroke="#888" 
                  stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Зона кисти -->
            <circle cx="155" cy="445" r="30" 
                    fill="rgba(160, 160, 160, 0.35)" 
                    stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
        `
    },

    // ===== ПРАВАЯ РУКА (толстая) =====
    armR: {
        id: 'armR',
        title: 'Правая рука',
        hint: 'Нарисуй руку от плеча до кисти',
        order: 5,
        slot: { x: 370, y: 260, w: 130, h: 200 },
        zIndex: 2,
        guide: `
            <!-- Толстая рука -->
            <path d="M 370 260 
                     Q 400 340 430 400
                     Q 440 420 445 430" 
                  fill="none" stroke="rgba(160,160,160,0.35)" 
                  stroke-width="55" stroke-linecap="round"/>
            <!-- Обводка -->
            <path d="M 370 260 
                     Q 400 340 430 400
                     Q 440 420 445 430" 
                  fill="none" stroke="#888" 
                  stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Зона кисти -->
            <circle cx="445" cy="445" r="30" 
                    fill="rgba(160, 160, 160, 0.35)" 
                    stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
        `
    },

    // ===== НОГИ (толстые) =====
    legs: {
        id: 'legs',
        title: 'Ноги',
        hint: 'Нарисуй обе ноги от бедра до стоп',
        order: 6,
        slot: { x: 180, y: 410, w: 240, h: 180 },
        zIndex: 1,
        guide: `
            <!-- Левая нога -->
            <path d="M 260 415 Q 250 510 240 570" 
                  fill="none" stroke="rgba(160,160,160,0.35)" 
                  stroke-width="65" stroke-linecap="round"/>
            <path d="M 260 415 Q 250 510 240 570" 
                  fill="none" stroke="#888" 
                  stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Зона стопы -->
            <ellipse cx="230" cy="590" rx="35" ry="15" 
                     fill="rgba(160, 160, 160, 0.35)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
            
            <!-- Правая нога -->
            <path d="M 340 415 Q 350 510 360 570" 
                  fill="none" stroke="rgba(160,160,160,0.35)" 
                  stroke-width="65" stroke-linecap="round"/>
            <path d="M 340 415 Q 350 510 360 570" 
                  fill="none" stroke="#888" 
                  stroke-width="2" stroke-dasharray="8,6"/>
            <!-- Зона стопы -->
            <ellipse cx="370" cy="590" rx="35" ry="15" 
                     fill="rgba(160, 160, 160, 0.35)" 
                     stroke="#888" stroke-width="1.5" stroke-dasharray="6,4"/>
        `
    }
};

window.AVATAR_ORDER = ['head', 'face', 'torso', 'armL', 'armR', 'legs'];

console.log('📐 avatar-parts.js:', window.AVATAR_ORDER.length, 'частей');
