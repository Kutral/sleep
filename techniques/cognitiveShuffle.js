/* ------------------------------------------------
   COGNITIVE SHUFFLE
   Paced visualization of random words.
   ------------------------------------------------ */

const CognitiveShuffle = {
    interval: null,
    isActive: false,
    currentLetter: '',

    // Non-anxious, neutral/positive words
    wordList: {
        'B': ['Bear', 'Boat', 'Bread', 'Ball', 'Blue', 'Book', 'Barn', 'Bell', 'Bird'],
        'C': ['Cat', 'Cake', 'Cloud', 'Cool', 'Camp', 'Card', 'Coin', 'Corn', 'Coat'],
        'M': ['Moon', 'Milk', 'Moss', 'Map', 'Mint', 'Mail', 'Meal', 'Mug', 'Mist'],
        'S': ['Star', 'Sand', 'Soup', 'Ship', 'Snow', 'Safe', 'Seed', 'Song', 'Soft'],
        'P': ['Park', 'Pine', 'Pear', 'Pool', 'Path', 'Post', 'Plan', 'Page', 'Pond'],
        'L': ['Lake', 'Leaf', 'Lamp', 'Lane', 'Lime', 'Log', 'Luck', 'Lock', 'Line']
    },

    start() {
        this.isActive = true;
        this.newRound();
    },

    stop() {
        this.isActive = false;
        clearInterval(this.interval);
        // Clear UI
        const container = document.getElementById('shuffle-container');
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    },

    newRound() {
        if (!this.isActive) return;

        // 1. Pick a random letter
        const keys = Object.keys(this.wordList);
        this.currentLetter = keys[Math.floor(Math.random() * keys.length)];
        const words = [...this.wordList[this.currentLetter]];

        // Shuffle words
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        // 2. Setup UI
        const container = document.getElementById('shuffle-container');
        if (!container) return;

        container.style.display = 'flex';
        container.innerHTML = `
            <div class="shuffle-intro">Visualize the letter</div>
            <div class="shuffle-letter">${this.currentLetter}</div>
            <div class="shuffle-word"></div>
        `;

        // 3. Start Sequence
        let wordIndex = 0;

        // Wait 3 seconds before first word (to visualize letter)
        this.interval = setTimeout(() => {
            this.showNextWord(words, wordIndex);
        }, 3000);
    },

    showNextWord(words, index) {
        if (!this.isActive) return;

        // If we ran out of words (limit to 6-8 per round)
        if (index >= Math.min(words.length, 8)) {
            // New Letter Round
            this.interval = setTimeout(() => {
                this.newRound();
            }, 2000);
            return;
        }

        const wordEl = document.querySelector('.shuffle-word');
        if (wordEl) {
            // Fade out previous
            wordEl.style.opacity = '0';

            setTimeout(() => {
                if (!this.isActive) return;
                // Show new word
                wordEl.textContent = words[index];
                wordEl.style.opacity = '1';

                // Next word in 4-6 seconds (paced)
                this.interval = setTimeout(() => {
                    this.showNextWord(words, index + 1);
                }, 5000);
            }, 1000);
        }
    }
};

window.CognitiveShuffle = CognitiveShuffle;
