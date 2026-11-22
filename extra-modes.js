// =====================================
// EXTRA GAME MODES: True or False + Capitals
// Load this AFTER script.js:
//   <script src="script.js"></script>
//   <script src="extra-modes.js"></script>
// It uses script.js's extraPools, shuffle and bindNavButton,
// so scoring, timer, power-ups, XP and chests all work as normal.
// =====================================
(() => {

    // ---------------------------------
    // TRUE OR FALSE
    // To add one, add a line to TF_LIST:
    // [statement, isTrue, hint, explanation, difficulty]
    // ---------------------------------
    const TF_LIST = [
        ["The Sun is a star.", true, "It is the centre of our solar system.", "The Sun is a star, a huge ball of hot gas.", "easy"],
        ["The Great Wall of China is easily visible from the Moon with the naked eye.", false, "Astronauts have said it is very hard to see even from low orbit.", "The Great Wall is long but narrow, and it cannot be seen from the Moon with the naked eye.", "normal"],
        ["Lightning never strikes the same place twice.", false, "Tall buildings are hit again and again.", "Lightning often strikes the same place; the Empire State Building is hit many times a year.", "normal"],
        ["Water boils at a lower temperature at high altitude.", true, "Think about the air pressure on a mountain.", "Lower air pressure at altitude means water boils below 100 °C.", "normal"],
        ["Sharks are mammals.", false, "They breathe with gills.", "Sharks are fish, not mammals.", "easy"],
        ["Bats are blind.", false, "Many bats see quite well.", "Bats can see; many also use echolocation to hunt in the dark.", "normal"],
        ["The Pacific is the largest ocean on Earth.", true, "It lies between Asia and the Americas.", "The Pacific Ocean covers about a third of the planet's surface.", "easy"],
        ["Mount Everest is in Africa.", false, "It is part of the Himalayas.", "Mount Everest is in the Himalayas on the border of Nepal and China.", "easy"],
        ["Australia is both a country and a continent.", true, "It is often counted as the smallest continent.", "Australia is a country, and it is also commonly treated as a continent.", "normal"],
        ["Venus is the hottest planet in the solar system.", true, "Its thick atmosphere traps heat.", "Venus is hotter than Mercury because of its dense, heat-trapping atmosphere.", "hard"],
        ["Humans only use 10% of their brains.", false, "Brain scans show activity all over.", "This is a myth; we use virtually all of our brain.", "normal"],
        ["An octopus has three hearts.", true, "Two serve the gills, one serves the body.", "Octopuses have three hearts and blue blood.", "normal"],
        ["The capital of Switzerland is Zurich.", false, "It is a smaller city, home to the federal government.", "The capital of Switzerland is Bern.", "normal"],
        ["Canada has the longest coastline of any country.", true, "It borders three oceans.", "Canada's coastline is by far the longest in the world.", "normal"],
        ["Diamonds are made of carbon.", true, "So is pencil graphite.", "Diamonds are carbon atoms arranged in a very strong crystal structure.", "easy"],
        ["Goldfish only have a three-second memory.", false, "They can be trained to remember things for months.", "Goldfish can remember things for weeks or months.", "normal"],
        ["The Amazon rainforest is located mainly in Brazil.", true, "It is in South America.", "About 60% of the Amazon rainforest lies in Brazil.", "easy"],
        ["Sound travels faster than light.", false, "You see lightning before you hear thunder.", "Light travels far faster than sound.", "easy"],
        ["A group of crows is called a murder.", true, "It is a famous odd collective noun.", "A group of crows is called a murder.", "normal"],
        ["The Statue of Liberty was a gift from France.", true, "It was given in 1886.", "France gave the Statue of Liberty to the United States.", "easy"],
        ["Vatican City is the smallest country in the world.", true, "It is inside Rome.", "Vatican City covers only about 0.44 square kilometres.", "easy"],
        ["Spiders are insects.", false, "Count their legs.", "Spiders are arachnids; insects have six legs and spiders have eight.", "easy"],
        ["Antarctica is a desert.", true, "Think about how little precipitation it gets.", "Antarctica is the largest desert on Earth because it receives very little precipitation.", "hard"],
        ["Russia lies entirely in Europe.", false, "The Ural Mountains are a traditional dividing line.", "Russia spans both Europe and Asia.", "normal"],
        ["Mars has two moons.", true, "Their names are Phobos and Deimos.", "Mars has two small moons, Phobos and Deimos.", "normal"],
        ["The Great Barrier Reef is off the coast of Australia.", true, "It is the world's largest coral reef system.", "The Great Barrier Reef lies off the coast of Queensland, Australia.", "easy"],
        ["Botanically speaking, a tomato is a fruit.", true, "It develops from a flower and contains seeds.", "Tomatoes are fruits, even though people use them as vegetables.", "normal"],
        ["Napoleon Bonaparte was unusually short for his time.", false, "Units of measurement were different in France.", "He was about average height; the myth comes from French vs. English units.", "hard"],
        ["The Berlin Wall fell in 1989.", true, "It was the year before German reunification.", "The Berlin Wall fell on 9 November 1989.", "normal"],
        ["The Moon is a planet.", false, "It orbits the Earth.", "The Moon is a natural satellite, not a planet.", "easy"],
        ["Lisbon is the capital of Spain.", false, "It is on the Atlantic coast.", "Lisbon is the capital of Portugal; Spain's capital is Madrid.", "easy"],
        ["The Nile flows through Egypt.", true, "Cairo sits on its banks.", "The Nile runs through Egypt on its way to the Mediterranean.", "easy"],
        ["Honey can last for thousands of years without spoiling.", true, "Archaeologists have found edible honey in ancient tombs.", "Honey's low moisture and acidity keep it from spoiling.", "hard"],
        ["A byte consists of 8 bits.", true, "It is the basic unit of digital storage.", "One byte equals eight bits.", "normal"],
        ["RAM keeps its data when the computer is switched off.", false, "It is the computer's short-term memory.", "RAM is volatile; it loses its contents when the power goes off.", "normal"],
        ["The programming language Python is named after the snake.", false, "It is named after a British comedy group.", "Python was named after Monty Python's Flying Circus.", "hard"],
        ["CSS is used to define the structure of a web page.", false, "That job belongs to HTML.", "HTML defines structure; CSS controls how it looks.", "normal"],
        ["Every device on the internet is identified by an IP address.", true, "It works like a postal address for data.", "IP addresses identify devices on a network so data can find them.", "normal"],
        ["Binary code uses only the digits 0 and 1.", true, "Computers store everything this way.", "Binary is a base-2 system with two digits, 0 and 1.", "easy"],
        ["HTTPS encrypts the connection between your browser and a website.", true, "Look for the padlock icon.", "HTTPS protects data in transit with encryption.", "normal"],
        ["Pristina is the capital of Kosovo.", true, "It is in the Balkans.", "Pristina is the capital and largest city of Kosovo.", "easy"]
    ];

    const tfPool = TF_LIST.map(([statement, isTrue, hint, explanation, difficulty]) => ({
        category: "True or False",
        difficulty: difficulty,
        visual: "✅",
        question: "True or False: " + statement,
        answers: ["True", "False"],
        correct: isTrue ? "True" : "False",
        hint: hint,
        explanation: explanation,
        fixedOrder: true,   // keep True first, False second
        noFifty: true       // 50/50 makes no sense with two answers
    }));


    // ---------------------------------
    // CAPITALS
    // To add one, add a line to CAPITAL_LIST:
    // [country, capital, region]
    // ---------------------------------
    const CAPITAL_LIST = [
        // Europe
        ["France", "Paris", "Europe"], ["Germany", "Berlin", "Europe"], ["Italy", "Rome", "Europe"],
        ["Spain", "Madrid", "Europe"], ["Portugal", "Lisbon", "Europe"], ["United Kingdom", "London", "Europe"],
        ["Ireland", "Dublin", "Europe"], ["Netherlands", "Amsterdam", "Europe"], ["Belgium", "Brussels", "Europe"],
        ["Switzerland", "Bern", "Europe"], ["Austria", "Vienna", "Europe"], ["Poland", "Warsaw", "Europe"],
        ["Czechia", "Prague", "Europe"], ["Slovakia", "Bratislava", "Europe"], ["Hungary", "Budapest", "Europe"],
        ["Romania", "Bucharest", "Europe"], ["Bulgaria", "Sofia", "Europe"], ["Greece", "Athens", "Europe"],
        ["Sweden", "Stockholm", "Europe"], ["Norway", "Oslo", "Europe"], ["Denmark", "Copenhagen", "Europe"],
        ["Finland", "Helsinki", "Europe"], ["Iceland", "Reykjavik", "Europe"], ["Croatia", "Zagreb", "Europe"],
        ["Serbia", "Belgrade", "Europe"], ["Albania", "Tirana", "Europe"], ["Ukraine", "Kyiv", "Europe"],
        ["Lithuania", "Vilnius", "Europe"], ["Latvia", "Riga", "Europe"], ["Estonia", "Tallinn", "Europe"],
        ["Kosovo", "Pristina", "Europe"], ["North Macedonia", "Skopje", "Europe"], ["Montenegro", "Podgorica", "Europe"],
        ["Bosnia and Herzegovina", "Sarajevo", "Europe"], ["Slovenia", "Ljubljana", "Europe"],

        // Asia
        ["Japan", "Tokyo", "Asia"], ["China", "Beijing", "Asia"], ["India", "New Delhi", "Asia"],
        ["South Korea", "Seoul", "Asia"], ["Thailand", "Bangkok", "Asia"], ["Vietnam", "Hanoi", "Asia"],
        ["Indonesia", "Jakarta", "Asia"], ["Philippines", "Manila", "Asia"], ["Pakistan", "Islamabad", "Asia"],
        ["Saudi Arabia", "Riyadh", "Asia"], ["Turkey", "Ankara", "Asia"], ["Iran", "Tehran", "Asia"],
        ["Iraq", "Baghdad", "Asia"], ["Nepal", "Kathmandu", "Asia"], ["Kazakhstan", "Astana", "Asia"],
        ["Malaysia", "Kuala Lumpur", "Asia"], ["Bangladesh", "Dhaka", "Asia"], ["Mongolia", "Ulaanbaatar", "Asia"],

        // Africa
        ["Egypt", "Cairo", "Africa"], ["Nigeria", "Abuja", "Africa"], ["Kenya", "Nairobi", "Africa"],
        ["Morocco", "Rabat", "Africa"], ["Ethiopia", "Addis Ababa", "Africa"], ["Ghana", "Accra", "Africa"],
        ["Algeria", "Algiers", "Africa"], ["Tanzania", "Dodoma", "Africa"], ["Tunisia", "Tunis", "Africa"],
        ["Senegal", "Dakar", "Africa"],

        // North America
        ["United States", "Washington, D.C.", "North America"], ["Canada", "Ottawa", "North America"],
        ["Mexico", "Mexico City", "North America"], ["Cuba", "Havana", "North America"],
        ["Jamaica", "Kingston", "North America"], ["Costa Rica", "San José", "North America"],
        ["Panama", "Panama City", "North America"],

        // South America
        ["Brazil", "Brasília", "South America"], ["Argentina", "Buenos Aires", "South America"],
        ["Chile", "Santiago", "South America"], ["Peru", "Lima", "South America"],
        ["Colombia", "Bogotá", "South America"], ["Venezuela", "Caracas", "South America"],
        ["Ecuador", "Quito", "South America"], ["Uruguay", "Montevideo", "South America"],

        // Oceania
        ["Australia", "Canberra", "Oceania"], ["New Zealand", "Wellington", "Oceania"], ["Fiji", "Suva", "Oceania"]
    ];

    // Rebuilds the question every time it is shown, so the direction
    // (country -> capital OR capital -> country) and the wrong answers
    // change on every play.
    function refreshCapital(q) {
        const [country, capital, region] = q.entry;
        const askCapital = Math.random() < 0.5;

        const others = CAPITAL_LIST.filter(e => e[0] !== country);
        // Prefer wrong answers from the same region so it is harder
        const nearby = shuffle(others.filter(e => e[2] === region));
        const far = shuffle(others.filter(e => e[2] !== region));
        const wrong = [...nearby, ...far].slice(0, 3);

        if (askCapital) {
            q.question = "What is the capital of " + country + "?";
            q.correct = capital;
            q.answers = [capital, ...wrong.map(e => e[1])];
            q.explanation = capital + " is the capital of " + country + ".";
        } else {
            q.question = capital + " is the capital of which country?";
            q.correct = country;
            q.answers = [country, ...wrong.map(e => e[0])];
            q.explanation = capital + " is the capital of " + country + ".";
        }

        q.hint = "The country is in " + region + ".";
    }

    const capitalPool = CAPITAL_LIST.map(entry => ({
        category: "Capitals",
        difficulty: "normal",
        visual: "🏛️",
        question: "",
        answers: [],
        correct: "",
        hint: "",
        explanation: "",
        entry: entry,
        refresh: refreshCapital
    }));


    // ---------------------------------
    // Register the pools + add the sidebar buttons
    // ---------------------------------
    extraPools["True or False"] = tfPool;
    extraPools["Capitals"] = capitalPool;

    function addModeButton(category, iconClass, label) {
        if (document.querySelector('[data-category="' + category + '"]')) return;

        const button = document.createElement("button");
        button.className = "nav-item";
        button.dataset.category = category;

        const icon = document.createElement("i");
        icon.className = "fa-solid " + iconClass;

        button.append(icon, " " + label);

        // Place the new buttons just above "Find the Country"
        const anchor = document.getElementById("map-nav");
        anchor.parentNode.insertBefore(button, anchor);

        bindNavButton(button);
    }

    addModeButton("True or False", "fa-circle-question", "True or False");
    addModeButton("Capitals", "fa-city", "Capitals");
})();