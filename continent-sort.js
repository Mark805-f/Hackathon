// =====================================
// WORLD CHALLENGE - continent-sort.js
// Drag each flag onto the right continent.
// Add <script src="continent-sort.js"></script> AFTER all other scripts.
// Uses from script.js: shuffle, addXP, showToast, startGame, currentCategory
// =====================================

(function () {

    // ---------- settings ----------

    const ROUND_SIZE = 12;      // countries per round
    const CARD_TIME = 10;       // seconds per country
    const NEXT_DELAY = 1300;    // pause after each answer (ms)

    const CONTINENTS = [
        { name: "Europe",        icon: "fa-earth-europe",   color: "#61d4f1" },
        { name: "Asia",          icon: "fa-earth-asia",     color: "#ff9d52" },
        { name: "Africa",        icon: "fa-earth-africa",   color: "#ffd166" },
        { name: "North America", icon: "fa-earth-americas", color: "#48d89a" },
        { name: "South America", icon: "fa-earth-americas", color: "#ff7185" },
        { name: "Oceania",       icon: "fa-earth-oceania",  color: "#a78bfa" }
    ];

    // [flag code, country name, continent]
    // Countries that sit on two continents (Turkey, Russia, ...) are left out on purpose.
    const COUNTRIES = [
        // Europe
        ["fr","France","Europe"], ["de","Germany","Europe"], ["it","Italy","Europe"], ["es","Spain","Europe"],
        ["gb","United Kingdom","Europe"], ["ie","Ireland","Europe"], ["pt","Portugal","Europe"], ["nl","Netherlands","Europe"],
        ["be","Belgium","Europe"], ["ch","Switzerland","Europe"], ["at","Austria","Europe"], ["se","Sweden","Europe"],
        ["no","Norway","Europe"], ["fi","Finland","Europe"], ["dk","Denmark","Europe"], ["pl","Poland","Europe"],
        ["cz","Czechia","Europe"], ["hu","Hungary","Europe"], ["gr","Greece","Europe"], ["ro","Romania","Europe"],
        ["bg","Bulgaria","Europe"], ["hr","Croatia","Europe"], ["rs","Serbia","Europe"], ["al","Albania","Europe"],
        ["xk","Kosovo","Europe"], ["ua","Ukraine","Europe"], ["is","Iceland","Europe"], ["sk","Slovakia","Europe"],
        ["si","Slovenia","Europe"], ["ba","Bosnia and Herzegovina","Europe"], ["mk","North Macedonia","Europe"],
        ["me","Montenegro","Europe"], ["lt","Lithuania","Europe"], ["lv","Latvia","Europe"], ["ee","Estonia","Europe"],

        // Asia
        ["jp","Japan","Asia"], ["cn","China","Asia"], ["in","India","Asia"], ["kr","South Korea","Asia"],
        ["th","Thailand","Asia"], ["vn","Vietnam","Asia"], ["id","Indonesia","Asia"], ["ph","Philippines","Asia"],
        ["my","Malaysia","Asia"], ["sg","Singapore","Asia"], ["pk","Pakistan","Asia"], ["bd","Bangladesh","Asia"],
        ["np","Nepal","Asia"], ["lk","Sri Lanka","Asia"], ["sa","Saudi Arabia","Asia"], ["ae","United Arab Emirates","Asia"],
        ["il","Israel","Asia"], ["jo","Jordan","Asia"], ["ir","Iran","Asia"], ["iq","Iraq","Asia"],
        ["mn","Mongolia","Asia"], ["af","Afghanistan","Asia"], ["qa","Qatar","Asia"], ["kh","Cambodia","Asia"],
        ["uz","Uzbekistan","Asia"],

        // Africa
        ["eg","Egypt","Africa"], ["za","South Africa","Africa"], ["ng","Nigeria","Africa"], ["ke","Kenya","Africa"],
        ["ma","Morocco","Africa"], ["dz","Algeria","Africa"], ["tn","Tunisia","Africa"], ["et","Ethiopia","Africa"],
        ["gh","Ghana","Africa"], ["sn","Senegal","Africa"], ["tz","Tanzania","Africa"], ["ug","Uganda","Africa"],
        ["ao","Angola","Africa"], ["cm","Cameroon","Africa"], ["ci","Côte d'Ivoire","Africa"], ["mg","Madagascar","Africa"],
        ["zw","Zimbabwe","Africa"], ["zm","Zambia","Africa"], ["ly","Libya","Africa"], ["sd","Sudan","Africa"],
        ["rw","Rwanda","Africa"], ["mz","Mozambique","Africa"], ["na","Namibia","Africa"], ["bw","Botswana","Africa"],

        // North America
        ["us","United States","North America"], ["ca","Canada","North America"], ["mx","Mexico","North America"],
        ["cu","Cuba","North America"], ["jm","Jamaica","North America"], ["cr","Costa Rica","North America"],
        ["pa","Panama","North America"], ["gt","Guatemala","North America"], ["do","Dominican Republic","North America"],
        ["ht","Haiti","North America"], ["hn","Honduras","North America"], ["ni","Nicaragua","North America"],
        ["sv","El Salvador","North America"], ["bs","Bahamas","North America"], ["bz","Belize","North America"],

        // South America
        ["br","Brazil","South America"], ["ar","Argentina","South America"], ["cl","Chile","South America"],
        ["pe","Peru","South America"], ["co","Colombia","South America"], ["ve","Venezuela","South America"],
        ["ec","Ecuador","South America"], ["bo","Bolivia","South America"], ["py","Paraguay","South America"],
        ["uy","Uruguay","South America"], ["gy","Guyana","South America"], ["sr","Suriname","South America"],

        // Oceania
        ["au","Australia","Oceania"], ["nz","New Zealand","Oceania"], ["fj","Fiji","Oceania"],
        ["pg","Papua New Guinea","Oceania"], ["ws","Samoa","Oceania"], ["to","Tonga","Oceania"],
        ["vu","Vanuatu","Oceania"], ["sb","Solomon Islands","Oceania"]
    ];


    // ---------- helpers ----------

    const $id = id => document.getElementById(id);
    const sfx = name => { if (window.playSound) window.playSound(name); };
    const shuf = arr => (typeof shuffle === "function")
        ? shuffle(arr)
        : [...arr].sort(() => Math.random() - 0.5);

    const state = {
        items: [], index: 0, score: 0, streak: 0, correct: 0,
        locked: true, timeLeft: CARD_TIME, counts: {}
    };

    let timerId = null;
    let nextId = null;
    let built = false;
    let screen, card;


    // ---------- styles ----------

    const style = document.createElement("style");
    style.textContent = `
    .sort-screen {
        position: fixed; inset: 0; z-index: 60; overflow-y: auto;
        background: rgba(7, 13, 25, 0.97); display: flex; padding: 20px;
    }
    .sort-box {
        position: relative; margin: auto; width: min(100%, 980px);
        background: #18263c; border: 1px solid #405675; border-radius: 20px; padding: 25px;
    }
    .sort-top { display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
    .sort-label { color: #61d4f1; font-size: 11px; letter-spacing: 3px; font-weight: bold; }
    .sort-title { font-size: clamp(22px, 3.5vw, 30px); color: #ffd166; margin-top: 6px; }
    .sort-info { display: flex; gap: 20px; color: #91a2bd; font-size: 13px; flex-wrap: wrap; }
    .sort-info strong { color: #61d4f1; }
    #sort-close {
        background: #263852; color: #fff; border: 1px solid #3b506d;
        width: 40px; height: 40px; border-radius: 10px; cursor: pointer;
    }
    .sort-timer { height: 6px; background: #30415b; border-radius: 20px; margin: 20px 0 10px; overflow: hidden; }
    #sort-timer-fill { height: 100%; width: 100%; background: linear-gradient(90deg, #53c8e8, #8d83ff); border-radius: 20px; }
    #sort-timer-fill.danger { background: #ff7185; }
    #sort-feedback { min-height: 24px; text-align: center; font-weight: bold; margin: 8px 0; }

    .sort-stage { display: grid; place-items: center; height: 200px; touch-action: none; }
    #sort-card {
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        background: #263852; border: 1px solid #3b506d; border-radius: 16px;
        padding: 18px 28px; cursor: grab; user-select: none; touch-action: none;
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4);
        transition: transform 0.25s, opacity 0.25s;
    }
    #sort-card.dragging { cursor: grabbing; transition: none; z-index: 5; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    #sort-card.placed { opacity: 0; transform: scale(0.6); }
    #sort-card img { height: 85px; max-width: 180px; border-radius: 8px; pointer-events: none;
        box-shadow: 0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.15); }
    #sort-card .sort-emoji { font-size: 70px; line-height: 85px; }
    #sort-card strong { font-size: 18px; text-align: center; }

    .sort-bins { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-top: 15px; }
    .sort-bin {
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        background: #1d2f49; border: 2px dashed var(--c); color: #fff;
        border-radius: 14px; padding: 18px 6px; cursor: pointer; font-size: 13px; font-weight: bold;
        transition: 0.2s; position: relative;
    }
    .sort-bin i { font-size: 26px; color: var(--c); }
    .sort-bin .key { position: absolute; top: 6px; left: 8px; font-size: 10px; color: #7787a3; }
    .sort-bin .cnt { font-size: 11px; color: #91a2bd; font-weight: normal; }
    .sort-bin:hover, .sort-bin.over { background: #263f60; transform: translateY(-4px); box-shadow: 0 8px 25px rgba(97,212,241,0.15); }
    .sort-bin.over { border-style: solid; }
    .sort-bin.sort-right { background: #176443; border-color: #48d89a; border-style: solid; animation: pop 0.45s; }
    .sort-bin.sort-bad { background: #793444; border-color: #fa748b; border-style: solid; animation: shake 0.4s; }

    .sort-help { color: #7787a3; font-size: 11px; margin-top: 14px; text-align: center; }

    .sort-end {
        position: absolute; inset: 0; background: rgba(12, 18, 32, 0.96); border-radius: 20px;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 20px;
    }
    .sort-end .big { color: #61d4f1; font-size: 52px; font-weight: bold; }
    .sort-end .sub { color: #91a2bd; font-size: 14px; }
    .sort-end-buttons { display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap; justify-content: center; }
    .sort-end button {
        background: #55c9e8; color: #102136; border: none; border-radius: 10px;
        padding: 14px 28px; font-weight: bold; cursor: pointer;
    }
    .sort-end button.alt { background: #263852; color: #fff; border: 1px solid #3b506d; }

    @media (max-width: 800px) {
        .sort-bins { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 450px) {
        .sort-box { padding: 16px; }
        .sort-bin { padding: 14px 4px; font-size: 12px; }
        .sort-stage { height: 180px; }
    }
    `;
    document.head.appendChild(style);


    // ---------- build the screen (once) ----------

    function build() {
        if (built) return;
        built = true;

        screen = document.createElement("div");
        screen.id = "sort-screen";
        screen.className = "sort-screen hidden";

        const bins = CONTINENTS.map((c, i) => `
            <button class="sort-bin" data-continent="${c.name}" style="--c:${c.color}">
                <span class="key">${i + 1}</span>
                <i class="fa-solid ${c.icon}"></i>
                <span>${c.name}</span>
                <span class="cnt" data-count="${c.name}">0</span>
            </button>`).join("");

        screen.innerHTML = `
            <div class="sort-box">
                <div class="sort-top">
                    <div>
                        <p class="sort-label">CONTINENT SORT</p>
                        <h2 class="sort-title">Where does it belong?</h2>
                    </div>
                    <div class="sort-info">
                        <span>Country <strong id="sort-round">1/${ROUND_SIZE}</strong></span>
                        <span>Score <strong id="sort-score">0</strong></span>
                        <span>Streak <strong id="sort-streak">0</strong></span>
                        <span>Best <strong id="sort-best">0</strong></span>
                    </div>
                    <button id="sort-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div class="sort-timer"><div id="sort-timer-fill"></div></div>
                <p id="sort-feedback"></p>

                <div class="sort-stage">
                    <div id="sort-card"></div>
                </div>

                <div class="sort-bins">${bins}</div>

                <p class="sort-help">Drag the card onto a continent, tap a continent, or press 1-6.</p>

                <div id="sort-end" class="sort-end hidden">
                    <i class="fa-solid fa-earth-europe" style="font-size:44px;color:#61d4f1"></i>
                    <h2>Continent Sort Complete!</h2>
                    <div class="big" id="sort-final">0</div>
                    <p class="sub" id="sort-final-detail"></p>
                    <div class="sort-end-buttons">
                        <button id="sort-again"><i class="fa-solid fa-rotate-right"></i> Play Again</button>
                        <button id="sort-exit" class="alt">Back to Quiz</button>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(screen);
        card = $id("sort-card");

        // buttons
        $id("sort-close").addEventListener("click", close);
        $id("sort-exit").addEventListener("click", close);
        $id("sort-again").addEventListener("click", startRound);

        screen.querySelectorAll(".sort-bin").forEach(bin => {
            bin.addEventListener("click", () => answer(bin.dataset.continent));
        });

        setupDrag();

        // Keyboard: 1-6 answer, Escape closes. Capture phase so the main quiz
        // (which also listens for 1-4) doesn't answer questions behind this screen.
        document.addEventListener("keydown", event => {
            if (screen.classList.contains("hidden")) return;

            event.stopPropagation();

            if (event.key === "Escape") return close();

            const n = parseInt(event.key, 10);
            if (n >= 1 && n <= CONTINENTS.length) answer(CONTINENTS[n - 1].name);
        }, true);
    }


    // ---------- drag and drop ----------

    function binAt(x, y) {
        for (const el of document.elementsFromPoint(x, y)) {
            const bin = el.closest && el.closest(".sort-bin");
            if (bin) return bin;
        }
        return null;
    }

    function highlight(bin) {
        screen.querySelectorAll(".sort-bin").forEach(b => b.classList.toggle("over", b === bin));
    }

    function setupDrag() {
        let dragging = false;
        let startX = 0, startY = 0;

        card.addEventListener("pointerdown", e => {
            if (state.locked) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            card.setPointerCapture(e.pointerId);
            card.classList.add("dragging");
        });

        card.addEventListener("pointermove", e => {
            if (!dragging) return;
            card.style.transform =
                "translate(" + (e.clientX - startX) + "px," + (e.clientY - startY) + "px) scale(1.06)";
            highlight(binAt(e.clientX, e.clientY));
        });

        card.addEventListener("pointerup", e => {
            if (!dragging) return;
            dragging = false;
            card.classList.remove("dragging");

            const bin = binAt(e.clientX, e.clientY);
            highlight(null);

            if (bin) {
                card.style.transform = "";
                answer(bin.dataset.continent);
            } else {
                card.style.transform = "";   // snap back
            }
        });

        card.addEventListener("pointercancel", () => {
            dragging = false;
            card.classList.remove("dragging");
            card.style.transform = "";
            highlight(null);
        });
    }


    // ---------- game flow ----------

    function open() {
        build();

        // Pause the main quiz so its timer doesn't run behind this screen
        try { clearInterval(timerInterval); clearTimeout(autoNextTimeout); } catch (e) {}

        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        $id("sort-nav").classList.add("active");

        screen.classList.remove("hidden");
        startRound();
    }

    function close() {
        clearInterval(timerId);
        clearTimeout(nextId);
        screen.classList.add("hidden");
        $id("sort-nav").classList.remove("active");

        // Restart the normal quiz and fix the sidebar highlight
        let cat = "All";
        try { cat = currentCategory === "Daily Challenge" ? "All" : currentCategory; } catch (e) {}

        try { startGame(cat); } catch (e) {}

        const match = document.querySelector('.nav-item[data-category="' + cat + '"]')
            || document.querySelector('.nav-item[data-category="All"]');
        if (match) match.classList.add("active");
    }

    function startRound() {
        clearInterval(timerId);
        clearTimeout(nextId);

        state.items = shuf(COUNTRIES).slice(0, ROUND_SIZE);
        state.index = 0;
        state.score = 0;
        state.streak = 0;
        state.correct = 0;
        state.counts = {};
        CONTINENTS.forEach(c => state.counts[c.name] = 0);

        $id("sort-end").classList.add("hidden");
        $id("sort-best").textContent = Number(localStorage.getItem("worldSortBest") || 0);

        updateCounts();
        showCard();
    }

    function updateHeader() {
        $id("sort-round").textContent =
            Math.min(state.index + 1, state.items.length) + "/" + state.items.length;
        $id("sort-score").textContent = state.score;
        $id("sort-streak").textContent = state.streak;
    }

    function updateCounts() {
        CONTINENTS.forEach(c => {
            const el = screen.querySelector('[data-count="' + c.name + '"]');
            if (el) el.textContent = state.counts[c.name];
        });
    }

    function showCard() {
        const [code, name] = state.items[state.index];

        // reset bins and card
        screen.querySelectorAll(".sort-bin").forEach(b => b.classList.remove("sort-right", "sort-bad", "over"));
        $id("sort-feedback").textContent = "";

        card.className = "";
        card.style.transform = "";
        card.innerHTML = "";

        const img = document.createElement("img");
        img.src = "https://flagcdn.com/w320/" + code + ".png";
        img.alt = "Flag of " + name;
        img.draggable = false;
        img.onerror = () => {
            const emoji = document.createElement("div");
            emoji.className = "sort-emoji";
            emoji.textContent = "🏳️";
            img.replaceWith(emoji);
        };

        const label = document.createElement("strong");
        label.textContent = name;

        card.append(img, label);

        state.locked = false;
        state.timeLeft = CARD_TIME;
        updateHeader();
        startTimer();
    }

    function startTimer() {
        clearInterval(timerId);

        const fill = $id("sort-timer-fill");
        fill.style.width = "100%";
        fill.classList.remove("danger");

        let lastWhole = CARD_TIME;

        timerId = setInterval(() => {
            state.timeLeft -= 0.1;

            fill.style.width = Math.max(0, state.timeLeft / CARD_TIME * 100) + "%";
            fill.classList.toggle("danger", state.timeLeft <= 3);

            const whole = Math.ceil(state.timeLeft);
            if (whole !== lastWhole && whole <= 3 && whole > 0) sfx("tick");
            lastWhole = whole;

            if (state.timeLeft <= 0) {
                clearInterval(timerId);
                answer(null);
            }
        }, 100);
    }

    function answer(continent) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(timerId);

        const [, name, right] = state.items[state.index];
        const ok = continent === right;
        const feedback = $id("sort-feedback");

        // mark the bins
        screen.querySelectorAll(".sort-bin").forEach(bin => {
            if (bin.dataset.continent === right) bin.classList.add("sort-right");
            else if (bin.dataset.continent === continent) bin.classList.add("sort-bad");
        });

        if (ok) {
            state.streak++;
            state.correct++;
            state.counts[right]++;

            const points = 100
                + Math.round(Math.max(0, state.timeLeft)) * 5
                + Math.min(state.streak, 5) * 10;

            state.score += points;

            feedback.textContent = "🎉 Correct! +" + points + " points";
            feedback.style.color = "#48d89a";
            sfx("correct");
        } else {
            state.streak = 0;

            feedback.textContent = continent === null
                ? "⏰ Time's up! " + name + " is in " + right
                : "❌ " + name + " is in " + right;
            feedback.style.color = "#ff7185";
            sfx(continent === null ? "timeup" : "wrong");
        }

        card.classList.add("placed");
        updateCounts();
        updateHeader();

        nextId = setTimeout(() => {
            state.index++;
            if (state.index >= state.items.length) finish();
            else showCard();
        }, NEXT_DELAY);
    }

    function finish() {
        const best = Number(localStorage.getItem("worldSortBest") || 0);
        const newBest = state.score > best;
        if (newBest) localStorage.setItem("worldSortBest", state.score);

        // XP: 10 per correct, +50 for a perfect round
        let xp = state.correct * 10;
        if (state.correct === state.items.length) xp += 50;

        try { addXP(xp); } catch (e) {}

        $id("sort-best").textContent = Math.max(best, state.score);
        $id("sort-final").textContent = state.score;
        $id("sort-final-detail").textContent =
            state.correct + " / " + state.items.length + " correct  •  +" + xp + " XP" +
            (newBest ? "  •  New best score!" : "");

        $id("sort-end").classList.remove("hidden");
        sfx("finish");

        try { showToast("Continent Sort: +" + xp + " XP", "fa-earth-europe", true); } catch (e) {}
    }


    // ---------- sidebar button ----------

    const navButton = document.createElement("button");
    navButton.className = "nav-item";
    navButton.id = "sort-nav";
    navButton.innerHTML = '<i class="fa-solid fa-layer-group"></i> Continent Sort';

    const anchor = $id("map-nav") || document.querySelector(".sidebar-bottom");
    anchor.parentNode.insertBefore(navButton, anchor);

    navButton.addEventListener("click", event => {
        event.stopPropagation();   // keep other menu scripts from reacting to this button
        sfx("nav");
        open();
    });

})();