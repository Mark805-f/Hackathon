// =====================================
// WORLD CHALLENGE - sounds.js
// Synthesized sound effects (no audio files needed).
// Add <script src="sounds.js"></script> AFTER all other scripts.
// =====================================

(function () {

    let ctx = null;
    let muted = localStorage.getItem("worldMuted") === "1";

    // ---------- audio engine ----------

    function getCtx() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    }

    // One note: frequency, start offset (s), duration (s), wave type, volume, optional slide-to frequency
    function tone(freq, start, dur, type = "sine", vol = 0.25, slideTo = null) {
        if (muted) return;
        const c = getCtx();
        if (!c) return;

        const t = c.currentTime + start;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain).connect(c.destination);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    }

    // ---------- the sounds ----------

    const sounds = {
        click()   { tone(620, 0, 0.06, "triangle", 0.15); },
        nav()     { tone(440, 0, 0.07, "sine", 0.15); tone(660, 0.05, 0.08, "sine", 0.12); },
        correct() {
            tone(523, 0, 0.14, "sine", 0.25);      // C5
            tone(659, 0.09, 0.14, "sine", 0.25);   // E5
            tone(784, 0.18, 0.28, "sine", 0.25);   // G5
        },
        wrong() {
            tone(220, 0, 0.18, "sawtooth", 0.18, 150);
            tone(165, 0.14, 0.3, "sawtooth", 0.18, 100);
        },
        timeup() {
            tone(300, 0, 0.15, "square", 0.15);
            tone(300, 0.2, 0.15, "square", 0.15);
            tone(200, 0.4, 0.35, "square", 0.15);
        },
        tick()    { tone(900, 0, 0.04, "square", 0.08); },
        hint()    { tone(700, 0, 0.1, "sine", 0.2); tone(950, 0.08, 0.18, "sine", 0.2); },
        fifty()   { tone(800, 0, 0.12, "triangle", 0.2, 300); },
        time()    { tone(500, 0, 0.1, "sine", 0.2); tone(750, 0.1, 0.15, "sine", 0.2); },
        skip()    { tone(400, 0, 0.1, "triangle", 0.2, 800); },
        double()  { tone(600, 0, 0.08, "square", 0.12); tone(900, 0.07, 0.08, "square", 0.12); tone(1200, 0.14, 0.15, "square", 0.12); },
        reward()  { tone(880, 0, 0.1, "sine", 0.2); tone(1175, 0.1, 0.2, "sine", 0.2); },
        achievement() {
            tone(988, 0, 0.15, "sine", 0.22);
            tone(1319, 0.12, 0.35, "sine", 0.22);
            tone(1976, 0.12, 0.35, "sine", 0.06);
        },
        chest() {
            [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.07, 0.3, "triangle", 0.2));
            tone(2093, 0.4, 0.5, "sine", 0.1);
        },
        levelup() {
            [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
                tone(f, i * 0.11, 0.25, "triangle", 0.25));
            tone(1568, 0.8, 0.6, "sine", 0.2);
        },
        finish() {
            [392, 392, 392, 523].forEach((f, i) => tone(f, i * 0.14, i === 3 ? 0.6 : 0.12, "square", 0.14));
            tone(659, 0.56, 0.6, "sine", 0.2);
        },
        unlock()  { tone(300, 0, 0.1, "sine", 0.2); tone(450, 0.1, 0.1, "sine", 0.2); tone(900, 0.2, 0.3, "sine", 0.2); },
        denied()  { tone(180, 0, 0.2, "sawtooth", 0.15); }
    };

    window.playSound = name => { if (sounds[name]) sounds[name](); };


    // ---------- mute button ----------

    const style = document.createElement("style");
    style.textContent = `
        #sound-toggle {
            position: fixed; left: 18px; bottom: 18px; z-index: 150;
            width: 46px; height: 46px; border-radius: 50%;
            background: #18263c; color: #61d4f1;
            border: 1px solid #3b5275; cursor: pointer; font-size: 17px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4); transition: 0.2s;
        }
        #sound-toggle:hover { transform: scale(1.1); border-color: #61d4f1; }
        #sound-toggle.off { color: #ff7185; }
    `;
    document.head.appendChild(style);

    const toggle = document.createElement("button");
    toggle.id = "sound-toggle";
    toggle.setAttribute("aria-label", "Toggle sound");
    document.body.appendChild(toggle);

    function renderToggle() {
        toggle.className = muted ? "off" : "";
        toggle.innerHTML = muted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
        toggle.title = muted ? "Sound off" : "Sound on";
    }

    toggle.addEventListener("click", e => {
        e.stopPropagation();
        muted = !muted;
        localStorage.setItem("worldMuted", muted ? "1" : "0");
        renderToggle();
        if (!muted) sounds.click();
    });

    renderToggle();


    // ---------- button clicks (one listener for the whole page) ----------

    document.addEventListener("click", event => {
        const el = event.target.closest("button");
        if (!el || el.id === "sound-toggle" || el.disabled) return;

        const id = el.id;

        if (id === "hint-btn") return sounds.hint();
        if (id === "fifty-btn") return sounds.fifty();
        if (id === "time-btn") return sounds.time();
        if (id === "skip-btn") return sounds.skip();
        if (id === "double-btn") return sounds.double();
        if (id === "open-chest") return sounds.chest();
        if (id === "unlock-secret") return;            // handled by the toast / message below
        if (el.classList.contains("answer")) return sounds.click();
        if (el.classList.contains("nav-item")) return sounds.nav();

        sounds.click();
    });


    // ---------- reactions to what the game does ----------

    // Answer feedback (correct / wrong / time's up / hint / double points)
    const feedback = document.getElementById("feedback");
    if (feedback) {
        new MutationObserver(() => {
            const text = feedback.textContent;

            if (text.startsWith("🎉")) {
                sounds.correct();
                if (text.includes("Reward")) setTimeout(sounds.reward, 350);
            } else if (text.startsWith("❌")) {
                sounds.wrong();
            } else if (text.startsWith("⏰")) {
                sounds.timeup();
            }
        }).observe(feedback, { childList: true, characterData: true, subtree: true });
    }

    // Timer ticking in the last 5 seconds
    const timerEl = document.getElementById("timer");
    if (timerEl) {
        new MutationObserver(() => {
            if (timerEl.classList.contains("danger") && timerEl.textContent !== "0s") {
                sounds.tick();
            }
        }).observe(timerEl, { childList: true, characterData: true, subtree: true });
    }

    // Level up popup
    const levelUp = document.getElementById("levelup-screen");
    if (levelUp) {
        let wasShown = false;
        new MutationObserver(() => {
            const shown = levelUp.classList.contains("show");
            if (shown && !wasShown) sounds.levelup();
            wasShown = shown;
        }).observe(levelUp, { attributes: true, attributeFilter: ["class"] });
    }

    // Results screen
    const result = document.getElementById("result-screen");
    if (result) {
        let wasHidden = result.classList.contains("hidden");
        new MutationObserver(() => {
            const hidden = result.classList.contains("hidden");
            if (wasHidden && !hidden) sounds.finish();
            wasHidden = hidden;
        }).observe(result, { attributes: true, attributeFilter: ["class"] });
    }

    // Toasts: gold toasts = achievements / chests / secret unlocked
    new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains("toast")) {
                const text = node.textContent;
                if (text.includes("Mystery World unlocked")) sounds.unlock();
                else if (node.classList.contains("gold")) sounds.achievement();
            }
        }));
    }).observe(document.body, { childList: true, subtree: true });

    // Wrong secret code
    const secretMsg = document.getElementById("secret-message");
    if (secretMsg) {
        new MutationObserver(() => {
            if (secretMsg.textContent.startsWith("❌")) sounds.denied();
        }).observe(secretMsg, { childList: true, characterData: true, subtree: true });
    }

    // Map game: correct / wrong countries
    const mapContainer = document.getElementById("map-container");
    if (mapContainer) {
        new MutationObserver(mutations => {
            mutations.forEach(m => {
                const t = m.target;
                if (!t.classList || !t.classList.contains("country")) return;
                if (t.classList.contains("map-correct")) sounds.correct();
                else if (t.classList.contains("map-wrong")) sounds.wrong();
            });
        }).observe(mapContainer, { attributes: true, attributeFilter: ["class"], subtree: true });
    }

})();