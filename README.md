# 🌙 SAT: Sleep Anxiety Tracker

> *Break the 2 AM anxiety loop. A gentle companion for sleepless nights.*

<p align="center">
  <img src="icons/icon-512.png" width="120" alt="SAT App Icon" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
</p>

SAT (Sleep Anxiety Tracker) is a **minimalist Progressive Web App (PWA)** designed for one specific moment: **Panic at 2 AM.**

It helps users who are awake, anxious, and spiraling about not sleeping. It is **not** a sleep tracker, meditation app, or habit builder. It is a digital "Panic Interrupter."

---

## ✨ Features

### 🌑 Panic Interruption Engine
Randomly selects one of 10 reassuring, cognitive-reframing scripts to immediately break the anxiety loop.

### 🫁 Visual Box Breathing
A calming, animated guide utilizing the **4-4-4-4 Navy SEAL technique** (Inhale, Hold, Exhale, Hold) to physically regulate your nervous system.

### 🌫️ Glassmorphism Design
Premium, frosted-glass aesthetics with a calming dark/warm theme designed to be gentle on tired eyes.

### 🧠 Cognitive Distraction
If breathing fails, the app deploys a "Fall-back Protocol" (counting backwards) to force the brain from Amygdala (Panic) to Prefrontal Cortex (Logic).

### ⚡ Premium Feel
*   **Typewriter Effect:** Scripts reveal slowly to force slower reading.
*   **Haptic Grounding:** Subtle vibrations on interaction.
*   **Offline First:** Works 100% offline via Service Worker V4.

---

## 🚀 How to Use

1.  **Open the App:** [Click here to use SAT](https://kutral.github.io/sleep/)
2.  **Add to Home Screen:**
    *   **iOS:** Share -> Add to Home Screen.
    *   **Android:** Three dots -> Add to Home Screen (or Install App).
3.  **Tap "I'm awake and anxious":** When you panic at night.
4.  **Read & Release:** Let the script ground you.

## 🛠️ Tech Stack

*   **Core:** Vanilla HTML5, CSS3, JavaScript (ES6+).
*   **PWA:** `manifest.json`, `sw.js` (Service Worker V4).
*   **Design:** CSS Variables, Glassmorphism, CSS Animations.
*   **Storage:** `localStorage` for privacy-first, on-device logging.

## 📦 Installation (Local)

1.  Clone the repo:
    ```bash
    git clone https://github.com/Kutral/sleep.git
    ```
2.  Serve the directory:
    ```bash
    npx serve .
    ```
3.  Open `http://localhost:3000`.

---

*Made with 🖤 for the sleepless.*
