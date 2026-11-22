const MAP_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

// Names must match the world-atlas dataset
const MAP_COUNTRIES = [
    "France", "Germany", "Italy", "Spain", "Portugal", "United Kingdom",
    "Norway", "Sweden", "Finland", "Poland", "Ukraine", "Greece", "Turkey",
    "Egypt", "Nigeria", "Kenya", "South Africa", "Ethiopia", "Morocco",
    "Brazil", "Argentina", "Chile", "Peru", "Colombia", "Mexico", "Canada",
    "United States of America", "Russia", "China", "India", "Japan",
    "South Korea", "Thailand", "Indonesia", "Australia", "New Zealand",
    "Saudi Arabia", "Iran", "Kazakhstan", "Mongolia", "Albania", "Cuba"
];

// EUROPE BLIND MAP: only these countries are drawn.
// Names that are not found in the dataset are skipped automatically.
const EUROPE_COUNTRIES = [
    "Albania", "Austria", "Belarus", "Belgium", "Bosnia and Herz.",
    "Bulgaria", "Croatia", "Czechia", "Denmark", "Estonia", "Finland",
    "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland",
    "Italy", "Latvia", "Lithuania", "Moldova", "Netherlands",
    "North Macedonia", "Macedonia", "Norway", "Poland", "Portugal",
    "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Ukraine", "United Kingdom"
];

const MAP_ROUNDS = 10;
const MAP_TRIES = 3;

let mapData = null;
let mapMode = "world";          // "world" or "europe"
let mapQueue = [];
let mapRound = 0;
let mapScore = 0;
let mapTries = MAP_TRIES;
let mapLocked = false;
let mapSvg, mapZoom;

async function openMapGame(mode = "world") {
    mapMode = mode;

    $("map-screen").classList.remove("hidden");
    $("map-target").textContent = "Loading map...";

    $("map-screen").querySelector(".map-label").textContent =
        mapMode === "europe" ? "FIND IT - NO BORDERS!" : "FIND THIS COUNTRY";

    if (!mapData) {
        try {
            const world = await (await fetch(MAP_URL)).json();
            mapData = topojson.feature(world, world.objects.countries).features;
        } catch (e) {
            $("map-target").textContent = "Could not load the map.";
            return;
        }
    }

    drawMap();      // redrawn every time, because each mode looks different
    startMapGame();
}

function drawMap() {
    const europe = mapMode === "europe";

    // Europe uses a smaller, taller drawing area
    const w = europe ? 720 : 960;
    const h = europe ? 520 : 500;

    const container = $("map-container");
    container.innerHTML = "";
    container.classList.toggle("europe-blind", europe);

    mapSvg = d3.select(container).append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .attr("class", "world-map");

    // Europe: zoomed-in projection. World: whole globe.
    const projection = europe
        ? d3.geoConicConformal()
            .rotate([-12, 0])
            .center([0, 54])
            .parallels([40, 65])
            .scale(820)
            .translate([w / 2, h / 2])
        : d3.geoNaturalEarth1().fitSize([w, h], { type: "Sphere" });

    const path = d3.geoPath(projection);

    const features = europe
        ? mapData.filter(d => EUROPE_COUNTRIES.includes(d.properties.name))
        : mapData;

    const g = mapSvg.append("g");

    // The sea shape is only needed on the world map
    // (the Europe container already has the sea colour as its background)
    if (!europe) {
        g.append("path")
            .datum({ type: "Sphere" })
            .attr("class", "map-sea")
            .attr("d", path);
    }

    g.selectAll(".country")
        .data(features)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .on("click", (event, d) => handleMapClick(d.properties.name, event.currentTarget));

    mapZoom = d3.zoom()
        .scaleExtent([1, 12])
        .translateExtent([[0, 0], [w, h]])
        .on("zoom", e => g.attr("transform", e.transform));

    mapSvg.call(mapZoom);
}

function startMapGame() {
    const names = mapMode === "europe" ? EUROPE_COUNTRIES : MAP_COUNTRIES;

    const available = names.filter(n =>
        mapData.some(d => d.properties.name === n)
    );

    mapQueue = shuffle(available).slice(0, MAP_ROUNDS);
    mapRound = 0;
    mapScore = 0;

    $("map-end").classList.add("hidden");
    mapSvg.call(mapZoom.transform, d3.zoomIdentity);
    nextMapRound();
}

function nextMapRound() {
    if (mapRound >= mapQueue.length) return endMapGame();

    mapTries = MAP_TRIES;
    mapLocked = false;

    d3.selectAll(".country").attr("class", "country");

    $("map-target").textContent = mapQueue[mapRound];
    $("map-feedback").textContent = "";
    updateMapInfo();
}

function updateMapInfo() {
    $("map-round").textContent = (mapRound + 1) + "/" + mapQueue.length;
    $("map-score").textContent = mapScore;
    $("map-tries").textContent = mapTries;
}

function handleMapClick(name, element) {
    if (mapLocked) return;

    const target = mapQueue[mapRound];
    const feedback = $("map-feedback");

    if (name === target) {
        mapLocked = true;
        const points = [100, 50, 25][MAP_TRIES - mapTries];
        mapScore += points;

        element.classList.add("map-correct");
        feedback.textContent = "🎉 Correct! +" + points + " points";
        feedback.style.color = "#48d89a";
        updateMapInfo();

        mapRound++;
        setTimeout(nextMapRound, 1200);
        return;
    }

    mapTries--;
    element.classList.add("map-wrong");
    setTimeout(() => element.classList.remove("map-wrong"), 700);

    if (mapTries <= 0) {
        mapLocked = true;
        feedback.textContent = "❌ Out of tries! Showing " + target + "...";
        feedback.style.color = "#ff7185";

        d3.selectAll(".country")
            .filter(d => d.properties.name === target)
            .classed("map-reveal", true);

        updateMapInfo();
        mapRound++;
        setTimeout(nextMapRound, 2200);
    } else {
        feedback.textContent = "❌ That was " + name + ". Try again!";
        feedback.style.color = "#ff7185";
        updateMapInfo();
    }
}

function endMapGame() {
    $("map-target").textContent = "Well done!";
    $("map-final").textContent = mapScore;
    $("map-end").classList.remove("hidden");

    addXP(Math.round(mapScore / 10));   // reward XP using your existing system
}

$("map-nav").addEventListener("click", () => openMapGame("world"));
$("europe-nav").addEventListener("click", () => openMapGame("europe"));
$("map-again").addEventListener("click", startMapGame);
$("map-close").addEventListener("click", () => {
    $("map-screen").classList.add("hidden");
});
