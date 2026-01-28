# 🌙 SAT: Sleep Anxiety Tracker

> *Break the 2 AM anxiety loop. A gentle companion for sleepless nights.*

![SAT App Preview](icons/icon-512.png)

SAT (Sleep Anxiety Tracker) is a **minimalist Progressive Web App (PWA)** designed for one specific moment: **Panic at 2 AM.**

It helps users who are awake, anxious, and spiraling about not sleeping. It is **not** a sleep tracker, meditation app, or habit builder. It is a digital "Panic Interrupter."

---

## ✨ Features

*   **🌑 Panic Interruption Engine:** randomly selects one of 10 reassuring, cognitive-reframing scripts to break the anxiety loop.
*   **🌬️ Rescue Breathing Flow:** A gentle, animated breathing guide (4s inhale, 6s exhale) if you feel "Worse" or "Same".
*   **🌫️ Glassmorphism UI:** Premium, frosted-glass aesthetics with a calming dark/warm theme.
*   **⌨️ Typewriter Effect:** Scripts reveal slowly to force a reduction in reading speed and racing thoughts.
*   **📳 Haptic Grounding:** Subtle vibrations on interaction to help ground you in reality.
*   **🔋 Offline First:** Works 100% offline via Service Worker.
*   **🚫 Zero Friction:** No login, no onboarding, no notifications, no scores.

## 🚀 How to Use

1.  **Open the App:** [Click here to view live](https://kutral.github.io/sleep/) *(Link active after deployment)*.
2.  **Add to Home Screen:**
    *   **iOS:** Share -> Add to Home Screen.
    *   **Android:** Three dots -> Add to Home Screen (or Install App).
3.  **Tap "I'm awake and anxious":** When you panic at night.
4.  **Read & Release:** Let the script ground you.

## 🛠️ Tech Stack

*   **Core:** Vanilla HTML5, CSS3, JavaScript (ES6+).
*   **PWA:** `manifest.json`, `sw.js` (Service Worker V3).
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

## 🤝 Contributing

This is a solo indie project built for impact, not profit. Suggestions are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Made with 🖤 for the sleepless.*
