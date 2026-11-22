// =====================================
// EUROPE (NO BORDERS) - europe-game.js
// Self-contained: own overlay, own IDs, own variables (wrapped in an IIFE),
// so it cannot clash with map-game.js. Needs script.js loaded first
// (uses its $, shuffle and addXP).
// =====================================
(() => {
    const URL_50M = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

    // Names must match the world-atlas dataset. Missing names are skipped safely.
    const TARGETS = [
        "Albania", "Austria", "Belarus", "Belgium", "Bosnia and Herz.", "Bulgaria",
        "Croatia", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany",
        "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Lithuania",
        "Moldova", "Montenegro", "Netherlands", "North Macedonia", "Macedonia",
        "Norway", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia",
        "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Kosovo"
    ];

    const ROUNDS = 10;
    const TRIES = 3;
    const W = 960, H = 600;

    let data = null;
    let queue = [], round = 0, score = 0, tries = TRIES, locked = false;
    let svg, zoom, overlay;

    const q = sel => overlay.querySelector(sel);

    // ---------- build the overlay + styles once ----------
    function build() {
        const style = document.createElement("style");
        style.textContent = `
            #eu-container .eu-under{fill:#5c6b8a;stroke:#5c6b8a;stroke-width:.8px;
            vector-effect:non-scaling-stroke;pointer-events:none}
            #eu-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;
                justify-content:center;background:rgba(5,8,20,.88);padding:16px}
            #eu-screen.eu-hidden{display:none}
            .eu-box{width:min(1100px,100%);max-height:100%;overflow:auto;background:#10172e;
                border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px;color:#fff;position:relative}
            .eu-top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
            .eu-label{font-size:12px;letter-spacing:2px;color:#61d4f1;margin:0}
            .eu-top h2{margin:4px 0 0;font-size:28px}
            .eu-info{display:flex;gap:16px}
            .eu-info span{opacity:.9}
            #eu-close{background:none;border:0;color:#fff;font-size:22px;cursor:pointer}
            #eu-feedback{min-height:24px;margin:10px 0;font-weight:600}
            #eu-container{border-radius:14px;overflow:hidden;background:#0b3a5b}
            #eu-container svg{display:block;width:100%;height:auto;cursor:grab}
            /* NO BORDERS: same fill for every country, no stroke */
            #eu-container .eu-country{fill:#5c6b8a;stroke:none;cursor:pointer}
            #eu-container .eu-country.eu-correct{fill:#48d89a}
            #eu-container .eu-country.eu-wrong{fill:#ff7185}
            #eu-container .eu-country.eu-reveal{fill:#ffd166}
            .eu-help{opacity:.7;font-size:13px;margin:10px 0 0}
            #eu-end{text-align:center;padding:20px}
            #eu-end.eu-hidden{display:none}
            #eu-end button{margin-top:10px;padding:12px 26px;border:0;border-radius:12px;
                background:#61d4f1;color:#0b1020;font-weight:700;cursor:pointer}
        `;
        document.head.appendChild(style);

        overlay = document.createElement("div");
        overlay.id = "eu-screen";
        overlay.className = "eu-hidden";
        overlay.innerHTML = `
            <div class="eu-box">
                <div class="eu-top">
                    <div>
                        <p class="eu-label">FIND THIS COUNTRY (NO BORDERS)</p>
                        <h2 id="eu-target">Loading...</h2>
                    </div>
                    <div class="eu-info">
                        <span>Round <strong id="eu-round">1/10</strong></span>
                        <span>Score <strong id="eu-score">0</strong></span>
                        <span>Tries <strong id="eu-tries">3</strong></span>
                    </div>
                    <button id="eu-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <p id="eu-feedback"></p>
                <div id="eu-container"></div>
                <p class="eu-help">Scroll to zoom, drag to move, click a country to answer.</p>
                <div id="eu-end" class="eu-hidden">
                    <h2>Europe Challenge Complete!</h2>
                    <p>Final score: <strong id="eu-final">0</strong></p>
                    <button id="eu-again">Play Again</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        q("#eu-close").addEventListener("click", close);
        q("#eu-again").addEventListener("click", start);

        // Block the quiz keyboard shortcuts (A-D, 1-4, Enter) while this screen is open
        document.addEventListener("keydown", e => {
            if (overlay.classList.contains("eu-hidden")) return;
            if (e.key === "Escape") { close(); return; }
            e.stopImmediatePropagation();
        }, true);
    }

    function close() {
        overlay.classList.add("eu-hidden");
    }

    // ---------- open ----------
    async function open() {
        if (!overlay) build();
        overlay.classList.remove("eu-hidden");
        q("#eu-target").textContent = "Loading map...";
        q("#eu-end").classList.add("eu-hidden");

        if (!data) {
            try {
                const world = await (await fetch(URL_50M)).json();
                data = topojson.feature(world, world.objects.countries).features;
                draw();
            } catch (e) {
                console.error("Europe map failed to load:", e);
                q("#eu-target").textContent = "Could not load the map.";
                return;
            }
        }
        start();
    }

    // ---------- draw ----------
    function draw() {
        const container = q("#eu-container");
        container.innerHTML = "";

        svg = d3.select(container).append("svg")
            .attr("viewBox", `0 0 ${W} ${H}`);

        // Zoomed in on Europe (instead of the whole globe)
        const projection = d3.geoAzimuthalEqualArea()
            .rotate([-15, -54])
            .scale(820)
            .translate([W / 2, H / 2])
            .clipExtent([[0, 0], [W, H]]);

        const path = d3.geoPath(projection);
        const g = svg.append("g");

        // Seam-filler: same-color copy of every country underneath, so no gaps show between neighbours
        g.append("g")
        .selectAll(".eu-under")
        .data(data)
        .join("path")
        .attr("class", "eu-under")
        .attr("d", path);

        g.selectAll(".eu-country")
            .data(data)
            .join("path")
            .attr("class", "eu-country")
            .attr("d", path)
            .on("click", (event, d) => handleClick(d.properties.name, event.currentTarget));

        zoom = d3.zoom()
            .scaleExtent([1, 14])
            .translateExtent([[0, 0], [W, H]])
            .on("zoom", e => g.attr("transform", e.transform));

        svg.call(zoom);
    }

    // ---------- game flow ----------
    function start() {
        const available = TARGETS.filter(n => data.some(d => d.properties.name === n));
        queue = shuffle(available).slice(0, ROUNDS);
        round = 0;
        score = 0;

        q("#eu-end").classList.add("eu-hidden");
        svg.call(zoom.transform, d3.zoomIdentity);
        nextRound();
    }

    function nextRound() {
        if (round >= queue.length) return end();

        tries = TRIES;
        locked = false;

        svg.selectAll(".eu-country").attr("class", "eu-country");

        q("#eu-target").textContent = queue[round];
        q("#eu-feedback").textContent = "";
        updateInfo();
    }

    function updateInfo() {
        q("#eu-round").textContent = (round + 1) + "/" + queue.length;
        q("#eu-score").textContent = score;
        q("#eu-tries").textContent = tries;
    }

    function handleClick(name, element) {
        if (locked) return;

        const target = queue[round];
        const feedback = q("#eu-feedback");

        if (name === target) {
            locked = true;
            const points = [100, 50, 25][TRIES - tries];
            score += points;

            element.classList.add("eu-correct");
            feedback.textContent = "🎉 Correct! +" + points + " points";
            feedback.style.color = "#48d89a";
            updateInfo();

            round++;
            setTimeout(nextRound, 1200);
            return;
        }

        tries--;
        element.classList.add("eu-wrong");
        setTimeout(() => element.classList.remove("eu-wrong"), 700);

        if (tries <= 0) {
            locked = true;
            feedback.textContent = "❌ Out of tries! Showing " + target + "...";
            feedback.style.color = "#ff7185";

            svg.selectAll(".eu-country")
                .filter(d => d.properties.name === target)
                .classed("eu-reveal", true);

            updateInfo();
            round++;
            setTimeout(nextRound, 2200);
        } else {
            feedback.textContent = "❌ That was " + name + ". Try again!";
            feedback.style.color = "#ff7185";
            updateInfo();
        }
    }

    function end() {
        q("#eu-target").textContent = "Well done!";
        q("#eu-final").textContent = score;
        q("#eu-end").classList.remove("eu-hidden");

        addXP(Math.round(score / 10));
    }

    // ---------- hook up the sidebar button ----------
    const btn = document.getElementById("europe-nav");
    if (btn) btn.addEventListener("click", open);
    else console.warn("europe-nav button not found");
})();