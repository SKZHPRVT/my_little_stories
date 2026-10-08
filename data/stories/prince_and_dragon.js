/* ============================================
   СКАЗКА: Принц и Дракон
   ============================================ */

window.STORIES = window.STORIES || {};

window.STORIES.prince_and_dragon = {
    id: 'prince_and_dragon',
    title: 'Принц и Дракон',
    emoji: '🐉',
    author: '@gellertm',
    unlocked: true,
    requires: [],
    reward: 'sword',

    chapters: {
        // ===== ГЛАВА 1: Начало =====
        ch1: {
            text: 'В маленьком королевстве у самого леса жил Принц. Он был добрым и смелым, но одиноким — у него не было ни друга, ни коня, ни меча.',
            task: 'Нарисуй Принца — каким ты его видишь?',
            taskType: 'avatar',
            onComplete: { draw: 'prince', next: 'ch1_ride' }
        },

        // ===== ГЛАВА 2: Транспорт =====
        ch1_ride: {
            text: 'Принц вышел из замка. Дорога звала в путь! Но сначала нужно было нарисовать себе транспорт.',
            task: 'Нарисуй мотоцикл или машину — на чём поедем?',
            taskType: 'object',
            onComplete: { draw: 'vehicle', next: 'ch1_game' }
        },

        // ===== МИНИ-ИГРА: Гонка =====
        ch1_game: {
            text: 'Поехали! Собери все звёзды по дороге.',
            miniGame: {
                type: 'gravity',
                difficulty: 'easy',
                assetKey: 'vehicle',
                goal: { type: 'collect', count: 5 },
                reward: 'coin',
                onWin: 'ch2'
            }
        },

        // ===== ГЛАВА 3: Яйцо =====
        ch2: {
            text: 'Принц доехал до леса. Там, у самого старого дуба, он нашёл большое пятнистое яйцо. Оно было тёплым и слегка шевелилось...',
            task: 'Нарисуй таинственное яйцо',
            taskType: 'object',
            onComplete: { draw: 'egg', next: 'ch3' }
        },

        // ===== ГЛАВА 4: Выбор =====
        ch3: {
            text: 'Что же делать с яйцом?',
            choices: [
                { text: '🟡 Забрать в замок и согреть', branch: 'yellow', next: 'ch_warm' },
                { text: '🔵 Позвать старого мудреца',   branch: 'blue',   next: 'ch_wise' },
                { text: '🔴 Разбить и посмотреть',      branch: 'red',    next: 'ch_break' }
            ]
        },

        // ===== ВЕТКА A: Согреть (жёлтая) =====
        ch_warm: {
            text: 'Принц отнёс яйцо в свою комнату и укутал его одеялом. Ночью что-то произошло...',
            task: 'Нарисуй маленького дракончика!',
            taskType: 'object',
            onComplete: { draw: 'baby_dragon', next: 'ch_warm_2' }
        },

        ch_warm_2: {
            text: 'Из яйца вылупился маленький дракон! Он посмотрел на Принца огромными глазами и лизнул ему руку. Так у Принца появился первый друг.',
            isEnding: true,
            ending: 'kindness',
            reward: 'dragon_pet'
        },

        // ===== ВЕТКА B: Мудрец (синяя) =====
        ch_wise: {
            text: 'Старый мудрец долго смотрел на яйцо и сказал: «Это яйцо Дракона Времени. Он может отнести тебя в любую эпоху...»',
            task: 'Нарисуй мудреца',
            taskType: 'object',
            onComplete: { draw: 'wise_man', next: 'ch_wise_2' }
        },

        ch_wise_2: {
            text: 'Мудрец дал Принцу амулет — тот самый, что хранился в королевстве тысячи лет. Теперь Принц может путешествовать во времени.',
            isEnding: true,
            ending: 'wisdom',
            reward: 'amulet'
        },

        // ===== ВЕТКА C: Разбить (красная) =====
        ch_break: {
            text: 'Принц разбил яйцо... и из него вырвался огромный огненный дракон! Он был напуган и разгневан.',
            task: 'Нарисуй большого дракона',
            taskType: 'object',
            onComplete: { draw: 'big_dragon', next: 'ch_break_2' }
        },

        ch_break_2: {
            text: 'Дракон взлетел над замком и изверг пламя. Принц схватил что-то тяжёлое...',
            task: 'Нарисуй меч!',
            taskType: 'object',
            onComplete: { draw: 'sword', next: 'ch_break_3' }
        },

        ch_break_3: {
            text: 'С мечом в руках Принц...',
            choices: [
                { text: '🔴 Сразиться с драконом',      branch: 'red',   next: 'ch_break_fight' },
                { text: '🟢 Попробовать договориться',  branch: 'green', next: 'ch_break_peace' }
            ]
        },

        ch_break_fight: {
            text: 'Принц бросился в бой. Дракон был сильнее... но Принц не сдавался. И тогда случилось чудо — дракон узнал в Принце родственную душу.',
            isEnding: true,
            ending: 'brave',
            reward: 'sword'
        },

        ch_break_peace: {
            text: 'Принц опустил меч и протянул руку. Дракон фыркнул, но подошёл. Так началась великая дружба человека и дракона.',
            isEnding: true,
            ending: 'peace',
            reward: 'dragon_pet'
        }
    },

    endings: {
        kindness: { title: 'Доброе сердце',  emoji: '💛', text: 'Ты получил друга-дракона' },
        wisdom:   { title: 'Мудрость веков', emoji: '🔮', text: 'Ты получил амулет времени' },
        brave:    { title: 'Храброе сердце', emoji: '⚔️', text: 'Ты получил меч героя' },
        peace:    { title: 'Мир с драконом', emoji: '🕊️', text: 'Ты получил друга-дракона' }
    }
};
