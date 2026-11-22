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
        sub: "Programming",
        visual: "💻",
        question: "What does the acronym API stand for?",
        answers: ["Automated Program Interaction", "Application Programming Interface", "Advanced Protocol Integration", "Applied Process Indicator"],
        correct: "Application Programming Interface",
        hint: "It lets different software programs talk to each other.",
        explanation: "An API is a set of rules that lets one program use the features of another."
    },
    {
        category: "Technology",
        sub: "Programming",
        visual: "📚",
        question: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
        answers: ["Queue", "Array", "Stack", "Linked List"],
        correct: "Stack",
        hint: "Think of a pile of plates: the last one you put on top is the first one you take off.",
        explanation: "A stack adds and removes items from the same end, so the newest item comes out first."
    },
    {
        category: "Technology",
        sub: "Programming",
        visual: "♾️",
        question: "What is an infinite loop?",
        answers: ["A loop that runs a predetermined number of times", "A loop whose terminating condition is never met", "A loop nested inside another loop", "A loop that skips its first iteration"],
        correct: "A loop whose terminating condition is never met",
        hint: "The loop's exit condition never becomes true.",
        explanation: "An infinite loop keeps running because its terminating condition is never met."
    },
    {
        category: "Technology",
        sub: "Programming",
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
    },


    // =====================================
    // MORE GEOGRAPHY
    // =====================================
    { category: "Geography", difficulty: "easy", visual: "🗼", question: "Which river flows through Paris?",
      answers: ["Thames", "Seine", "Rhine", "Danube"], correct: "Seine",
      hint: "It runs past the Eiffel Tower.", explanation: "The Seine flows through the centre of Paris." },
    { category: "Geography", difficulty: "easy", visual: "🗺️", question: "Which is the largest country in the world by area?",
      answers: ["Canada", "China", "United States", "Russia"], correct: "Russia",
      hint: "It spans eleven time zones.", explanation: "Russia covers about 17 million square kilometres." },
    { category: "Geography", difficulty: "normal", visual: "🦘", question: "What is the capital of Australia?",
      answers: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: "Canberra",
      hint: "It is not the biggest city, which is why it is a popular trick question.", explanation: "Canberra was purpose-built as the capital." },
    { category: "Geography", difficulty: "easy", visual: "🍁", question: "What is the capital of Canada?",
      answers: ["Toronto", "Vancouver", "Montreal", "Ottawa"], correct: "Ottawa",
      hint: "It sits on the border between Ontario and Quebec.", explanation: "Ottawa is the capital of Canada." },
    { category: "Geography", difficulty: "normal", visual: "🧊", question: "What is the largest island in the world?",
      answers: ["Madagascar", "Greenland", "Borneo", "New Guinea"], correct: "Greenland",
      hint: "Most of it is covered by an ice sheet.", explanation: "Greenland is the largest island that is not a continent." },
    { category: "Geography", difficulty: "hard", visual: "🌍", question: "Which continent has the most countries?",
      answers: ["Asia", "Europe", "Africa", "South America"], correct: "Africa",
      hint: "It has more than 50 recognised countries.", explanation: "Africa has 54 recognised countries." },
    { category: "Geography", difficulty: "normal", visual: "🌉", question: "Which strait separates Spain from Morocco?",
      answers: ["Bosphorus", "Strait of Gibraltar", "Strait of Hormuz", "English Channel"], correct: "Strait of Gibraltar",
      hint: "It connects the Atlantic Ocean and the Mediterranean Sea.", explanation: "The Strait of Gibraltar is only about 14 km wide at its narrowest." },
    { category: "Geography", difficulty: "easy", visual: "🗾", question: "What is the capital of Japan?",
      answers: ["Kyoto", "Osaka", "Tokyo", "Seoul"], correct: "Tokyo",
      hint: "It is one of the largest cities in the world.", explanation: "Tokyo is the capital of Japan." },
    { category: "Geography", difficulty: "normal", visual: "🏙️", question: "What is the capital of Brazil?",
      answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: "Brasília",
      hint: "It is not Rio de Janeiro, even though many people think so.", explanation: "Brasília became Brazil's capital in 1960." },
    { category: "Geography", difficulty: "easy", visual: "🐪", question: "What is the capital of Egypt?",
      answers: ["Alexandria", "Cairo", "Luxor", "Giza"], correct: "Cairo",
      hint: "It lies on the River Nile.", explanation: "Cairo is the capital and largest city of Egypt." },
    { category: "Geography", difficulty: "easy", visual: "🥾", question: "Which country is shaped like a boot?",
      answers: ["Greece", "Portugal", "Italy", "Croatia"], correct: "Italy",
      hint: "Its capital is Rome.", explanation: "Italy's outline looks like a boot kicking the island of Sicily." },
    { category: "Geography", difficulty: "easy", visual: "🏛️", question: "What is the capital of Poland?",
      answers: ["Kraków", "Gdańsk", "Warsaw", "Wrocław"], correct: "Warsaw",
      hint: "It lies on the Vistula River.", explanation: "Warsaw is the capital and largest city of Poland." },
    { category: "Geography", difficulty: "normal", visual: "🌋", question: "In which country is Mount Kilimanjaro located?",
      answers: ["Kenya", "Tanzania", "Uganda", "Ethiopia"], correct: "Tanzania",
      hint: "It is the highest mountain in Africa.", explanation: "Kilimanjaro is in northeastern Tanzania, near the Kenyan border." },
    { category: "Geography", difficulty: "hard", visual: "⛰️", question: "Which is the longest mountain range on land?",
      answers: ["Himalayas", "Rocky Mountains", "Andes", "Alps"], correct: "Andes",
      hint: "It runs along the western edge of South America.", explanation: "The Andes stretch about 7,000 km along South America." },
    { category: "Geography", difficulty: "normal", visual: "🏜️", question: "Which desert covers much of Mongolia and northern China?",
      answers: ["Sahara", "Gobi", "Kalahari", "Atacama"], correct: "Gobi",
      hint: "It is a cold desert in Asia.", explanation: "The Gobi is a large desert region in northern China and southern Mongolia." },
    { category: "Geography", difficulty: "easy", visual: "🌐", question: "What is the smallest continent by land area?",
      answers: ["Europe", "Antarctica", "Australia/Oceania", "South America"], correct: "Australia/Oceania",
      hint: "It is surrounded by the Pacific and Indian Oceans.", explanation: "Australia/Oceania is the smallest continent by land area." },

    // =====================================
    // MORE HISTORY
    // =====================================
    { category: "History", difficulty: "easy", visual: "🕊️", question: "In which year did World War II end?",
      answers: ["1918", "1939", "1945", "1950"], correct: "1945",
      hint: "It was the middle of the 1940s.", explanation: "World War II ended in 1945." },
    { category: "History", difficulty: "easy", visual: "🇺🇸", question: "Who was the first President of the United States?",
      answers: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], correct: "George Washington",
      hint: "He appears on the one-dollar bill.", explanation: "George Washington served as president from 1789 to 1797." },
    { category: "History", difficulty: "normal", visual: "🧱", question: "In which year did the Berlin Wall fall?",
      answers: ["1979", "1985", "1989", "1991"], correct: "1989",
      hint: "It was the year before German reunification.", explanation: "The Berlin Wall fell on 9 November 1989." },
    { category: "History", difficulty: "normal", visual: "🚢", question: "Which ship sank on its maiden voyage in 1912?",
      answers: ["Lusitania", "Titanic", "Britannic", "Bismarck"], correct: "Titanic",
      hint: "It hit an iceberg in the North Atlantic.", explanation: "The Titanic sank on 15 April 1912." },
    { category: "History", difficulty: "hard", visual: "⚔️", question: "Who was the first emperor of Rome?",
      answers: ["Julius Caesar", "Nero", "Augustus", "Constantine"], correct: "Augustus",
      hint: "He was Julius Caesar's adopted heir.", explanation: "Augustus became the first Roman emperor in 27 BC." },
    { category: "History", difficulty: "normal", visual: "🎨", question: "In which country did the Renaissance begin?",
      answers: ["France", "England", "Italy", "Spain"], correct: "Italy",
      hint: "Think of Florence and Leonardo da Vinci.", explanation: "The Renaissance began in Italy in the 14th century." },
    { category: "History", difficulty: "easy", visual: "🖼️", question: "Who painted the Mona Lisa?",
      answers: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Vincent van Gogh"], correct: "Leonardo da Vinci",
      hint: "He was also an inventor and engineer.", explanation: "Leonardo da Vinci painted the Mona Lisa in the early 1500s." },
    { category: "History", difficulty: "easy", visual: "🧭", question: "In which year did Columbus first reach the Americas?",
      answers: ["1392", "1492", "1592", "1692"], correct: "1492",
      hint: "\"In fourteen hundred ninety-two, Columbus sailed the ocean blue.\"", explanation: "Columbus reached the Caribbean in 1492." },
    { category: "History", difficulty: "normal", visual: "⚜️", question: "In which year did the French Revolution begin?",
      answers: ["1689", "1776", "1789", "1815"], correct: "1789",
      hint: "It began with the storming of the Bastille.", explanation: "The French Revolution began in 1789." },
    { category: "History", difficulty: "normal", visual: "🧑‍🚀", question: "Who was the first human to travel into space?",
      answers: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"], correct: "Yuri Gagarin",
      hint: "He was a Soviet cosmonaut.", explanation: "Yuri Gagarin orbited the Earth on 12 April 1961." },
    { category: "History", difficulty: "normal", visual: "🐎", question: "Which empire was founded by Genghis Khan?",
      answers: ["Ottoman Empire", "Mongol Empire", "Persian Empire", "Roman Empire"], correct: "Mongol Empire",
      hint: "It became the largest contiguous land empire in history.", explanation: "Genghis Khan founded the Mongol Empire in 1206." },
    { category: "History", difficulty: "hard", visual: "🏛️", question: "Which ancient wonder stood on the island of Pharos near Alexandria?",
      answers: ["Colossus", "The Lighthouse", "Hanging Gardens", "Mausoleum"], correct: "The Lighthouse",
      hint: "It guided ships into the harbour.", explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World." },
    { category: "History", difficulty: "normal", visual: "🏅", question: "Who was the first woman to win a Nobel Prize?",
      answers: ["Marie Curie", "Mother Teresa", "Rosalind Franklin", "Florence Nightingale"], correct: "Marie Curie",
      hint: "She researched radioactivity.", explanation: "Marie Curie won the Nobel Prize in Physics in 1903." },
    { category: "History", difficulty: "easy", visual: "🧱", question: "Which famous wall was built to protect northern China?",
      answers: ["Hadrian's Wall", "The Great Wall", "Berlin Wall", "Wall of Jericho"], correct: "The Great Wall",
      hint: "It is visible in many photos of China.", explanation: "The Great Wall of China was built over many centuries." },

    // =====================================
    // MORE SCIENCE
    // =====================================
    { category: "Science", difficulty: "easy", visual: "💎", question: "What is the hardest natural substance on Earth?",
      answers: ["Gold", "Iron", "Diamond", "Quartz"], correct: "Diamond",
      hint: "It is made of carbon.", explanation: "Diamond is the hardest known natural material." },
    { category: "Science", difficulty: "easy", visual: "🌱", question: "Which gas do plants absorb from the air?",
      answers: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"], correct: "Carbon dioxide",
      hint: "Humans breathe it out.", explanation: "Plants use carbon dioxide for photosynthesis." },
    { category: "Science", difficulty: "easy", visual: "🌌", question: "How many planets are in our solar system?",
      answers: ["7", "8", "9", "10"], correct: "8",
      hint: "Pluto is no longer counted as a planet.", explanation: "There are eight planets, from Mercury to Neptune." },
    { category: "Science", difficulty: "normal", visual: "🥇", question: "What is the chemical symbol for gold?",
      answers: ["Go", "Gd", "Au", "Ag"], correct: "Au",
      hint: "It comes from the Latin word 'aurum'.", explanation: "Au is the symbol for gold." },
    { category: "Science", difficulty: "normal", visual: "🧬", question: "Which part of the cell is known as its powerhouse?",
      answers: ["Nucleus", "Mitochondria", "Ribosome", "Cell wall"], correct: "Mitochondria",
      hint: "It produces most of the cell's energy.", explanation: "Mitochondria generate most of a cell's ATP." },
    { category: "Science", difficulty: "hard", visual: "⚡", question: "Approximately how fast does light travel in a vacuum?",
      answers: ["30,000 km/s", "300,000 km/s", "3,000,000 km/s", "300 km/s"], correct: "300,000 km/s",
      hint: "It is about 3 followed by five zeros.", explanation: "Light travels at roughly 299,792 km per second." },
    { category: "Science", difficulty: "easy", visual: "🪐", question: "Which is the largest planet in our solar system?",
      answers: ["Saturn", "Jupiter", "Neptune", "Earth"], correct: "Jupiter",
      hint: "It has a famous Great Red Spot.", explanation: "Jupiter is the largest planet, more than 300 times the mass of Earth." },
    { category: "Science", difficulty: "normal", visual: "🦴", question: "How many bones does an adult human body have?",
      answers: ["106", "206", "306", "406"], correct: "206",
      hint: "Babies are born with more, but many fuse together.", explanation: "An adult human has 206 bones." },
    { category: "Science", difficulty: "easy", visual: "🫁", question: "Which gas do humans need to breathe to survive?",
      answers: ["Nitrogen", "Carbon dioxide", "Oxygen", "Hydrogen"], correct: "Oxygen",
      hint: "It makes up about 21% of the air.", explanation: "Humans need oxygen for cellular respiration." },
    { category: "Science", difficulty: "easy", visual: "🌡️", question: "At what temperature does water boil at sea level?",
      answers: ["50 °C", "90 °C", "100 °C", "120 °C"], correct: "100 °C",
      hint: "It is a nice round number on the Celsius scale.", explanation: "Water boils at 100 °C (212 °F) at sea level." },
    { category: "Science", difficulty: "easy", visual: "🍎", question: "Which force keeps us on the ground?",
      answers: ["Magnetism", "Gravity", "Friction", "Electricity"], correct: "Gravity",
      hint: "Isaac Newton famously studied it.", explanation: "Gravity pulls objects toward the centre of the Earth." },
    { category: "Science", difficulty: "normal", visual: "🩸", question: "Which blood cells carry oxygen around the body?",
      answers: ["White blood cells", "Platelets", "Red blood cells", "Plasma cells"], correct: "Red blood cells",
      hint: "They contain haemoglobin.", explanation: "Red blood cells carry oxygen using haemoglobin." },
    { category: "Science", difficulty: "normal", visual: "🧂", question: "What is the chemical symbol for sodium?",
      answers: ["So", "Sd", "Na", "S"], correct: "Na",
      hint: "It comes from the Latin word 'natrium'.", explanation: "Na is the symbol for sodium." },
    { category: "Science", difficulty: "normal", visual: "🧠", question: "Who developed the theory of general relativity?",
      answers: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"], correct: "Albert Einstein",
      hint: "He is famous for E = mc².", explanation: "Albert Einstein published general relativity in 1915." },
    { category: "Science", difficulty: "normal", visual: "🎈", question: "Which is the lightest chemical element?",
      answers: ["Helium", "Hydrogen", "Lithium", "Oxygen"], correct: "Hydrogen",
      hint: "It has atomic number 1.", explanation: "Hydrogen is the lightest and most abundant element in the universe." },

    // =====================================
    // MORE WORLD FACTS
    // =====================================
    { category: "World Facts", difficulty: "normal", visual: "👥", question: "Which country has the largest population today?",
      answers: ["China", "India", "United States", "Indonesia"], correct: "India",
      hint: "It overtook China in 2023.", explanation: "India became the world's most populous country in 2023." },
    { category: "World Facts", difficulty: "easy", visual: "💴", question: "What is the currency of Japan?",
      answers: ["Won", "Yuan", "Yen", "Baht"], correct: "Yen",
      hint: "Its symbol is ¥.", explanation: "The Japanese yen is the national currency." },
    { category: "World Facts", difficulty: "normal", visual: "🗽", question: "Which country gave the Statue of Liberty to the United States?",
      answers: ["United Kingdom", "France", "Spain", "Italy"], correct: "France",
      hint: "It was a gift in 1886.", explanation: "France gifted the statue to the US in 1886." },
    { category: "World Facts", difficulty: "hard", visual: "🏜️", question: "Which is the largest country in Africa by area?",
      answers: ["Nigeria", "Egypt", "Algeria", "South Africa"], correct: "Algeria",
      hint: "It is in North Africa, on the Mediterranean.", explanation: "Algeria has been Africa's largest country since South Sudan split from Sudan in 2011." },
    { category: "World Facts", difficulty: "easy", visual: "🍣", question: "Which country is famous for inventing sushi as we know it today?",
      answers: ["China", "Japan", "Thailand", "Vietnam"], correct: "Japan",
      hint: "Its capital is Tokyo.", explanation: "Modern sushi developed in Japan." },
    { category: "World Facts", difficulty: "easy", visual: "🕌", question: "In which country is the Taj Mahal located?",
      answers: ["Pakistan", "India", "Bangladesh", "Nepal"], correct: "India",
      hint: "It is in the city of Agra.", explanation: "The Taj Mahal is a marble mausoleum in Agra, India." },
    { category: "World Facts", difficulty: "easy", visual: "🌍", question: "How many continents are there?",
      answers: ["5", "6", "7", "8"], correct: "7",
      hint: "Africa, Antarctica, Asia, Europe, Australia/Oceania, North America and South America.", explanation: "By the most common convention, there are seven continents." },
    { category: "World Facts", difficulty: "normal", visual: "🗣️", question: "Which language has the most native speakers in the world?",
      answers: ["English", "Spanish", "Mandarin Chinese", "Hindi"], correct: "Mandarin Chinese",
      hint: "It is spoken mostly in China.", explanation: "Mandarin Chinese has the most native speakers." },
    { category: "World Facts", difficulty: "normal", visual: "🌅", question: "Which country is nicknamed the Land of the Rising Sun?",
      answers: ["China", "South Korea", "Japan", "Thailand"], correct: "Japan",
      hint: "Its flag shows a red circle on white.", explanation: "Japan's name in Japanese means 'origin of the sun'." },
    { category: "World Facts", difficulty: "hard", visual: "🏝️", question: "Which country has the most islands in the world?",
      answers: ["Indonesia", "Philippines", "Sweden", "Canada"], correct: "Sweden",
      hint: "It is in Northern Europe.", explanation: "Sweden has more than 260,000 islands, the most of any country." },

    // =====================================
    // MORE TECHNOLOGY (with sub-categories)
    // =====================================
    { category: "Technology", sub: "Programming", difficulty: "easy", visual: "🎨", question: "Which language is mainly used to style web pages?",
      answers: ["HTML", "CSS", "SQL", "Python"], correct: "CSS",
      hint: "It controls colours, fonts and layout.", explanation: "CSS (Cascading Style Sheets) styles web pages." },
    { category: "Technology", sub: "Programming", difficulty: "normal", visual: "🔁", question: "What is a variable in programming?",
      answers: ["A fixed error message", "A named place that stores a value", "A type of loop", "A hardware component"], correct: "A named place that stores a value",
      hint: "Its value can change while the program runs.", explanation: "A variable stores a value that you can read and change." },
    { category: "Technology", sub: "Programming", difficulty: "easy", visual: "🌐", question: "What does HTML stand for?",
      answers: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Machine Language"], correct: "HyperText Markup Language",
      hint: "It describes the structure of a web page.", explanation: "HTML is the standard markup language for web pages." },
    { category: "Technology", sub: "Programming", difficulty: "normal", visual: "💬", question: "Which symbols start a single-line comment in JavaScript?",
      answers: ["//", "##", "<!--", "**"], correct: "//",
      hint: "It is two identical characters.", explanation: "In JavaScript, // starts a single-line comment." },
    { category: "Technology", sub: "Hardware", difficulty: "easy", visual: "🧠", question: "What does CPU stand for?",
      answers: ["Central Processing Unit", "Computer Power Unit", "Core Program Utility", "Central Program Updater"], correct: "Central Processing Unit",
      hint: "It is often called the brain of the computer.", explanation: "The CPU executes the instructions of a program." },
    { category: "Technology", sub: "Hardware", difficulty: "normal", visual: "💾", question: "Which component keeps your files when the computer is turned off?",
      answers: ["RAM", "SSD", "CPU cache", "Graphics card"], correct: "SSD",
      hint: "RAM forgets everything when the power goes off.", explanation: "SSDs and hard drives are permanent storage; RAM is temporary." },
    { category: "Technology", sub: "Hardware", difficulty: "easy", visual: "🎮", question: "What does GPU stand for?",
      answers: ["General Processing Unit", "Graphics Processing Unit", "Game Power Unit", "Graphical Program Utility"], correct: "Graphics Processing Unit",
      hint: "It handles images and video.", explanation: "A GPU is specialised for graphics and highly parallel work." },
    { category: "Technology", sub: "Hardware", difficulty: "easy", visual: "🧮", question: "What does RAM stand for?",
      answers: ["Random Access Memory", "Read And Modify", "Rapid Application Module", "Run Anytime Memory"], correct: "Random Access Memory",
      hint: "It is the computer's short-term memory.", explanation: "RAM holds data that programs are using right now." },
    { category: "Technology", sub: "Internet & Networks", difficulty: "easy", visual: "🌐", question: "What does HTTP stand for?",
      answers: ["HyperText Transfer Protocol", "High Tech Transfer Program", "Hyper Terminal Text Process", "Home Tool Transfer Protocol"], correct: "HyperText Transfer Protocol",
      hint: "It is the protocol used to load web pages.", explanation: "HTTP is the protocol browsers use to talk to web servers." },
    { category: "Technology", sub: "Internet & Networks", difficulty: "normal", visual: "📖", question: "What does DNS do?",
      answers: ["Encrypts your files", "Turns domain names into IP addresses", "Speeds up your Wi-Fi", "Blocks advertisements"], correct: "Turns domain names into IP addresses",
      hint: "Think of it as the phone book of the internet.", explanation: "DNS translates names like example.com into IP addresses." },
    { category: "Technology", sub: "Internet & Networks", difficulty: "easy", visual: "🔗", question: "What does URL stand for?",
      answers: ["Uniform Resource Locator", "Universal Radio Link", "Unified Router Layer", "User Route List"], correct: "Uniform Resource Locator",
      hint: "It is the address of a web page.", explanation: "A URL is the address used to locate a resource on the web." },
    { category: "Technology", sub: "Internet & Networks", difficulty: "normal", visual: "🔒", question: "Which protocol is the secure version of HTTP?",
      answers: ["FTP", "HTTPS", "SMTP", "SSH-HTTP"], correct: "HTTPS",
      hint: "Look for the padlock in your browser.", explanation: "HTTPS encrypts the connection between your browser and a website." },
    { category: "Technology", sub: "Cybersecurity", difficulty: "easy", visual: "🎣", question: "What is phishing?",
      answers: ["A type of computer hardware", "Tricking people into giving up private information", "A way to speed up a network", "A programming language"], correct: "Tricking people into giving up private information",
      hint: "It often arrives as a fake email or message.", explanation: "Phishing uses fake messages to steal passwords and personal data." },
    { category: "Technology", sub: "Cybersecurity", difficulty: "normal", visual: "🔐", question: "What does two-factor authentication (2FA) add to a login?",
      answers: ["A second proof of identity", "A faster connection", "A bigger password limit", "Automatic backups"], correct: "A second proof of identity",
      hint: "It is often a code sent to your phone.", explanation: "2FA requires something besides your password, so a stolen password alone is not enough." },
    { category: "Technology", sub: "Cybersecurity", difficulty: "normal", visual: "🦠", question: "What is malware?",
      answers: ["Software designed to cause harm", "A type of firewall", "A backup tool", "A fast internet connection"], correct: "Software designed to cause harm",
      hint: "The name is short for 'malicious software'.", explanation: "Malware includes viruses, ransomware and spyware." },
    { category: "Technology", sub: "Cybersecurity", difficulty: "easy", visual: "🔑", question: "Which of these is the strongest password?",
      answers: ["123456", "password", "qwerty", "A long mix of random words, numbers and symbols"], correct: "A long mix of random words, numbers and symbols",
      hint: "Length and unpredictability matter most.", explanation: "Long, random passwords are far harder to guess or crack." },
    { category: "Technology", sub: "AI & Data", difficulty: "easy", visual: "🤖", question: "What does AI stand for?",
      answers: ["Automated Internet", "Artificial Intelligence", "Advanced Interface", "Applied Information"], correct: "Artificial Intelligence",
      hint: "Machines that perform tasks that normally need human intelligence.", explanation: "AI stands for Artificial Intelligence." },
    { category: "Technology", sub: "AI & Data", difficulty: "normal", visual: "🗄️", question: "Which language is used to query databases?",
      answers: ["CSS", "SQL", "HTML", "Java"], correct: "SQL",
      hint: "Its name stands for Structured Query Language.", explanation: "SQL is the standard language for working with relational databases." },
    { category: "Technology", sub: "AI & Data", difficulty: "normal", visual: "📈", question: "What is machine learning?",
      answers: ["Computers learning patterns from data", "Building physical robots", "Repairing computer hardware", "Writing web pages"], correct: "Computers learning patterns from data",
      hint: "The program improves with experience instead of fixed rules.", explanation: "Machine learning lets computers learn patterns from data without being explicitly programmed for each task." },
    { category: "Technology", sub: "AI & Data", difficulty: "normal", visual: "🗃️", question: "What does the term 'big data' refer to?",
      answers: ["Very large and complex sets of data", "A very large hard drive", "A fast processor", "A type of database language"], correct: "Very large and complex sets of data",
      hint: "It is too large for traditional tools to handle easily.", explanation: "Big data describes datasets too large or complex for traditional processing." }
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
        sub: continent,
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

// Extra game modes register their question pools here (see extra-modes.js)
const extraPools = {};

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
    } else if (extraPools[category]) {
        available = extraPools[category];
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
    document.querySelector(".quiz-card").dataset.cat = q.category;

    // Flag questions get fresh wrong answers every time
    if (q.flag) refreshFlagAnswers(q);

    // Modes like Capitals rebuild their question every time it is shown
    if (q.refresh) q.refresh(q);

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

        // If the image fails to load (offline), fall back to the icon badge
        img.onerror = () => {
            renderVisual(visualDisplay, q);       // <-- changed
        };

        visualDisplay.appendChild(img);
    } else {
        renderVisual(visualDisplay, q);           // <-- changed
    }

    feedbackDisplay.textContent = "";
    explanationDisplay.textContent = "";

    answersDisplay.innerHTML = "";

    (q.fixedOrder ? q.answers : shuffle(q.answers)).forEach((answer, index) => {

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
    const currentQ = selectedQuestions[currentQuestion];
    fiftyButton.disabled = fiftyFifty <= 0 || fiftyUsed || answered ||
        !!(currentQ && currentQ.noFifty);
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
    { id: "first", name: "First Victory", icon: "fa-bullseye", description: "Answer correctly once" },
    { id: "five", name: "Knowledge Seeker", icon: "fa-book-open", description: "Answer 5 questions correctly" },
    { id: "ten", name: "Quiz Master", icon: "fa-trophy", description: "Answer 10 questions correctly" },
    { id: "streak", name: "On Fire", icon: "fa-fire", description: "Reach a streak of 5" }
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
        const iconEl = document.createElement("i");
        iconEl.className = "fa-solid " + item.icon;
        icon.appendChild(iconEl);

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