/* ------------------------------------------------
   SLEEP JOURNAL MODULE
   Handles local storage for the experimental journal.
   ------------------------------------------------ */
const SleepJournal = {
    STORAGE_KEY: 'sat_journal_entry',

    init() {
        console.log("Sleep Journal Initialized");
    },

    save(text) {
        try {
            localStorage.setItem(this.STORAGE_KEY, text);
            return true;
        } catch (e) {
            console.error("Failed to save journal:", e);
            return false;
        }
    },

    load() {
        return localStorage.getItem(this.STORAGE_KEY) || '';
    },

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// Expose globally
window.SleepJournal = SleepJournal;
