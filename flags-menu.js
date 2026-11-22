// =====================================
// flags-menu.js - Flags dropdown by continent
// Load this AFTER script.js
// =====================================

(function () {

    // ---------- MORE FLAGS ----------
    // [country code, name, continent]
    // The continent must be one of: Europe, Asia, Africa,
    // North America, South America, Oceania

    const EXTRA_FLAGS = [

        // Europe
        ["nl", "Netherlands", "Europe"],
        ["be", "Belgium", "Europe"],
        ["at", "Austria", "Europe"],
        ["dk", "Denmark", "Europe"],
        ["fi", "Finland", "Europe"],
        ["ua", "Ukraine", "Europe"],
        ["cz", "Czechia", "Europe"],
        ["hu", "Hungary", "Europe"],

        // Asia
        ["th", "Thailand", "Asia"],
        ["vn", "Vietnam", "Asia"],
        ["id", "Indonesia", "Asia"],
        ["ph", "Philippines", "Asia"],
        ["pk", "Pakistan", "Asia"],
        ["ir", "Iran", "Asia"],
        ["np", "Nepal", "Asia"],
        ["my", "Malaysia", "Asia"],

        // Africa
        ["ma", "Morocco", "Africa"],
        ["dz", "Algeria", "Africa"],
        ["et", "Ethiopia", "Africa"],
        ["gh", "Ghana", "Africa"],
        ["tn", "Tunisia", "Africa"],
        ["sn", "Senegal", "Africa"],
        ["tz", "Tanzania", "Africa"],
        ["ug", "Uganda", "Africa"],

        // North America
        ["cu", "Cuba", "North America"],
        ["jm", "Jamaica", "North America"],
        ["cr", "Costa Rica", "North America"],
        ["pa", "Panama", "North America"],
        ["gt", "Guatemala", "North America"],
        ["do", "Dominican Republic", "North America"],

        // South America
        ["cl", "Chile", "South America"],
        ["co", "Colombia", "South America"],
        ["pe", "Peru", "South America"],
        ["ve", "Venezuela", "South America"],
        ["uy", "Uruguay", "South America"],
        ["ec", "Ecuador", "South America"],
        ["bo", "Bolivia", "South America"],
        ["py", "Paraguay", "South America"],

        // Oceania
        ["fj", "Fiji", "Oceania"],
        ["pg", "Papua New Guinea", "Oceania"],
        ["ws", "Samoa", "Oceania"],
        ["to", "Tonga", "Oceania"],
        ["sb", "Solomon Islands", "Oceania"],
        ["vu", "Vanuatu", "Oceania"]
    ];

    EXTRA_FLAGS.forEach(([code, name, continent]) => {

        // Add to the master list so these can also appear as wrong answers
        FLAG_LIST.push([code, name, continent]);

        questions.push({
            category: "Flags",
            flag: code,
            continent: continent,
            visual: "🏳️",
            question: "Which country does this flag belong to?",
            answers: [],               // filled fresh each time by script.js
            correct: name,
            hint: "",
            explanation: "This is the flag of " + name + "."
        });
    });


    // ---------- TOPICS + BETTER HINTS FOR EVERY FLAG ----------

    questions
        .filter(q => q.category === "Flags")
        .forEach(q => {

            // Turkey is listed as "Asia and Europe", so we file it under Asia
            q.sub = q.continent === "Asia and Europe" ? "Asia" : q.continent;

            const letters = q.correct.replace(/ /g, "").length;

            q.hint =
                "It's in " + q.continent + ". The name starts with “" +
                q.correct[0] + "” and has " + letters + " letters.";
        });


    // ---------- DROPDOWN BEHAVIOUR ----------

    const toggle = document.getElementById("flags-toggle");
    const submenu = document.getElementById("flags-submenu");

    if (!toggle || !submenu) return;

    toggle.addEventListener("click", () => {
        const open = submenu.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
    });

    // Highlight "Flags" while one of its topics is selected
    document.querySelectorAll(".nav-item").forEach(button => {

        button.addEventListener("click", () => {

            if (button === toggle) return;

            toggle.classList.toggle("has-active", submenu.contains(button));
        });
    });

})();
