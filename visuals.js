// =====================================
// QUESTION VISUALS: gradient icon badges instead of emoji
// Uses Font Awesome (already loaded). Must be loaded BEFORE script.js.
//
// To pick an icon for one specific question, add  icon: "microchip"
// to that question. Otherwise the emoji in `visual` is translated below.
// Browse icon names (free, solid) at https://fontawesome.com/icons
// =====================================

// emoji -> Font Awesome icon name
const EMOJI_TO_ICON = {
    // Geography
    "🏔️": "mountain", "⛰️": "mountain", "🌊": "water", "🏛️": "landmark",
    "🗼": "tower-observation", "🗺️": "map", "🦘": "paw", "🍁": "leaf",
    "🧊": "snowflake", "🌍": "earth-africa", "🌐": "globe", "🌉": "bridge",
    "🗾": "torii-gate", "🏙️": "city", "🐪": "mosque", "🥾": "shoe-prints",
    "🌋": "volcano", "🏜️": "cactus", "🏝️": "umbrella-beach", "🌅": "sun",

    // History
    "🏺": "monument", "🚀": "rocket", "🕊️": "dove", "🇺🇸": "flag-usa",
    "🧱": "border-all", "🚢": "ship", "⚔️": "shield-halved", "🎨": "palette",
    "🖼️": "paintbrush", "🧭": "compass", "⚜️": "crown", "🧑‍🚀": "user-astronaut",
    "🐎": "horse", "🏅": "medal",

    // Science
    "🪐": "satellite", "🧪": "flask-vial", "☀️": "sun", "🫀": "heart-pulse",
    "💎": "gem", "🌱": "seedling", "🌌": "star", "🥇": "coins",
    "🧬": "dna", "⚡": "bolt", "🦴": "bone", "🫁": "lungs",
    "🌡️": "temperature-half", "🍎": "apple-whole", "🩸": "droplet",
    "🧂": "flask", "🧠": "brain", "🎈": "atom",

    // World facts
    "🫒": "leaf", "🍫": "cookie-bite", "🐼": "paw", "👥": "users",
    "💴": "yen-sign", "🗽": "monument", "🍣": "fish", "🕌": "mosque",
    "🗣️": "comments",

    // Technology
    "💻": "laptop-code", "📚": "layer-group", "♾️": "infinity", "🧩": "puzzle-piece",
    "🔁": "rotate", "💬": "comment-dots", "💾": "hard-drive", "🎮": "gamepad",
    "🧮": "memory", "🔗": "link", "🔒": "lock", "📖": "book-open",
    "🎣": "fish", "🔐": "lock", "🦠": "virus", "🔑": "key",
    "🤖": "robot", "🗄️": "database", "🗃️": "database", "📈": "chart-line",

    // Mystery world & misc
    "🚩": "flag", "🏰": "chess-rook", "🕐": "clock", "🏞️": "mountain-sun",
    "🏳️": "flag"
};

// Fallback icon when an emoji has no match
const CATEGORY_ICON = {
    "Geography": "earth-europe",
    "History": "landmark",
    "Science": "flask",
    "Technology": "microchip",
    "World Facts": "globe",
    "Flags": "flag",
    "Mystery World": "user-secret"
};

// Two gradient colours per category
const CATEGORY_COLORS = {
    "Geography":     ["#48d89a", "#2dd4bf"],
    "History":       ["#ffb45f", "#ff7a59"],
    "Science":       ["#5ea8ff", "#8d83ff"],
    "Technology":    ["#a78bfa", "#e879f9"],
    "Flags":         ["#ff7185", "#ff9d52"],
    "World Facts":   ["#2dd4bf", "#61d4f1"],
    "Mystery World": ["#c4a8ff", "#a78bfa"]
};
const DEFAULT_COLORS = ["#61d4f1", "#8d83ff"];

// Emoji can carry an invisible variation selector, so strip it before looking up
const stripEmoji = s => (s || "").replace(/\uFE0F/g, "");
const ICON_LOOKUP = {};
Object.keys(EMOJI_TO_ICON).forEach(e => { ICON_LOOKUP[stripEmoji(e)] = EMOJI_TO_ICON[e]; });

function renderVisual(container, q) {

    const icon =
        q.icon ||
        ICON_LOOKUP[stripEmoji(q.visual)] ||
        CATEGORY_ICON[q.category] ||
        "circle-question";

    const [c1, c2] = CATEGORY_COLORS[q.category] || DEFAULT_COLORS;

    const badge = document.createElement("div");
    badge.className = "visual-badge";
    badge.style.setProperty("--c1", c1);
    badge.style.setProperty("--c2", c2);

    const i = document.createElement("i");
    i.className = "fa-solid fa-" + icon;
    i.setAttribute("aria-hidden", "true");

    badge.appendChild(i);
    container.innerHTML = "";
    container.appendChild(badge);
}

// ---------- Styles ----------
(() => {
    const style = document.createElement("style");
    style.textContent = `
        .visual-badge {
            position: relative;
            width: clamp(88px, 12vw, 116px);
            aspect-ratio: 1;
            display: grid;
            place-items: center;
            border-radius: 30px;
            transform: rotate(-4deg);
            background: linear-gradient(145deg, var(--c1), var(--c2));
            box-shadow:
                0 16px 40px rgba(0, 0, 0, 0.35),
                0 0 38px color-mix(in srgb, var(--c1) 40%, transparent),
                inset 0 2px 0 rgba(255, 255, 255, 0.4),
                inset 0 -10px 20px rgba(0, 0, 0, 0.18);
            animation: ansIn 0.5s both;
        }

        /* soft glossy highlight in the top-left corner */
        .visual-badge::before {
            content: "";
            position: absolute;
            inset: 5px 38% 52% 5px;
            border-radius: 24px 50% 50% 50%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0));
            pointer-events: none;
        }

        /* thin outer ring */
        .visual-badge::after {
            content: "";
            position: absolute;
            inset: -8px;
            border-radius: 36px;
            border: 1.5px solid color-mix(in srgb, var(--c1) 45%, transparent);
            pointer-events: none;
        }

        /* beat the old gradient-text rule on .question-visual i */
        .question-visual .visual-badge i {
            background: none;
            -webkit-background-clip: border-box;
            background-clip: border-box;
            color: #fff;
            animation: none;
            font-size: clamp(38px, 5.5vw, 54px);
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }
    `;
    document.head.appendChild(style);
})();