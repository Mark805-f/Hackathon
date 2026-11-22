// =====================================
// STUDY MODE (flashcards) - study-mode.js
// No timer, no score. Flip a card, then mark it "Got it" or "Study again".
// Cards you miss go back to the end of the pile until you know them all.
//
// Load AFTER script.js and extra-modes.js:
//   <script src="script.js"></script>
//   <script src="extra-modes.js"></script>
//   <script src="study-mode.js"></script>
//
// Uses: FLAG_LIST and questions (script.js), extraPools (capitals, extra-modes.js),
// shuffle (script.js). Self-contained overlay, wrapped in an IIFE.
// =====================================
(() => {

    // ---------- the decks ----------
    const DECKS = {
        flags: {
            title: "Flags",
            icon: "fa-flag",
            description: "See a flag, recall the country.",
            build: () => FLAG_LIST.map(([code, name, continent]) => ({
                flag: code,
                label: "WHICH COUNTRY?",
                front: "",
                back: name,
                note: continent
            }))
        },
        capitals: {
            title: "Capitals",
            icon: "fa-city",
            description: "See a country, recall its capital.",
            build: () => (extraPools["Capitals"] || []).map(q => ({
                label: "CAPITAL OF",
                front: q.entry[0],
                back: q.entry[1],
                note: q.entry[2]
            }))
        },
        facts: {
            title: "Quiz Facts",
            icon: "fa-lightbulb",
            description: "Questions from every category, with the answer and explanation.",
            build: () => questions.filter(q => !q.flag).map(q => ({
                label: q.category.toUpperCase(),
                front: q.question,
                back: q.correct,
                note: q.explanation
            }))
        }
    };

    let overlay = null;
    let deckKey = null;
    let queue = [];
    let total = 0;
    let mastered = 0;
    let flipped = false;

    const q = sel => overlay.querySelector(sel);

    // ---------- build the overlay + styles once ----------
    function build() {
        const style = document.createElement("style");
        style.textContent = `
            #st-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;
                justify-content:center;background:rgba(5,8,20,.88);padding:16px}
            #st-screen.st-hidden{display:none}
            .st-box{width:min(720px,100%);max-height:100%;overflow:auto;background:#10172e;
                border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:24px;color:#fff;position:relative}
            .st-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
            .st-top h2{margin:0;font-size:24px}
            .st-label{font-size:12px;letter-spacing:2px;color:#61d4f1;margin:0 0 4px}
            #st-close{background:none;border:0;color:#fff;font-size:22px;cursor:pointer}
            .st-section.st-hidden{display:none}

            /* deck picker */
            .st-decks{display:grid;gap:12px}
            .st-deck{display:flex;align-items:center;gap:14px;text-align:left;width:100%;cursor:pointer;
                padding:16px;border-radius:14px;border:1px solid rgba(255,255,255,.12);
                background:rgba(255,255,255,.05);color:#fff;font:inherit}
            .st-deck:hover{background:rgba(97,212,241,.14);border-color:#61d4f1}
            .st-deck i{font-size:22px;color:#61d4f1;width:30px;text-align:center}
            .st-deck strong{display:block;font-size:17px}
            .st-deck small{opacity:.7}
            .st-deck b{margin-left:auto;opacity:.8;font-weight:600}

            /* progress */
            .st-progress-text{display:flex;justify-content:space-between;font-size:14px;opacity:.85;margin-bottom:8px}
            .st-track{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin-bottom:18px}
            #st-fill{height:100%;width:0;background:linear-gradient(90deg,#61d4f1,#48d89a);transition:width .3s}

            /* flip card */
            .st-scene{perspective:1000px;margin-bottom:16px}
            .st-card{position:relative;min-height:290px;cursor:pointer;
                transform-style:preserve-3d;transition:transform .5s}
            .st-card.st-flipped{transform:rotateY(180deg)}
            .st-card.st-noanim{transition:none}
            .st-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
                justify-content:center;gap:14px;padding:22px;text-align:center;border-radius:18px;
                border:1px solid rgba(255,255,255,.14);backface-visibility:hidden;-webkit-backface-visibility:hidden}
            .st-front{background:linear-gradient(145deg,#1b2850,#142040)}
            .st-back{background:linear-gradient(145deg,#12423a,#0f3a46);transform:rotateY(180deg)}
            .st-tag{font-size:12px;letter-spacing:2px;color:#61d4f1}
            .st-back .st-tag{color:#48d89a}
            .st-main{font-size:clamp(22px,4vw,32px);font-weight:700;line-height:1.25}
            .st-note{opacity:.8;font-size:15px;max-width:520px}
            .st-flag{max-width:min(300px,80%);max-height:170px;border-radius:8px;
                box-shadow:0 6px 22px rgba(0,0,0,.45)}
            .st-tap{position:absolute;bottom:12px;font-size:12px;opacity:.5}

            /* buttons */
            .st-actions{display:flex;gap:12px}
            .st-actions button,.st-done-actions button{flex:1;padding:14px;border:0;border-radius:12px;
                font-weight:700;font-size:15px;cursor:pointer;color:#0b1020}
            #st-again{background:#ffd166}
            #st-got{background:#48d89a}
            .st-actions button:disabled{opacity:.35;cursor:not-allowed}
            .st-keys{margin:12px 0 0;text-align:center;font-size:12px;opacity:.55}

            /* finished */
            .st-done{text-align:center;padding:10px 0}
            .st-done i{font-size:48px;color:#ffd166;margin-bottom:10px}
            .st-done-actions{display:flex;gap:12px;margin-top:18px}
            #st-restart{background:#61d4f1}
            #st-menu-btn{background:rgba(255,255,255,.85)}

            @media (prefers-reduced-motion: reduce){.st-card{transition:none}}
        `;
        document.head.appendChild(style);

        overlay = document.createElement("div");
        overlay.id = "st-screen";
        overlay.className = "st-hidden";
        overlay.innerHTML = `
            <div class="st-box">
                <div class="st-top">
                    <div>
                        <p class="st-label">STUDY MODE</p>
                        <h2 id="st-title">Choose a deck</h2>
                    </div>
                    <button id="st-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div id="st-menu" class="st-section">
                    <div class="st-decks" id="st-decks"></div>
                </div>

                <div id="st-study" class="st-section st-hidden">
                    <div class="st-progress-text">
                        <span id="st-remaining">0 left</span>
                        <span id="st-mastered">0 / 0 learned</span>
                    </div>
                    <div class="st-track"><div id="st-fill"></div></div>

                    <div class="st-scene">
                        <div class="st-card" id="st-card">
                            <div class="st-face st-front">
                                <span class="st-tag" id="st-front-tag"></span>
                                <div id="st-front-visual"></div>
                                <span class="st-tap">Click to flip</span>
                            </div>
                            <div class="st-face st-back">
                                <span class="st-tag">ANSWER</span>
                                <span class="st-main" id="st-back-main"></span>
                                <span class="st-note" id="st-back-note"></span>
                            </div>
                        </div>
                    </div>

                    <div class="st-actions">
                        <button id="st-again" disabled><i class="fa-solid fa-rotate-left"></i> Study again</button>
                        <button id="st-got" disabled><i class="fa-solid fa-check"></i> Got it</button>
                    </div>
                    <p class="st-keys">Space = flip &nbsp;•&nbsp; ← study again &nbsp;•&nbsp; → got it &nbsp;•&nbsp; Esc = close</p>
                </div>

                <div id="st-finish" class="st-section st-hidden">
                    <div class="st-done">
                        <i class="fa-solid fa-circle-check"></i>
                        <h2>Deck complete!</h2>
                        <p id="st-finish-text"></p>
                        <div class="st-done-actions">
                            <button id="st-restart"><i class="fa-solid fa-rotate-right"></i> Study again</button>
                            <button id="st-menu-btn"><i class="fa-solid fa-layer-group"></i> Pick another deck</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        // deck buttons
        const decksBox = q("#st-decks");
        Object.entries(DECKS).forEach(([key, deck]) => {
            const button = document.createElement("button");
            button.className = "st-deck";
            button.innerHTML =
                '<i class="fa-solid ' + deck.icon + '"></i>' +
                "<span><strong>" + deck.title + "</strong><small>" + deck.description + "</small></span>" +
                "<b></b>";
            button.dataset.deck = key;
            button.addEventListener("click", () => startDeck(key));
            decksBox.appendChild(button);
        });

        q("#st-close").addEventListener("click", close);
        q("#st-card").addEventListener("click", flip);
        q("#st-again").addEventListener("click", () => mark(false));
        q("#st-got").addEventListener("click", () => mark(true));
        q("#st-restart").addEventListener("click", () => startDeck(deckKey));
        q("#st-menu-btn").addEventListener("click", showMenu);

        // Keyboard: handled here, and the quiz shortcuts (A-D, 1-4, Enter)
        // are blocked while this screen is open
        document.addEventListener("keydown", e => {
            if (overlay.classList.contains("st-hidden")) return;

            if (e.key === "Escape") { close(); return; }

            const studying = !q("#st-study").classList.contains("st-hidden");

            if (studying) {
                if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); flip(); }
                else if (e.key === "ArrowLeft" && flipped) mark(false);
                else if (e.key === "ArrowRight" && flipped) mark(true);
            }

            e.stopImmediatePropagation();
        }, true);
    }

    function show(sectionId) {
        ["#st-menu", "#st-study", "#st-finish"].forEach(id => {
            q(id).classList.toggle("st-hidden", id !== sectionId);
        });
    }

    function close() {
        overlay.classList.add("st-hidden");
    }

    function open() {
        if (!overlay) build();
        overlay.classList.remove("st-hidden");
        showMenu();
    }

    function showMenu() {
        q("#st-title").textContent = "Choose a deck";

        // show how many cards each deck has
        overlay.querySelectorAll(".st-deck").forEach(button => {
            const count = DECKS[button.dataset.deck].build().length;
            button.querySelector("b").textContent = count + " cards";
        });

        show("#st-menu");
    }

    // ---------- studying ----------
    function startDeck(key) {
        deckKey = key;
        queue = shuffle(DECKS[key].build());
        total = queue.length;
        mastered = 0;

        q("#st-title").textContent = DECKS[key].title;
        show("#st-study");
        showCard();
    }

    function showCard() {
        if (queue.length === 0) return finish();

        const card = queue[0];

        // reset the flip instantly so the next answer never flashes through
        const cardEl = q("#st-card");
        cardEl.classList.add("st-noanim");
        cardEl.classList.remove("st-flipped");
        void cardEl.offsetWidth;
        cardEl.classList.remove("st-noanim");

        flipped = false;
        q("#st-again").disabled = true;
        q("#st-got").disabled = true;

        q("#st-front-tag").textContent = card.label;

        const visual = q("#st-front-visual");
        visual.innerHTML = "";

        if (card.flag) {
            const img = document.createElement("img");
            img.className = "st-flag";
            img.src = "https://flagcdn.com/w320/" + card.flag + ".png";
            img.srcset = "https://flagcdn.com/w640/" + card.flag + ".png 2x";
            img.alt = "Country flag";
            img.onerror = () => { visual.textContent = "🏳️"; };
            visual.appendChild(img);
        } else {
            const text = document.createElement("span");
            text.className = "st-main";
            text.textContent = card.front;
            visual.appendChild(text);
        }

        q("#st-back-main").textContent = card.back;
        q("#st-back-note").textContent = card.note || "";

        updateProgress();
    }

    function flip() {
        if (q("#st-study").classList.contains("st-hidden")) return;

        flipped = !flipped;
        q("#st-card").classList.toggle("st-flipped", flipped);

        if (flipped) {
            q("#st-again").disabled = false;
            q("#st-got").disabled = false;
        }
    }

    function mark(gotIt) {
        if (!flipped || queue.length === 0) return;

        const card = queue.shift();

        if (gotIt) {
            mastered++;
        } else {
            queue.push(card);   // back to the end of the pile
        }

        showCard();
    }

    function updateProgress() {
        q("#st-remaining").textContent = queue.length + " left";
        q("#st-mastered").textContent = mastered + " / " + total + " learned";
        q("#st-fill").style.width = (mastered / total * 100) + "%";
    }

    function finish() {
        q("#st-fill").style.width = "100%";
        q("#st-finish-text").textContent =
            "You learned all " + total + " cards in the " + DECKS[deckKey].title + " deck.";
        show("#st-finish");
    }

    // ---------- sidebar button ----------
    const button = document.createElement("button");
    button.className = "nav-item";
    button.id = "study-nav";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-book-open-reader";
    button.append(icon, " Study Mode");

    const anchor = document.getElementById("map-nav");
    anchor.parentNode.insertBefore(button, anchor);

    button.addEventListener("click", open);
})();
