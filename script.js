// =====================================
// WORLD CHALLENGE - script.js (fixed)
// =====================================


// =====================================
// QUESTIONS
// =====================================

const questions = [

    // GEOGRAPHY
    {
        category: "Geography",
        visual: "🏔️",
        question: "What is the tallest mountain above sea level?",
        answers: ["K2", "Mount Everest", "Kilimanjaro", "Mont Blanc"],
        correct: "Mount Everest",
        hint: "It is located in the Himalayas.",
        explanation: "Mount Everest reaches approximately 8,849 metres."
    },
    {
        category: "Geography",
        visual: "🌊",
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Pacific", "Arctic"],
        correct: "Pacific",
        hint: "It lies between Asia and the Americas.",
        explanation: "The Pacific is the largest ocean in the world."
    },
    {
        category: "Geography",
        visual: "🏛️",
        question: "What is the capital of Italy?",
        answers: ["Madrid", "Athens", "Rome", "Paris"],
        correct: "Rome",
        hint: "The Colosseum is located here.",
        explanation: "Rome is the capital of Italy."
    },

    // WORLD FACTS
    {
        category: "World Facts",
        visual: "🫒",
        question: "Which country is the world's largest olive oil producer?",
        answers: ["Spain", "Italy", "Greece", "Portugal"],
        correct: "Spain",
        hint: "Think of a Mediterranean country with vast olive groves.",
        explanation: "Spain is the largest olive oil producer in typical harvest years."
    },
    {
        category: "World Facts",
        visual: "🏛️",
        question: "Which country claims to be the world's oldest republic?",
        answers: ["Vatican City", "Italy", "Greece", "San Marino"],
        correct: "San Marino",
        hint: "It is one of the smallest countries in Europe and is surrounded by Italy.",
        explanation: "San Marino, traditionally founded in 301 AD, is considered the world's oldest surviving republic."
    },
    {
        category: "World Facts",
        visual: "🍫",
        question: "Which country is particularly famous for its chocolate industry?",
        answers: ["Switzerland", "Egypt", "India", "Brazil"],
        correct: "Switzerland",
        hint: "This country is also famous for watches and the Alps.",
        explanation: "Switzerland has a long-established chocolate-making tradition."
    },
    {
        category: "World Facts",
        visual: "🐼",
        question: "Which country is the natural home of giant pandas?",
        answers: ["Japan", "China", "India", "Australia"],
        correct: "China",
        hint: "Think of the country where the Great Wall is located.",
        explanation: "Giant pandas are native to China."
    },

    // TECHNOLOGY
    {
        category: "Technology",
        visual: "💻",
        question: "What does the acronym API stand for?",
        answers: ["Automated Program Interaction", "Application Programming Interface", "Advanced Protocol Integration", "Applied Process Indicator"],
        correct: "Application Programming Interface",
        hint: "It lets different software programs talk to each other.",
        explanation: "An API is a set of rules that lets one program use the features of another."
    },
    {
        category: "Technology",
        visual: "📚",
        question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
        answers: ["Queue", "Array", "Stack", "Linked List"],
        correct: "Stack",
        hint: "Think of a pile of plates: the last one you put on top is the first one you take off.",
        explanation: "A stack adds and removes items from the same end, so the newest item comes out first."
    },
    {
        category: "Technology",
        visual: "♾️",
        question: "What is an infinite loop?",
        answers: ["A loop that runs a predetermined number of times", "A loop whose terminating condition is never met", "A loop nested inside another loop", "A loop that skips its first iteration"],
        correct: "A loop whose terminating condition is never met",
        hint: "The loop's exit condition never becomes true.",
        explanation: "An infinite loop keeps running because its terminating condition is never met."
    },
    {
        category: "Technology",
        visual: "🧩",
        question: "Which of the following is NOT an object-oriented programming (OOP) concept?",
        answers: ["Encapsulation", "Polymorphism", "Inheritance", "Compilation"],
        correct: "Compilation",
        hint: "It is a step that turns code into a program, not a design principle.",
        explanation: "Compilation is a build step. The core OOP concepts are encapsulation, inheritance, polymorphism and abstraction."
    },

    // HISTORY
    {
        category: "History",
        visual: "🏺",
        question: "Which ancient civilization built the pyramids of Giza?",
        answers: ["Romans", "Ancient Egyptians", "Greeks", "Persians"],
        correct: "Ancient Egyptians",
        hint: "Think of the ancient civilization along the Nile.",
        explanation: "The pyramids of Giza were built in ancient Egypt."
    },
    {
        category: "History",
        visual: "🚀",
        question: "In which year did humans first land on the Moon?",
        answers: ["1965", "1969", "1972", "1980"],
        correct: "1969",
        hint: "The Apollo 11 mission took place in this year.",
        explanation: "Apollo 11 landed on the Moon in July 1969."
    },

    // SCIENCE
    {
        category: "Science",
        visual: "🪐",
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Jupiter", "Mars", "Saturn"],
        correct: "Mars",
        hint: "Its reddish appearance comes from iron oxide.",
        explanation: "Mars is known as the Red Planet."
    },
    {
        category: "Science",
        visual: "🧪",
        question: "What is the chemical formula for water?",
        answers: ["CO2", "H2O", "O2", "NaCl"],
        correct: "H2O",
        hint: "A water molecule contains hydrogen and oxygen.",
        explanation: "Water is made of two hydrogen atoms and one oxygen atom."
    },
    {
        category: "Science",
        visual: "☀️",
        question: "What is the closest star to Earth?",
        answers: ["Sirius", "The Sun", "Polaris", "Proxima Centauri"],
        correct: "The Sun",
        hint: "It gives Earth light and heat every day.",
        explanation: "The Sun is our nearest star."
    },
    {
        category: "Science",
        visual: "🫀",
        question: "Which organ pumps blood around the human body?",
        answers: ["Lungs", "Brain", "Heart", "Liver"],
        correct: "Heart",
        hint: "You can feel its beating in your chest.",
        explanation: "The heart pumps blood through the circulatory system."
    }
];


// -------------------------------------
// FLAG QUESTIONS (generated from this list)
// [country code, name, continent]
// To add a flag, just add a line here.
// -------------------------------------

const FLAG_LIST = [
    ["fr", "France", "Europe"],
    ["jp", "Japan", "Asia"],
    ["br", "Brazil", "South America"],
    ["de", "Germany", "Europe"],
    ["it", "Italy", "Europe"],
    ["es", "Spain", "Europe"],
    ["gb", "United Kingdom", "Europe"],
    ["us", "United States", "North America"],
    ["ca", "Canada", "North America"],
    ["mx", "Mexico", "North America"],
    ["ar", "Argentina", "South America"],
    ["au", "Australia", "Oceania"],
    ["nz", "New Zealand", "Oceania"],
    ["cn", "China", "Asia"],
    ["in", "India", "Asia"],
    ["kr", "South Korea", "Asia"],
    ["eg", "Egypt", "Africa"],
    ["za", "South Africa", "Africa"],
    ["ng", "Nigeria", "Africa"],
    ["ke", "Kenya", "Africa"],
    ["tr", "Turkey", "Asia and Europe"],
    ["gr", "Greece", "Europe"],
    ["se", "Sweden", "Europe"],
    ["ch", "Switzerland", "Europe"],
    ["al", "Albania", "Europe"],
    ["ie", "Ireland", "Europe"],
    ["pt", "Portugal", "Europe"],
    ["no", "Norway", "Europe"],
    ["pl", "Poland", "Europe"],
    ["sa", "Saudi Arabia", "Asia"]
];

FLAG_LIST.forEach(([code, name, continent]) => {
    questions.push({
        category: "Flags",
        flag: code,
        continent: continent,
        visual: "🏳️",
        question: "Which country does this flag belong to?",
        answers: [],               // filled fresh every time the question is shown
        correct: name,
        hint: "This country is in " + continent + ".",
        explanation: "This is the flag of " + name + "."
    });
});

// Picks 3 wrong answers (prefers the same continent so it is harder)
function refreshFlagAnswers(q) {
    const others = FLAG_LIST.filter(f => f[1] !== q.correct);
    const sameContinent = shuffle(others.filter(f => f[2] === q.continent));
    const different = shuffle(others.filter(f => f[2] !== q.continent));

    const wrong = [...sameContinent, ...different]
        .slice(0, 3)
        .map(f => f[1]);

    q.answers = [q.correct, ...wrong];
}


// -------------------------------------
// MYSTERY WORLD (unlocked with the secret code)
// -------------------------------------

const mysteryQuestions = [
    {
        category: "Mystery World",
        visual: "🚩",
        question: "Which country has the only non-rectangular national flag?",
        answers: ["Nepal", "Bhutan", "Switzerland", "Sri Lanka"],
        correct: "Nepal",
        hint: "It is home to Mount Everest.",
        explanation: "Nepal's flag is made of two stacked triangular pennants."
    },
    {
        category: "Mystery World",
        visual: "🏰",
        question: "What is the smallest country in the world by area?",
        answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correct: "Vatican City",
        hint: "It sits inside the city of Rome.",
        explanation: "Vatican City covers only about 0.44 square kilometres."
    },
    {
        category: "Mystery World",
        visual: "🏜️",
        question: "Which is the largest hot desert in the world?",
        answers: ["Gobi", "Kalahari", "Sahara", "Arabian"],
        correct: "Sahara",
        hint: "It stretches across North Africa.",
        explanation: "The Sahara covers about 9 million square kilometres."
    },
    {
        category: "Mystery World",
        visual: "🕐",
        question: "Which country has the most time zones when overseas territories are included?",
        answers: ["Russia", "United States", "France", "United Kingdom"],
        correct: "France",
        hint: "Its territories are spread across several oceans.",
        explanation: "France has about 12 time zones because of its overseas territories."
    },
    {
        category: "Mystery World",
        visual: "🏞️",
        question: "Which is the deepest lake in the world?",
        answers: ["Lake Superior", "Lake Victoria", "Lake Tanganyika", "Lake Baikal"],
        correct: "Lake Baikal",
        hint: "It is located in Siberia.",
        explanation: "Lake Baikal is over 1,600 metres deep."
    }
];


// =====================================
// GAME SETTINGS
// =====================================

const QUESTIONS_PER_ROUND = 10;
const QUESTION_TIME = 20;
const MAX_POWERUPS = 3;
const AUTO_NEXT_DELAY = 1500;   
let autoNextTimeout = null;


// =====================================
// GAME STATE
// =====================================

let score = 0;
let streak = 0;
let correctAnswers = 0;
let totalAnswered = 0;

let hints = 2;
let fiftyFifty = 2;

// NEW power-ups
let extraTime = 1;
let skips = 1;
let doublePoints = 1;
let timeUsed = false;
let doubleActive = false;


let currentQuestion = 0;
let selectedQuestions = [];
let currentCategory = "All";

let answered = false;
let hintUsed = false;
let fiftyUsed = false;
let timer = QUESTION_TIME;
let timerInterval = null;

let dailyMode = false;


// =====================================
// HTML ELEMENTS + HELPERS
// =====================================

const $ = id => document.getElementById(id);

const scoreDisplay = $("score");
const questionDisplay = $("question");
const visualDisplay = $("visual");
const categoryDisplay = $("category");
const answersDisplay = $("answers");
const feedbackDisplay = $("feedback");
const explanationDisplay = $("explanation");
const nextButton = $("next-btn");
const hintButton = $("hint-btn");
const fiftyButton = $("fifty-btn");
const resultScreen = $("result-screen");

function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

// Toast notifications (replace alert popups)
function showToast(message, icon = "fa-circle-check", gold = false) {
    let container = $("toasts");

    if (!container) {
        container = document.createElement("div");
        container.id = "toasts";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast" + (gold ? " gold" : "");

    const i = document.createElement("i");
    i.className = "fa-solid " + icon;

    const text = document.createElement("span");
    text.textContent = message;

    toast.append(i, text);
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("out"), 3000);
    setTimeout(() => toast.remove(), 3600);
}


// =====================================
// PLAYER, LEVELS & XP (one single system)
// =====================================

const levels = [
    { name: "Explorer", xp: 0 },
    { name: "Traveller", xp: 100 },
    { name: "Adventurer", xp: 250 },
    { name: "World Expert", xp: 450 },
    { name: "Geography Master", xp: 700 },
    { name: "World Legend", xp: 1000 }
];

const defaultPlayer = {
    name: "Quiz Explorer",
    xp: 0,
    games: 0,
    correct: 0,
    bestStreak: 0,
    achievements: []
};

let player = { ...defaultPlayer };

try {
    player = {
        ...defaultPlayer,
        ...(JSON.parse(localStorage.getItem("worldPlayer")) || {})
    };
} catch (e) {
    player = { ...defaultPlayer };
}

function savePlayer() {
    localStorage.setItem("worldPlayer", JSON.stringify(player));
}

function getLevelIndex(xp) {
    let index = 0;

    levels.forEach((level, i) => {
        if (xp >= level.xp) index = i;
    });

    return index;
}

function updatePlayerDisplay() {
    const currentIndex = getLevelIndex(player.xp);
    const currentLevel = levels[currentIndex];
    const nextLevel = levels[currentIndex + 1];

    $("player-name-display").textContent = player.name;
    $("player-level").textContent =
        "Level " + (currentIndex + 1) + " - " + currentLevel.name;

    $("xp-total").textContent = player.xp + " XP";
    $("games-played").textContent = player.games;
    $("total-correct").textContent = player.correct;
    $("best-streak").textContent = player.bestStreak;

    if (nextLevel) {
        const progress = player.xp - currentLevel.xp;
        const needed = nextLevel.xp - currentLevel.xp;

        $("xp-progress-text").textContent = progress + " / " + needed + " XP";
        $("xp-progress-fill").style.width = (progress / needed * 100) + "%";
        $("next-level-text").textContent =
            (nextLevel.xp - player.xp) + " XP until " + nextLevel.name;
    } else {
        $("xp-progress-text").textContent = "MAX LEVEL";
        $("xp-progress-fill").style.width = "100%";
        $("next-level-text").textContent = "You are a World Legend!";
    }

    savePlayer();
}

// The ONLY addXP function (map-game.js uses this too)
function addXP(amount) {
    const oldIndex = getLevelIndex(player.xp);

    player.xp += amount;

    const newIndex = getLevelIndex(player.xp);

    updatePlayerDisplay();

    if (newIndex > oldIndex) {
        showLevelUp(newIndex);
    }
}


// =====================================
// LEVEL UP POPUP + CONFETTI
// =====================================

function showLevelUp(levelIndex) {
    $("new-level-number").textContent = "LEVEL " + (levelIndex + 1);
    $("new-level-name").textContent = levels[levelIndex].name;
    $("levelup-screen").classList.add("show");

    createConfetti();
}

function createConfetti() {
    const container = $("levelup-confetti");
    container.innerHTML = "";

    const colors = ["#ffd166", "#61d4f1", "#a78bfa", "#48d89a", "#ff7185"];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";

        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + "s";
        piece.style.animationDuration = (2 + Math.random() * 2) + "s";

        container.appendChild(piece);
    }
}

$("close-levelup").addEventListener("click", () => {
    $("levelup-screen").classList.remove("show");
    $("levelup-confetti").innerHTML = "";
});


// =====================================
// START A NEW ROUND
// =====================================

function startGame(category = "All") {

    clearInterval(timerInterval);

    dailyMode = false;
    currentCategory = category;

    let available;

    if (category === "All") {
        available = questions;
    } else if (category === "Mystery World") {
        available = mysteryQuestions;
    } else if (category.includes(":")) {
        const [main, sub] = category.split(":");
        available = questions.filter(q => q.category === main && q.sub === sub);
    }
    else {
        available = questions.filter(q => q.category === category);
    }

    selectedQuestions = shuffle(available).slice(0, QUESTIONS_PER_ROUND);

    resetRoundState();

    resultScreen.classList.add("hidden");
    nextButton.style.display = "block";

    updateStats();
    updateDailyUI();
    showQuestion();
}

function resetRoundState() {
    score = 0;
    streak = 0;
    correctAnswers = 0;
    totalAnswered = 0;

    hints = 2;
    fiftyFifty = 2;

    // NEW power-ups
    extraTime = 1;
    skips = 1;
    doublePoints = 1;

    currentQuestion = 0;
}


// =====================================
// DISPLAY QUESTION
// =====================================

function showQuestion() {

    clearInterval(timerInterval);
    clearTimeout(autoNextTimeout);
    if (currentQuestion >= selectedQuestions.length) {
        endGame();
        return;
    }

    answered = false;
    hintUsed = false;
    fiftyUsed = false;
    timeUsed = false;
    doubleActive = false;

    const q = selectedQuestions[currentQuestion];

    // Flag questions get fresh wrong answers every time
    if (q.flag) refreshFlagAnswers(q);

    questionDisplay.textContent = q.question;
    categoryDisplay.textContent =
        q.category.toUpperCase() + (q.sub ? " • " + q.sub.toUpperCase() : "");

    const difficulty = (q.difficulty || "normal").toLowerCase();
    $("difficulty").textContent = difficulty.toUpperCase();
    $("difficulty").className = "difficulty " + difficulty;

    // Visual: real flag image or emoji
    visualDisplay.innerHTML = "";

    if (q.flag) {
        const img = document.createElement("img");
        img.className = "flag-img";
        img.src = "https://flagcdn.com/w320/" + q.flag + ".png";
        img.srcset = "https://flagcdn.com/w640/" + q.flag + ".png 2x";
        img.alt = "Country flag";

        // If the image fails to load (offline), fall back to the emoji
        img.onerror = () => {
            visualDisplay.textContent = q.visual;
        };

        visualDisplay.appendChild(img);
    } else {
        visualDisplay.textContent = q.visual;
    }

    feedbackDisplay.textContent = "";
    explanationDisplay.textContent = "";

    answersDisplay.innerHTML = "";

    shuffle(q.answers).forEach((answer, index) => {

        const button = document.createElement("button");
        button.className = "answer";
        button.dataset.answer = answer;

        const key = document.createElement("span");
        key.className = "key";
        key.textContent = String.fromCharCode(65 + index);

        const label = document.createElement("span");
        label.textContent = answer;

        button.append(key, label);

        button.addEventListener("click", () => checkAnswer(answer, button));

        answersDisplay.appendChild(button);
    });

    nextButton.disabled = true;
    nextButton.textContent =
        currentQuestion === selectedQuestions.length - 1
            ? "See Results →"
            : "Next Question →";

    updateStats();
    updatePowerups();
    startTimer();
}


// =====================================
// TIMER
// =====================================

function startTimer() {

    timer = QUESTION_TIME;
    $("timer").textContent = timer + "s";
    $("timer").classList.remove("danger");

    timerInterval = setInterval(() => {

        timer--;

        $("timer").textContent = timer + "s";
        $("timer").classList.toggle("danger", timer <= 5);

        if (timer <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null, null);
        }

    }, 1000);
}


// =====================================
// CHECK ANSWER (one single function)
// =====================================

function checkAnswer(answer, selectedButton) {

    if (answered) return;

    answered = true;
    clearInterval(timerInterval);
    $("timer").classList.remove("danger");

    const q = selectedQuestions[currentQuestion];
    const isCorrect = answer !== null && answer === q.correct;

    totalAnswered++;

    document.querySelectorAll(".answer").forEach(button => {

        button.disabled = true;

        if (button.dataset.answer === q.correct) {
            button.classList.add("correct");
        }

        if (selectedButton === button && !isCorrect) {
            button.classList.add("wrong");
        }
        clearTimeout(autoNextTimeout);
        autoNextTimeout = setTimeout(goNext, AUTO_NEXT_DELAY);
    });

    if (isCorrect) {

        // Extra time from the +10 Seconds power-up gives no bonus points,
        // and Double Points multiplies the result
        let points = 100 + Math.min(timer, QUESTION_TIME) * 5;
        if (doubleActive) points *= 2;

        score += points;
        correctAnswers++;
        streak++;

        feedbackDisplay.textContent = "🎉 Correct! +" + points + " points";
        feedbackDisplay.style.color = "#48d89a";

        // Streak reward every 3 correct answers
        // Rewards for answering correctly
const reward = [];

// Every 3 correct in a row: +1 Hint and +1 50/50
if (streak % 3 === 0) {
    if (hints < MAX_POWERUPS) {
        hints++;
        reward.push("+1 Hint");
    }

    if (fiftyFifty < MAX_POWERUPS) {
        fiftyFifty++;
        reward.push("+1 50/50");
    }
}

// Every 4 correct answers in the round: +1 Skip
if (correctAnswers % 4 === 0 && skips < MAX_POWERUPS) {
    skips++;
    reward.push("+1 Skip");
}

// Every 5 correct in a row: +1 Double Points
if (streak % 5 === 0 && doublePoints < MAX_POWERUPS) {
    doublePoints++;
    reward.push("+1 Double Points");
}

if (reward.length) {
    feedbackDisplay.textContent +=
        " 🎁 Reward unlocked: " + reward.join(", ");
}

        // Player stats, XP, achievements, chest progress
        player.correct++;
        player.bestStreak = Math.max(player.bestStreak, streak);

        unlockAchievement("first");
        if (player.correct >= 5) unlockAchievement("five");
        if (player.correct >= 10) unlockAchievement("ten");
        if (streak >= 5) unlockAchievement("streak");

        addXP(20);
        addChestProgress();

    } else {

        streak = 0;

        feedbackDisplay.textContent =
            answer === null ? "⏰ Time's up!" : "❌ Incorrect answer!";

        feedbackDisplay.style.color = "#ff7185";
    }

    explanationDisplay.textContent = q.explanation;
    nextButton.disabled = false;

    updateStats();
    updatePowerups();
    updatePlayerDisplay();

    if (dailyMode) updateDailyUI();
}


// =====================================
// POWER UPS
// =====================================

hintButton.addEventListener("click", () => {

    if (answered || hints <= 0 || hintUsed) return;

    const q = selectedQuestions[currentQuestion];

    hints--;
    hintUsed = true;

    feedbackDisplay.textContent = "💡 Hint: " + q.hint;
    feedbackDisplay.style.color = "#ffd166";

    updatePowerups();
});

fiftyButton.addEventListener("click", () => {

    if (answered || fiftyFifty <= 0 || fiftyUsed) return;

    const q = selectedQuestions[currentQuestion];

    fiftyFifty--;
    fiftyUsed = true;

    const wrongButtons = [...document.querySelectorAll(".answer")]
        .filter(button =>
            button.dataset.answer !== q.correct &&
            !button.classList.contains("hidden")
        );

    shuffle(wrongButtons)
        .slice(0, 2)
        .forEach(button => button.classList.add("hidden"));

    updatePowerups();
});

// +10 SECONDS
$("time-btn").addEventListener("click", () => {

    if (answered || extraTime <= 0 || timeUsed) return;

    extraTime--;
    timeUsed = true;
    timer += 10;

    $("timer").textContent = timer + "s";
    $("timer").classList.toggle("danger", timer <= 5);

    updatePowerups();
});

// SKIP (not allowed in the daily challenge)
$("skip-btn").addEventListener("click", () => {

    if (answered || skips <= 0 || dailyMode) return;

    skips--;
    clearInterval(timerInterval);

    currentQuestion++;
    showQuestion();
});

// DOUBLE POINTS
$("double-btn").addEventListener("click", () => {

    if (answered || doublePoints <= 0 || doubleActive) return;

    doublePoints--;
    doubleActive = true;

    feedbackDisplay.textContent = "⚡ Double points active for this question!";
    feedbackDisplay.style.color = "#ffd166";

    updatePowerups();
});

function updatePowerups() {

    $("hint-count").textContent = hints;
    $("fifty-count").textContent = fiftyFifty;
    $("time-count").textContent = extraTime;
    $("skip-count").textContent = skips;
    $("double-count").textContent = doublePoints;

    hintButton.disabled = hints <= 0 || hintUsed || answered;
    fiftyButton.disabled = fiftyFifty <= 0 || fiftyUsed || answered;
    $("time-btn").disabled = extraTime <= 0 || timeUsed || answered;
    $("skip-btn").disabled = skips <= 0 || answered || dailyMode;
    $("double-btn").disabled = doublePoints <= 0 || doubleActive || answered;
}


// =====================================
// DASHBOARD
// =====================================

function updateStats() {

    scoreDisplay.textContent = score;
    $("streak").textContent = streak;

    const shown = Math.min(currentQuestion + 1, selectedQuestions.length);

    $("question-number").textContent = shown + " / " + selectedQuestions.length;
    $("question-progress").textContent =
        "Question " + shown + " of " + selectedQuestions.length;

    const accuracy = totalAnswered === 0
        ? 0
        : Math.round((correctAnswers / totalAnswered) * 100);

    $("accuracy").textContent = accuracy + "%";

    $("progress-fill").style.width =
        (currentQuestion / selectedQuestions.length * 100) + "%";

    $("best-score").textContent =
        Number(localStorage.getItem("worldBest") || 0);
}


// =====================================
// NEXT QUESTION
// =====================================

function goNext() {

    clearTimeout(autoNextTimeout);

    if (!answered) return;

    currentQuestion++;
    showQuestion();
}

nextButton.addEventListener("click", goNext);


// =====================================
// FINISH GAME (one single function)
// =====================================

function endGame() {

    clearInterval(timerInterval);

    const accuracy = Math.round(
        correctAnswers / selectedQuestions.length * 100
    );

    const previousBest = Number(localStorage.getItem("worldBest") || 0);

    if (score > previousBest) {
        localStorage.setItem("worldBest", score);
    }

    $("final-score").textContent = score;
    $("final-correct").textContent =
        correctAnswers + "/" + selectedQuestions.length;
    $("final-accuracy").textContent = accuracy + "%";
    $("best-score").textContent = Math.max(score, previousBest);
    $("progress-fill").style.width = "100%";

    nextButton.style.display = "none";
    resultScreen.classList.remove("hidden");

    // Daily challenge reward
    if (dailyMode) finishDailyChallenge();

    // Save to personal leaderboard
    player.games++;

    const leaderboard = JSON.parse(
        localStorage.getItem("worldLeaderboard") || "[]"
    );

    const existing = leaderboard.find(entry => entry.name === player.name);

    if (existing) {
        existing.score = Math.max(existing.score, score);
    } else {
        leaderboard.push({ name: player.name, score: score });
    }

    localStorage.setItem("worldLeaderboard", JSON.stringify(leaderboard));

    updatePlayerDisplay();
    renderLeaderboard();
}

$("play-again").addEventListener("click", () => {
    // A finished daily challenge can't be replayed, so go back to all questions
    startGame(currentCategory === "Daily Challenge" ? "All" : currentCategory);
});


// =====================================
// SIDEBAR CATEGORIES
// =====================================

function bindNavButton(button) {

    button.addEventListener("click", () => {

        // The map game button has its own code in map-game.js
        if (button.classList.contains("map-nav") || button.classList.contains("nav-toggle")) return;

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        startGame(button.dataset.category);
    });
}

document.querySelectorAll(".nav-item").forEach(bindNavButton);


// =====================================
// SECRET CODE -> MYSTERY WORLD
// =====================================

function addMysteryButton() {

    if (document.querySelector('[data-category="Mystery World"]')) return;

    const button = document.createElement("button");
    button.className = "nav-item secret-nav";
    button.dataset.category = "Mystery World";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-user-secret";

    button.append(icon, " Mystery World");

    document.querySelector(".sidebar").insertBefore(
        button,
        document.querySelector(".sidebar-bottom")
    );

    bindNavButton(button);
}

$("unlock-secret").addEventListener("click", () => {

    const code = $("secret-code").value.trim().toUpperCase();

    if (code === "WORLD2026") {

        localStorage.setItem("worldMystery", "1");
        addMysteryButton();

        $("secret-message").textContent =
            "🎉 SECRET UNLOCKED! Mystery World is now in the menu.";
        $("secret-message").style.color = "#48d89a";

        showToast("Mystery World unlocked!", "fa-user-secret", true);

    } else {

        $("secret-message").textContent =
            "❌ Wrong code! Keep searching...";
        $("secret-message").style.color = "#ff7185";
    }
});


// =====================================
// PLAYER NAME
// =====================================

$("save-player-name").addEventListener("click", () => {

    const name = $("player-name-input").value.trim();

    if (name.length > 0) {
        player.name = name;
        updatePlayerDisplay();
        renderLeaderboard();
        showToast("Name saved!", "fa-floppy-disk");
    }
});


// =====================================
// PERSONAL LEADERBOARD
// =====================================

function renderLeaderboard() {

    const leaderboard = JSON.parse(
        localStorage.getItem("worldLeaderboard") || "[]"
    );

    leaderboard.sort((a, b) => b.score - a.score);

    $("leaderboard-list").innerHTML = "";

    if (leaderboard.length === 0) {
        $("leaderboard-list").innerHTML =
            '<p class="empty-leaderboard">No scores yet. Play a game!</p>';
        return;
    }

    leaderboard.forEach((entry, index) => {

        const div = document.createElement("div");
        div.className = "leaderboard-entry";

        const rank = document.createElement("span");
        rank.className = "leaderboard-rank";
        rank.textContent = ["🥇", "🥈", "🥉"][index] || "#" + (index + 1);

        const name = document.createElement("span");
        name.className = "leaderboard-player";
        name.textContent = entry.name;

        const points = document.createElement("span");
        points.className = "leaderboard-score";
        points.textContent = entry.score + " pts";

        div.append(rank, name, points);
        $("leaderboard-list").appendChild(div);
    });
}


// =====================================
// ACHIEVEMENTS
// =====================================

const achievements = [
    { id: "first", name: "First Victory", icon: "🎯", description: "Answer correctly once" },
    { id: "five", name: "Knowledge Seeker", icon: "📚", description: "Answer 5 questions correctly" },
    { id: "ten", name: "Quiz Master", icon: "🏆", description: "Answer 10 questions correctly" },
    { id: "streak", name: "On Fire", icon: "🔥", description: "Reach a streak of 5" }
];

function unlockAchievement(id) {

    if (player.achievements.includes(id)) return;

    player.achievements.push(id);

    const item = achievements.find(a => a.id === id);

    showToast(
        "Achievement unlocked: " + (item ? item.name : id),
        "fa-award",
        true
    );

    renderAchievements();
}

function renderAchievements() {

    $("achievement-count").textContent = player.achievements.length;
    $("achievements-list").innerHTML = "";

    achievements.forEach(item => {

        const unlocked = player.achievements.includes(item.id);

        const div = document.createElement("div");
        div.className = "achievement" + (unlocked ? " unlocked" : " locked");

        const icon = document.createElement("span");
        icon.textContent = item.icon;

        const name = document.createElement("strong");
        name.textContent = item.name;

        const description = document.createElement("small");
        description.textContent = item.description;

        div.append(icon, name, description);
        $("achievements-list").appendChild(div);
    });
}


// =====================================
// MYSTERY CHEST
// =====================================

let chestData = { count: 0, progress: 0 };

try {
    chestData = {
        ...chestData,
        ...(JSON.parse(localStorage.getItem("worldChests")) || {})
    };
} catch (e) {}

function saveChests() {
    localStorage.setItem("worldChests", JSON.stringify(chestData));
}

function updateChestDisplay() {

    $("chest-count").textContent = chestData.count;

    $("chest-progress-fill").style.width =
        (chestData.progress / 5 * 100) + "%";

    $("chest-progress-text").textContent =
        chestData.progress + " / 5 correct answers";

    $("open-chest").disabled = chestData.count <= 0;
}

function addChestProgress() {

    chestData.progress++;

    if (chestData.progress >= 5) {
        chestData.progress = 0;
        chestData.count++;

        $("chest-reward").textContent = "🎉 You earned a Mystery Chest!";
        showToast("You earned a Mystery Chest!", "fa-gift", true);
    }

    saveChests();
    updateChestDisplay();
}

$("open-chest").addEventListener("click", () => {

    if (chestData.count <= 0) return;

    chestData.count--;

    const rewards = [
        { text: "+50 XP", chance: 36, type: "xp", amount: 50 },
        { text: "+100 XP", chance: 25, type: "xp", amount: 100 },
        { text: "+200 XP", chance: 12, type: "xp", amount: 200 },
        { text: "+1 Hint", chance: 7, type: "hint", amount: 1 },
        { text: "+1 50/50", chance: 5, type: "fifty", amount: 1 },
        { text: "+1 Extra Time", chance: 4, type: "time", amount: 1 },
        { text: "+1 Skip", chance: 4, type: "skip", amount: 1 },
        { text: "+1 Double Points", chance: 6, type: "double", amount: 1 },
        { text: "LEGENDARY! +500 XP", chance: 1, type: "xp", amount: 500 }
    ];

    const random = Math.random() * 100;
    let total = 0;

    const reward = rewards.find(item => {
        total += item.chance;
        return random < total;
    }) || rewards[0];

    if (reward.type === "xp") addXP(reward.amount);
    if (reward.type === "hint") hints++;
    if (reward.type === "fifty") fiftyFifty++;
    if (reward.type === "time") extraTime++;
    if (reward.type === "skip") skips++;
    if (reward.type === "double") doublePoints++;

    updatePowerups();

    $("chest-image").classList.add("opening");
    setTimeout(() => $("chest-image").classList.remove("opening"), 1500);

    $("chest-reward").textContent = "🎉 YOU WON: " + reward.text;

    saveChests();
    updateChestDisplay();
});


// =====================================
// DAILY CHALLENGE
// =====================================

const DAILY_COUNT = 5;
const DAILY_BONUS_XP = 100;

function dateString(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
}

const dailyToday = () => dateString(new Date());

function dailyCompleted() {
    return localStorage.getItem("dailyCompleted") === dailyToday();
}

// Same 5 questions for the whole day (seeded by the date)
function getDailyQuestions() {

    const date = dailyToday();
    let seed = 0;

    for (let i = 0; i < date.length; i++) {
        seed = (seed * 31 + date.charCodeAt(i)) >>> 0;
    }

    const pool = [...questions];

    for (let i = pool.length - 1; i > 0; i--) {
        seed = (seed * 1664525 + 1013904223) >>> 0;

        const j = seed % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, DAILY_COUNT);
}

function updateDailyUI() {

    const completed = dailyCompleted();

    const progress = dailyMode
        ? Math.min(totalAnswered, DAILY_COUNT)
        : completed ? DAILY_COUNT : 0;

    $("daily-progress-fill").style.width =
        (progress / DAILY_COUNT * 100) + "%";

    $("daily-progress-text").textContent = progress + " / " + DAILY_COUNT;

    $("daily-streak").textContent = localStorage.getItem("dailyStreak") || 0;

    $("daily-start-btn").disabled = completed;

    $("daily-start-btn").innerHTML = completed
        ? '<i class="fa-solid fa-check"></i> COMPLETED TODAY'
        : '<i class="fa-solid fa-play"></i> START DAILY CHALLENGE';
}

function startDailyChallenge() {

    if (dailyCompleted()) {
        $("daily-status").textContent =
            "You have already completed today's challenge!";
        return;
    }

    clearInterval(timerInterval);

    dailyMode = true;
    currentCategory = "Daily Challenge";
    selectedQuestions = getDailyQuestions();

    resetRoundState();

    resultScreen.classList.add("hidden");
    nextButton.style.display = "block";

    $("daily-status").textContent =
        "Your daily mission has started! Good luck!";

    updateStats();
    updateDailyUI();
    showQuestion();

    document.querySelector(".quiz-card").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function finishDailyChallenge() {

    if (!dailyMode || dailyCompleted()) return;

    const today = dailyToday();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDate = localStorage.getItem("dailyLastDate");

    let dailyStreak = Number(localStorage.getItem("dailyStreak") || 0);

    dailyStreak = lastDate === dateString(yesterday)
        ? dailyStreak + 1
        : 1;

    localStorage.setItem("dailyCompleted", today);
    localStorage.setItem("dailyStreak", dailyStreak);
    localStorage.setItem("dailyLastDate", today);

    dailyMode = false;

    addXP(DAILY_BONUS_XP);

    $("daily-status").textContent =
        "Daily challenge completed! +" + DAILY_BONUS_XP + " XP earned!";

    showToast("Daily challenge complete! +" + DAILY_BONUS_XP + " XP", "fa-fire", true);

    updateDailyUI();
}

$("daily-start-btn").addEventListener("click", startDailyChallenge);

function updateDailyCountdown() {

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const remaining = tomorrow - now;

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    $("daily-countdown").textContent =
        [hours, minutes, seconds]
            .map(n => String(n).padStart(2, "0"))
            .join(":");
}

setInterval(updateDailyCountdown, 1000);


// =====================================
// KEYBOARD SHORTCUTS
// A-D or 1-4 to answer, Enter for next question
// =====================================

document.addEventListener("keydown", event => {

    const tag = event.target.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    // Ignore while a popup or the map game is open
    if ($("levelup-screen").classList.contains("show")) return;
    if (!resultScreen.classList.contains("hidden")) return;

    const mapScreen = $("map-screen");
    if (mapScreen && !mapScreen.classList.contains("hidden")) return;

    const key = event.key.toLowerCase();
    const index = "abcd".includes(key) && key.length === 1
        ? "abcd".indexOf(key)
        : "1234".indexOf(key);

    if (index >= 0 && key.length === 1) {
        const buttons = document.querySelectorAll(".answer");
        const button = buttons[index];

        if (button && !button.disabled && !button.classList.contains("hidden")) {
            button.click();
        }
        return;
    }

    if (event.key === "Enter" && tag !== "BUTTON") {
        if (!nextButton.disabled && nextButton.style.display !== "none") {
            nextButton.click();
        }
    }
});


// =====================================
// FLOATING PARTICLES
// =====================================

const particleContainer = $("particles");

for (let i = 0; i < 35; i++) {

    const particle = document.createElement("div");
    particle.className = "particle";

    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = (8 + Math.random() * 15) + "s";
    particle.style.animationDelay = (-Math.random() * 20) + "s";
    particle.style.opacity = Math.random();

    particleContainer.appendChild(particle);
}


// =====================================
// INITIALIZE EVERYTHING
// =====================================

if (localStorage.getItem("worldMystery") === "1") {
    addMysteryButton();
}

$("best-score").textContent = Number(localStorage.getItem("worldBest") || 0);

updatePlayerDisplay();
renderLeaderboard();
renderAchievements();
updateChestDisplay();
updateDailyUI();
updateDailyCountdown();

startGame("All");
