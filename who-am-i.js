// =====================================
// WORLD CHALLENGE - who-am-i.js
// Guess the mystery from clues. Fewer clues = more points.
// Add <script src="who-am-i.js"></script> AFTER all other scripts.
// Uses from script.js: shuffle, addXP, showToast, startGame, currentCategory
// =====================================

(function () {

    // ---------- settings ----------

    const ROUND_SIZE = 8;        // mysteries per round
    const CLUE_TIME = 8;         // seconds before the next clue appears by itself
    const MAX_CLUES = 5;
    const MAX_GUESSES = 2;       // wrong guesses allowed per mystery (the 2nd wrong one ends it)
    const NEXT_DELAY = 2200;     // pause after each mystery (ms)

    const CAT_STYLE = {
        Country:  { icon: "fa-flag",     color: "#61d4f1" },
        City:     { icon: "fa-city",     color: "#ff9d52" },
        Landmark: { icon: "fa-landmark", color: "#ffd166" },
        Person:   { icon: "fa-user",     color: "#a78bfa" }
    };

    // [answer, category, [5 clues: hardest first, easiest last]]
    const ENTRIES = [

        // ---- COUNTRIES ----
        ["Japan", "Country", [
            "I am made up of thousands of islands, more than 6,000 of them.",
            "My high-speed trains are called Shinkansen.",
            "My most famous mountain is a snow-capped volcano called Fuji.",
            "My capital city is Tokyo.",
            "My flag is a red circle on a white background."
        ]],
        ["Brazil", "Country", [
            "Portuguese is my official language, which is unusual in my region.",
            "A huge part of the Amazon rainforest lies inside my borders.",
            "My capital, Brasília, was purpose-built and opened in 1960.",
            "I hosted the Summer Olympics in Rio de Janeiro in 2016.",
            "I am the largest country in South America."
        ]],
        ["Egypt", "Country", [
            "Almost all of my people live along a single river.",
            "A famous canal that I control links the Mediterranean Sea and the Red Sea.",
            "My capital city is Cairo.",
            "Ancient pharaohs once ruled my land.",
            "The pyramids of Giza stand in my desert."
        ]],
        ["Australia", "Country", [
            "My capital is not my biggest city; that is a common mistake.",
            "A giant coral reef runs along my northeast coast.",
            "Kangaroos and koalas are native to me.",
            "Sydney is home to my famous Opera House.",
            "I am both a country and a continent."
        ]],
        ["Switzerland", "Country", [
            "I have four national languages: German, French, Italian and Romansh.",
            "My capital city is Bern.",
            "I am landlocked in the middle of Europe.",
            "I am famous for chocolate, cheese and watches.",
            "Much of my land is covered by the Alps."
        ]],
        ["Italy", "Country", [
            "Two tiny independent states exist inside or on the edge of my borders.",
            "One of my cities has canals instead of streets.",
            "The Colosseum is one of my most famous ruins.",
            "Pizza was born in my city of Naples.",
            "I am shaped like a boot."
        ]],
        ["India", "Country", [
            "Hindi and English are my two official languages at the national level.",
            "Cricket is wildly popular among my people.",
            "The Taj Mahal stands in my city of Agra.",
            "My capital city is New Delhi.",
            "In 2023 I became the most populous country in the world."
        ]],
        ["Kosovo", "Country", [
            "I use the euro as my currency even though I am not in the European Union.",
            "I declared independence in 2008.",
            "I share borders with Albania, North Macedonia, Montenegro and Serbia.",
            "A famous monument in my capital spells out the word NEWBORN.",
            "My capital city is Pristina."
        ]],

        // ---- CITIES ----
        ["Paris", "City", [
            "I am home to the most visited art museum in the world.",
            "The Seine river flows through my centre.",
            "The cathedral of Notre-Dame stands on one of my islands.",
            "I am nicknamed the City of Light.",
            "A tall iron tower is my best-known symbol."
        ]],
        ["Rome", "City", [
            "I was built across seven hills.",
            "An entire independent country lies inside my borders.",
            "Visitors throw coins over their shoulder into my Trevi Fountain.",
            "I have an ancient amphitheatre where gladiators once fought.",
            "They say all roads lead to me."
        ]],
        ["New York", "City", [
            "I am made up of five boroughs.",
            "A giant green statue stands in my harbour.",
            "I have a huge rectangular park right in the middle of Manhattan.",
            "Times Square is one of my busiest spots.",
            "My nickname is the Big Apple."
        ]],
        ["Istanbul", "City", [
            "I am the largest city in my country, but I am not its capital.",
            "The Hagia Sophia is one of my most famous buildings.",
            "A strait called the Bosphorus runs through me.",
            "I used to be called Constantinople.",
            "I sit on two continents, Europe and Asia."
        ]],
        ["Venice", "City", [
            "I am built across about 118 small islands.",
            "My main street is called the Grand Canal.",
            "St Mark's Square is my most famous plaza.",
            "People travel through me in gondolas.",
            "I am the Italian city of canals."
        ]],
        ["Tokyo", "City", [
            "I used to be called Edo.",
            "People love to watch the huge crowd cross at Shibuya.",
            "A broadcasting tower called the Skytree stands in me.",
            "I am the centre of the largest metropolitan area in the world.",
            "I am the capital of Japan."
        ]],
        ["Dubai", "City", [
            "I am not the capital of my country; Abu Dhabi is.",
            "I have a man-made island shaped like a palm tree.",
            "I am home to the Burj Khalifa, the tallest building in the world.",
            "I grew from a small desert town into a global city.",
            "I am the largest city in the United Arab Emirates."
        ]],

        // ---- LANDMARKS ----
        ["Eiffel Tower", "Landmark", [
            "I was built as the entrance to the 1889 World's Fair.",
            "I was only supposed to stand for about 20 years.",
            "I am named after the engineer whose company built me.",
            "I am roughly 330 metres tall.",
            "I stand in Paris, France."
        ]],
        ["Great Wall of China", "Landmark", [
            "Many dynasties built and rebuilt me over centuries.",
            "A popular myth says I can be seen from space, which is not true.",
            "My brick sections near Beijing, such as Badaling, were rebuilt in the Ming era.",
            "I stretch for thousands of kilometres.",
            "I was built to protect the northern border of China."
        ]],
        ["Colosseum", "Landmark", [
            "Emperor Vespasian started building me.",
            "I opened around 80 AD.",
            "I could hold roughly 50,000 spectators.",
            "Gladiators fought inside me.",
            "I am the huge ancient amphitheatre of Rome."
        ]],
        ["Taj Mahal", "Landmark", [
            "A Mughal emperor named Shah Jahan had me built.",
            "I stand on the banks of the Yamuna River.",
            "I am made of gleaming white marble.",
            "I was built as a tomb for an emperor's beloved wife.",
            "I am in Agra, India."
        ]],
        ["Machu Picchu", "Landmark", [
            "An explorer named Hiram Bingham made me world-famous in 1911.",
            "The Inca built me in the 15th century.",
            "I sit about 2,400 metres above sea level in the Andes.",
            "Llamas roam across my stone terraces.",
            "I am a lost city of the Incas in Peru."
        ]],
        ["Pyramids of Giza", "Landmark", [
            "My largest pyramid was the tallest man-made structure for around 3,800 years.",
            "I am the only one of the Seven Wonders of the Ancient World that still stands.",
            "My largest pyramid was built for the pharaoh Khufu.",
            "A giant statue with a lion's body and human head guards me.",
            "I stand near Cairo, Egypt."
        ]],
        ["Statue of Liberty", "Landmark", [
            "A sculptor named Bartholdi designed me.",
            "I am made of copper, which turned green with age.",
            "The engineer Gustave Eiffel designed my inner framework.",
            "I was a gift from France in 1886.",
            "I stand in New York Harbor holding a torch."
        ]],
        ["Sydney Opera House", "Landmark", [
            "A Danish architect named Jørn Utzon designed me.",
            "I officially opened in 1973.",
            "My roof looks like giant white sails or shells.",
            "I stand on Sydney Harbour.",
            "I am the most famous building in Australia."
        ]],

        // ---- PEOPLE ----
        ["Albert Einstein", "Person", [
            "In 1952 I was offered the presidency of Israel and I declined.",
            "I won the Nobel Prize in Physics in 1921 for explaining the photoelectric effect.",
            "I developed the theory of general relativity.",
            "My most famous equation is E = mc².",
            "I am known for my wild white hair and genius intellect."
        ]],
        ["Marie Curie", "Person", [
            "I was born in Warsaw, Poland.",
            "I discovered two elements: polonium and radium.",
            "I am the only person to win Nobel Prizes in two different sciences.",
            "I was the first woman to win a Nobel Prize.",
            "I pioneered research into radioactivity."
        ]],
        ["Leonardo da Vinci", "Person", [
            "I was born in 1452 in a small Italian town called Vinci.",
            "I wrote my notebooks in mirror writing.",
            "I painted The Last Supper.",
            "I drew the Vitruvian Man.",
            "I painted the Mona Lisa."
        ]],
        ["Isaac Newton", "Person", [
            "Late in life I became Master of the Royal Mint.",
            "I developed calculus at about the same time as Leibniz.",
            "I wrote the Principia Mathematica.",
            "I described three laws of motion.",
            "A falling apple is said to have inspired my theory of gravity."
        ]],
        ["Nikola Tesla", "Person", [
            "I was born in a village in what is now Croatia.",
            "I worked for Thomas Edison for a short time.",
            "I invented a coil that bears my name and makes sparks.",
            "I championed alternating current for power systems.",
            "A famous electric car company is named after me."
        ]],
        ["Cleopatra", "Person", [
            "My family was Greek, not Egyptian, by ancestry.",
            "I was the first of my family in generations to learn the Egyptian language.",
            "I allied myself with Julius Caesar and later Mark Antony.",
            "I died in 30 BC.",
            "I was the last pharaoh of ancient Egypt."
        ]],
        ["Neil Armstrong", "Person", [
            "I was a naval aviator during the Korean War.",
            "I performed the first docking of two spacecraft in orbit on Gemini 8.",
            "I commanded the Apollo 11 mission.",
            "In July 1969 I became the first person to walk on the Moon.",
            "I called it one small step for man."
        ]],
        ["Frida Kahlo", "Person", [
            "I lived in a blue house in Coyoacán, Mexico City.",
            "I married the famous muralist Diego Rivera.",
            "A bus accident when I was 18 left me in lifelong pain.",
            "Many of my paintings are self-portraits.",
            "I am one of Mexico's most famous painters."
        ]]
    ];


    // ---------- helpers ----------

    const $id = id => document.getElementById(id);
    const sfx = name => { if (window.playSound) window.playSound(name); };
    const shuf = arr => (typeof shuffle === "function")
        ? shuffle(arr)
        : [...arr].sort(() => Math.random() - 0.5);

    const state = {
        items: [], index: 0, score: 0, streak: 0, correct: 0,
        shown: 1, guesses: 0, locked: true, timeLeft: CLUE_TIME, options: []
    };

    let timerId = null;
    let nextId = null;
    let built = false;
    let screen;


    // ---------- styles ----------

    const style = document.createElement("style");
    style.textContent = `
    .who-screen {
        position: fixed; inset: 0; z-index: 60; overflow-y: auto;
        background: rgba(7, 13, 25, 0.97); display: flex; padding: 20px;
    }
    .who-box {
        position: relative; margin: auto; width: min(100%, 780px);
        background: #18263c; border: 1px solid #405675; border-radius: 20px; padding: 25px;
    }
    .who-top { display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
    .who-label { color: #61d4f1; font-size: 11px; letter-spacing: 3px; font-weight: bold; }
    .who-title { font-size: clamp(24px, 4vw, 34px); color: #ffd166; margin-top: 6px; }
    .who-info { display: flex; gap: 18px; color: #91a2bd; font-size: 13px; flex-wrap: wrap; }
    .who-info strong { color: #61d4f1; }
    #who-close {
        background: #263852; color: #fff; border: 1px solid #3b506d;
        width: 40px; height: 40px; border-radius: 10px; cursor: pointer;
    }
    .who-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; gap: 10px; flex-wrap: wrap; }
    #who-chip {
        display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: bold;
        letter-spacing: 1.5px; padding: 7px 14px; border-radius: 20px;
        background: #263852; border: 1px solid var(--c, #3b506d); color: var(--c, #fff);
    }
    #who-worth { font-size: 13px; color: #91a2bd; }
    #who-worth strong { color: #ffd166; font-size: 17px; }
    .who-timer { height: 6px; background: #30415b; border-radius: 20px; margin: 12px 0 18px; overflow: hidden; }
    #who-timer-fill { height: 100%; width: 100%; background: linear-gradient(90deg, #53c8e8, #8d83ff); border-radius: 20px; }
    #who-timer-fill.danger { background: #ff7185; }

    .who-clues { display: flex; flex-direction: column; gap: 10px; min-height: 290px; }
    .who-clue {
        display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px;
        background: #263852; border: 1px solid #3b506d; font-size: 15px; line-height: 1.5;
    }
    .who-clue .who-num {
        display: grid; place-items: center; flex-shrink: 0; width: 28px; height: 28px;
        border-radius: 8px; background: #1a2a42; color: #61d4f1; font-weight: bold; font-size: 13px;
    }
    .who-clue.new { animation: ansIn 0.45s both; border-color: #61d4f1; }
    .who-clue.locked { background: #1a2a42; border-style: dashed; color: #5d6f8c; font-size: 13px; }
    .who-clue.locked .who-num { background: #223452; color: #5d6f8c; }

    #who-feedback { min-height: 26px; text-align: center; font-weight: bold; margin: 14px 0 6px; }

    .who-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .who-option {
        display: flex; align-items: center; gap: 12px; text-align: left;
        background: #263852; border: 1px solid #3b506d; color: #fff;
        border-radius: 12px; padding: 16px; cursor: pointer; font-size: 15px; transition: 0.2s;
    }
    .who-option .key {
        display: grid; place-items: center; flex-shrink: 0; width: 26px; height: 26px;
        border-radius: 8px; background: #1a2a42; color: #61d4f1; font-size: 12px; font-weight: bold;
    }
    .who-option:hover:not(:disabled) { background: #304d70; border-color: #61d4f1; transform: translateY(-2px); }
    .who-option:disabled { cursor: default; }
    .who-option.correct { background: #176443; border-color: #48d89a; animation: pop 0.45s; }
    .who-option.wrong { background: #793444; border-color: #fa748b; animation: shake 0.4s; }
    .who-option.out { opacity: 0.25; }

    #who-reveal {
        display: block; margin: 16px auto 0; background: transparent; color: #61d4f1;
        border: 1px solid #3b5275; border-radius: 10px; padding: 11px 20px;
        font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s;
    }
    #who-reveal:hover:not(:disabled) { background: #233b58; }
    #who-reveal:disabled { opacity: 0.35; cursor: not-allowed; }
    .who-help { color: #7787a3; font-size: 11px; margin-top: 12px; text-align: center; }

    .who-end {
        position: absolute; inset: 0; background: rgba(12, 18, 32, 0.96); border-radius: 20px;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 20px;
    }
    .who-end .big { color: #61d4f1; font-size: 52px; font-weight: bold; }
    .who-end .sub { color: #91a2bd; font-size: 14px; }
    .who-end-buttons { display: flex; gap: 12px; margin-top: 10px; flex-wrap: wrap; justify-content: center; }
    .who-end button {
        background: #55c9e8; color: #102136; border: none; border-radius: 10px;
        padding: 14px 28px; font-weight: bold; cursor: pointer;
    }
    .who-end button.alt { background: #263852; color: #fff; border: 1px solid #3b506d; }

    @media (max-width: 550px) {
        .who-box { padding: 16px; }
        .who-options { grid-template-columns: 1fr; }
        .who-clue { font-size: 14px; padding: 12px; }
        .who-clues { min-height: 260px; }
    }
    `;
    document.head.appendChild(style);


    // ---------- build the screen (once) ----------

    function build() {
        if (built) return;
        built = true;

        screen = document.createElement("div");
        screen.id = "who-screen";
        screen.className = "who-screen hidden";

        screen.innerHTML = `
            <div class="who-box">
                <div class="who-top">
                    <div>
                        <p class="who-label">WHO AM I?</p>
                        <h2 class="who-title">Guess the mystery</h2>
                    </div>
                    <div class="who-info">
                        <span>Round <strong id="who-round">1/${ROUND_SIZE}</strong></span>
                        <span>Score <strong id="who-score">0</strong></span>
                        <span>Streak <strong id="who-streak">0</strong></span>
                        <span>Best <strong id="who-best">0</strong></span>
                    </div>
                    <button id="who-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div class="who-bar">
                    <span id="who-chip"></span>
                    <span id="who-worth"></span>
                </div>

                <div class="who-timer"><div id="who-timer-fill"></div></div>

                <div class="who-clues" id="who-clues"></div>

                <p id="who-feedback"></p>

                <div class="who-options" id="who-options"></div>

                <button id="who-reveal"><i class="fa-solid fa-lightbulb"></i> Reveal next clue (N)</button>

                <p class="who-help">Clue 1 is the hardest. Every extra clue lowers the points. Press 1-4 to answer. You get ${MAX_GUESSES} guesses.</p>

                <div id="who-end" class="who-end hidden">
                    <i class="fa-solid fa-user-secret" style="font-size:44px;color:#61d4f1"></i>
                    <h2>Who Am I? Complete!</h2>
                    <div class="big" id="who-final">0</div>
                    <p class="sub" id="who-final-detail"></p>
                    <div class="who-end-buttons">
                        <button id="who-again"><i class="fa-solid fa-rotate-right"></i> Play Again</button>
                        <button id="who-exit" class="alt">Back to Quiz</button>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(screen);

        $id("who-close").addEventListener("click", close);
        $id("who-exit").addEventListener("click", close);
        $id("who-again").addEventListener("click", startRound);
        $id("who-reveal").addEventListener("click", () => revealNext(false));

        // Keyboard: 1-4 answer, N reveals a clue, Escape closes.
        // Capture phase so the main quiz doesn't react to these keys behind this screen.
        document.addEventListener("keydown", event => {
            if (screen.classList.contains("hidden")) return;

            event.stopPropagation();

            const key = event.key.toLowerCase();

            if (key === "escape") return close();
            if (key === "n") return revealNext(false);

            const n = parseInt(key, 10);
            if (n >= 1 && n <= 4) {
                const button = $id("who-options").children[n - 1];
                if (button && !button.disabled) button.click();
            }
        }, true);
    }


    // ---------- game flow ----------

    function open() {
        build();

        // Pause the main quiz so its timer doesn't run behind this screen
        try { clearInterval(timerInterval); clearTimeout(autoNextTimeout); } catch (e) {}

        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
        $id("who-nav").classList.add("active");

        screen.classList.remove("hidden");
        startRound();
    }

    function close() {
        clearInterval(timerId);
        clearTimeout(nextId);
        screen.classList.add("hidden");
        $id("who-nav").classList.remove("active");

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

        state.items = shuf(ENTRIES).slice(0, ROUND_SIZE);
        state.index = 0;
        state.score = 0;
        state.streak = 0;
        state.correct = 0;

        $id("who-end").classList.add("hidden");
        $id("who-best").textContent = Number(localStorage.getItem("worldWhoBest") || 0);

        showMystery();
    }

    function updateHeader() {
        $id("who-round").textContent =
            Math.min(state.index + 1, state.items.length) + "/" + state.items.length;
        $id("who-score").textContent = state.score;
        $id("who-streak").textContent = state.streak;
    }

    function updateWorth() {
        $id("who-worth").innerHTML =
            "Worth <strong>" + ((MAX_CLUES + 1 - state.shown) * 100) + "</strong> points";
    }

    function renderClues(animateLast) {
        const [, , clues] = state.items[state.index];
        const box = $id("who-clues");
        box.innerHTML = "";

        clues.forEach((text, i) => {
            const div = document.createElement("div");
            const num = document.createElement("span");
            num.className = "who-num";
            num.textContent = i + 1;

            const p = document.createElement("span");

            if (i < state.shown) {
                div.className = "who-clue" + (animateLast && i === state.shown - 1 ? " new" : "");
                p.textContent = text;
            } else {
                div.className = "who-clue locked";
                p.textContent = "Clue " + (i + 1) + " is locked";
            }

            div.append(num, p);
            box.appendChild(div);
        });
    }

    function showMystery() {
        const [name, cat] = state.items[state.index];

        state.shown = 1;
        state.guesses = 0;
        state.locked = false;

        // chip
        const look = CAT_STYLE[cat];
        const chip = $id("who-chip");
        chip.style.setProperty("--c", look.color);
        chip.innerHTML = '<i class="fa-solid ' + look.icon + '"></i> ' + cat.toUpperCase();

        // options: the answer + 3 others of the same type
        const others = shuf(ENTRIES.filter(e => e[1] === cat && e[0] !== name)).slice(0, 3).map(e => e[0]);
        state.options = shuf([name, ...others]);

        const box = $id("who-options");
        box.innerHTML = "";

        state.options.forEach((option, i) => {
            const button = document.createElement("button");
            button.className = "who-option";
            button.dataset.answer = option;

            const key = document.createElement("span");
            key.className = "key";
            key.textContent = i + 1;

            const label = document.createElement("span");
            label.textContent = option;

            button.append(key, label);
            button.addEventListener("click", () => guess(option, button));
            box.appendChild(button);
        });

        $id("who-feedback").textContent = "";
        $id("who-reveal").disabled = false;

        renderClues(true);
        updateWorth();
        updateHeader();
        startClueTimer();
    }

    function startClueTimer() {
        clearInterval(timerId);

        const fill = $id("who-timer-fill");
        state.timeLeft = CLUE_TIME;
        fill.style.width = "100%";
        fill.classList.remove("danger");

        timerId = setInterval(() => {
            state.timeLeft -= 0.1;

            fill.style.width = Math.max(0, state.timeLeft / CLUE_TIME * 100) + "%";
            fill.classList.toggle("danger", state.timeLeft <= 3);

            if (state.timeLeft <= 0) {
                if (state.shown < MAX_CLUES) {
                    revealNext(true);
                } else {
                    finishMystery(null, null);
                }
            }
        }, 100);
    }

    function revealNext(auto) {
        if (state.locked || state.shown >= MAX_CLUES) return;

        state.shown++;
        renderClues(true);
        updateWorth();
        sfx("hint");

        $id("who-reveal").disabled = state.shown >= MAX_CLUES;

        startClueTimer();
    }

    function guess(option, button) {
        if (state.locked) return;

        const [name] = state.items[state.index];

        if (option === name) {
            finishMystery(option, button);
            return;
        }

        // wrong guess
        state.guesses++;
        button.disabled = true;
        button.classList.add("wrong");
        sfx("wrong");

        if (state.guesses >= MAX_GUESSES) {
            finishMystery(option, button);
            return;
        }

        $id("who-feedback").textContent = "❌ Not quite, here comes another clue...";
        $id("who-feedback").style.color = "#ff7185";

        if (state.shown < MAX_CLUES) revealNext(true);
    }

    function finishMystery(option, button) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(timerId);

        const [name] = state.items[state.index];
        const ok = option === name;
        const feedback = $id("who-feedback");
        const cluesUsed = state.shown;   // remember this before all clues are revealed

        // show every clue and mark the options
        state.shown = MAX_CLUES;
        renderClues(false);
        $id("who-reveal").disabled = true;

        $id("who-options").querySelectorAll(".who-option").forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === name) b.classList.add("correct");
            else if (!b.classList.contains("wrong")) b.classList.add("out");
        });

        if (ok) {
            const points = (MAX_CLUES + 1 - cluesUsed) * 100 + Math.min(state.streak, 5) * 20;

            state.score += points;
            state.streak++;
            state.correct++;

            feedback.textContent = "🎉 It's " + name + "! +" + points + " points";
            feedback.style.color = "#48d89a";
            sfx("correct");
        } else {
            state.streak = 0;

            feedback.textContent = option === null
                ? "⏰ Time's up! It was " + name
                : "❌ It was " + name;
            feedback.style.color = "#ff7185";

            if (option === null) sfx("timeup");
        }

        updateHeader();

        nextId = setTimeout(() => {
            state.index++;
            if (state.index >= state.items.length) finish();
            else showMystery();
        }, NEXT_DELAY);
    }

    function finish() {
        const best = Number(localStorage.getItem("worldWhoBest") || 0);
        const newBest = state.score > best;
        if (newBest) localStorage.setItem("worldWhoBest", state.score);

        // XP: 10 per correct, +50 for a perfect round
        let xp = state.correct * 10;
        if (state.correct === state.items.length) xp += 50;

        try { addXP(xp); } catch (e) {}

        $id("who-best").textContent = Math.max(best, state.score);
        $id("who-final").textContent = state.score;
        $id("who-final-detail").textContent =
            state.correct + " / " + state.items.length + " solved  •  +" + xp + " XP" +
            (newBest ? "  •  New best score!" : "");

        $id("who-end").classList.remove("hidden");
        sfx("finish");

        try { showToast("Who Am I?: +" + xp + " XP", "fa-user-secret", true); } catch (e) {}
    }


    // ---------- sidebar button ----------

    const navButton = document.createElement("button");
    navButton.className = "nav-item";
    navButton.id = "who-nav";
    navButton.innerHTML = '<i class="fa-solid fa-user-secret"></i> Who Am I?';

    const anchor = $id("sort-nav") || $id("map-nav") || document.querySelector(".sidebar-bottom");
    anchor.parentNode.insertBefore(navButton, anchor);

    navButton.addEventListener("click", event => {
        event.stopPropagation();   // keep other menu scripts from reacting to this button
        sfx("nav");
        open();
    });

})();