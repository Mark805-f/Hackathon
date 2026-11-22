// =====================================
// MATCH PAIRS (memory game) - match-pairs.js
// Flip two cards at a time. Find every matching pair in as few moves as you can.
//
// Load AFTER script.js and extra-modes.js:
//   <script src="script.js"></script>
//   <script src="extra-modes.js"></script>
//   <script src="match-pairs.js"></script>
//
// Uses: FLAG_LIST (script.js), extraPools["Capitals"] (extra-modes.js),
// shuffle and addXP (script.js). Self-contained overlay, wrapped in an IIFE.
// =====================================
(() => {

    // ---------- the two game types ----------
    const MODES = {
        flags: {
            title: "Flags & Countries",
            icon: "fa-flag",
            description: "Match each flag to its country name.",
            // returns [{ a: {flag}|{text}, b: {text} }, ...]
            build: n => shuffle(FLAG_LIST).slice(0, n).map(([code, name]) => ({
                a: { flag: code },
                b: { text: name }
            }))
        },
        capitals: {
            title: "Countries & Capitals",
            icon: "fa-city",
            description: "Match each country to its capital.",
            build: n => shuffle(
                (typeof extraPools !== "undefined" && extraPools["Capitals"]) || []
            ).slice(0, n).map(q => ({
                a: { text: q.entry[0] },
                b: { text: q.entry[1] }
            }))
        }
    };

    const SIZES = [
        { key: "easy", label: "Easy", pairs: 4 },
        { key: "normal", label: "Normal", pairs: 6 },
        { key: "hard", label: "Hard", pairs: 8 }
    ];

    const MISMATCH_DELAY = 900;

    let overlay = null;
    let modeKey = null;
    let sizeKey = "normal";

    let first = null;
    let lock = false;
    let matched = 0;
    let moves = 0;
    let seconds = 0;
    let pairCount = 0;
    let clock = null;

    const q = sel => overlay.querySelector(sel);

    // ---------- build the overlay + styles once ----------
    function build() {
        const style = document.createElement("style");
        style.textContent = `
            #mp-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;
                justify-content:center;background:rgba(5,8,20,.88);padding:16px}
            #mp-screen.mp-hidden{display:none}
            .mp-box{width:min(820px,100%);max-height:100%;overflow:auto;background:#10172e;
                border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:24px;color:#fff}
            .mp-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
            .mp-top h2{margin:0;font-size:24px}
            .mp-label{font-size:12px;letter-spacing:2px;color:#61d4f1;margin:0 0 4px}
            #mp-close{background:none;border:0;color:#fff;font-size:22px;cursor:pointer}
            .mp-section.mp-hidden{display:none}

            /* menu */
            .mp-sub{margin:0 0 10px;font-size:13px;letter-spacing:1px;opacity:.7}
            .mp-modes{display:grid;gap:12px;margin-bottom:20px}
            .mp-mode{display:flex;align-items:center;gap:14px;text-align:left;width:100%;cursor:pointer;
                padding:16px;border-radius:14px;border:1px solid rgba(255,255,255,.12);
                background:rgba(255,255,255,.05);color:#fff;font:inherit}
            .mp-mode:hover{background:rgba(97,212,241,.14);border-color:#61d4f1}
            .mp-mode i{font-size:22px;color:#61d4f1;width:30px;text-align:center}
            .mp-mode strong{display:block;font-size:17px}
            .mp-mode small{opacity:.7}
            .mp-sizes{display:flex;gap:10px;margin-bottom:20px}
            .mp-size{flex:1;padding:12px;border-radius:12px;cursor:pointer;font:inherit;font-weight:700;
                border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#fff}
            .mp-size small{display:block;font-weight:400;opacity:.65}
            .mp-size.mp-active{background:#61d4f1;color:#0b1020;border-color:#61d4f1}

            /* playing */
            .mp-stats{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px}
            .mp-stat{background:rgba(255,255,255,.06);border-radius:12px;padding:8px 14px;font-size:14px}
            .mp-stat strong{font-size:18px;margin-left:6px}
            .mp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
            .mp-card{position:relative;aspect-ratio:1/1;min-height:96px;padding:0;border:0;background:none;
                cursor:pointer;perspective:800px;font:inherit;color:#fff}
            .mp-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .45s}
            .mp-card.mp-up .mp-inner,.mp-card.mp-done .mp-inner{transform:rotateY(180deg)}
            .mp-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                text-align:center;padding:8px;border-radius:14px;border:1px solid rgba(255,255,255,.14);
                backface-visibility:hidden;-webkit-backface-visibility:hidden}
            .mp-cover{background:linear-gradient(145deg,#1b2850,#142040);font-size:26px;color:#61d4f1}
            .mp-card:hover .mp-cover{border-color:#61d4f1}
            .mp-content{background:linear-gradient(145deg,#243564,#1a2a52);transform:rotateY(180deg);
                font-weight:700;font-size:clamp(13px,2.2vw,18px);line-height:1.2;overflow-wrap:anywhere}
            .mp-card.mp-done .mp-content{background:linear-gradient(145deg,#12423a,#0f3a46);
                border-color:#48d89a;box-shadow:0 0 14px rgba(72,216,154,.35)}
            .mp-card.mp-bad .mp-content{background:linear-gradient(145deg,#5a2230,#431a28);border-color:#ff7185}
            .mp-card.mp-done{cursor:default}
            .mp-flag{max-width:100%;max-height:100%;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.45)}
            .mp-bar{display:flex;gap:12px;margin-top:16px}
            .mp-btn{flex:1;padding:12px;border:0;border-radius:12px;font-weight:700;font-size:15px;
                cursor:pointer;color:#0b1020;background:#61d4f1}
            .mp-btn.mp-alt{background:rgba(255,255,255,.85)}

            /* finished */
            .mp-win{text-align:center;padding:10px 0}
            .mp-win i{font-size:48px;color:#ffd166;margin-bottom:10px}
            .mp-win-stats{display:flex;justify-content:center;gap:28px;margin:16px 0;flex-wrap:wrap}
            .mp-win-stats div strong{display:block;font-size:26px}
            .mp-win-stats div span{font-size:12px;opacity:.7;letter-spacing:1px}
            #mp-newbest{color:#ffd166;font-weight:700;min-height:22px}

            @media (max-width:520px){.mp-grid{gap:8px}}
            @media (prefers-reduced-motion: reduce){.mp-inner{transition:none}}
        `;
        document.head.appendChild(style);

        overlay = document.createElement("div");
        overlay.id = "mp-screen";
        overlay.className = "mp-hidden";
        overlay.innerHTML = `
            <div class="mp-box">
                <div class="mp-top">
                    <div>
                        <p class="mp-label">MATCH PAIRS</p>
                        <h2 id="mp-title">Choose a game</h2>
                    </div>
                    <button id="mp-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>

                <div id="mp-menu" class="mp-section">
                    <p class="mp-sub">DIFFICULTY</p>
                    <div class="mp-sizes" id="mp-sizes"></div>
                    <p class="mp-sub">WHAT TO MATCH</p>
                    <div class="mp-modes" id="mp-modes"></div>
                </div>

                <div id="mp-play" class="mp-section mp-hidden">
                    <div class="mp-stats">
                        <div class="mp-stat">Moves<strong id="mp-moves">0</strong></div>
                        <div class="mp-stat">Time<strong id="mp-time">0:00</strong></div>
                        <div class="mp-stat">Pairs<strong id="mp-pairs">0 / 0</strong></div>
                    </div>
                    <div class="mp-grid" id="mp-grid"></div>
                    <div class="mp-bar">
                        <button class="mp-btn mp-alt" id="mp-restart"><i class="fa-solid fa-rotate-right"></i> Restart</button>
                        <button class="mp-btn mp-alt" id="mp-menu-btn"><i class="fa-solid fa-layer-group"></i> Menu</button>
                    </div>
                </div>

                <div id="mp-finish" class="mp-section mp-hidden">
                    <div class="mp-win">
                        <i class="fa-solid fa-trophy"></i>
                        <h2>All pairs found!</h2>
                        <div class="mp-win-stats">
                            <div><strong id="mp-f-moves">0</strong><span>MOVES</span></div>
                            <div><strong id="mp-f-time">0:00</strong><span>TIME</span></div>
                            <div><strong id="mp-f-xp">+0</strong><span>XP</span></div>
                        </div>
                        <p id="mp-newbest"></p>
                        <div class="mp-bar">
                            <button class="mp-btn" id="mp-again"><i class="fa-solid fa-rotate-right"></i> Play again</button>
                            <button class="mp-btn mp-alt" id="mp-menu-btn2"><i class="fa-solid fa-layer-group"></i> Menu</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        // difficulty buttons
        const sizesBox = q("#mp-sizes");
        SIZES.forEach(size => {
            const button = document.createElement("button");
            button.className = "mp-size";
            button.dataset.size = size.key;
            button.innerHTML = size.label + "<small>" + size.pairs + " pairs</small>";
            button.addEventListener("click", () => {
                sizeKey = size.key;
                markSize();
            });
            sizesBox.appendChild(button);
        });

        // game type buttons
        const modesBox = q("#mp-modes");
        Object.entries(MODES).forEach(([key, mode]) => {
            const button = document.createElement("button");
            button.className = "mp-mode";
            button.innerHTML =
                '<i class="fa-solid ' + mode.icon + '"></i>' +
                "<span><strong>" + mode.title + "</strong><small>" + mode.description + "</small></span>";
            button.addEventListener("click", () => startGame(key));
            modesBox.appendChild(button);
        });

        q("#mp-close").addEventListener("click", close);
        q("#mp-restart").addEventListener("click", () => startGame(modeKey));
        q("#mp-menu-btn").addEventListener("click", showMenu);
        q("#mp-again").addEventListener("click", () => startGame(modeKey));
        q("#mp-menu-btn2").addEventListener("click", showMenu);

        // Esc closes; the quiz shortcuts (A-D, 1-4, Enter) are blocked while open
        document.addEventListener("keydown", e => {
            if (overlay.classList.contains("mp-hidden")) return;
            if (e.key === "Escape") { close(); return; }
            e.stopImmediatePropagation();
        }, true);
    }

    function markSize() {
        overlay.querySelectorAll(".mp-size").forEach(button => {
            button.classList.toggle("mp-active", button.dataset.size === sizeKey);
        });
    }

    function show(sectionId) {
        ["#mp-menu", "#mp-play", "#mp-finish"].forEach(id => {
            q(id).classList.toggle("mp-hidden", id !== sectionId);
        });
    }

    function stopClock() {
        clearInterval(clock);
        clock = null;
    }

    function close() {
        stopClock();
        overlay.classList.add("mp-hidden");
    }

    function open() {
        if (!overlay) build();
        overlay.classList.remove("mp-hidden");
        showMenu();
    }

    function showMenu() {
        stopClock();
        q("#mp-title").textContent = "Choose a game";
        markSize();
        show("#mp-menu");
    }

    // ---------- game ----------
    function formatTime(total) {
        const m = Math.floor(total / 60);
        const s = String(total % 60).padStart(2, "0");
        return m + ":" + s;
    }

    function makeFace(content) {
        const face = document.createElement("div");
        face.className = "mp-face mp-content";

        if (content.flag) {
            const img = document.createElement("img");
            img.className = "mp-flag";
            img.src = "https://flagcdn.com/w160/" + content.flag + ".png";
            img.srcset = "https://flagcdn.com/w320/" + content.flag + ".png 2x";
            img.alt = "Country flag";
            img.onerror = () => { face.textContent = "🏳️"; };
            face.appendChild(img);
        } else {
            face.textContent = content.text;
        }

        return face;
    }

    function startGame(key) {
        modeKey = key;
        stopClock();

        const size = SIZES.find(s => s.key === sizeKey);
        const pairs = MODES[key].build(size.pairs);

        pairCount = pairs.length;
        first = null;
        lock = false;
        matched = 0;
        moves = 0;
        seconds = 0;

        q("#mp-title").textContent = MODES[key].title;
        q("#mp-moves").textContent = "0";
        q("#mp-time").textContent = "0:00";
        q("#mp-pairs").textContent = "0 / " + pairCount;

        // two cards per pair, shuffled together
        const cards = [];
        pairs.forEach((pair, id) => {
            cards.push({ id: id, content: pair.a });
            cards.push({ id: id, content: pair.b });
        });

        const grid = q("#mp-grid");
        grid.innerHTML = "";

        shuffle(cards).forEach(card => {
            const button = document.createElement("button");
            button.className = "mp-card";
            button.dataset.pair = card.id;
            button.setAttribute("aria-label", "Hidden card");

            const inner = document.createElement("div");
            inner.className = "mp-inner";

            const cover = document.createElement("div");
            cover.className = "mp-face mp-cover";
            cover.innerHTML = '<i class="fa-solid fa-question"></i>';

            inner.append(cover, makeFace(card.content));
            button.appendChild(inner);

            button.addEventListener("click", () => flipCard(button));
            grid.appendChild(button);
        });

        show("#mp-play");
    }

    function startClock() {
        if (clock) return;

        clock = setInterval(() => {
            seconds++;
            q("#mp-time").textContent = formatTime(seconds);
        }, 1000);
    }

    function flipCard(card) {
        if (lock) return;
        if (card.classList.contains("mp-done") || card === first) return;

        startClock();
        card.classList.add("mp-up");

        if (!first) {
            first = card;
            return;
        }

        const second = card;
        moves++;
        q("#mp-moves").textContent = moves;

        if (first.dataset.pair === second.dataset.pair) {
            // a match
            [first, second].forEach(c => {
                c.classList.remove("mp-up");
                c.classList.add("mp-done");
            });

            matched++;
            q("#mp-pairs").textContent = matched + " / " + pairCount;
            first = null;

            if (matched === pairCount) {
                setTimeout(finish, 700);
            }
            return;
        }

        // not a match: show red briefly, then flip back
        lock = true;
        const a = first;
        first = null;

        a.classList.add("mp-bad");
        second.classList.add("mp-bad");

        setTimeout(() => {
            [a, second].forEach(c => c.classList.remove("mp-up", "mp-bad"));
            lock = false;
        }, MISMATCH_DELAY);
    }

    function finish() {
        stopClock();

        // XP: more for fewer extra moves (a perfect game needs exactly one move per pair)
        const extra = Math.max(0, moves - pairCount);
        const xp = Math.max(pairCount * 2, pairCount * 8 - extra * 2);

        if (typeof addXP === "function") addXP(xp);

        // personal best per game type + difficulty (fewest moves, then fastest)
        const storeKey = "matchBest_" + modeKey + "_" + sizeKey;
        let best = null;

        try { best = JSON.parse(localStorage.getItem(storeKey)); } catch (e) {}

        const isBest = !best || moves < best.moves ||
            (moves === best.moves && seconds < best.seconds);

        if (isBest) {
            try {
                localStorage.setItem(storeKey, JSON.stringify({ moves: moves, seconds: seconds }));
            } catch (e) {}
        }

        q("#mp-f-moves").textContent = moves;
        q("#mp-f-time").textContent = formatTime(seconds);
        q("#mp-f-xp").textContent = "+" + xp;
        q("#mp-newbest").textContent = isBest
            ? "New personal best!"
            : "Best: " + best.moves + " moves, " + formatTime(best.seconds);

        show("#mp-finish");
    }
    
    const button = document.createElement("button");
    button.className = "nav-item";
    button.id = "match-nav";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-clone";
    button.append(icon, " Match Pairs");

    const anchor = document.getElementById("map-nav");
    anchor.parentNode.insertBefore(button, anchor);

    button.addEventListener("click", open);
})();