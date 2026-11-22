// =====================================
// tech-menu.js - Technology dropdown + sub-topic questions
// Load this AFTER script.js
// =====================================

(function () {

    // Your 4 existing Technology questions become "Programming"
    questions
        .filter(q => q.category === "Technology" && !q.sub)
        .forEach(q => { q.sub = "Programming"; });

    // ---------- NEW QUESTIONS ----------
    // To add one, copy a block and change the text. "sub" must match
    // the data-category in the dropdown, e.g. "Technology:Hardware".

    const techQuestions = [

        // PROGRAMMING
        {
            sub: "Programming",
            visual: "🌐",
            question: "Which language is mainly used to add interactivity to web pages?",
            answers: ["HTML", "CSS", "JavaScript", "SQL"],
            correct: "JavaScript",
            hint: "It runs inside your web browser.",
            explanation: "JavaScript makes pages interactive. HTML gives a page its structure and CSS gives it its style."
        },
        {
            sub: "Programming",
            visual: "📄",
            question: "What does HTML stand for?",
            answers: ["HyperText Markup Language", "High Transfer Machine Language", "HyperTool Multi Language", "Home Text Markup Level"],
            correct: "HyperText Markup Language",
            hint: "It describes the structure of a web page.",
            explanation: "HTML is the standard markup language used to build the structure of web pages."
        },
        {
            sub: "Programming",
            visual: "🟰",
            question: "In most programming languages, what does the == operator do?",
            answers: ["Assigns a value", "Compares two values for equality", "Adds two numbers", "Declares a variable"],
            correct: "Compares two values for equality",
            hint: "A single = does something different.",
            explanation: "== checks whether two values are equal, while a single = assigns a value to a variable."
        },

        // HARDWARE
        {
            sub: "Hardware",
            visual: "🧠",
            question: "What does CPU stand for?",
            answers: ["Central Processing Unit", "Computer Power Unit", "Core Program Utility", "Central Program Updater"],
            correct: "Central Processing Unit",
            hint: "It is often called the brain of the computer.",
            explanation: "The CPU runs program instructions and does most of a computer's calculations."
        },
        {
            sub: "Hardware",
            visual: "💾",
            question: "Which of these keeps your files even when the power is off?",
            answers: ["RAM", "SSD", "CPU", "Cache"],
            correct: "SSD",
            hint: "Think about where your photos and documents are saved.",
            explanation: "SSDs and hard drives store data long-term. RAM only holds data while the computer is on."
        },
        {
            sub: "Hardware",
            visual: "⚡",
            question: "What is RAM mainly used for?",
            answers: ["Permanently storing files", "Temporarily holding data for running programs", "Connecting to the internet", "Cooling the computer"],
            correct: "Temporarily holding data for running programs",
            hint: "It is fast memory that is cleared when you shut down.",
            explanation: "RAM gives the CPU quick access to the data of the programs you are using right now."
        },
        {
            sub: "Hardware",
            visual: "🎮",
            question: "Which component is mainly responsible for rendering graphics?",
            answers: ["PSU", "GPU", "BIOS", "SSD"],
            correct: "GPU",
            hint: "Gamers often upgrade this part first.",
            explanation: "The GPU (Graphics Processing Unit) is built to draw images and handle many calculations at once."
        },

        // INTERNET & NETWORKS
        {
            sub: "Internet & Networks",
            visual: "📖",
            question: "What does DNS do?",
            answers: ["Translates domain names into IP addresses", "Encrypts your web traffic", "Stores your website files", "Speeds up your Wi-Fi"],
            correct: "Translates domain names into IP addresses",
            hint: "Think of it as the internet's phone book.",
            explanation: "The Domain Name System turns names like example.com into the IP addresses computers use."
        },
        {
            sub: "Internet & Networks",
            visual: "🔗",
            question: "What does HTTP stand for?",
            answers: ["HyperText Transfer Protocol", "High Transfer Text Process", "Hyper Terminal Transmission Path", "Home Tool Transfer Protocol"],
            correct: "HyperText Transfer Protocol",
            hint: "It is the set of rules browsers use to request web pages.",
            explanation: "HTTP is the protocol used to transfer web pages between servers and browsers."
        },
        {
            sub: "Internet & Networks",
            visual: "🔒",
            question: "What does the 'S' in HTTPS stand for?",
            answers: ["Server", "Speed", "Secure", "Standard"],
            correct: "Secure",
            hint: "It means the connection is encrypted.",
            explanation: "HTTPS is HTTP with encryption, which protects data sent between you and a website."
        },
        {
            sub: "Internet & Networks",
            visual: "📡",
            question: "What is an IP address?",
            answers: ["A unique number that identifies a device on a network", "The password for your Wi-Fi", "The speed of your connection", "A website's design theme"],
            correct: "A unique number that identifies a device on a network",
            hint: "It works a bit like a home address for your device.",
            explanation: "IP addresses let devices find and send data to each other across a network."
        },

        // CYBERSECURITY
        {
            sub: "Cybersecurity",
            visual: "🎣",
            question: "What is phishing?",
            answers: ["Tricking people into revealing private information with fake messages", "Speeding up a slow computer", "Copying a website's design legally", "Encrypting files with a key"],
            correct: "Tricking people into revealing private information with fake messages",
            hint: "It often arrives as a fake email or text.",
            explanation: "Phishing messages pretend to be from a trusted source to steal passwords or personal details."
        },
        {
            sub: "Cybersecurity",
            visual: "🧱",
            question: "What does a firewall do?",
            answers: ["Monitors and filters network traffic", "Makes your computer run faster", "Deletes old files", "Backs up your photos"],
            correct: "Monitors and filters network traffic",
            hint: "It acts like a guard between your device and the network.",
            explanation: "A firewall blocks or allows network traffic based on security rules."
        },
        {
            sub: "Cybersecurity",
            visual: "🔑",
            question: "Which is the strongest kind of password?",
            answers: ["Your birthday", "The word 'password'", "A long, unique mix of letters, numbers and symbols", "Your pet's name"],
            correct: "A long, unique mix of letters, numbers and symbols",
            hint: "Length and unpredictability matter most.",
            explanation: "Long, unique passwords are much harder to guess. A password manager can help you keep track of them."
        },
        {
            sub: "Cybersecurity",
            visual: "📱",
            question: "What does two-factor authentication (2FA) add?",
            answers: ["A second proof of your identity besides your password", "A faster login", "A longer password", "Automatic virus removal"],
            correct: "A second proof of your identity besides your password",
            hint: "Think of a code sent to your phone.",
            explanation: "With 2FA, a stolen password alone isn't enough to get into your account."
        },

        // AI & DATA
        {
            sub: "AI & Data",
            visual: "🤖",
            question: "What is machine learning?",
            answers: ["Computers learning patterns from data instead of following only fixed rules", "Building robots from metal", "Typing code faster", "Repairing broken hardware"],
            correct: "Computers learning patterns from data instead of following only fixed rules",
            hint: "The more examples it sees, the better it can get.",
            explanation: "Machine learning systems find patterns in data and use them to make predictions or decisions."
        },
        {
            sub: "AI & Data",
            visual: "🗄️",
            question: "What does SQL mainly work with?",
            answers: ["Images", "Databases", "Sound files", "Network cables"],
            correct: "Databases",
            hint: "It is used to store, search and update tables of data.",
            explanation: "SQL (Structured Query Language) is used to manage and query data in relational databases."
        },
        {
            sub: "AI & Data",
            visual: "0️⃣",
            question: "What is a 'bit'?",
            answers: ["A small piece of code", "The smallest unit of data, either 0 or 1", "A type of virus", "A kind of cable"],
            correct: "The smallest unit of data, either 0 or 1",
            hint: "Computers use a number system with only two digits.",
            explanation: "A bit is a single binary digit, and all digital data is made of bits."
        },
        {
            sub: "AI & Data",
            visual: "🔢",
            question: "How many bits are in one byte?",
            answers: ["4", "8", "16", "32"],
            correct: "8",
            hint: "It is a power of two.",
            explanation: "One byte is 8 bits."
        }
    ];

    techQuestions.forEach(q => {
        q.category = "Technology";
        questions.push(q);
    });


    // ---------- DROPDOWN BEHAVIOUR ----------

    const toggle = document.getElementById("tech-toggle");
    const submenu = document.getElementById("tech-submenu");

    if (!toggle || !submenu) return;

    // Open / close the dropdown
    toggle.addEventListener("click", () => {
        const open = submenu.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
    });

    // Highlight "Technology" while one of its topics is selected
    document.querySelectorAll(".nav-item").forEach(button => {

        button.addEventListener("click", () => {

            if (button === toggle) return;

            toggle.classList.toggle("has-active", submenu.contains(button));
        });
    });

})();