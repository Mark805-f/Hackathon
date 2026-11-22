// =====================================
// CAMPAIGN MODE
// A route around the world: one stage per continent, each locked until you clear
// the one before, ending with a World Boss (3 lives). Stars, progress and XP rewards.
//
// Runs on your normal quiz screen (timer, power-ups, hints all work).
// Load AFTER script.js. If you use challenge.js, either order works.
// Needs (from script.js): startGame, endGame, checkAnswer, extraPools, questions,
// selectedQuestions, correctAnswers, totalAnswered, currentQuestion, answered, timer,
// timerInterval, autoNextTimeout, resultScreen, addXP, showToast
// =====================================
(() => {
    if (typeof startGame !== "function" || typeof extraPools === "undefined") return;

    const baseStart = startGame;      // whatever startGame is right now
    const origEnd = endGame;
    const origCheck = checkAnswer;

    // ---------- Question bank [category, difficulty, emoji, question, answers, correct, hint, explanation] ----------
    const BANK = {
        Europe: [
            ["Geography","normal","🌊","Which river is the longest in Europe?",["Danube","Volga","Rhine","Seine"],"Volga","It flows through Russia into the Caspian Sea.","The Volga is about 3,500 km long."],
            ["Geography","easy","🏛️","Which country has Vienna as its capital?",["Hungary","Switzerland","Austria","Czech Republic"],"Austria","It is famous for classical music and the Alps.","Vienna is the capital of Austria."],
            ["Geography","normal","🏝️","Which is the largest island in the Mediterranean Sea?",["Crete","Sicily","Sardinia","Cyprus"],"Sicily","It sits at the toe of Italy's boot.","Sicily is the largest Mediterranean island."],
            ["Geography","easy","⛪","In which city is the Sagrada Família basilica?",["Madrid","Seville","Barcelona","Valencia"],"Barcelona","It was designed by Antoni Gaudí.","The Sagrada Família is in Barcelona, Spain."],
            ["Geography","normal","🌊","Which sea lies between Italy and the Balkan Peninsula?",["Aegean Sea","Adriatic Sea","Baltic Sea","Black Sea"],"Adriatic Sea","Venice sits at its northern end.","The Adriatic separates Italy from the Balkans."],
            ["Geography","easy","⛰️","Which European country is famous for its fjords?",["Denmark","Netherlands","Norway","Poland"],"Norway","Think of long, narrow sea inlets between steep cliffs.","Norway has some of the world's most famous fjords."],
            ["World Facts","hard","💶","In which year did euro coins and notes enter circulation?",["1992","1999","2002","2010"],"2002","The euro existed only electronically for a few years first.","The euro was created in 1999 but cash arrived in January 2002."],
            ["Geography","normal","🏰","Which is the smallest country in Europe by area?",["Monaco","San Marino","Vatican City","Liechtenstein"],"Vatican City","It sits inside the city of Rome.","Vatican City covers only about 0.44 square kilometres."]
        ],
        Asia: [
            ["Geography","normal","🗺️","Which is the largest country located entirely in Asia?",["India","China","Kazakhstan","Saudi Arabia"],"China","Its population is also over a billion.","China covers about 9.6 million square kilometres."],
            ["Geography","easy","🛕","What is the capital of Thailand?",["Hanoi","Manila","Bangkok","Jakarta"],"Bangkok","It is known for its floating markets and temples.","Bangkok is the capital of Thailand."],
            ["Geography","easy","🏔️","Which mountain range lies between the Indian subcontinent and the Tibetan Plateau?",["Urals","Himalayas","Alps","Andes"],"Himalayas","Mount Everest is part of it.","The Himalayas contain many of the world's highest peaks."],
            ["Geography","normal","🌊","Which is the longest river in Asia?",["Yangtze","Mekong","Ganges","Yellow River"],"Yangtze","It flows through China to the East China Sea.","The Yangtze is about 6,300 km long."],
            ["Geography","normal","🏝️","Which country is made up of more than 17,000 islands?",["Philippines","Japan","Malaysia","Indonesia"],"Indonesia","It is the world's largest archipelagic country.","Indonesia has over 17,000 islands."],
            ["World Facts","normal","🚄","What is the name of Japan's famous high-speed train network?",["Shinkansen","Eurostar","TGV","Acela"],"Shinkansen","It is nicknamed the bullet train.","The Shinkansen opened in 1964."],
            ["Geography","easy","🏙️","What is the capital of South Korea?",["Busan","Incheon","Pyongyang","Seoul"],"Seoul","It lies on the Han River.","Seoul is the capital of South Korea."],
            ["History","normal","🏛️","In which country is the ancient rock-cut city of Petra?",["Syria","Jordan","Iraq","Egypt"],"Jordan","It is called the Rose City.","Petra is in southern Jordan."]
        ],
        Africa: [
            ["Geography","easy","🌊","Which is the longest river in Africa?",["Congo","Niger","Nile","Zambezi"],"Nile","It flows north through Egypt.","The Nile is about 6,650 km long."],
            ["Geography","normal","🏞️","Which is the largest lake in Africa by area?",["Lake Tanganyika","Lake Victoria","Lake Malawi","Lake Chad"],"Lake Victoria","It is shared by Uganda, Kenya and Tanzania.","Lake Victoria is Africa's largest lake."],
            ["Geography","easy","🏙️","What is the capital of Kenya?",["Mombasa","Nairobi","Kampala","Addis Ababa"],"Nairobi","It has a national park right next to the city.","Nairobi is the capital of Kenya."],
            ["History","hard","⚔️","Which African country defeated Italy at the Battle of Adwa in 1896?",["Liberia","Egypt","Morocco","Ethiopia"],"Ethiopia","It stayed independent during the colonial era.","Ethiopia's victory at Adwa secured its independence."],
            ["World Facts","normal","🦓","Which animal is famous for the Great Migration across the Serengeti?",["Elephants","Wildebeest","Giraffes","Hippos"],"Wildebeest","Millions of them travel together each year.","Over a million wildebeest take part in the migration."],
            ["Geography","normal","🧭","Which country is at the southern tip of mainland Africa?",["Namibia","Botswana","South Africa","Mozambique"],"South Africa","Cape Town is its legislative capital.","South Africa lies at Africa's southern end."],
            ["Geography","normal","🚢","The Suez Canal connects the Mediterranean Sea to which sea?",["Black Sea","Red Sea","Caspian Sea","Arabian Sea"],"Red Sea","It cuts across Egypt.","The Suez Canal links the Mediterranean with the Red Sea."],
            ["World Facts","easy","🐒","Which island nation off Africa's southeast coast is home to lemurs?",["Mauritius","Seychelles","Madagascar","Comoros"],"Madagascar","Lemurs live nowhere else in the wild.","Madagascar is the only natural home of lemurs."]
        ],
        "North America": [
            ["Geography","normal","🍁","Which is the largest country in North America by area?",["United States","Mexico","Cuba","Canada"],"Canada","It is the second largest country in the world.","Canada covers about 9.98 million square kilometres."],
            ["Geography","easy","🏞️","Which chain of lakes lies on the border between the US and Canada?",["The Finger Lakes","The Great Lakes","The Rift Lakes","The Salt Lakes"],"The Great Lakes","Lake Superior is the biggest of them.","The Great Lakes are five huge freshwater lakes."],
            ["Geography","easy","🌮","What is the capital of Mexico?",["Guadalajara","Cancún","Monterrey","Mexico City"],"Mexico City","It was built on top of the Aztec city of Tenochtitlan.","Mexico City is the capital and largest city."],
            ["Geography","normal","🚢","Which canal connects the Atlantic and Pacific Oceans through Central America?",["Suez Canal","Kiel Canal","Erie Canal","Panama Canal"],"Panama Canal","It opened in 1914.","The Panama Canal lets ships avoid sailing around South America."],
            ["Geography","hard","🏔️","Which is the highest mountain in North America?",["Mount Logan","Denali","Mount Whitney","Pico de Orizaba"],"Denali","It is in Alaska.","Denali rises to about 6,190 metres."],
            ["History","normal","🏛️","Which ancient civilization built Chichén Itzá?",["Aztec","Inca","Maya","Olmec"],"Maya","It is in the Yucatán Peninsula.","Chichén Itzá was a major Maya city."],
            ["Geography","normal","🏝️","Which is the largest island in the Caribbean?",["Jamaica","Cuba","Bahamas","Barbados"],"Cuba","Its capital is Havana.","Cuba is the largest Caribbean island."],
            ["Geography","normal","🌵","Which river forms much of the border between Texas and Mexico?",["Colorado River","Mississippi River","Missouri River","Rio Grande"],"Rio Grande","Its name means Big River in Spanish.","The Rio Grande marks much of the US-Mexico border."]
        ],
        "South America": [
            ["Geography","easy","🌊","Which is the longest river in South America?",["Orinoco","Paraná","Amazon","Magdalena"],"Amazon","It flows through the world's largest rainforest.","The Amazon is about 6,400 km long."],
            ["Geography","easy","🏔️","What is the capital of Peru?",["Cusco","Quito","Bogotá","Lima"],"Lima","It lies on the Pacific coast.","Lima is the capital of Peru."],
            ["History","easy","🏛️","Which ancient empire built Machu Picchu?",["Maya","Aztec","Inca","Olmec"],"Inca","It sits high in the Andes.","Machu Picchu was built by the Inca in the 15th century."],
            ["World Facts","normal","🗣️","Which is the only South American country where Portuguese is the official language?",["Argentina","Chile","Colombia","Brazil"],"Brazil","It is also the largest country on the continent.","Brazil was colonised by Portugal."],
            ["Geography","normal","🌊","Which is the highest uninterrupted waterfall in the world, in Venezuela?",["Iguazu Falls","Victoria Falls","Angel Falls","Niagara Falls"],"Angel Falls","It drops almost one kilometre.","Angel Falls is about 979 metres tall."],
            ["Geography","normal","🏜️","Which desert in Chile is one of the driest places on Earth?",["Gobi","Atacama","Sahara","Kalahari"],"Atacama","Some weather stations there have never recorded rain.","The Atacama is extremely dry."],
            ["Geography","hard","🏞️","Which large lake on the border of Peru and Bolivia is the highest navigable lake in the world?",["Lake Maracaibo","Lake Nicaragua","Lake Titicaca","Lake Victoria"],"Lake Titicaca","It sits at about 3,800 metres.","Lake Titicaca lies high in the Andes."],
            ["Geography","easy","💃","What is the capital of Argentina?",["Córdoba","Montevideo","Santiago","Buenos Aires"],"Buenos Aires","It is known for tango.","Buenos Aires is the capital of Argentina."]
        ],
        Oceania: [
            ["Geography","normal","🏙️","What is the capital of New Zealand?",["Auckland","Wellington","Christchurch","Queenstown"],"Wellington","It is at the southern tip of the North Island.","Wellington is New Zealand's capital."],
            ["Geography","easy","🐠","Which is the largest coral reef system in the world?",["Belize Barrier Reef","Great Barrier Reef","Red Sea Coral Reef","Raja Ampat"],"Great Barrier Reef","It can be seen from space.","The Great Barrier Reef stretches for over 2,000 km."],
            ["Geography","normal","🪨","Which huge red sandstone rock, also known as Ayers Rock, is sacred to the Anangu people?",["Kata Tjuta","Uluru","Mount Augustus","Wave Rock"],"Uluru","It is in the middle of Australia.","Uluru is a famous sacred landmark in central Australia."],
            ["World Facts","easy","🥝","Which country is the kiwi bird a national symbol of?",["Australia","Fiji","Papua New Guinea","New Zealand"],"New Zealand","The kiwi cannot fly.","The kiwi is a flightless bird native to New Zealand."],
            ["Geography","hard","🏝️","Which Pacific country is made up of more than 300 islands?",["Samoa","Tonga","Vanuatu","Fiji"],"Fiji","Its capital is Suva.","Fiji has around 330 islands."],
            ["Geography","normal","🌆","Which is the largest city in Australia by population?",["Melbourne","Sydney","Brisbane","Perth"],"Sydney","It has a famous Opera House.","Sydney is Australia's most populous city."],
            ["History","easy","🌿","What is the name of the Indigenous Polynesian people of New Zealand?",["Aboriginal","Inuit","Sámi","Māori"],"Māori","Their language is called te reo.","The Māori are the Indigenous people of New Zealand."],
            ["Geography","hard","🗺️","Which island is shared by Papua New Guinea and Indonesia?",["Borneo","New Guinea","Timor","Sumatra"],"New Guinea","It is the second largest island in the world.","New Guinea is divided between Indonesia and Papua New Guinea."]
        ],
        "World Boss": [
            ["Geography","hard","🌊","Which river is traditionally considered the longest in the world?",["Amazon","Yangtze","Nile","Mississippi"],"Nile","Some measurements argue for the Amazon, but tradition picks this one.","The Nile is traditionally measured at about 6,650 km."],
            ["Geography","normal","🧊","Which is the only continent with no permanent human population?",["Australia","Antarctica","Europe","Oceania"],"Antarctica","It is covered in ice.","Only scientists live in Antarctica, and only temporarily."],
            ["Geography","hard","🧭","Which pair of countries are the only two doubly landlocked countries?",["Bolivia and Paraguay","Nepal and Bhutan","Switzerland and Austria","Liechtenstein and Uzbekistan"],"Liechtenstein and Uzbekistan","All their neighbours are landlocked too.","Both are surrounded only by landlocked countries."],
            ["Geography","hard","🏙️","What is the capital of Kazakhstan?",["Almaty","Tashkent","Astana","Bishkek"],"Astana","It was briefly renamed Nur-Sultan.","Astana is Kazakhstan's capital."],
            ["Geography","normal","🌊","Which strait separates Asia from North America?",["Strait of Hormuz","Strait of Malacca","Strait of Magellan","Bering Strait"],"Bering Strait","It lies between Russia and Alaska.","The Bering Strait separates Russia from Alaska."],
            ["Geography","hard","🍁","Which country has the longest coastline in the world?",["Russia","Indonesia","Australia","Canada"],"Canada","It borders three oceans.","Canada's coastline is over 200,000 km long."],
            ["Geography","hard","🏔️","Which is the highest capital city in the world?",["Quito","Bogotá","Kathmandu","La Paz"],"La Paz","It is in Bolivia, high in the Andes.","La Paz sits at roughly 3,650 metres."],
            ["Geography","hard","🌊","Which body of water has a shore at the lowest elevation on land?",["Caspian Sea","Lake Baikal","Dead Sea","Lake Victoria"],"Dead Sea","It is also extremely salty.","The Dead Sea shore is over 400 m below sea level."],
            ["Geography","normal","🧊","Which is the smallest ocean?",["Indian Ocean","Southern Ocean","Atlantic Ocean","Arctic Ocean"],"Arctic Ocean","It surrounds the North Pole.","The Arctic is the smallest and shallowest ocean."],
            ["Geography","hard","⛰️","Which mountain is the tallest when measured from its base on the ocean floor?",["Mount Everest","K2","Mauna Kea","Denali"],"Mauna Kea","It is a volcano in Hawaii.","Mauna Kea is over 10,000 m tall from base to peak."]
        ]
    };

    function makeQuestion(row, sub) {
        const [category, difficulty, visual, question, answers, correct, hint, explanation] = row;
        return { category, sub, difficulty, visual, question, answers, correct, hint, explanation };
    }

    // ---------- Stages ----------
    const STAGES = [
        { id: "europe",  name: "Europe",        continent: "Europe",        icon: "fa-earth-europe",   color: "#61d4f1", count: 8, flags: 2, pass: 5,
          desc: "Start your journey on the old continent: rivers, capitals and a few flags." },
        { id: "asia",    name: "Asia",          continent: "Asia",          icon: "fa-earth-asia",     color: "#ffb45f", count: 8, flags: 2, pass: 5,
          desc: "The biggest continent, from the Himalayas to thousands of islands." },
        { id: "africa",  name: "Africa",        continent: "Africa",        icon: "fa-earth-africa",   color: "#48d89a", count: 8, flags: 2, pass: 5,
          desc: "Great rivers, wide savannas and ancient kingdoms." },
        { id: "namerica",name: "North America", continent: "North America", icon: "fa-earth-americas", color: "#5ea8ff", count: 8, flags: 2, pass: 5,
          desc: "From the Arctic north down to the Caribbean islands." },
        { id: "samerica",name: "South America", continent: "South America", icon: "fa-earth-americas", color: "#2dd4bf", count: 8, flags: 2, pass: 5,
          desc: "Rainforests, tall mountains and lost cities." },
        { id: "oceania", name: "Oceania",       continent: "Oceania",       icon: "fa-earth-oceania",  color: "#a78bfa", count: 8, flags: 2, pass: 5,
          desc: "Reefs, islands and the far corner of the map." },
        { id: "boss",    name: "World Boss",    continent: "World Boss",    icon: "fa-dragon",         color: "#ff7185", count: 10, flags: 0, pass: 0, boss: true, lives: 3,
          desc: "Ten hard questions from all over the world. Three lives. Lose them all and the boss wins." }
    ];

    // ---------- Saved progress ----------
    let data = { stages: {}, done: false };
    try {
        const saved = JSON.parse(localStorage.getItem("worldCampaign"));
        if (saved && saved.stages) data = { stages: saved.stages, done: !!saved.done };
    } catch (e) {}

    const save = () => localStorage.setItem("worldCampaign", JSON.stringify(data));
    const starsOf = st => (data.stages[st.id] && data.stages[st.id].stars) || 0;
    const isUnlocked = i => i === 0 || starsOf(STAGES[i - 1]) >= 1;
    const totalStars = () => STAGES.reduce((sum, st) => sum + starsOf(st), 0);
    const maxStars = STAGES.length * 3;

    const starText = n => "★".repeat(n) + "☆".repeat(3 - n);

    // ---------- Styles ----------
    const style = document.createElement("style");
    style.textContent = `
        .nav-item.cp-nav { color: #ffb45f; }
        .nav-item.cp-nav i { color: #ffb45f; }

        .cp-box { max-width: 1000px; max-height: 92vh; overflow-y: auto; }
        .cp-head { display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
        .cp-title { font-size: clamp(22px, 3vw, 30px); margin-top: 6px; }
        .cp-total {
            background: #263852; border: 1px solid #405b7d; border-radius: 12px;
            padding: 10px 16px; font-weight: 900; color: #ffd166; font-size: 16px;
        }

        .cp-map {
            position: relative; height: 330px; margin: 18px 0 8px;
            background: radial-gradient(circle at 50% 50%, #17304d, #0f1a2b 70%);
            border-radius: 16px; border: 1px solid #293b58; overflow: hidden;
        }
        .cp-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
        .cp-lines line { stroke: #3b506d; stroke-width: 3; stroke-dasharray: 5 7; vector-effect: non-scaling-stroke; stroke-linecap: round; }
        .cp-lines line.done { stroke: #ffd166; stroke-dasharray: none; }

        .cp-node {
            position: absolute; transform: translate(-50%, -50%);
            display: flex; flex-direction: column; align-items: center; gap: 5px;
            background: none; border: none; color: #fff; cursor: pointer; width: 96px;
        }
        .cp-orb {
            width: 62px; height: 62px; border-radius: 50%; display: grid; place-items: center; font-size: 25px;
            background: linear-gradient(145deg, var(--c), color-mix(in srgb, var(--c) 35%, #0c1220));
            border: 3px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45), 0 0 24px color-mix(in srgb, var(--c) 40%, transparent),
                        inset 0 2px 0 rgba(255, 255, 255, 0.35);
            transition: 0.2s;
        }
        .cp-orb i { color: #fff; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35)); }
        .cp-node:hover .cp-orb { transform: scale(1.08); }
        .cp-node.boss .cp-orb { width: 82px; height: 82px; font-size: 34px; }
        .cp-node.locked .cp-orb {
            background: #263852; border-color: #3b506d; box-shadow: none;
        }
        .cp-node.locked .cp-orb i { color: #62748f; filter: none; }
        .cp-node.next .cp-orb { box-shadow: 0 0 0 5px rgba(255, 209, 102, 0.35), 0 0 30px var(--c); }
        .cp-node.selected .cp-orb { outline: 3px solid #ffd166; outline-offset: 4px; }
        .cp-label { font-size: 12px; font-weight: bold; text-shadow: 0 2px 6px #000; }
        .cp-node.locked .cp-label { color: #62748f; }
        .cp-stars { font-size: 13px; letter-spacing: 2px; color: #ffd166; text-shadow: 0 2px 6px #000; min-height: 16px; }

        .cp-panel {
            display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: center;
            background: #1b2b45; border: 1px solid #3b5275; border-radius: 14px; padding: 18px 20px; margin-top: 12px;
        }
        .cp-panel h3 { font-size: 20px; margin-bottom: 6px; }
        .cp-panel p { color: #a6b6cf; font-size: 13px; line-height: 1.6; }
        .cp-panel .cp-meta { color: #ffd166; font-size: 12px; margin-top: 8px; }
        .cp-start {
            padding: 15px 28px; border: none; border-radius: 11px; cursor: pointer;
            background: linear-gradient(90deg, #ffd166, #f39f35); color: #281d32;
            font-weight: 900; letter-spacing: 0.05em; font-size: 13px; transition: 0.2s;
        }
        .cp-start:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .cp-start:disabled { opacity: 0.4; cursor: not-allowed; }
        .cp-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
        .cp-foot button { background: none; border: none; color: #7787a3; font-size: 11px; cursor: pointer; text-decoration: underline; }
        .cp-foot span { color: #ffd166; font-size: 12px; font-weight: bold; }

        @media (max-width: 700px) {
            .cp-map { height: 650px; }
            .cp-panel { grid-template-columns: 1fr; }
        }

        /* banner above the quiz while playing a stage */
        .cp-banner {
            display: none; align-items: center; gap: 12px; flex-wrap: wrap;
            margin-bottom: 16px; padding: 13px 18px; border-radius: 14px;
            background: linear-gradient(90deg, #3a2f23, #24366a); border: 1px solid #ffb45f;
            color: #ffe6c7; font-size: 13px;
        }
        .cp-banner.show { display: flex; }
        .cp-banner i { color: #ffd166; font-size: 18px; }
        .cp-banner strong { color: #ffd166; }
        .cp-banner .cp-progress { margin-left: auto; font-weight: bold; color: #ffd166; }

        /* result screen extras */
        .cp-result { margin-top: 16px; padding-top: 16px; border-top: 1px solid #405675; text-align: center; }
        .cp-result.hidden { display: none; }
        .cp-result-stars { font-size: 34px; letter-spacing: 6px; color: #ffd166; margin-bottom: 6px; }
        .cp-result-text { color: #b5c2d9; font-size: 13px; line-height: 1.6; margin-bottom: 14px; }
        .cp-result-text strong { color: #ffd166; }
        .cp-btn {
            width: 100%; padding: 13px; margin-top: 8px; border: none; border-radius: 10px; cursor: pointer;
            font-weight: 900; font-size: 12px; letter-spacing: 0.05em; transition: 0.2s;
            background: linear-gradient(90deg, #ffd166, #f39f35); color: #281d32;
        }
        .cp-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .cp-btn.secondary { background: #263852; color: #d6e2f5; border: 1px solid #3b506d; }
    `;
    document.head.appendChild(style);

    // ---------- Sidebar button ----------
    const navBtn = document.createElement("button");
    navBtn.className = "nav-item map-nav cp-nav";       // "map-nav": script.js leaves it alone
    navBtn.innerHTML = '<i class="fa-solid fa-route"></i> Campaign';
    document.querySelector(".sidebar").insertBefore(navBtn, document.querySelector(".sidebar-bottom"));

    // ---------- Campaign map window ----------
    const screen = document.createElement("div");
    screen.className = "map-screen hidden";
    screen.innerHTML = `
        <div class="map-box cp-box">
            <div class="cp-head">
                <div>
                    <p class="map-label">CAMPAIGN</p>
                    <h2 class="cp-title">Around the World</h2>
                </div>
                <div class="cp-total" id="cp-total"></div>
                <button id="cp-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cp-map" id="cp-map"></div>
            <div class="cp-panel" id="cp-panel"></div>
            <div class="cp-foot">
                <button id="cp-reset">Reset campaign progress</button>
                <span id="cp-done"></span>
            </div>
        </div>`;
    document.body.appendChild(screen);

    const $p = id => document.getElementById(id);

    let selected = 0;        // index of the stage shown in the panel
    let wasRunning = false;  // was a quiz timer running when the map opened?

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // Nodes zig-zag across on wide screens and down the screen on narrow ones
    function positions() {
        return window.innerWidth <= 700
            ? [[30, 7], [70, 21], [30, 35], [70, 49], [30, 63], [70, 77], [50, 91]]
            : [[8, 68], [22, 28], [36, 68], [50, 28], [64, 68], [78, 28], [92, 56]];
    }

    function firstOpenStage() {
        for (let i = 0; i < STAGES.length; i++) {
            if (isUnlocked(i) && starsOf(STAGES[i]) === 0) return i;
        }
        return STAGES.length - 1;
    }

    function renderMap() {
        const map = $p("cp-map");
        map.innerHTML = "";

        const pos = positions();
        const nextIndex = firstOpenStage();

        // Lines between stages
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("class", "cp-lines");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");

        for (let i = 0; i < STAGES.length - 1; i++) {
            const line = document.createElementNS(NS, "line");
            line.setAttribute("x1", pos[i][0]);
            line.setAttribute("y1", pos[i][1]);
            line.setAttribute("x2", pos[i + 1][0]);
            line.setAttribute("y2", pos[i + 1][1]);
            if (starsOf(STAGES[i]) >= 1) line.setAttribute("class", "done");
            svg.appendChild(line);
        }
        map.appendChild(svg);

        // Stage nodes
        STAGES.forEach((st, i) => {
            const unlocked = isUnlocked(i);
            const cleared = starsOf(st) >= 1;

            const node = el("button", "cp-node");
            if (st.boss) node.classList.add("boss");
            if (!unlocked) node.classList.add("locked");
            if (unlocked && i === nextIndex && !cleared) node.classList.add("next");
            if (i === selected) node.classList.add("selected");

            node.style.left = pos[i][0] + "%";
            node.style.top = pos[i][1] + "%";
            node.style.setProperty("--c", st.color);

            const orb = el("div", "cp-orb");
            orb.appendChild(el("i", "fa-solid " + (unlocked ? st.icon : "fa-lock")));

            node.append(orb, el("div", "cp-label", st.name), el("div", "cp-stars", cleared ? starText(starsOf(st)) : ""));
            node.addEventListener("click", () => { selected = i; render(); });
            map.appendChild(node);
        });
    }

    function renderPanel() {
        const st = STAGES[selected];
        const unlocked = isUnlocked(selected);
        const panel = $p("cp-panel");
        panel.innerHTML = "";

        const info = el("div");
        info.appendChild(el("h3", "", "Stage " + (selected + 1) + " · " + st.name));
        info.appendChild(el("p", "", st.desc));

        let goal;
        if (st.boss) {
            goal = "Answer " + st.count + " hard questions with " + st.lives + " lives. You earn 1 to 3 stars depending on how many lives are left.";
        } else {
            goal = "Answer " + st.count + " questions. Get " + st.pass + " right to clear it, " +
                (st.pass + 1) + " for two stars and all " + st.count + " for three.";
        }
        info.appendChild(el("p", "", goal));

        const best = starsOf(st);
        const baseXP = st.boss ? 250 : 60;
        info.appendChild(el("p", "cp-meta",
            (best ? "Best: " + starText(best) + "   ·   " : "") +
            (best ? "Beat your stars for +20 XP each" : "First clear: +" + baseXP + " XP and +20 XP per star")));

        const btn = el("button", "cp-start");
        btn.textContent = unlocked ? (best ? "PLAY AGAIN" : "START STAGE") : "LOCKED";
        btn.disabled = !unlocked;
        btn.addEventListener("click", () => beginStage(st));

        if (!unlocked) {
            info.appendChild(el("p", "cp-meta", "Clear " + STAGES[selected - 1].name + " first to unlock this stage."));
        }

        panel.append(info, btn);
    }

    function render() {
        $p("cp-total").textContent = "★ " + totalStars() + " / " + maxStars;
        $p("cp-done").textContent = data.done ? "🌍 Campaign complete: World Champion!" : "";
        renderMap();
        renderPanel();
    }

    // ---------- Starting a stage ----------
    let active = null;   // { stage, list, total }

    function buildPool(st) {
        if (st.boss) {
            return BANK[st.continent].map(row => makeQuestion(row, st.continent));
        }

        // Flags from this continent (they already exist in your questions list) + curated questions
        const flags = shuffle(questions.filter(q => q.flag && (q.continent || "").includes(st.continent)))
            .slice(0, st.flags);
        const curated = shuffle(BANK[st.continent].map(row => makeQuestion(row, st.continent)))
            .slice(0, st.count - flags.length);

        return [...flags, ...curated];
    }

    function beginStage(st) {
        screen.classList.add("hidden");
        window.removeEventListener("keydown", onKey, true);
        wasRunning = false;

        selected = STAGES.indexOf(st);
        extraPools["Campaign"] = buildPool(st);

        // Make sure the difficulty selector (if you added one) doesn't thin out the stage
        let savedDifficulty;
        const hasDifficulty = typeof currentDifficulty !== "undefined";
        if (hasDifficulty) { savedDifficulty = currentDifficulty; currentDifficulty = "all"; }

        baseStart("Campaign");

        if (hasDifficulty) currentDifficulty = savedDifficulty;

        active = { stage: st, list: selectedQuestions, total: selectedQuestions.length };
        resetResultTitle(false);
        updateBanner();

        document.querySelector(".quiz-card").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // The normal "Play Again" button and the other modes also call startGame
    window.startGame = function (category = "All") {
        if (category === "Campaign" && active) {
            beginStage(active.stage);       // replay the same stage with fresh questions
            return;
        }
        active = null;
        updateBanner();
        baseStart(category);
    };

    // ---------- Banner above the quiz ----------
    const banner = document.createElement("div");
    banner.className = "cp-banner";
    document.querySelector(".quiz-layout").before(banner);

    function livesLeft() {
        return Math.max(0, active.stage.lives - (totalAnswered - correctAnswers));
    }

    function updateBanner() {
        banner.innerHTML = "";
        banner.classList.toggle("show", !!active);
        if (!active) return;

        const st = active.stage;
        const index = STAGES.indexOf(st) + 1;

        const text = el("span");
        text.append("Campaign · Stage " + index + " of " + STAGES.length + ": ");
        text.appendChild(el("strong", "", st.name));

        let progress;
        if (st.boss) {
            const lives = livesLeft();
            progress = "Lives: " + "❤️".repeat(lives) + "🖤".repeat(st.lives - lives);
        } else {
            progress = "Correct: " + correctAnswers + " / " + st.pass + " needed";
        }

        banner.append(el("i", "fa-solid fa-route"), text, el("span", "cp-progress", progress));
    }

    // Boss lives: after the last life is lost, end the round after this question
    window.checkAnswer = function (answer, button) {
        origCheck(answer, button);

        if (!active || active.list !== selectedQuestions) return;

        if (active.stage.boss && livesLeft() <= 0) {
            active.list.length = Math.min(active.list.length, currentQuestion + 1);
        }

        updateBanner();
    };

    // ---------- Results ----------
    const resultBox = document.querySelector("#result-screen .result-box");
    const resultTitle = resultBox.querySelector("h1");
    const resultSub = resultBox.querySelector(":scope > p");
    const originalTitle = resultTitle.textContent;
    const originalSub = resultSub ? resultSub.textContent : "";

    function resetResultTitle(isCampaignResult, title, sub) {
        resultTitle.textContent = isCampaignResult ? title : originalTitle;
        if (resultSub) resultSub.textContent = isCampaignResult ? sub : originalSub;
    }

    const panelResult = el("div", "cp-result hidden");
    document.getElementById("play-again").after(panelResult);

    function evaluate() {
        const st = active.stage;
        const index = STAGES.indexOf(st);
        const correct = correctAnswers;

        let passed, stars, detail;

        if (st.boss) {
            const lives = livesLeft();
            passed = lives > 0;
            stars = passed ? lives : 0;
            detail = passed
                ? "You beat the boss with " + lives + (lives === 1 ? " life" : " lives") + " left."
                : "You ran out of lives. Try again!";
        } else {
            passed = correct >= st.pass;
            stars = !passed ? 0 : correct >= active.total ? 3 : correct > st.pass ? 2 : 1;
            detail = correct + " of " + active.total + " correct. You needed " + st.pass + ".";
        }

        // Progress and rewards
        const prev = starsOf(st);
        const gained = Math.max(0, stars - prev);
        let xp = 0;

        if (passed) {
            if (prev === 0) xp += st.boss ? 250 : 60;
            xp += gained * 20;

            data.stages[st.id] = { stars: Math.max(prev, stars) };

            if (st.boss && !data.done) {
                data.done = true;
                showToast("Campaign complete! You are a World Champion!", "fa-trophy", true);
            }
            save();
            if (xp > 0) addXP(xp);
        }

        // Result screen
        resetResultTitle(true,
            passed ? (st.boss ? "Boss Defeated!" : "Stage Cleared!") : (st.boss ? "Boss Wins..." : "Stage Failed"),
            st.name + " · " + (passed ? "well played." : "so close!"));

        panelResult.innerHTML = "";
        panelResult.classList.remove("hidden");

        panelResult.appendChild(el("div", "cp-result-stars", starText(stars)));

        const text = el("div", "cp-result-text");
        text.append(detail);
        if (xp > 0) {
            text.append(document.createElement("br"));
            text.appendChild(el("strong", "", "+" + xp + " XP"));
        }
        if (passed && st.boss && data.done) {
            text.append(document.createElement("br"), "🌍 You finished the whole campaign!");
        }
        panelResult.appendChild(text);

        const nextStage = STAGES[index + 1];
        if (passed && nextStage) {
            const next = el("button", "cp-btn", "NEXT STAGE: " + nextStage.name.toUpperCase());
            next.addEventListener("click", () => beginStage(nextStage));
            panelResult.appendChild(next);
        }

        const retry = el("button", "cp-btn secondary", "RETRY THIS STAGE");
        retry.addEventListener("click", () => beginStage(st));
        panelResult.appendChild(retry);

        const mapBtn = el("button", "cp-btn secondary", "BACK TO CAMPAIGN MAP");
        mapBtn.addEventListener("click", openMap);
        panelResult.appendChild(mapBtn);

        selected = passed && nextStage ? index + 1 : index;
    }

    window.endGame = function () {
        origEnd();

        if (active && active.list === selectedQuestions) {
            evaluate();
        } else {
            panelResult.classList.add("hidden");
            resetResultTitle(false);
        }
    };

    // ---------- Open / close the map (pauses a running quiz) ----------
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

    function openMap() {
        const wasOpen = !screen.classList.contains("hidden");

        if (!wasOpen) {
            wasRunning = !answered && resultScreen.classList.contains("hidden") &&
                selectedQuestions.length > 0 && currentQuestion < selectedQuestions.length;

            clearInterval(timerInterval);
            clearTimeout(autoNextTimeout);
            selected = firstOpenStage();
            window.addEventListener("keydown", onKey, true);
        }

        render();
        screen.classList.remove("hidden");
    }

    function closeMap() {
        screen.classList.add("hidden");
        window.removeEventListener("keydown", onKey, true);

        if (wasRunning && !answered) resumeTimer();
        wasRunning = false;
    }

    // Capture keys so A-D / 1-4 don't answer the quiz behind the map
    function onKey(e) {
        e.stopPropagation();
        if (e.key === "Escape") closeMap();
    }

    navBtn.addEventListener("click", openMap);
    $p("cp-close").addEventListener("click", closeMap);

    $p("cp-reset").addEventListener("click", () => {
        if (!confirm("Reset all campaign progress?")) return;
        data = { stages: {}, done: false };
        save();
        selected = 0;
        render();
    });

    window.addEventListener("resize", () => {
        if (!screen.classList.contains("hidden")) renderMap();
    });
})();
