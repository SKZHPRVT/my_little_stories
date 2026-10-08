/* ============================================
   ДВИЖОК СКАЗОК
   ============================================ */

window.StoryEngine = {
    currentStory: null,
    currentChapterId: null,

    openList() {
        window.Router.go('stories');
        this.renderList();
    },

    renderList() {
        const grid = document.getElementById('stories-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const stories = window.STORIES || {};

        Object.values(stories).forEach(story => {
            const unlocked = this.isUnlocked(story);
            const progress = window.State.progress[story.id] || {};
            const endingsCount = (progress.endingsUnlocked || []).length;
            const totalEndings = Object.keys(story.endings || {}).length;

            const card = document.createElement('div');
            card.className = 'story-card' + (unlocked ? '' : ' locked');
            card.innerHTML = `
                <span class="story-emoji">${story.emoji}</span>
                <div class="story-name">${story.title}</div>
                <div class="story-status">
                    ${unlocked
                        ? `Финал: ${endingsCount}/${totalEndings}`
                        : '🔒 Закрыто'}
                </div>
            `;

            if (unlocked) {
                window.Buttons.onTap(card, () => this.start(story));
            } else {
                window.Buttons.onTap(card, () => {
                    window.Toast.info('Пройди предыдущие сказки, чтобы открыть');
                });
            }

            grid.appendChild(card);
        });
    },

    isUnlocked(story) {
        if (story.unlocked) return true;
        return (story.requires || []).every(req => {
            const reqStory = window.STORIES[req];
            if (!reqStory) return false;
            const progress = window.State.progress[req] || {};
            return (progress.endingsUnlocked || []).length > 0;
        });
    },

    start(story) {
        this.currentStory = story;
        const progress = window.State.progress[story.id] || {};
        this.currentChapterId = progress.currentChapter || 'ch1';

        window.Audio.click();
        window.Router.go('story');
        this.showChapter(this.currentChapterId);
    },

    showChapter(chapterId) {
        const story = this.currentStory;
        if (!story) return;
        const chapter = story.chapters[chapterId];
        if (!chapter) {
            console.warn('⚠️ Глава не найдена:', chapterId);
            return;
        }

        this.currentChapterId = chapterId;
        window.State.story.id = story.id;
        window.State.story.currentChapter = chapterId;

        // Заголовок
        document.getElementById('story-title').textContent = story.title;

        // Прогресс
        const allIds = Object.keys(story.chapters);
        const currentIdx = allIds.indexOf(chapterId) + 1;
        document.getElementById('story-progress').textContent = `${currentIdx}/${allIds.length}`;

        // Текст
        document.getElementById('story-text').textContent = chapter.text;

        // Задание (если есть)
        const taskEl = document.getElementById('story-task');
        taskEl.innerHTML = '';
        if (chapter.task) {
            taskEl.innerHTML = `
                <strong>🎨 Задание:</strong> ${chapter.task}
                <button class="task-btn" id="task-action">Открыть холст →</button>
            `;
            setTimeout(() => {
                const btn = document.getElementById('task-action');
                if (btn) {
                    window.Buttons.onTap(btn, () => {
                        window.Draw.open(
                            chapter.taskType,
                            chapter.onComplete?.draw || 'drawing',
                            chapter.onComplete?.next
                        );
                    });
                }
            }, 50);
        }

        // Мини-игра (если есть)
        if (chapter.miniGame) {
            setTimeout(() => {
                window.MiniGame.start({
                    ...chapter.miniGame,
                    onWin: chapter.miniGame.onWin || chapter.next
                });
            }, 800);
        }

        // Выборы или концовка
        const choicesEl = document.getElementById('story-choices');
        choicesEl.innerHTML = '';

        if (chapter.isEnding) {
            this.showEnding(chapter);
        } else if (chapter.choices) {
            chapter.choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = `choice-btn branch-${choice.branch || 'yellow'}`;
                btn.textContent = choice.text;
                window.Buttons.onTap(btn, () => {
                    window.Audio.click();
                    this.showChapter(choice.next);
                });
                choicesEl.appendChild(btn);
            });
        }

        // Если глава завершается рисованием и рисунок уже есть — показываем «Дальше»
        if (chapter.onComplete && window.State.player.portfolio?.[chapter.onComplete.draw]) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'choice-btn branch-green';
            nextBtn.textContent = '➡️ Продолжить';
            window.Buttons.onTap(nextBtn, () => {
                this.showChapter(chapter.onComplete.next);
            });
            choicesEl.appendChild(nextBtn);
        }
    },

    showEnding(chapter) {
        const story = this.currentStory;
        const ending = story.endings[chapter.ending];

        if (!window.State.progress[story.id]) {
            window.State.progress[story.id] = { endingsUnlocked: [] };
        }
        if (!window.State.progress[story.id].endingsUnlocked.includes(chapter.ending)) {
            window.State.progress[story.id].endingsUnlocked.push(chapter.ending);
        }
        window.Storage.save();

        if (chapter.reward) {
            window.Inventory.add(chapter.reward);
        }

        setTimeout(() => {
            window.Modal.open(
                `${ending.emoji} ${ending.title}`,
                `${ending.text}\n\nВсего финалов: ${window.State.progress[story.id].endingsUnlocked.length}/${Object.keys(story.endings).length}`,
                'В меню'
            );
            window.Audio.success();

            document.getElementById('modal-close').onclick = () => {
                window.Modal.close();
                window.Router.reset();
                window.Router.go('menu');
            };
        }, 600);
    }
};
