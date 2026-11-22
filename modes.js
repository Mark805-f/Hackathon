// =====================================
// modes.js - Timed Blitz + Higher or Lower
// Needs script.js to be loaded first.
// =====================================

(function () {

    // ---------- SETTINGS (change these freely) ----------

    const BLITZ_SECONDS = 60;     // length of a Blitz round
    const BLITZ_PENALTY = 5;      // seconds lost for a wrong answer
    const HL_XP_PER_STREAK = 5;   // XP earned per correct guess

    // ---------- DATA FOR HIGHER OR LOWER (approximate figures) ----------
    // [flag code, name, population, area in km2]

    const HL_DATA = [
        ["cn", "China", 1410000000, 9597000],
        ["in", "India", 1430000000, 3287000],
        ["us", "United States", 335000000, 9834000],
        ["id", "Indonesia", 277000000, 1905000],
        ["pk", "Pakistan", 240000000, 882000],
        ["ng", "Nigeria", 224000000, 924000],
        ["br", "Brazil", 216000000, 8516000],
        ["bd", "Bangladesh", 173000000, 148000],
        ["ru", "Russia", 144000000, 17098000],
        ["et", "Ethiopia", 126000000, 1104000],
        ["mx", "Mexico", 129000000, 1964000],
        ["jp", "Japan", 124000000, 378000],
        ["eg", "Egypt", 112000000, 1002000],
        ["vn", "Vietnam", 100000000, 331000],
        ["ir", "Iran", 89000000, 1648000],
        ["tr", "Turkey", 85000000, 784000],
        ["de", "Germany", 84000000, 358000],
        ["th", "Thailand", 71000000, 513000],
        ["gb", "United Kingdom", 68000000, 244000],
        ["fr", "France", 68000000, 551000],
        ["za", "South Africa", 60000000, 1221000],
        ["it", "Italy", 59000000, 301000],
        ["ke", "Kenya", 55000000, 580000],
        ["co", "Colombia", 52000000, 1142000],
        ["kr", "South Korea", 51000000, 100000],
        ["es", "Spain", 48000000, 506000],
        ["ar", "Argentina", 46000000, 2780000],
        ["ca", "Canada", 40000000, 9985000],
        ["pl", "Poland", 37000000, 313000],
        ["sa", "Saudi Arabia", 36000000, 2150000],
        ["pe", "Peru", 34000000, 1285000],
        ["au", "Australia", 26500000, 7692000],
        ["kz", "Kazakhstan", 20000000, 2725000],
        ["cl", "Chile", 19600000, 756000],
        ["cu", "Cuba", 11000000, 110000],
        ["se", "Sweden", 10500000, 450000],
        ["gr", "Greece", 10400000, 132000],
        ["pt", "Portugal", 10300000, 92000],
        ["ch", "Switzerland", 8800000, 41000],
        ["fi", "Finland", 5600000, 338000],
        ["no", "Norway", 5500000, 385000],
        ["ie", "Ireland", 5300000, 70000],
        ["nz", "New Zealand", 5200000, 268000],
        ["mn", "Mongolia", 3400000, 1564000],
        ["al", "Albania", 2800000, 28700]
    ];

    const HL_STATS = {
        population: {
            label: "population",
            title: "POPULATION",
            index: 2,
            format: n => n.toLocaleString("en-US")
        },
        area: {
            label: "total area",
            title: "TOTAL AREA",
            index: 3,
            format: n => n.toLocaleString("en-US") + " km²"
        }
    };

    const flagUrl = code => "https://flagcdn.com/w320/" + code + ".png";


    // ---------- BUILD THE SCREENS AND SIDEBAR BUTTONS ----------

    function buildUI() {

        const holder = document.createElement("div");

        holder.innerHTML = `
        <!-- TIMED BLITZ -->
        <div id="blitz-screen" class="mode-screen hidden">
            <div class="mode-box">

                <div class="mode-top">
                    <div>
                        <p class="mode-label">TIMED BLITZ</p>
                        <h2 class="mode-title">Answer as fast as you can!</h2>
                    </div>

                    <div class="mode-info">
                        <span>Time <strong id="blitz-time">60</strong></span>
                        <span>Score <strong id="blitz-score">0</strong></span>
                        <span>Streak <strong id="blitz-streak">0</strong></span>
                    </div>

                    <button class="mode-close" id="blitz-close" aria-label="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="blitz-bar"><div id="blitz-bar-fill"></div></div>

                <div id="blitz-visual" class="question-visual"></div>
                <h3 id="blitz-question" class="mode-question"></h3>
                <div id="blitz-answers" class="blitz-answers"></div>
                <p id="blitz-feedback" class="mode-feedback"></p>
                <p class="mode-help">Wrong answers cost you time. Keys A-D or 1-4 also work. Esc closes.</p>

                <div id="blitz-end" class="mode-end hidden">
                    <i class="fa-solid fa-bolt mode-end-icon"></i>
                    <h2>Time's up!</h2>
                    <p class="mode-big" id="blitz-final-score">0</p>
                    <p id="blitz-final-details"></p>
                    <p id="blitz-final-best" class="mode-best"></p>
                    <button id="blitz-again" class="mode-button">Play Again</button>
                </div>
            </div>
        </div>

        <!-- HIGHER OR LOWER -->
        <div id="hl-screen" class="mode-screen hidden">
            <div class="mode-box">

                <div class="mode-top">
                    <div>
                        <p class="mode-label">HIGHER OR LOWER</p>
                        <h2 class="mode-title" id="hl-title">Which is bigger?</h2>
                    </div>

                    <div class="mode-info">
                        <span>Streak <strong id="hl-streak">0</strong></span>
                        <span>Best <strong id="hl-best">0</strong></span>
                    </div>

                    <button class="mode-close" id="hl-close" aria-label="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="hl-cards">
                    <div class="hl-card" id="hl-left"></div>
                    <div class="hl-vs">VS</div>
                    <div class="hl-card" id="hl-right"></div>
                </div>

                <div class="hl-buttons">
                    <button id="hl-higher" class="hl-btn hl-up">
                        <i class="fa-solid fa-arrow-up"></i> Higher
                    </button>
                    <button id="hl-lower" class="hl-btn hl-down">
                        <i class="fa-solid fa-arrow-down"></i> Lower
                    </button>
                </div>

                <p id="hl-feedback" class="mode-feedback"></p>
                <p class="mode-help">Figures are approximate. Keys H (higher) and L (lower) also work.</p>

                <div id="hl-end" class="mode-end hidden">
                    <i class="fa-solid fa-up-down mode-end-icon"></i>
                    <h2>Game over!</h2>
                    <p class="mode-big" id="hl-final-streak">0</p>
                    <p>correct in a row</p>
                    <p id="hl-final-best" class="mode-best"></p>
                    <button id="hl-again" class="mode-button">Play Again</button>
                </div>
            </div>
        </div>
        `;

        while (holder.firstChild) {
            document.body.appendChild(holder.firstChild);
        }

        // Sidebar buttons
        const sidebar = document.querySelector(".sidebar");
        const bottom = document.querySelector(".sidebar-bottom");

        [
            ["blitz-nav", "fa-bolt", "Timed Blitz"],
            ["hl-nav", "fa-up-down", "Higher or Lower"]
        ].forEach(([id, icon, text]) => {

            const button = document.createElement("button");
            button.className = "nav-item mode-nav";
            button.id = id;

            const i = document.createElement("i");
            i.className = "fa-solid " + icon;

            button.append(i, " " + text);
            sidebar.insertBefore(button, bottom);
        });
    }

    buildUI();


    // ---------- SHARED HELPERS ----------

    function setVisual(element, q) {

        element.innerHTML = "";

        if (q.flag) {
            const img = document.createElement("img");
            img.className = "flag-img";
            img.src = "https://flagcdn.com/w320/" + q.flag + ".png";
            img.alt = "Country flag";
            img.onerror = () => { element.textContent = q.visual; };
            element.appendChild(img);
        } else {
            element.textContent = q.visual;
        }
    }

    // Stops the normal quiz timer while a mode is open
    function pauseMainQuiz() {
        clearInterval(timerInterval);
    }

    // Closes a mode and starts a fresh normal round behind it
    function closeMode(screenId) {

        blitzActive = false;
        hlActive = false;
        clearInterval(blitzTimer);

        $(screenId).classList.add("hidden");

        startGame(currentCategory === "Daily Challenge" ? "All" : currentCategory);
    }


    // =====================================
    // TIMED BLITZ
    // =====================================

    let blitzActive = false;
    let blitzTimer = null;
    let blitzPool = [];
    let blitzQuestion = null;
    let blitzLocked = false;
    let blitzTime = BLITZ_SECONDS;
    let blitzScore = 0;
    let blitzStreak = 0;
    let blitzCorrect = 0;
    let blitzTotal = 0;

    function openBlitz() {
        pauseMainQuiz();
        $("blitz-screen").classList.remove("hidden");
        startBlitz();
    }

    function startBlitz() {

        clearInterval(blitzTimer);

        blitzPool = shuffle(questions);
        blitzTime = BLITZ_SECONDS;
        blitzScore = 0;
        blitzStreak = 0;
        blitzCorrect = 0;
        blitzTotal = 0;
        blitzActive = true;

        $("blitz-end").classList.add("hidden");
        $("blitz-feedback").textContent = "";

        updateBlitzInfo();
        nextBlitzQuestion();

        blitzTimer = setInterval(() => {

            blitzTime--;
            updateBlitzInfo();

            if (blitzTime <= 0) endBlitz();

        }, 1000);
    }

    function updateBlitzInfo() {

        $("blitz-time").textContent = Math.max(0, blitzTime);
        $("blitz-time").classList.toggle("danger", blitzTime <= 10);
        $("blitz-score").textContent = blitzScore;
        $("blitz-streak").textContent = blitzStreak;

        $("blitz-bar-fill").style.width =
            (Math.max(0, blitzTime) / BLITZ_SECONDS * 100) + "%";
    }

    function nextBlitzQuestion() {

        if (!blitzActive) return;

        // Reshuffle if we run out of questions
        if (blitzPool.length === 0) blitzPool = shuffle(questions);

        blitzQuestion = blitzPool.pop();

        if (blitzQuestion.flag) refreshFlagAnswers(blitzQuestion);

        blitzLocked = false;

        setVisual($("blitz-visual"), blitzQuestion);
        $("blitz-question").textContent = blitzQuestion.question;
        $("blitz-feedback").textContent = "";

        const container = $("blitz-answers");
        container.innerHTML = "";

        shuffle(blitzQuestion.answers).forEach((answer, index) => {

            const button = document.createElement("button");
            button.className = "blitz-answer";
            button.dataset.answer = answer;

            const key = document.createElement("span");
            key.className = "key";
            key.textContent = String.fromCharCode(65 + index);

            const label = document.createElement("span");
            label.textContent = answer;

            button.append(key, label);
            button.addEventListener("click", () => answerBlitz(answer, button));

            container.appendChild(button);
        });
    }

    function answerBlitz(answer, button) {

        if (!blitzActive || blitzLocked) return;

        blitzLocked = true;
        blitzTotal++;

        const feedback = $("blitz-feedback");

        if (answer === blitzQuestion.correct) {

            blitzStreak++;
            blitzCorrect++;

            // 10 points, plus a small bonus for a streak (max +10)
            const points = 10 + Math.min(blitzStreak - 1, 5) * 2;
            blitzScore += points;

            button.classList.add("correct");
            feedback.textContent = "✅ +" + points;
            feedback.style.color = "#48d89a";

            updateBlitzInfo();
            setTimeout(nextBlitzQuestion, 450);

        } else {

            blitzStreak = 0;
            blitzTime = Math.max(0, blitzTime - BLITZ_PENALTY);

            button.classList.add("wrong");

            document.querySelectorAll(".blitz-answer").forEach(b => {
                if (b.dataset.answer === blitzQuestion.correct) {
                    b.classList.add("correct");
                }
            });

            feedback.textContent = "❌ -" + BLITZ_PENALTY + " seconds";
            feedback.style.color = "#ff7185";

            updateBlitzInfo();

            if (blitzTime <= 0) {
                endBlitz();
            } else {
                setTimeout(nextBlitzQuestion, 900);
            }
        }
    }

    function endBlitz() {

        if (!blitzActive) return;

        blitzActive = false;
        clearInterval(blitzTimer);
        blitzTime = Math.max(0, blitzTime);
        updateBlitzInfo();

        const best = Number(localStorage.getItem("worldBlitzBest") || 0);
        const isNewBest = blitzScore > best;

        if (isNewBest) localStorage.setItem("worldBlitzBest", blitzScore);

        const xp = Math.round(blitzScore / 4);

        $("blitz-final-score").textContent = blitzScore;
        $("blitz-final-details").textContent =
            blitzCorrect + " correct out of " + blitzTotal +
            (xp > 0 ? "  •  +" + xp + " XP" : "");

        $("blitz-final-best").textContent = isNewBest
            ? "🏆 New personal best!"
            : "Personal best: " + best;

        $("blitz-end").classList.remove("hidden");

        if (xp > 0) addXP(xp);
    }

    $("blitz-nav").addEventListener("click", openBlitz);
    $("blitz-again").addEventListener("click", startBlitz);
    $("blitz-close").addEventListener("click", () => closeMode("blitz-screen"));


    // =====================================
    // HIGHER OR LOWER
    // =====================================

    let hlActive = false;
    let hlLocked = false;
    let hlLeft = null;
    let hlRight = null;
    let hlStat = HL_STATS.population;
    let hlStreak = 0;

    function openHL() {
        pauseMainQuiz();
        $("hl-screen").classList.remove("hidden");
        startHL();
    }

    function startHL() {

        hlActive = true;
        hlStreak = 0;
        hlLeft = HL_DATA[Math.floor(Math.random() * HL_DATA.length)];

        $("hl-end").classList.add("hidden");
        $("hl-best").textContent = localStorage.getItem("worldHLBest") || 0;

        newHLRound();
    }

    // Picks a country whose value is clearly different (no near-ties)
    function pickHLRight(left, stat) {

        const options = HL_DATA.filter(country => {
            if (country === left) return false;

            const a = country[stat.index];
            const b = left[stat.index];

            return Math.max(a, b) / Math.min(a, b) > 1.08;
        });

        return options[Math.floor(Math.random() * options.length)];
    }

    function newHLRound() {

        hlLocked = false;

        hlStat = Math.random() < 0.5 ? HL_STATS.population : HL_STATS.area;
        hlRight = pickHLRight(hlLeft, hlStat);

        $("hl-title").textContent =
            "Does " + hlRight[1] + " have a higher or lower " +
            hlStat.label + " than " + hlLeft[1] + "?";

        renderHLCard($("hl-left"), hlLeft, true);
        renderHLCard($("hl-right"), hlRight, false);

        $("hl-streak").textContent = hlStreak;
        $("hl-feedback").textContent = "";

        $("hl-higher").disabled = false;
        $("hl-lower").disabled = false;
    }

    function renderHLCard(card, country, showValue) {

        card.className = "hl-card";
        card.innerHTML = "";

        const img = document.createElement("img");
        img.className = "flag-img";
        img.src = flagUrl(country[0]);
        img.alt = "Flag of " + country[1];

        const name = document.createElement("h3");
        name.textContent = country[1];

        const stat = document.createElement("p");
        stat.className = "hl-stat";
        stat.textContent = hlStat.title;

        const value = document.createElement("p");
        value.className = "hl-value";
        value.textContent = showValue
            ? hlStat.format(country[hlStat.index])
            : "?";

        card.append(img, name, stat, value);
    }

    function guessHL(guess) {

        if (!hlActive || hlLocked) return;

        hlLocked = true;

        $("hl-higher").disabled = true;
        $("hl-lower").disabled = true;

        const leftValue = hlLeft[hlStat.index];
        const rightValue = hlRight[hlStat.index];

        const isCorrect = (guess === "higher") === (rightValue > leftValue);

        // Reveal the hidden number
        const card = $("hl-right");
        card.querySelector(".hl-value").textContent = hlStat.format(rightValue);
        card.classList.add(isCorrect ? "hl-correct" : "hl-wrong");

        const feedback = $("hl-feedback");

        if (isCorrect) {

            hlStreak++;
            $("hl-streak").textContent = hlStreak;

            feedback.textContent = "✅ Correct!";
            feedback.style.color = "#48d89a";

            setTimeout(() => {
                if (!hlActive) return;
                hlLeft = hlRight;      // the revealed country becomes the new reference
                newHLRound();
            }, 1400);

        } else {

            feedback.textContent = "❌ Wrong!";
            feedback.style.color = "#ff7185";

            setTimeout(endHL, 1600);
        }
    }

    function endHL() {

        if (!hlActive) return;

        hlActive = false;

        const best = Number(localStorage.getItem("worldHLBest") || 0);
        const isNewBest = hlStreak > best;

        if (isNewBest) localStorage.setItem("worldHLBest", hlStreak);

        $("hl-best").textContent = Math.max(best, hlStreak);
        $("hl-final-streak").textContent = hlStreak;

        const xp = hlStreak * HL_XP_PER_STREAK;

        $("hl-final-best").textContent =
            (isNewBest && hlStreak > 0 ? "🏆 New personal best!" : "Personal best: " + best) +
            (xp > 0 ? "  •  +" + xp + " XP" : "");

        $("hl-end").classList.remove("hidden");

        if (xp > 0) addXP(xp);
    }

    $("hl-nav").addEventListener("click", openHL);
    $("hl-again").addEventListener("click", startHL);
    $("hl-close").addEventListener("click", () => closeMode("hl-screen"));
    $("hl-higher").addEventListener("click", () => guessHL("higher"));
    $("hl-lower").addEventListener("click", () => guessHL("lower"));


    // =====================================
    // KEYBOARD (runs before the main quiz shortcuts)
    // =====================================

    document.addEventListener("keydown", event => {

        const blitzOpen = !$("blitz-screen").classList.contains("hidden");
        const hlOpen = !$("hl-screen").classList.contains("hidden");

        if (!blitzOpen && !hlOpen) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        // Stop the normal quiz from also reacting to these keys
        event.stopImmediatePropagation();

        const key = event.key.toLowerCase();

        if (key === "escape") {
            closeMode(blitzOpen ? "blitz-screen" : "hl-screen");
            return;
        }

        if (key.length !== 1) return;

        if (blitzOpen) {

            let index = "abcd".indexOf(key);
            if (index < 0) index = "1234".indexOf(key);

            const button = document.querySelectorAll(".blitz-answer")[index];

            if (index >= 0 && button) button.click();
        }

        if (hlOpen) {
            if (key === "h") guessHL("higher");
            if (key === "l") guessHL("lower");
        }

    }, true);

})();