// =====================================
// COINS & SHOP
// - Coins are earned whenever XP is earned (1 coin per 2 XP) + a level-up bonus
// - Shop sells: power-up boosts, avatars, avatar frames, background themes, titles
// - Saved in localStorage ("worldShop")
//
// Load AFTER script.js (and before challenge.js, which should stay last).
// Needs (from script.js): addXP, showLevelUp, resetRoundState, endGame, checkAnswer,
// updatePowerups, showToast, resultScreen, timer, timerInterval, autoNextTimeout, answered,
// selectedQuestions, currentQuestion, hints, fiftyFifty, extraTime, skips, doublePoints
// =====================================
(() => {
    if (typeof addXP !== "function" || typeof resetRoundState !== "function") return;

    const XP_PER_COIN = 2;
    const LEVEL_UP_COINS = 50;
    const STARTER_COINS = 100;
    const MAX_STASH = 6;

    // ---------- Shop items ----------
    const ITEMS = {
        boosts: [
            { id: "b_hint",   key: "hint",   name: "Hint Pack",      detail: "+2 Hints",           amount: 2, price: 60, icon: "fa-lightbulb" },
            { id: "b_fifty",  key: "fifty",  name: "50/50 Pack",     detail: "+2 50/50",           amount: 2, price: 80, icon: "fa-scissors" },
            { id: "b_time",   key: "time",   name: "Time Pack",      detail: "+2 Extra Time",      amount: 2, price: 70, icon: "fa-hourglass-half" },
            { id: "b_skip",   key: "skip",   name: "Skip Pass",      detail: "+1 Skip",            amount: 1, price: 60, icon: "fa-forward" },
            { id: "b_double", key: "double", name: "Double Points",  detail: "+1 Double Points",   amount: 1, price: 90, icon: "fa-bolt" }
        ],
        avatars: [
            { id: "av_scholar",   name: "Scholar",   icon: "fa-user-graduate", price: 0 },
            { id: "av_cat",       name: "Cat",       icon: "fa-cat",           price: 150 },
            { id: "av_astronaut", name: "Astronaut", icon: "fa-user-astronaut", price: 150 },
            { id: "av_ninja",     name: "Ninja",     icon: "fa-user-ninja",    price: 200 },
            { id: "av_wizard",    name: "Wizard",    icon: "fa-hat-wizard",    price: 250 },
            { id: "av_robot",     name: "Robot",     icon: "fa-robot",         price: 250 },
            { id: "av_dragon",    name: "Dragon",    icon: "fa-dragon",        price: 400 },
            { id: "av_royal",     name: "Royal",     icon: "fa-crown",         price: 600 }
        ],
        frames: [
            { id: "fr_none",    name: "No Frame", fx: "",        price: 0 },
            { id: "fr_bronze",  name: "Bronze",   fx: "bronze",  price: 100 },
            { id: "fr_silver",  name: "Silver",   fx: "silver",  price: 200 },
            { id: "fr_gold",    name: "Gold",     fx: "gold",    price: 350 },
            { id: "fr_neon",    name: "Neon",     fx: "neon",    price: 400 },
            { id: "fr_fire",    name: "Fire",     fx: "fire",    price: 500 },
            { id: "fr_rainbow", name: "Rainbow",  fx: "rainbow", price: 600 }
        ],
        themes: [
            { id: "th_default", name: "Ocean",      theme: "",       colors: ["#168bd5", "#7545cf", "#087c9c"], price: 0 },
            { id: "th_aurora",  name: "Aurora",     theme: "aurora", colors: ["#2dd4bf", "#48d89a", "#22d3ee"], price: 250 },
            { id: "th_sunset",  name: "Sunset",     theme: "sunset", colors: ["#ff7a59", "#ff5d9e", "#ffb45f"], price: 250 },
            { id: "th_neon",    name: "Neon City",  theme: "neon",   colors: ["#e879f9", "#22d3ee", "#a78bfa"], price: 350 },
            { id: "th_space",   name: "Deep Space", theme: "space",  colors: ["#6366f1", "#8b5cf6", "#38bdf8"], price: 350 }
        ],
        titles: [
            { id: "ti_seeker",    name: "Knowledge Seeker", price: 0 },
            { id: "ti_globe",     name: "Globetrotter",     price: 100 },
            { id: "ti_titan",     name: "Trivia Titan",     price: 200 },
            { id: "ti_map",       name: "Map Master",       price: 300 },
            { id: "ti_flag",      name: "Flag Fanatic",     price: 300 },
            { id: "ti_brain",     name: "Brainiac",         price: 400 },
            { id: "ti_legend",    name: "Living Legend",    price: 600 }
        ]
    };

    const TABS = [
        { id: "boosts",  label: "Boosts",  icon: "fa-bolt" },
        { id: "avatars", label: "Avatars", icon: "fa-user-astronaut" },
        { id: "frames",  label: "Frames",  icon: "fa-circle-notch" },
        { id: "themes",  label: "Themes",  icon: "fa-palette" },
        { id: "titles",  label: "Titles",  icon: "fa-signature" }
    ];

    // Which slot each type equips into
    const SLOT = { avatars: "avatar", frames: "frame", themes: "theme", titles: "title" };
    const DEFAULT_EQUIPPED = { avatar: "av_scholar", frame: "fr_none", theme: "th_default", title: "ti_seeker" };
    const FREE_IDS = ["av_scholar", "fr_none", "th_default", "ti_seeker"];

    const allItems = Object.entries(ITEMS).flatMap(([type, list]) => list.map(i => ({ ...i, type })));
    const byId = id => allItems.find(i => i.id === id);

    // ---------- Saved data ----------
    const emptyStash = () => ({ hint: 0, fifty: 0, time: 0, skip: 0, double: 0 });

    let data = null;
    let isNewPlayer = false;

    try {
        const saved = JSON.parse(localStorage.getItem("worldShop"));
        if (saved) {
            data = {
                coins: Number(saved.coins) || 0,
                owned: Array.from(new Set([...FREE_IDS, ...(saved.owned || [])])),
                equipped: { ...DEFAULT_EQUIPPED, ...(saved.equipped || {}) },
                stash: { ...emptyStash(), ...(saved.stash || {}) }
            };
        }
    } catch (e) {}

    if (!data) {
        isNewPlayer = true;
        data = { coins: STARTER_COINS, owned: [...FREE_IDS], equipped: { ...DEFAULT_EQUIPPED }, stash: emptyStash() };
    }

    const save = () => localStorage.setItem("worldShop", JSON.stringify(data));
    const isOwned = item => data.owned.includes(item.id);
    const isEquipped = item => data.equipped[SLOT[item.type]] === item.id;
    const inRound = () => resultScreen.classList.contains("hidden");

    // ---------- Styles ----------
    const themeCSS = ITEMS.themes.filter(t => t.theme).map(t => {
        const s = `body[data-theme="${t.theme}"]`;
        return `
        ${s} .animated-background {
            background:
                radial-gradient(circle at 15% 20%, color-mix(in srgb, ${t.colors[0]} 16%, transparent), transparent 35%),
                radial-gradient(circle at 85% 75%, color-mix(in srgb, ${t.colors[1]} 16%, transparent), transparent 35%),
                #0c1220;
        }
        ${s} .glow-one   { background: ${t.colors[0]}; }
        ${s} .glow-two   { background: ${t.colors[1]}; }
        ${s} .glow-three { background: ${t.colors[2]}; }
        ${s} .particle   { background: ${t.colors[2]}; box-shadow: 0 0 12px ${t.colors[2]}; }
        ${s}::before {
            background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%),
                color-mix(in srgb, ${t.colors[0]} 11%, transparent), transparent 70%);
        }`;
    }).join("\n");

    const style = document.createElement("style");
    style.textContent = `
        /* ----- coin counter in the header ----- */
        .coin-stat { cursor: pointer; position: relative; }
        .coin-stat span i { color: #ffd166; }
        .coin-stat strong { color: #ffd166; }
        .coin-stat.bump { animation: pop 0.35s; }
        .coin-pop {
            position: absolute; right: 14px; top: 6px;
            color: #ffd166; font-weight: 900; font-size: 14px; pointer-events: none;
            animation: coinPop 1s ease-out forwards;
        }
        @keyframes coinPop {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(-26px); }
        }

        /* ----- sidebar button ----- */
        .nav-item.shop-nav { color: #ffd166; }
        .nav-item.shop-nav i { color: #ffd166; }

        /* ----- shop window ----- */
        .shop-box { max-width: 980px; max-height: 90vh; overflow-y: auto; }
        .shop-head { display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
        .shop-title { font-size: clamp(22px, 3vw, 30px); margin-top: 6px; }
        .shop-balance {
            display: flex; align-items: center; gap: 10px;
            background: #263852; border: 1px solid #405b7d; border-radius: 12px;
            padding: 10px 16px; font-weight: 900; font-size: 20px; color: #ffd166;
        }
        .shop-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin: 20px 0; }
        .shop-tab {
            background: #263852; color: #aab7cf; border: 1px solid #3b506d; border-radius: 10px;
            padding: 10px 16px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s;
        }
        .shop-tab i { margin-right: 7px; }
        .shop-tab:hover { border-color: #61d4f1; }
        .shop-tab.active { background: #55c9e8; color: #102136; border-color: #55c9e8; }
        .shop-note { color: #91a2bd; font-size: 12px; margin: -6px 0 16px; }

        .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 14px; }
        .shop-card {
            display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
            background: #263852; border: 1px solid #3b506d; border-radius: 16px; padding: 18px 12px;
            transition: 0.2s; animation: ansIn 0.35s both;
        }
        .shop-card:hover { transform: translateY(-3px); border-color: #61d4f1; }
        .shop-card.equipped { border-color: #48d89a; box-shadow: 0 0 22px rgba(72, 216, 154, 0.2); }
        .shop-preview { height: 78px; display: grid; place-items: center; }
        .shop-name { font-weight: bold; font-size: 14px; }
        .shop-detail { color: #91a2bd; font-size: 11px; min-height: 14px; }
        .shop-price { color: #ffd166; font-weight: 900; font-size: 14px; }
        .shop-price i { margin-right: 5px; }
        .shop-btn {
            width: 100%; padding: 10px; border: none; border-radius: 9px; cursor: pointer;
            background: linear-gradient(90deg, #ffd166, #f39f35); color: #281d32;
            font-weight: 900; font-size: 12px; letter-spacing: 0.05em; transition: 0.2s;
        }
        .shop-btn:hover:not(:disabled) { filter: brightness(1.12); }
        .shop-btn.equip { background: #55c9e8; color: #102136; }
        .shop-btn.poor { background: #3b506d; color: #91a2bd; }
        .shop-btn:disabled { opacity: 0.55; cursor: default; }

        .shop-icon { font-size: 44px; color: #ffd166; }
        .shop-avatar {
            width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center;
            background: #293d5c; font-size: 30px; color: #61d4f1;
        }
        .shop-swatch { width: 100%; height: 60px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); }
        .shop-title-pill {
            background: #34304e; border: 1px solid #a78bfa; color: #d9c5ff; border-radius: 20px;
            padding: 8px 14px; font-size: 12px; font-weight: bold;
        }

        /* ----- avatar frames (used on the sidebar, profile and shop previews) ----- */
        .shop-fx.fx-bronze { box-shadow: 0 0 0 3px #cd7f32, 0 0 14px rgba(205, 127, 50, 0.5); }
        .shop-fx.fx-silver { box-shadow: 0 0 0 3px #cfd8e8, 0 0 14px rgba(207, 216, 232, 0.45); }
        .shop-fx.fx-gold   { box-shadow: 0 0 0 3px #ffd166, 0 0 18px rgba(255, 209, 102, 0.6); }
        .shop-fx.fx-neon   { box-shadow: 0 0 0 2px #61d4f1, 0 0 18px #61d4f1, 0 0 40px rgba(97, 212, 241, 0.5); }
        .shop-fx.fx-fire {
            border: 3px solid transparent;
            background: linear-gradient(#293d5c, #293d5c) padding-box, linear-gradient(135deg, #ff4d2e, #ffb45f) border-box;
            box-shadow: 0 0 20px rgba(255, 110, 50, 0.65);
        }
        .shop-fx.fx-rainbow {
            border: 3px solid transparent;
            background: linear-gradient(#293d5c, #293d5c) padding-box,
                conic-gradient(#ff7185, #ffd166, #48d89a, #61d4f1, #a78bfa, #ff7185) border-box;
        }

        @media (max-width: 550px) {
            .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ----- background themes ----- */
        ${themeCSS}
    `;
    document.head.appendChild(style);

    // ---------- Coin counter in the header ----------
    const coinStat = document.createElement("div");
    coinStat.className = "stat coin-stat";
    coinStat.title = "Open the shop";
    coinStat.innerHTML = '<span><i class="fa-solid fa-coins"></i> COINS</span><strong id="coin-count">0</strong>';
    document.querySelector(".top-stats").appendChild(coinStat);

    function renderCoins() {
        document.getElementById("coin-count").textContent = data.coins.toLocaleString();
        const bal = document.getElementById("shop-balance-num");
        if (bal) bal.textContent = data.coins.toLocaleString();
    }

    function earn(amount) {
        if (amount <= 0) return;

        data.coins += amount;
        save();
        renderCoins();

        const pop = document.createElement("span");
        pop.className = "coin-pop";
        pop.textContent = "+" + amount;
        coinStat.appendChild(pop);
        setTimeout(() => pop.remove(), 1000);

        coinStat.classList.remove("bump");
        void coinStat.offsetWidth;
        coinStat.classList.add("bump");
    }

    // ---------- Earning coins ----------
    // Every XP gain (correct answers, daily bonus, chests, map games, extra modes) also pays coins
    const origAddXP = addXP;
    window.addXP = function (amount) {
        origAddXP(amount);
        earn(Math.round(amount / XP_PER_COIN));
    };

    if (typeof showLevelUp === "function") {
        const origLevelUp = showLevelUp;
        window.showLevelUp = function (index) {
            origLevelUp(index);
            earn(LEVEL_UP_COINS);
            showToast("Level-up bonus: +" + LEVEL_UP_COINS + " coins", "fa-coins", true);
        };
    }

    // ---------- Boosts: added to power-up counts at the start of a round ----------
    const BOOST_VARS = {
        hint:   n => { hints += n; },
        fifty:  n => { fiftyFifty += n; },
        time:   n => { extraTime += n; },
        skip:   n => { skips += n; },
        double: n => { doublePoints += n; }
    };

    const origReset = resetRoundState;
    window.resetRoundState = function () {
        origReset();
        // Safe to run twice in a row: the reset above sets absolute values each time
        Object.keys(BOOST_VARS).forEach(key => BOOST_VARS[key](data.stash[key]));
    };

    // Boosts are used up after one full round
    const origEnd = endGame;
    window.endGame = function () {
        origEnd();
        data.stash = emptyStash();
        save();
        if (shopScreen && !shopScreen.classList.contains("hidden")) render();
    };

    // ---------- Applying equipped cosmetics ----------
    function applyEquipped() {
        const avatar = byId(data.equipped.avatar) || ITEMS.avatars[0];
        const frame = byId(data.equipped.frame) || ITEMS.frames[0];
        const theme = byId(data.equipped.theme) || ITEMS.themes[0];
        const title = byId(data.equipped.title) || ITEMS.titles[0];

        document.querySelectorAll(".profile-icon i, .profile-avatar i").forEach(i => {
            i.className = "fa-solid " + avatar.icon;
        });

        document.querySelectorAll(".profile-icon, .profile-avatar").forEach(el => {
            el.className = el.className.replace(/\b(shop-fx|fx-\w+)\b/g, "").replace(/\s+/g, " ").trim();
            if (frame.fx) el.classList.add("shop-fx", "fx-" + frame.fx);
        });

        if (theme.theme) document.body.dataset.theme = theme.theme;
        else delete document.body.dataset.theme;

        const titleEl = document.querySelector(".sidebar-bottom p");
        if (titleEl) titleEl.textContent = title.name;
    }

    // ---------- Shop window ----------
    const shopNav = document.createElement("button");
    shopNav.className = "nav-item map-nav shop-nav";      // "map-nav": script.js leaves it alone
    shopNav.innerHTML = '<i class="fa-solid fa-store"></i> Shop';
    document.querySelector(".sidebar").insertBefore(shopNav, document.querySelector(".sidebar-bottom"));

    const shopScreen = document.createElement("div");
    shopScreen.className = "map-screen hidden";
    shopScreen.innerHTML = `
        <div class="map-box shop-box">
            <div class="shop-head">
                <div>
                    <p class="map-label">SHOP</p>
                    <h2 class="shop-title">Spend your coins</h2>
                </div>
                <div class="shop-balance"><i class="fa-solid fa-coins"></i><span id="shop-balance-num">0</span></div>
                <button id="shop-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="shop-tabs" id="shop-tabs"></div>
            <p class="shop-note" id="shop-note"></p>
            <div class="shop-grid" id="shop-grid"></div>
        </div>`;
    document.body.appendChild(shopScreen);

    const $s = id => document.getElementById(id);
    let currentTab = "boosts";
    let wasRunning = false;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function coinPrice(price) {
        const p = el("div", "shop-price");
        const icon = el("i", "fa-solid fa-coins");
        p.append(icon, price === 0 ? "Free" : String(price));
        return p;
    }

    function buildPreview(item) {
        const box = el("div", "shop-preview");

        if (item.type === "boosts") {
            const icon = el("i", "fa-solid " + item.icon + " shop-icon");
            box.appendChild(icon);
        } else if (item.type === "avatars") {
            const av = el("div", "shop-avatar");
            av.appendChild(el("i", "fa-solid " + item.icon));
            box.appendChild(av);
        } else if (item.type === "frames") {
            const current = byId(data.equipped.avatar) || ITEMS.avatars[0];
            const av = el("div", "shop-avatar" + (item.fx ? " shop-fx fx-" + item.fx : ""));
            av.appendChild(el("i", "fa-solid " + current.icon));
            box.appendChild(av);
        } else if (item.type === "themes") {
            const sw = el("div", "shop-swatch");
            sw.style.background = "linear-gradient(135deg, " + item.colors.join(", ") + ")";
            box.appendChild(sw);
        } else {
            box.appendChild(el("div", "shop-title-pill", item.name));
        }

        return box;
    }

    function buildCard(item, index) {
        const owned = isOwned(item);
        const equipped = item.type !== "boosts" && isEquipped(item);

        const card = el("div", "shop-card" + (equipped ? " equipped" : ""));
        card.style.animationDelay = index * 0.04 + "s";

        card.appendChild(buildPreview(item));
        card.appendChild(el("div", "shop-name", item.name));

        const btn = el("button", "shop-btn");

        if (item.type === "boosts") {
            const stash = data.stash[item.key];
            card.appendChild(el("div", "shop-detail", item.detail + (stash ? "  •  in stash: " + stash : "")));
            card.appendChild(coinPrice(item.price));

            const full = stash + item.amount > MAX_STASH;
            btn.textContent = full ? "FULL" : "BUY";
            btn.disabled = full;
            if (!full && data.coins < item.price) btn.classList.add("poor");
        } else {
            card.appendChild(el("div", "shop-detail", ""));
            card.appendChild(owned ? el("div", "shop-price", "Owned") : coinPrice(item.price));

            if (equipped) {
                btn.textContent = "EQUIPPED";
                btn.disabled = true;
                btn.classList.add("equip");
            } else if (owned) {
                btn.textContent = "EQUIP";
                btn.classList.add("equip");
            } else {
                btn.textContent = "BUY";
                if (data.coins < item.price) btn.classList.add("poor");
            }
        }

        btn.addEventListener("click", () => handleClick(item));
        card.appendChild(btn);
        return card;
    }

    function render() {
        renderCoins();

        // Tabs
        const tabs = $s("shop-tabs");
        tabs.innerHTML = "";
        TABS.forEach(tab => {
            const b = el("button", "shop-tab" + (tab.id === currentTab ? " active" : ""));
            b.appendChild(el("i", "fa-solid " + tab.icon));
            b.append(tab.label);
            b.addEventListener("click", () => { currentTab = tab.id; render(); });
            tabs.appendChild(b);
        });

        $s("shop-note").textContent = currentTab === "boosts"
            ? "Boosts work right away if a round is running. Otherwise they are added to your next round, and any left over are used up when that round ends."
            : "Buying an item equips it automatically. You can switch any time.";

        // Cards
        const grid = $s("shop-grid");
        grid.innerHTML = "";
        ITEMS[currentTab].forEach((item, i) => grid.appendChild(buildCard({ ...item, type: currentTab }, i)));
    }

    function handleClick(item) {
        // Already owned: just equip
        if (item.type !== "boosts" && isOwned(item)) {
            equip(item);
            return;
        }

        if (data.coins < item.price) {
            showToast("Not enough coins. You need " + (item.price - data.coins) + " more.", "fa-coins");
            return;
        }

        if (item.type === "boosts") {
            if (data.stash[item.key] + item.amount > MAX_STASH) return;

            data.coins -= item.price;
            data.stash[item.key] += item.amount;

            if (inRound()) {            // a round is running: give it right now
                BOOST_VARS[item.key](item.amount);
                updatePowerups();
            }

            showToast(item.detail + " added!", item.icon, true);
        } else {
            data.coins -= item.price;
            data.owned.push(item.id);
            equip(item, true);
            showToast(item.name + " unlocked!", "fa-gift", true);
        }

        save();
        render();
    }

    function equip(item, silent) {
        data.equipped[SLOT[item.type]] = item.id;
        save();
        applyEquipped();
        render();
        if (!silent) showToast(item.name + " equipped", "fa-check");
    }

    // ---------- Open / close (pauses the quiz timer while shopping) ----------
    function resumeTimer() {
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timer--;
            const t = document.getElementById("timer");
            t.textContent = timer + "s";
            t.classList.toggle("danger", timer <= 5);

            if (timer <= 0) {
                clearInterval(timerInterval);
                checkAnswer(null, null);
            }
        }, 1000);
    }

    function openShop() {
        wasRunning = !answered && inRound() &&
            selectedQuestions.length > 0 && currentQuestion < selectedQuestions.length;

        clearInterval(timerInterval);
        clearTimeout(autoNextTimeout);       // after an answer, use the Next button instead

        render();
        shopScreen.classList.remove("hidden");
        window.addEventListener("keydown", onKey, true);
    }

    function closeShop() {
        shopScreen.classList.add("hidden");
        window.removeEventListener("keydown", onKey, true);

        if (wasRunning && !answered) resumeTimer();
        wasRunning = false;
    }

    // Capture keys so A-D / 1-4 don't answer the quiz behind the shop
    function onKey(e) {
        e.stopPropagation();
        if (e.key === "Escape") closeShop();
    }

    shopNav.addEventListener("click", openShop);
    coinStat.addEventListener("click", openShop);
    $s("shop-close").addEventListener("click", closeShop);

    // ---------- Start ----------
    applyEquipped();
    renderCoins();

    if (isNewPlayer) {
        save();
        setTimeout(() => showToast("Welcome gift: " + STARTER_COINS + " coins! Visit the Shop.", "fa-gift", true), 1200);
    }
})();