/* ============================================
   SAT - Data Store
   Separating content from logic for easier updates.
   ============================================ */

(function () {
    // ============================================
    // CLOSING MESSAGES (Dynamic End Screen)
    // ============================================
    window.CLOSING_MESSAGES = [
        "You are safe.<br>Rest well.",
        "The night is soft.<br>You are okay.",
        "Let go of the day.<br>It is done.",
        "Breathing in.<br>Breathing out.",
        "Nothing more to do.<br>Just be.",
        "Gravity has you.<br>Let go.",
        "Peace is here.<br>In the quiet.",
        "You have done enough.<br>Goodnight."
    ];

    // ============================================
    // HOME SCREEN RANDOMIZATION
    // ============================================
    window.OPENING_WHISPERS = [
        "It's okay to be here.",
        "The night is long, but it ends.",
        "You are not alone in this.",
        "Just breathe. That's enough.",
        "Softly now. No rush.",
        "Let the world spin without you.",
        "You don't have to fix anything."
    ];

    window.BUTTON_LABELS = [
        "I'm awake and anxious",
        "My mind won't stop",
        "I need a moment",
        "Help me reset",
        "It's too loud inside",
        "I can't sleep"
    ];

    // ============================================
    // GROUNDING SCRIPTS
    // ============================================
    window.SCRIPTS = [
        { id: 1, text: "Your body is resting right now, even if your mind isn't. Lying still provides 80% of the physical recovery of sleep. You are rebuilding energy just by being here. You are okay." },
        { id: 2, text: "Tomorrow will happen, and you will get through it. You have survived tired days before. Your adrenaline will carry you. For now, you don't need to solve tomorrow. You just need to be." },
        { id: 3, text: "Trying to sleep is the best way to stay awake. Give up the goal of sleeping. Your only goal right now is to rest your eyes. Sleep is a visitor; you can't force it to arrive, but you can leave the door open." },
        { id: 4, text: "It is okay to be awake. Millions of people are awake with you right now. You are not broken. You are just a human with an active mind. This moment will pass." },
        { id: 5, text: "In the grand scheme of your life, this one rough night is a tiny speck. It will not break you. It will not ruin your health. Let go of the pressure to be perfect at sleeping." },
        { id: 6, text: "Feel the weight of your body on the mattress. Gravity is holding you. You don't need to hold yourself up. Let the bed do the work. Release your jaw. Release your shoulders." },
        { id: 7, text: "Your brain is spinning because it thinks there is a problem to solve. There is no problem. This is just a false alarm. You are safe in bed. There is no tiger. You can stand down." },
        { id: 8, text: "Say to yourself: 'I am awake, and that is fine.' Fighting it creates tension. Accepting it creates space. Be a watcher of your wakefulness, not a judge." },
        { id: 9, text: "Imagine you are drifting on a boat in a calm lake. Thoughts are just clouds passing overhead. You don't need to chase them or push them away. Just let them float by." },
        { id: 10, text: "You are warm. You are safe. You have nowhere to be for hours. This is your time to just exist. Nothing is required of you right now." }
    ];

    // ============================================
    // MICRO ACTIONS
    // ============================================
    window.MICRO_ACTIONS = [
        "Put the phone face down for 5 minutes.",
        "Read something boring — anything at all.",
        "Lie still and rest your eyes. No pressure.",
        "Get a glass of water, then return to bed.",
        "Stretch your arms above your head, then relax.",
        "Listen to the silence around you.",
        "Wiggle your toes for 10 seconds.",
        "Visualize a candle flame flickering.",
        "Count backwards from 300 by 3s.",
        "Imagine your body is made of heavy sand.",
        "Touch your thumb to each finger, one by one.",
        "Recall the smell of rain.",
        "Scan your body for tension and let it drop.",
        "Imagine a color you love filling the room.",
        "Say 'I accept this moment' silently."
    ];

    // ============================================
    // RESCUE METHODS (10 Scientific)
    // ============================================
    window.RESCUE_METHODS = [
        { title: "Worry Burner", text: "Write down the thought that is haunting you. Then, watch it burn into nothingness. <br><br>The light of the flame will carry the weight for you." },
        { title: "Cognitive Shuffling", text: "Visualize random objects that start with the same letter. <br><br>Example: Letter 'B'.<br><span class='text-highlight'>Ball... Bear... Boat... Bread...</span><br><br>When you run out, pick a new letter." },
        { title: "4-7-8 Breathing", text: "A natural tranquilizer for the nervous system.<br><br>1. Inhale through nose for <b>4s</b>.<br>2. Hold breath for <b>7s</b>.<br>3. Exhale forcefully through mouth for <b>8s</b>." },
        { title: "The Candle Flame", text: "Losing yourself in the flicker of a flame can reset the nervous system. Focus only on the dance of the light." },
        { title: "The 5-4-3-2-1 Grounding", text: "Identify specifically:<br><br>5 things you see.<br>4 things you can touch.<br>3 things you hear.<br>2 things you can smell.<br>1 thing you can taste." },
        { title: "Progressive Relaxation", text: "Squeeze your toes hard for 5 seconds. Then release completely.<br><br>Now move to your calves. Squeeze, release.<br><br>Slowly work your way up to your face." },
        { title: "Paradoxical Intention", text: "Stop trying to sleep. Instead, <span class='text-highlight'>try to stay awake.</span><br><br>Keep your eyes open in the dark. Tell yourself 'I will not sleep.'<br><br>This removes the performance anxiety of sleeping." },
        { title: "The Physiological Sigh", text: "Reset your CO2 levels instantly.<br><br>1. Double inhale through nose (one long, one short).<br>2. Very long exhale through mouth.<br><br>Repeat 3 times." },
        { title: "Cognitive Distraction", text: "Engage your logical brain to dampen the emotional brain.<br><br>Count backwards from <b>100</b> by <b>7s</b>.<br><span class='text-highlight'>100... 93... 86... 79...</span>" },
        { title: "The 'Grateful 3'", text: "Find three tiny, specific things from the last 24 hours designed just for you.<br><br>1. The warmth of coffee.<br>2. A text from a friend.<br>3. The cool pillow side." }
    ];
})();
