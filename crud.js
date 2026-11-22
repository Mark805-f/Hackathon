// =====================================
// crud.js - Question Manager (Create, Read, Update, Delete)
// Needs script.js to be loaded first.
// Data is saved in the browser (localStorage).
// =====================================

(function () {

    const STORAGE_KEY = "worldCustomQuestions";

    // Categories a custom question can be added to
    const CATEGORIES = [
        "My Questions",
        "Geography",
        "History",
        "Science",
        "World Facts",
        "Technology"
    ];

    let items = loadItems();     // the saved custom questions
    let editingId = null;        // id of the question being edited (null = creating)


    // =====================================
    // STORAGE
    // =====================================

    function loadItems() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function newId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    // Saves, then refreshes the real quiz questions
    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        syncQuestions();
    }

    // Puts the saved questions into the main `questions` array used by the quiz
    function syncQuestions() {

        for (let i = questions.length - 1; i >= 0; i--) {
            if (questions[i].custom) questions.splice(i, 1);
        }

        items.forEach(r => {
            questions.push({
                category: r.category,
                visual: "✏️",
                question: r.question,
                answers: [...r.answers],
                correct: r.correct,
                hint: r.hint || "Think carefully!",
                explanation: r.explanation || "The correct answer is " + r.correct + ".",
                custom: true
            });
        });
    }


    // =====================================
    // BUILD THE SCREEN + SIDEBAR BUTTONS
    // =====================================

    function buildUI() {

        const holder = document.createElement("div");

        holder.innerHTML = `
        <div id="crud-screen" class="crud-screen hidden">
            <div class="crud-box">

                <div class="crud-top">
                    <div>
                        <p class="crud-label">QUESTION MANAGER</p>
                        <h2>Create your own questions</h2>
                    </div>
                    <button class="crud-close" id="crud-close" aria-label="Close">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="crud-grid">

                    <!-- CREATE / UPDATE -->
                    <form id="crud-form" class="crud-panel" novalidate>

                        <h3 id="crud-form-title">Add a question</h3>

                        <label for="crud-category">Category</label>
                        <select id="crud-category"></select>

                        <label for="crud-question">Question</label>
                        <input id="crud-question" type="text" maxlength="200"
                               placeholder="e.g. What is the capital of Albania?">

                        <label>Answers <small>(select the correct one)</small></label>

                        <div class="crud-answer-row">
                            <input type="radio" name="crud-correct" value="0" aria-label="Answer A is correct" checked>
                            <input class="crud-answer-input" type="text" maxlength="80" placeholder="Answer A">
                        </div>
                        <div class="crud-answer-row">
                            <input type="radio" name="crud-correct" value="1" aria-label="Answer B is correct">
                            <input class="crud-answer-input" type="text" maxlength="80" placeholder="Answer B">
                        </div>
                        <div class="crud-answer-row">
                            <input type="radio" name="crud-correct" value="2" aria-label="Answer C is correct">
                            <input class="crud-answer-input" type="text" maxlength="80" placeholder="Answer C">
                        </div>
                        <div class="crud-answer-row">
                            <input type="radio" name="crud-correct" value="3" aria-label="Answer D is correct">
                            <input class="crud-answer-input" type="text" maxlength="80" placeholder="Answer D">
                        </div>

                        <label for="crud-hint">Hint <small>(optional)</small></label>
                        <input id="crud-hint" type="text" maxlength="150" placeholder="A small clue">

                        <label for="crud-explanation">Explanation <small>(optional)</small></label>
                        <input id="crud-explanation" type="text" maxlength="200" placeholder="Shown after answering">

                        <p id="crud-error" class="crud-error"></p>

                        <div class="crud-form-buttons">
                            <button type="submit" id="crud-submit" class="crud-btn primary">
                                <i class="fa-solid fa-plus"></i> Add question
                            </button>
                            <button type="button" id="crud-cancel" class="crud-btn hidden">Cancel edit</button>
                        </div>
                    </form>

                    <!-- READ -->
                    <div class="crud-panel">

                        <div class="crud-toolbar">
                            <h3>Your questions <span id="crud-count"></span></h3>

                            <div class="crud-tools">
                                <button type="button" id="crud-play" class="crud-btn primary">
                                    <i class="fa-solid fa-play"></i> Play
                                </button>
                                <button type="button" id="crud-export" class="crud-btn">
                                    <i class="fa-solid fa-download"></i> Export
                                </button>
                                <button type="button" id="crud-import" class="crud-btn">
                                    <i class="fa-solid fa-upload"></i> Import
                                </button>
                                <input type="file" id="crud-file" accept=".json,application/json" hidden>
                            </div>
                        </div>

                        <input id="crud-search" type="search" placeholder="Search your questions...">

                        <div id="crud-list" class="crud-list"></div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(holder.firstElementChild);

        // Category dropdown
        CATEGORIES.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            $("crud-category").appendChild(option);
        });

        // Sidebar buttons
        const sidebar = document.querySelector(".sidebar");
        const bottom = document.querySelector(".sidebar-bottom");

        [
            ["my-questions-nav", "fa-star", "My Questions"],
            ["manage-nav", "fa-pen-to-square", "Manage Questions"]
        ].forEach(([id, icon, text]) => {

            const button = document.createElement("button");
            button.className = "nav-item";
            button.id = id;

            const i = document.createElement("i");
            i.className = "fa-solid " + icon;

            button.append(i, " " + text);
            sidebar.insertBefore(button, bottom);
        });
    }

    buildUI();
    syncQuestions();


    // =====================================
    // OPEN / CLOSE / PLAY
    // =====================================

    function setActiveNav(button) {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });
        button.classList.add("active");
    }

    // Picks a category that is safe to restart after closing
    function safeCategory() {
        if (currentCategory === "Daily Challenge") return "All";
        if (currentCategory === "My Questions" && items.length === 0) return "All";
        return currentCategory;
    }

    function openManager() {
        clearInterval(timerInterval);       // pause the normal quiz timer
        $("crud-screen").classList.remove("hidden");
        render();
        $("crud-question").focus();
    }

    function closeManager() {
        $("crud-screen").classList.add("hidden");
        resetForm();
        startGame(safeCategory());
    }

    function playMine() {

        if (items.length === 0) {
            showToast("Add a question first!", "fa-pen-to-square");
            return;
        }

        $("crud-screen").classList.add("hidden");
        resetForm();
        setActiveNav($("my-questions-nav"));
        startGame("My Questions");
    }

    $("manage-nav").addEventListener("click", openManager);
    $("crud-close").addEventListener("click", closeManager);
    $("crud-play").addEventListener("click", playMine);

    $("my-questions-nav").addEventListener("click", () => {

        if (items.length === 0) {
            openManager();
            showToast("You have no questions yet. Add some!", "fa-pen-to-square");
            return;
        }

        setActiveNav($("my-questions-nav"));
        startGame("My Questions");
    });


    // =====================================
    // CREATE + UPDATE (the form)
    // =====================================

    function answerInputs() {
        return [...document.querySelectorAll(".crud-answer-input")];
    }

    function showError(message) {
        $("crud-error").textContent = message;
    }

    function resetForm() {

        editingId = null;

        $("crud-question").value = "";
        $("crud-hint").value = "";
        $("crud-explanation").value = "";
        $("crud-category").value = "My Questions";

        answerInputs().forEach(input => { input.value = ""; });
        document.querySelector('input[name="crud-correct"][value="0"]').checked = true;

        showError("");

        $("crud-form-title").textContent = "Add a question";
        $("crud-submit").innerHTML = '<i class="fa-solid fa-plus"></i> Add question';
        $("crud-cancel").classList.add("hidden");
    }

    // Reads and checks the form. Returns the data, or null if something is wrong.
    function readForm() {

        const question = $("crud-question").value.trim();
        const answers = answerInputs().map(input => input.value.trim());
        const correctIndex = Number(
            document.querySelector('input[name="crud-correct"]:checked').value
        );

        if (!question) {
            showError("Please write the question.");
            return null;
        }

        if (answers.some(a => !a)) {
            showError("Please fill in all 4 answers.");
            return null;
        }

        const unique = new Set(answers.map(a => a.toLowerCase()));

        if (unique.size !== answers.length) {
            showError("Every answer must be different.");
            return null;
        }

        showError("");

        return {
            category: $("crud-category").value,
            question: question,
            answers: answers,
            correct: answers[correctIndex],
            hint: $("crud-hint").value.trim(),
            explanation: $("crud-explanation").value.trim()
        };
    }

    $("crud-form").addEventListener("submit", event => {

        event.preventDefault();

        const data = readForm();
        if (!data) return;

        if (editingId) {
            // UPDATE
            const index = items.findIndex(r => r.id === editingId);

            if (index >= 0) {
                items[index] = { ...items[index], ...data };
                showToast("Question updated!", "fa-pen-to-square");
            }
        } else {
            // CREATE
            items.unshift({ id: newId(), ...data });
            showToast("Question added!", "fa-circle-check");
        }

        save();
        resetForm();
        render();
        $("crud-question").focus();
    });

    $("crud-cancel").addEventListener("click", resetForm);

    function startEdit(id) {

        const record = items.find(r => r.id === id);
        if (!record) return;

        editingId = id;

        $("crud-category").value = record.category;
        $("crud-question").value = record.question;
        $("crud-hint").value = record.hint || "";
        $("crud-explanation").value = record.explanation || "";

        answerInputs().forEach((input, i) => {
            input.value = record.answers[i];
        });

        const correctIndex = record.answers.indexOf(record.correct);

        document.querySelector(
            'input[name="crud-correct"][value="' + Math.max(0, correctIndex) + '"]'
        ).checked = true;

        showError("");

        $("crud-form-title").textContent = "Edit question";
        $("crud-submit").innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save changes';
        $("crud-cancel").classList.remove("hidden");

        $("crud-form").scrollIntoView({ behavior: "smooth", block: "start" });
        $("crud-question").focus();
    }


    // =====================================
    // DELETE
    // =====================================

    function deleteItem(id) {

        items = items.filter(r => r.id !== id);

        if (editingId === id) resetForm();

        save();
        render();
        showToast("Question deleted", "fa-trash");
    }


    // =====================================
    // READ (the list)
    // =====================================

    function render() {

        const term = $("crud-search").value.trim().toLowerCase();
        const list = $("crud-list");

        list.innerHTML = "";

        $("crud-count").textContent =
            "(" + items.length + ")";

        const shown = items.filter(r =>
            !term ||
            r.question.toLowerCase().includes(term) ||
            r.category.toLowerCase().includes(term) ||
            r.answers.some(a => a.toLowerCase().includes(term))
        );

        if (shown.length === 0) {
            const empty = document.createElement("p");
            empty.className = "crud-empty";
            empty.textContent = items.length === 0
                ? "No questions yet. Use the form to add your first one!"
                : "No questions match your search.";
            list.appendChild(empty);
            return;
        }

        shown.forEach(record => list.appendChild(buildCard(record)));
    }

    function buildCard(record) {

        const card = document.createElement("div");
        card.className = "crud-card" + (record.id === editingId ? " editing" : "");

        const tag = document.createElement("span");
        tag.className = "crud-tag";
        tag.textContent = record.category;

        const title = document.createElement("h4");
        title.textContent = record.question;

        const answers = document.createElement("ul");

        record.answers.forEach(answer => {
            const li = document.createElement("li");
            const isCorrect = answer === record.correct;

            li.className = isCorrect ? "correct" : "";
            li.textContent = (isCorrect ? "✓ " : "• ") + answer;

            answers.appendChild(li);
        });

        const actions = document.createElement("div");
        actions.className = "crud-actions";

        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "crud-btn small";
        edit.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';
        edit.addEventListener("click", () => startEdit(record.id));

        const del = document.createElement("button");
        del.type = "button";
        del.className = "crud-btn small";
        del.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';

        // Two-step delete: click once, then confirm
        del.addEventListener("click", () => {

            if (del.dataset.confirm === "1") {
                deleteItem(record.id);
                return;
            }

            del.dataset.confirm = "1";
            del.classList.add("danger");
            del.textContent = "Click again to confirm";

            setTimeout(() => {
                if (!del.isConnected) return;
                del.dataset.confirm = "";
                del.classList.remove("danger");
                del.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
            }, 3000);
        });

        actions.append(edit, del);
        card.append(tag, title, answers, actions);

        return card;
    }

    $("crud-search").addEventListener("input", render);


    // =====================================
    // EXPORT / IMPORT (backup as a JSON file)
    // =====================================

    $("crud-export").addEventListener("click", () => {

        if (items.length === 0) {
            showToast("Nothing to export yet", "fa-download");
            return;
        }

        const blob = new Blob(
            [JSON.stringify(items, null, 2)],
            { type: "application/json" }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "my-questions.json";
        link.click();

        URL.revokeObjectURL(link.href);
    });

    $("crud-import").addEventListener("click", () => $("crud-file").click());

    $("crud-file").addEventListener("change", event => {

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {

            try {
                const data = JSON.parse(reader.result);
                if (!Array.isArray(data)) throw new Error("Not a list");

                let added = 0;

                data.forEach(r => {

                    const valid =
                        r &&
                        typeof r.question === "string" && r.question.trim() &&
                        Array.isArray(r.answers) && r.answers.length === 4 &&
                        r.answers.every(a => typeof a === "string" && a.trim()) &&
                        r.answers.includes(r.correct);

                    if (!valid) return;

                    items.push({
                        id: newId(),
                        category: CATEGORIES.includes(r.category) ? r.category : "My Questions",
                        question: r.question.trim(),
                        answers: r.answers.map(a => a.trim()),
                        correct: r.correct.trim(),
                        hint: typeof r.hint === "string" ? r.hint : "",
                        explanation: typeof r.explanation === "string" ? r.explanation : ""
                    });

                    added++;
                });

                save();
                render();
                showToast("Imported " + added + " question" + (added === 1 ? "" : "s"), "fa-upload");

            } catch (e) {
                showToast("That file couldn't be read", "fa-triangle-exclamation");
            }

            $("crud-file").value = "";
        };

        reader.readAsText(file);
    });


    // =====================================
    // KEYBOARD (stops the quiz shortcuts while the manager is open)
    // =====================================

    document.addEventListener("keydown", event => {

        if ($("crud-screen").classList.contains("hidden")) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        event.stopImmediatePropagation();

        if (event.key === "Escape") closeManager();

    }, true);

})();