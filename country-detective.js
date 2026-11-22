// =====================================
// COUNTRY DETECTIVE (Worldle-style)
// Guess the secret country. Each guess shows distance, direction and closeness.
// Needs: d3, topojson, addXP, showToast (all already in your project)
// =====================================
(() => {
    const MAX_GUESSES = 6;
    const EARTH_KM = 6371;
    const HALF_EARTH_KM = 20015;          // farthest two points can be apart
    const SHAPE_HINT_AT = 3;              // silhouette appears after this many guesses

    // Tiny / disputed / odd entries in the 110m map data
    const EXCLUDE = new Set([
        "Antarctica", "Fr. S. Antarctic Lands", "N. Cyprus", "Somaliland",
        "Falkland Is.", "W. Sahara", "Palestine", "Kosovo", "New Caledonia", "Greenland"
    ]);

    let countries = null;                 // [{ name, feature, c: [lon, lat] }]
    let target, guesses, over, activeSuggestion = -1;
    let solved = Number(localStorage.getItem("worldDetectiveSolved") || 0);

    // ---------- Sidebar button ----------
    const navBtn = document.createElement("button");
    navBtn.className = "nav-item map-nav";      // "map-nav" makes script.js ignore it
    navBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass-location"></i> Country Detective';
    document.querySelector(".sidebar").insertBefore(
        navBtn, document.querySelector(".sidebar-bottom")
    );

    // ---------- Styles ----------
    const style = document.createElement("style");
    style.textContent = `
        .cd-box{max-width:760px}
        .cd-shape{display:grid;place-items:center;height:170px;margin:16px 0;background:#0f1a2b;
            border-radius:14px;color:#7787a3;font-size:12px;text-align:center;padding:10px}
        .cd-shape svg{height:100%;width:100%}
        .cd-shape path{fill:#61d4f1;stroke:#a78bfa;stroke-width:1.5;filter:drop-shadow(0 0 12px rgba(97,212,241,.4))}
        .cd-input-wrap{position:relative;display:flex;gap:10px}
        .cd-input-wrap input{flex:1;min-width:0;padding:15px;background:#111729;border:1px solid #3b506d;
            border-radius:10px;color:#fff;font-size:15px;outline:none}
        .cd-input-wrap input:focus{border-color:#61d4f1}
        .cd-input-wrap button{background:#55c9e8;color:#102136;border:none;border-radius:10px;
            padding:0 24px;font-weight:900;cursor:pointer;transition:.2s}
        .cd-input-wrap button:hover:not(:disabled){background:#8ce7f8}
        .cd-input-wrap button:disabled,.cd-input-wrap input:disabled{opacity:.4;cursor:not-allowed}
        .cd-suggest{position:absolute;top:100%;left:0;right:90px;z-index:5;margin-top:4px;
            background:#1b2b45;border:1px solid #3b5275;border-radius:10px;overflow:hidden;
            box-shadow:0 12px 30px rgba(0,0,0,.5)}
        .cd-suggest div{padding:11px 15px;cursor:pointer;font-size:14px}
        .cd-suggest div.active,.cd-suggest div:hover{background:#304d70;color:#61d4f1}
        .cd-rows{margin-top:16px;display:flex;flex-direction:column;gap:8px}
        .cd-row{display:grid;grid-template-columns:1.6fr 1fr 44px 1.2fr;gap:10px;align-items:center;
            background:#263852;border:1px solid #3b506d;border-radius:10px;padding:12px 14px;
            font-size:13px;animation:ansIn .4s both}
        .cd-row.empty{opacity:.25;justify-items:center;grid-template-columns:1fr}
        .cd-row.win{border-color:#48d89a;background:#176443;box-shadow:0 0 25px rgba(72,216,154,.3)}
        .cd-name{font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .cd-dist{color:#ffd166;font-weight:bold}
        .cd-arrow{font-size:22px;text-align:center;color:#61d4f1}
        .cd-close{display:flex;align-items:center;gap:8px}
        .cd-bar{flex:1;height:8px;background:#30415b;border-radius:20px;overflow:hidden}
        .cd-bar div{height:100%;border-radius:20px}
        .cd-pct{min-width:38px;text-align:right;font-weight:bold;font-size:12px}
        @media(max-width:550px){
            .cd-row{grid-template-columns:1.3fr 1fr 32px;font-size:12px}
            .cd-close{grid-column:1 / -1}
            .cd-suggest{right:0}
            .cd-input-wrap{flex-wrap:wrap}.cd-input-wrap button{padding:14px;width:100%}
        }
    `;
    document.head.appendChild(style);

    // ---------- Overlay ----------
    const screen = document.createElement("div");
    screen.className = "map-screen hidden";
    screen.innerHTML = `
        <div class="map-box cd-box">
            <div class="map-top">
                <div>
                    <p class="map-label">COUNTRY DETECTIVE</p>
                    <h2 style="font-size:clamp(18px,3vw,24px);color:#ffd166;margin-top:6px;">
                        Find the secret country
                    </h2>
                </div>
                <div class="map-info">
                    <span>Guess <strong id="cd-count">0/${MAX_GUESSES}</strong></span>
                    <span>Solved <strong id="cd-solved">${solved}</strong></span>
                </div>
                <button id="cd-close"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="cd-shape" id="cd-shape">
                Shape hint unlocks after ${SHAPE_HINT_AT} guesses
            </div>

            <div class="cd-input-wrap">
                <input id="cd-input" type="text" placeholder="Type a country..." autocomplete="off">
                <button id="cd-guess">GUESS</button>
                <div class="cd-suggest hidden" id="cd-suggest"></div>
            </div>

            <p id="cd-feedback" style="min-height:22px;margin:12px 0 0;font-weight:bold;"></p>
            <div class="cd-rows" id="cd-rows"></div>

            <div id="cd-end" class="map-end hidden">
                <h2 id="cd-end-title"></h2>
                <p id="cd-end-text"></p>
                <button id="cd-again">Play Again</button>
            </div>
        </div>`;
    document.body.appendChild(screen);

    const $c = id => document.getElementById(id);

    // ---------- Geometry helpers ----------
    // Centroid of the biggest polygon, so islands don't drag it into the sea
    function centroidOf(feature) {
        const g = feature.geometry;
        if (g.type === "MultiPolygon") {
            let best = null, bestArea = -1;
            g.coordinates.forEach(coords => {
                const poly = { type: "Polygon", coordinates: coords };
                const area = d3.geoArea(poly);
                if (area > bestArea) { bestArea = area; best = poly; }
            });
            return d3.geoCentroid(best);
        }
        return d3.geoCentroid(feature);
    }

    const rad = d => d * Math.PI / 180;

    // Compass bearing from point a to point b, in degrees 0-360
    function bearing(a, b) {
        const [l1, p1] = [rad(a[0]), rad(a[1])];
        const [l2, p2] = [rad(b[0]), rad(b[1])];
        const y = Math.sin(l2 - l1) * Math.cos(p2);
        const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    const ARROWS = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
    const arrowFor = deg => ARROWS[Math.round(deg / 45) % 8];

    function closenessColor(pct) {
        if (pct >= 80) return "#48d89a";
        if (pct >= 50) return "#ffd166";
        return "#ff7185";
    }

    // ---------- Map data ----------
    async function loadData() {
        if (countries) return;

        const url = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
        const topo = await (await fetch(url)).json();
        const feats = topojson.feature(topo, topo.objects.countries).features;

        countries = feats
            .filter(f => f.properties.name && !EXCLUDE.has(f.properties.name))
            .map(f => ({ name: f.properties.name, feature: f, c: centroidOf(f) }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // ---------- Game flow ----------
    async function start() {
        screen.classList.remove("hidden");
        $c("cd-feedback").style.color = "#91a2bd";
        $c("cd-feedback").textContent = "Loading map data...";

        try {
            await loadData();
        } catch (e) {
            $c("cd-feedback").style.color = "#ff7185";
            $c("cd-feedback").textContent = "Could not load map data. Check your internet connection.";
            return;
        }

        target = countries[Math.floor(Math.random() * countries.length)];
        guesses = [];
        over = false;

        $c("cd-end").classList.add("hidden");
        $c("cd-shape").textContent = "Shape hint unlocks after " + SHAPE_HINT_AT + " guesses";
        $c("cd-feedback").textContent = "";
        $c("cd-input").value = "";
        $c("cd-input").disabled = false;
        $c("cd-guess").disabled = false;
        hideSuggestions();
        renderRows();
        updateCount();
        $c("cd-input").focus();
    }

    function updateCount() {
        $c("cd-count").textContent = guesses.length + "/" + MAX_GUESSES;
        $c("cd-solved").textContent = solved;
    }

    function renderRows() {
        const box = $c("cd-rows");
        box.innerHTML = "";

        for (let i = 0; i < MAX_GUESSES; i++) {
            const g = guesses[i];
            const row = document.createElement("div");

            if (!g) {
                row.className = "cd-row empty";
                row.textContent = "Guess " + (i + 1);
                box.appendChild(row);
                continue;
            }

            row.className = "cd-row" + (g.win ? " win" : "");

            const name = document.createElement("span");
            name.className = "cd-name";
            name.textContent = g.name;

            const dist = document.createElement("span");
            dist.className = "cd-dist";
            dist.textContent = g.win ? "🎯 Found!" : g.km.toLocaleString() + " km";

            const arrow = document.createElement("span");
            arrow.className = "cd-arrow";
            arrow.textContent = g.win ? "✔" : g.arrow;

            const close = document.createElement("span");
            close.className = "cd-close";
            const color = closenessColor(g.pct);
            close.innerHTML =
                '<span class="cd-bar"><div style="width:' + g.pct + '%;background:' + color + '"></div></span>' +
                '<span class="cd-pct" style="color:' + color + '">' + g.pct + '%</span>';

            row.append(name, dist, arrow, close);
            box.appendChild(row);
        }
    }

    function showShape() {
        const box = $c("cd-shape");
        box.innerHTML = "";

        const W = 300, H = 170;
        const projection = d3.geoAzimuthalEqualArea()
            .rotate([-target.c[0], -target.c[1]])
            .fitSize([W - 20, H - 20], target.feature)
            .translate([W / 2, H / 2]);

        // fitSize sets translate for its own box, so re-center after
        const svg = d3.select(box).append("svg").attr("viewBox", `0 0 ${W} ${H}`);
        const path = d3.geoPath(projection);
        const b = path.bounds(target.feature);
        const dx = W / 2 - (b[0][0] + b[1][0]) / 2;
        const dy = H / 2 - (b[0][1] + b[1][1]) / 2;

        svg.append("g")
            .attr("transform", `translate(${dx},${dy})`)
            .append("path")
            .attr("d", path(target.feature));
    }

    function submitGuess(name) {
        if (over) return;

        const entry = countries.find(c => c.name.toLowerCase() === name.trim().toLowerCase());
        const fb = $c("cd-feedback");

        if (!entry) {
            fb.style.color = "#ff7185";
            fb.textContent = "❌ Pick a country from the list.";
            return;
        }

        if (guesses.some(g => g.name === entry.name)) {
            fb.style.color = "#ffd166";
            fb.textContent = "You already guessed " + entry.name + ".";
            return;
        }

        fb.textContent = "";
        $c("cd-input").value = "";
        hideSuggestions();

        const win = entry.name === target.name;
        const km = Math.round(d3.geoDistance(entry.c, target.c) * EARTH_KM);
        const pct = win ? 100 : Math.max(0, Math.round((1 - km / HALF_EARTH_KM) * 100));

        guesses.push({
            name: entry.name,
            win,
            km,
            pct,
            arrow: win ? "✔" : arrowFor(bearing(entry.c, target.c))
        });

        renderRows();
        updateCount();

        if (guesses.length >= SHAPE_HINT_AT && !win) showShape();

        if (win) return finish(true);
        if (guesses.length >= MAX_GUESSES) finish(false);
    }

    function finish(won) {
        over = true;
        $c("cd-input").disabled = true;
        $c("cd-guess").disabled = true;
        hideSuggestions();
        showShape();

        if (won) {
            solved++;
            localStorage.setItem("worldDetectiveSolved", solved);
            $c("cd-solved").textContent = solved;

            const xp = (MAX_GUESSES - guesses.length + 1) * 10;
            $c("cd-end-title").textContent = "🕵️ Case solved!";
            $c("cd-end-text").innerHTML =
                "It was <strong>" + target.name + "</strong>, found in " +
                guesses.length + " guess" + (guesses.length > 1 ? "es" : "") + ". +" + xp + " XP";
            addXP(xp);
            showToast("Case solved! +" + xp + " XP", "fa-magnifying-glass-location", true);
        } else {
            $c("cd-end-title").textContent = "Case closed...";
            $c("cd-end-text").innerHTML = "The secret country was <strong>" + target.name + "</strong>.";
        }

        // Let the player see the final board before the overlay appears
        setTimeout(() => $c("cd-end").classList.remove("hidden"), won ? 900 : 600);
    }

    // ---------- Autocomplete ----------
    function hideSuggestions() {
        $c("cd-suggest").classList.add("hidden");
        $c("cd-suggest").innerHTML = "";
        activeSuggestion = -1;
    }

    function showSuggestions() {
        const q = $c("cd-input").value.trim().toLowerCase();
        if (!q || !countries) return hideSuggestions();

        const starts = countries.filter(c => c.name.toLowerCase().startsWith(q));
        const contains = countries.filter(c =>
            !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q));
        const matches = [...starts, ...contains].slice(0, 6);

        const box = $c("cd-suggest");
        box.innerHTML = "";
        activeSuggestion = -1;

        if (matches.length === 0) return box.classList.add("hidden");

        matches.forEach(m => {
            const item = document.createElement("div");
            item.textContent = m.name;
            // mousedown fires before the input loses focus
            item.addEventListener("mousedown", e => {
                e.preventDefault();
                submitGuess(m.name);
            });
            box.appendChild(item);
        });

        box.classList.remove("hidden");
    }

    function moveSuggestion(step) {
        const items = [...$c("cd-suggest").children];
        if (!items.length) return;

        activeSuggestion = (activeSuggestion + step + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle("active", i === activeSuggestion));
    }

    // ---------- Events ----------
    const input = $c("cd-input");

    input.addEventListener("input", showSuggestions);
    input.addEventListener("blur", () => setTimeout(hideSuggestions, 120));

    input.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { e.preventDefault(); moveSuggestion(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); moveSuggestion(-1); }
        else if (e.key === "Escape") { hideSuggestions(); }
        else if (e.key === "Enter") {
            e.preventDefault();
            const items = [...$c("cd-suggest").children];
            if (activeSuggestion >= 0 && items[activeSuggestion]) {
                submitGuess(items[activeSuggestion].textContent);
            } else if (items.length === 1) {
                submitGuess(items[0].textContent);
            } else {
                submitGuess(input.value);
            }
        }
    });

    $c("cd-guess").addEventListener("click", () => submitGuess(input.value));
    $c("cd-again").addEventListener("click", start);
    $c("cd-close").addEventListener("click", () => screen.classList.add("hidden"));
    navBtn.addEventListener("click", start);
})();