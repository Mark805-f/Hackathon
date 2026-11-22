// =====================================
// HEADER GLOBE: a rotating 3D globe you can drag, with country hover
// Needs: d3, topojson (both already loaded in your index.html)
// =====================================
(() => {
    const topbar = document.querySelector(".topbar");
    if (!topbar || typeof d3 === "undefined") return;

    const SPIN_SPEED = 12;                      // degrees per second
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- Elements ----------
    const wrap = document.createElement("div");
    wrap.className = "globe-wrap";
    wrap.innerHTML = `
        <canvas class="globe-canvas" aria-label="Rotating globe. Drag to spin it."></canvas>
        <div class="globe-label">Drag to spin</div>`;

    // Sits between the title (left) and the stats (right)
    topbar.insertBefore(wrap, topbar.querySelector(".top-stats"));

    const canvas = wrap.querySelector(".globe-canvas");
    const label = wrap.querySelector(".globe-label");
    const ctx = canvas.getContext("2d");

    // ---------- Styles ----------
    const style = document.createElement("style");
    style.textContent = `
        .globe-wrap {
            position: relative;
            width: 140px;
            height: 140px;
            margin: -14px 0;                    /* keeps the header from growing taller */
            flex-shrink: 0;
        }
        .globe-canvas {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 50%;
            cursor: grab;
            touch-action: pan-y;                /* vertical swipes still scroll the page */
            box-shadow:
                0 0 40px rgba(97, 212, 241, 0.28),
                0 0 90px rgba(167, 139, 250, 0.16);
            transition: box-shadow 0.3s;
        }
        .globe-canvas:hover {
            box-shadow:
                0 0 50px rgba(97, 212, 241, 0.42),
                0 0 100px rgba(167, 139, 250, 0.24);
        }
        .globe-canvas.dragging { cursor: grabbing; }
        .globe-label {
            position: absolute;
            left: 50%;
            bottom: -18px;
            transform: translateX(-50%);
            white-space: nowrap;
            font-size: 11px;
            letter-spacing: 1px;
            color: #7787a3;
            pointer-events: none;
            transition: color 0.2s;
        }
        .globe-label.active { color: #ffd166; font-weight: bold; }

        @media (max-width: 550px) {
            .globe-wrap { width: 110px; height: 110px; align-self: center; margin: 0 0 10px; }
        }
    `;
    document.head.appendChild(style);

    // ---------- Projection & state ----------
    const projection = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(projection, ctx);
    const sphere = { type: "Sphere" };
    const graticule = d3.geoGraticule10();

    let size = 140;
    let oceanGradient, shadeGradient;
    let rotation = { lon: 0, lat: -20 };        // lat is negative to tilt the north pole toward us
    let dragging = false;
    let hoverActive = false;
    let hovered = null;

    let land = null;                            // land shape
    let borders = null;                         // country border lines
    let countries = [];                         // for hover detection

    // ---------- Sizing (sharp on high-DPI screens) ----------
    function resize() {
        size = wrap.clientWidth || 140;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const r = size / 2 - 1;
        projection.translate([size / 2, size / 2]).scale(r);

        // Ocean: lit from the top-left
        oceanGradient = ctx.createRadialGradient(size * 0.35, size * 0.3, size * 0.05, size / 2, size / 2, r);
        oceanGradient.addColorStop(0, "#2a79b8");
        oceanGradient.addColorStop(1, "#0d2a52");

        // Shading overlay: dark rim + soft highlight, makes it look round
        shadeGradient = ctx.createRadialGradient(size * 0.38, size * 0.33, r * 0.2, size / 2, size / 2, r);
        shadeGradient.addColorStop(0, "rgba(255,255,255,0.14)");
        shadeGradient.addColorStop(0.55, "rgba(0,0,0,0)");
        shadeGradient.addColorStop(1, "rgba(3,8,22,0.6)");
    }

    // ---------- Drawing ----------
    function draw() {
        projection.rotate([rotation.lon, rotation.lat]);
        ctx.clearRect(0, 0, size, size);

        // Ocean
        ctx.beginPath();
        path(sphere);
        ctx.fillStyle = oceanGradient;
        ctx.fill();

        // Grid lines
        ctx.beginPath();
        path(graticule);
        ctx.strokeStyle = "rgba(97, 212, 241, 0.16)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Land and borders
        if (land) {
            ctx.beginPath();
            path(land);
            ctx.fillStyle = "#3fbf9a";
            ctx.fill();

            ctx.beginPath();
            path(borders);
            ctx.strokeStyle = "rgba(10, 30, 50, 0.55)";
            ctx.lineWidth = 0.4;
            ctx.stroke();
        }

        // Hovered country
        if (hovered) {
            ctx.beginPath();
            path(hovered);
            ctx.fillStyle = "#ffd166";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        // Round shading on top
        ctx.beginPath();
        path(sphere);
        ctx.fillStyle = shadeGradient;
        ctx.fill();

        // Thin rim
        ctx.beginPath();
        path(sphere);
        ctx.strokeStyle = "rgba(159, 220, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // ---------- Animation loop ----------
    let last = performance.now();

    function frame(now) {
        const dt = Math.min((now - last) / 1000, 0.1);   // cap, so tab switching doesn't jump
        last = now;

        if (!reduceMotion && !dragging && !hoverActive) {
            rotation.lon += SPIN_SPEED * dt;
        }

        draw();
        requestAnimationFrame(frame);
    }

    // ---------- Dragging ----------
    let lastX = 0, lastY = 0;

    canvas.addEventListener("pointerdown", e => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.classList.add("dragging");
        canvas.setPointerCapture(e.pointerId);
        setHover(null);
    });

    canvas.addEventListener("pointermove", e => {
        if (dragging) {
            rotation.lon += (e.clientX - lastX) * 0.4;
            rotation.lat = Math.max(-70, Math.min(70, rotation.lat - (e.clientY - lastY) * 0.3));
            lastX = e.clientX;
            lastY = e.clientY;
            return;
        }

        hoverActive = true;
        const rect = canvas.getBoundingClientRect();
        findCountry(e.clientX - rect.left, e.clientY - rect.top);
    });

    function endDrag(e) {
        dragging = false;
        canvas.classList.remove("dragging");
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    canvas.addEventListener("pointerleave", () => {
        hoverActive = false;
        setHover(null);
    });

    // ---------- Hover: which country is under the cursor? ----------
    function findCountry(x, y) {
        const point = projection.invert([x, y]);

        if (!point || isNaN(point[0]) || !countries.length) return setHover(null);

        // Reject points off the edge of the globe
        const dx = x - size / 2, dy = y - size / 2;
        if (dx * dx + dy * dy > (size / 2) * (size / 2)) return setHover(null);

        setHover(countries.find(f => d3.geoContains(f, point)) || null);
    }

    function setHover(feature) {
        if (feature === hovered) return;
        hovered = feature;

        if (feature) {
            label.textContent = feature.properties.name;
            label.classList.add("active");
        } else {
            label.textContent = "Drag to spin";
            label.classList.remove("active");
        }
    }

    // ---------- Load the map data (the globe still works without it) ----------
    async function loadMap() {
        try {
            const url = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
            const topo = await (await fetch(url)).json();

            land = topojson.merge(topo, topo.objects.countries.geometries);
            borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
            countries = topojson.feature(topo, topo.objects.countries).features
                .filter(f => f.properties.name);
        } catch (e) {
            // Offline: you just get the ocean sphere with grid lines
        }
    }

    // ---------- Start ----------
    resize();
    window.addEventListener("resize", resize);
    loadMap();
    requestAnimationFrame(frame);
})();