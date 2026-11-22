// =====================================
// HANGMAN: COUNTRIES
// Guess the country letter by letter. Every mistake cracks the globe.
// Needs: addXP, showToast, shuffle (all already in your project)
// =====================================
(() => {
    const MAX_MISTAKES = 6;
    const FLAG_HINT_AT = 4;     // flag is revealed after this many mistakes

    // [name, continent, flag code]  (add more lines to grow the game)
    const WORDS = [
        ["France","Europe","fr"], ["Germany","Europe","de"], ["Italy","Europe","it"],
        ["Spain","Europe","es"], ["Portugal","Europe","pt"], ["Greece","Europe","gr"],
        ["Sweden","Europe","se"], ["Norway","Europe","no"], ["Finland","Europe","fi"],
        ["Poland","Europe","pl"], ["Ireland","Europe","ie"], ["Switzerland","Europe","ch"],
        ["Austria","Europe","at"], ["Belgium","Europe","be"], ["Netherlands","Europe","nl"],
        ["Denmark","Europe","dk"], ["Iceland","Europe","is"], ["Croatia","Europe","hr"],
        ["Albania","Europe","al"], ["Romania","Europe","ro"], ["Hungary","Europe","hu"],
        ["Ukraine","Europe","ua"], ["United Kingdom","Europe","gb"], ["Czech Republic","Europe","cz"],
        ["Japan","Asia","jp"], ["China","Asia","cn"], ["India","Asia","in"],
        ["South Korea","Asia","kr"], ["Thailand","Asia","th"], ["Vietnam","Asia","vn"],
        ["Indonesia","Asia","id"], ["Philippines","Asia","ph"], ["Pakistan","Asia","pk"],
        ["Saudi Arabia","Asia","sa"], ["Turkey","Asia","tr"], ["Mongolia","Asia","mn"],
        ["Nepal","Asia","np"], ["Kazakhstan","Asia","kz"], ["Malaysia","Asia","my"],
        ["Egypt","Africa","eg"], ["Nigeria","Africa","ng"], ["Kenya","Africa","ke"],
        ["South Africa","Africa","za"], ["Morocco","Africa","ma"], ["Ethiopia","Africa","et"],
        ["Ghana","Africa","gh"], ["Tanzania","Africa","tz"], ["Algeria","Africa","dz"],
        ["Madagascar","Africa","mg"], ["Senegal","Africa","sn"], ["Tunisia","Africa","tn"],
        ["Canada","North America","ca"], ["Mexico","North America","mx"], ["Cuba","North America","cu"],
        ["United States","North America","us"], ["Jamaica","North America","jm"],
        ["Costa Rica","North America","cr"], ["Panama","North America","pa"],
        ["Brazil","South America","br"], ["Argentina","South America","ar"], ["Chile","South America","cl"],
        ["Peru","South America","pe"], ["Colombia","South America","co"], ["Venezuela","South America","ve"],
        ["Ecuador","South America","ec"], ["Bolivia","South America","bo"], ["Uruguay","South America","uy"],
        ["Australia","Oceania","au"], ["New Zealand","Oceania","nz"], ["Fiji","Oceania","fj"]
    ];

    let pool = [], current, guessed, mistakes, over;
    let wins = 0, streak = 0;
    let bestStreak = Number(localStorage.getItem("worldHangmanBest") || 0);

    // ---------- Sidebar button ----------
    const navBtn = document.createElement("button");
    navBtn.className = "nav-item map-nav";      // "map-nav" makes script.js ignore it
    navBtn.innerHTML = '<i class="fa-solid fa-spell-check"></i> Hangman: Countries';
    document.querySelector(".sidebar").insertBefore(
        navBtn, document.querySelector(".sidebar-bottom")
    );

    // ---------- Styles ----------
    const style = document.createElement("style");
    style.textContent = `
        .hm-box{max-width:720px}
        .hm-top{display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:center;margin:14px 0}
        .hm-globe{width:100%;max-width:200px;margin:auto;overflow:visible}
        .hm-globe .half{transition:transform .9s cubic-bezier(.5,0,.3,1),opacity .9s;transform-origin:100px 100px}
        .hm-globe.lost #hm-left{transform:translate(-22px,10px) rotate(-12deg);opacity:.75}
        .hm-globe.lost #hm-right{transform:translate(22px,14px) rotate(12deg);opacity:.75}
        .hm-globe.won{filter:drop-shadow(0 0 18px rgba(72,216,154,.7))}
        .hm-globe.hit{animation:shake .4s}
        .hm-crack{display:none;fill:none;stroke:#fff;stroke-width:2.5;stroke-linejoin:round;
            stroke-linecap:round;filter:drop-shadow(0 0 3px #0b1426)}
        .hm-crack.on{display:block}
        .hm-info{text-align:center}
        .hm-cat{color:#61d4f1;font-size:12px;font-weight:bold;letter-spacing:2px}
        .hm-flag{height:54px;border-radius:7px;margin-top:12px;box-shadow:0 8px 22px rgba(0,0,0,.5);
            animation:ansIn .5s both}
        .hm-lives{margin-top:12px;color:#91a2bd;font-size:13px}
        .hm-lives strong{color:#ff7185}
        .hm-word{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 6px;margin:22px 0;min-height:52px}
        .hm-letter{width:34px;height:44px;display:grid;place-items:center;font-size:24px;font-weight:900;
            border-bottom:3px solid #61d4f1;color:#fff;animation:ansIn .3s both}
        .hm-letter.gap{border-bottom:none;width:16px}
        .hm-letter.missed{color:#ff7185;border-color:#ff7185}
        .hm-keys{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}
        .hm-key{width:40px;height:44px;background:#263852;color:#fff;border:1px solid #3b506d;
            border-radius:9px;font-weight:bold;font-size:15px;cursor:pointer;transition:.15s}
        .hm-key:hover:not(:disabled){background:#304d70;border-color:#61d4f1;transform:translateY(-2px)}
        .hm-key:disabled{cursor:default}
        .hm-key.right{background:#176443;border-color:#48d89a}
        .hm-key.wrong{background:#793444;border-color:#fa748b;opacity:.6}
        @media(max-width:550px){
            .hm-top{grid-template-columns:1fr}
            .hm-key{width:32px;height:40px;font-size:13px}
            .hm-letter{width:24px;height:36px;font-size:19px}
        }
    `;
    document.head.appendChild(style);

    // ---------- Globe (SVG): crack lines appear with each mistake ----------
    const CRACKS = [
        "M100 20 L92 45 L104 62 L96 82",
        "M100 100 L82 118 L90 140 L78 165",
        "M96 82 L70 78 L55 90 L38 84",
        "M100 100 L124 94 L140 108 L162 102",
        "M104 62 L122 48 L134 30",
        "M90 140 L114 150 L124 172"
    ];

    const globeSVG = `
        <svg class="hm-globe" id="hm-globe" viewBox="-20 0 240 200">
            <defs>
                <radialGradient id="hm-ocean" cx="35%" cy="30%" r="80%">
                    <stop offset="0" stop-color="#4fb8e8"/>
                    <stop offset="1" stop-color="#14407a"/>
                </radialGradient>
                <clipPath id="hm-circle"><circle cx="100" cy="100" r="80"/></clipPath>
                <clipPath id="hm-clip-l"><rect x="-40" y="0" width="140" height="200"/></clipPath>
                <clipPath id="hm-clip-r"><rect x="100" y="0" width="140" height="200"/></clipPath>
                <g id="hm-art">
                    <circle cx="100" cy="100" r="80" fill="url(#hm-ocean)"/>
                    <g clip-path="url(#hm-circle)" fill="#48d89a" opacity=".85">
                        <path d="M45 60 Q70 40 95 55 Q105 75 85 90 Q70 110 55 95 Q35 80 45 60Z"/>
                        <path d="M110 105 Q135 95 150 115 Q145 145 125 160 Q108 140 110 105Z"/>
                        <path d="M120 45 Q150 38 165 58 Q150 72 128 68 Q115 58 120 45Z"/>
                    </g>
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#9fdcff" stroke-width="2" opacity=".6"/>
                    <g id="hm-cracks">${CRACKS.map(d => `<path class="hm-crack" d="${d}"/>`).join("")}</g>
                </g>
            </defs>
            <g class="half" id="hm-left" clip-path="url(#hm-clip-l)"><use href="#hm-art"/></g>
            <g class="half" id="hm-right" clip-path="url(#hm-clip-r)"><use href="#hm-art"/></g>
        </svg>`;

    // ---------- Overlay ----------
    const screen = document.createElement("div");
    screen.className = "map-screen hidden";
    screen.innerHTML = `
        <div class="map-box hm-box">
            <div class="map-top">
                <div>
                    <p class="map-label">HANGMAN: COUNTRIES</p>
                    <h2 style="font-size:clamp(18px,3vw,24px);color:#ffd166;margin-top:6px;">
                        Save the globe!
                    </h2>
                </div>
                <div class="map-info">
                    <span>Streak <strong id="hm-streak">0</strong></span>
                    <span>Best <strong id="hm-best">${bestStreak}</strong></span>
                </div>
                <button id="hm-close"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="hm-top">
                ${globeSVG}
                <div class="hm-info">
                    <div class="hm-cat" id="hm-cat"></div>
                    <div id="hm-flagbox"></div>
                    <div class="hm-lives">Cracks: <strong id="hm-lives">0/${MAX_MISTAKES}</strong></div>
                </div>
            </div>

            <div class="hm-word" id="hm-word"></div>
            <p id="hm-feedback" style="min-height:22px;text-align:center;font-weight:bold;margin-bottom:12px;"></p>
            <div class="hm-keys" id="hm-keys"></div>

            <div id="hm-end" class="map-end hidden">
                <h2 id="hm-end-title"></h2>
                <p id="hm-end-text"></p>
                <button id="hm-next">Next Country</button>
            </div>
        </div>`;
    document.body.appendChild(screen);

    const $h = id => document.getElementById(id);

    // Build the on-screen keyboard once
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "hm-key";
        btn.dataset.letter = letter;
        btn.textContent = letter;
        btn.addEventListener("click", () => guess(letter));
        $h("hm-keys").appendChild(btn);
    });

    // ---------- Game flow ----------
    function pickWord() {
        if (pool.length === 0) pool = shuffle(WORDS);   // reshuffle once every word was used
        return pool.pop();
    }

    function newWord() {
        const [name, continent, code] = pickWord();
        current = { name: name.toUpperCase(), display: name, continent, code };
        guessed = new Set();
        mistakes = 0;
        over = false;

        $h("hm-end").classList.add("hidden");
        $h("hm-cat").textContent = "COUNTRY • " + continent.toUpperCase();
        $h("hm-flagbox").innerHTML = "";
        $h("hm-feedback").textContent = "";
        $h("hm-globe").classList.remove("lost", "won", "hit");

        document.querySelectorAll(".hm-key").forEach(k => {
            k.disabled = false;
            k.className = "hm-key";
        });

        render();
    }

    function start() {
        screen.classList.remove("hidden");
        streak = 0;
        $h("hm-streak").textContent = 0;
        newWord();
    }

    function render(revealAll = false) {
        // Letters
        const wordBox = $h("hm-word");
        wordBox.innerHTML = "";

        current.name.split("").forEach(ch => {
            const span = document.createElement("span");

            if (!/[A-Z]/.test(ch)) {            // spaces, hyphens...
                span.className = "hm-letter gap";
                span.textContent = ch === " " ? "" : ch;
            } else {
                span.className = "hm-letter";
                if (guessed.has(ch)) {
                    span.textContent = ch;
                } else if (revealAll) {
                    span.textContent = ch;
                    span.classList.add("missed");
                }
            }
            wordBox.appendChild(span);
        });

        // Globe cracks
        document.querySelectorAll("#hm-art .hm-crack").forEach((el, i) =>
            el.classList.toggle("on", i < mistakes));
        // <use> clones read the original, so nothing else to update

        $h("hm-lives").textContent = mistakes + "/" + MAX_MISTAKES;
    }

    function guess(letter) {
        if (over || guessed.has(letter)) return;

        guessed.add(letter);
        const key = document.querySelector('.hm-key[data-letter="' + letter + '"]');
        key.disabled = true;

        if (current.name.includes(letter)) {
            key.classList.add("right");
            $h("hm-feedback").textContent = "";
        } else {
            key.classList.add("wrong");
            mistakes++;

            const globe = $h("hm-globe");
            globe.classList.remove("hit");
            void globe.getBoundingClientRect();      // restart the shake animation
            globe.classList.add("hit");

            $h("hm-feedback").style.color = "#ff7185";
            $h("hm-feedback").textContent = "💥 The globe cracks!";

            if (mistakes === FLAG_HINT_AT) showFlag();
        }

        render();

        const solved = current.name.split("")
            .every(ch => !/[A-Z]/.test(ch) || guessed.has(ch));

        if (solved) return finish(true);
        if (mistakes >= MAX_MISTAKES) finish(false);
    }

    function showFlag() {
        const img = document.createElement("img");
        img.className = "hm-flag";
        img.alt = "Hint flag";
        img.src = "https://flagcdn.com/w160/" + current.code + ".png";
        img.onerror = () => img.remove();              // offline: just skip the hint
        $h("hm-flagbox").appendChild(img);
        $h("hm-feedback").textContent += "  🚩 Flag hint unlocked!";
    }

    function finish(won) {
        over = true;
        document.querySelectorAll(".hm-key").forEach(k => k.disabled = true);

        if (won) {
            streak++;
            wins++;
            $h("hm-streak").textContent = streak;

            if (streak > bestStreak) {
                bestStreak = streak;
                localStorage.setItem("worldHangmanBest", bestStreak);
                $h("hm-best").textContent = bestStreak;
            }

            const xp = 10 + (MAX_MISTAKES - mistakes) * 5;
            $h("hm-globe").classList.add("won");
            $h("hm-feedback").style.color = "#48d89a";
            $h("hm-feedback").textContent = "🎉 You saved the globe! +" + xp + " XP";
            $h("hm-end-title").textContent = "Globe saved!";
            $h("hm-end-text").innerHTML = "It was <strong>" + current.display + "</strong>. +" + xp + " XP";

            addXP(xp);
            if (streak % 5 === 0) {
                addXP(25);
                showToast("Streak of " + streak + "! +25 XP", "fa-fire", true);
            }
        } else {
            streak = 0;
            $h("hm-streak").textContent = 0;
            $h("hm-globe").classList.add("lost");
            render(true);                                // show the missing letters in red
            $h("hm-feedback").style.color = "#ff7185";
            $h("hm-feedback").textContent = "💔 The globe shattered!";
            $h("hm-end-title").textContent = "Globe shattered...";
            $h("hm-end-text").innerHTML = "The country was <strong>" + current.display + "</strong>.";
        }

        setTimeout(() => {
            if (over) $h("hm-end").classList.remove("hidden");
        }, won ? 1100 : 1500);
    }

    // ---------- Events ----------
    navBtn.addEventListener("click", start);
    $h("hm-next").addEventListener("click", newWord);
    $h("hm-close").addEventListener("click", () => screen.classList.add("hidden"));

    // Physical keyboard. Registered on window in the capture phase so the quiz's own
    // A-D / 1-4 shortcuts behind this screen don't also fire.
    window.addEventListener("keydown", e => {
        if (screen.classList.contains("hidden")) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === "Escape") {
            screen.classList.add("hidden");
            e.stopPropagation();
            return;
        }

        if (e.key === "Enter" && over) {
            e.preventDefault();
            e.stopPropagation();
            newWord();
            return;
        }

        if (/^[a-zA-Z]$/.test(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            guess(e.key.toUpperCase());
        }
    }, true);
})();