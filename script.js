//state elements
const streak = document.getElementById('streak-value');
const rating = document.getElementById('rating-value');

//game elements
const modalOverlay = document.getElementById("modal-overlay");
const modal = modalOverlay?.querySelector(".modal");
const modalMessage = document.getElementById("modal-message");
const modalOkBtn = document.getElementById("modal-ok-btn");
const puzzlePrompt = document.getElementById('prompt');
const board = document.getElementById('board');
const moves = document.getElementById('moves-btn'); //container
const feedback = document.querySelector('.feedback p');
const hintBtn = document.getElementById('hint-btn');
const nextBtn = document.getElementById('next-btn');
const initialState = {
    streak: 0,
    rating: 400,
    initialPuzzleId: 0,
    hintShown: false,
    hasAnswered: false,
}
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");

let toastTimer = null;
let toastHideTimer = null;

function showToast(message, type = "info", durationMs = 7000) {
    if (!toast || !toastText) return;

    // Reset any previous timers/animations
    clearTimeout(toastTimer);
    clearTimeout(toastHideTimer);

    toast.classList.remove("good", "bad", "info", "show", "hide");
    toast.classList.add(type);
    toastText.textContent = message;

    // Force reflow so repeated calls retrigger animation reliably
    void toast.offsetHeight;

    toast.classList.add("show");

    // Start fade-out near the end
    const fadeOutMs = 260;
    const startHideAt = Math.max(0, durationMs - fadeOutMs);

    toastHideTimer = setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, startHideAt);

    // Fully clear classes after fade-out completes
    toastTimer = setTimeout(() => {
        toast.classList.remove("hide", "good", "bad", "info");
        toastText.textContent = "";
    }, durationMs);
}

const puzzles = [
    {
        puzzleId: 0,
        prompt: "Return an array of user names.",
        board: `const users = [/n{ name: "Alice" },/n{ name: "Bob" }/n];`,
        moves: [
            "users.map(u =&gt; u.name)",
            "users.filter(u =&gt; u.name)",
            "users.forEach(u =&gt; u.name)",
            "users.reduce(u =&gt; u.name)"
        ],
        hint: "Use the array method that transforms each item into a new value.",
        solution: "users.map(u =&gt; u.name)"
    },
    {
        puzzleId: 1,
        prompt: "Why does this function return 10?",
        board: `var x = 5;/n var x = 15;/n function getX() {/n var x = 10 return x; }/n getX();`,
        moves: [
            "Variable redeclaration causes the second x to overwrite the first.",
            "The function getX is hoisted and uses the latest value of x.",
            "JavaScript uses function scope, so the local declaration of x is used.",
            "The return statement always returns the last assigned value."
        ],
        hint: "Focus on variable scope inside the function body, not the outer declarations.",
        solution: "JavaScript uses function scope, so the local declaration of x is used."
    }, {
        puzzleId: 2,
        prompt: "Which keyword should you use if the value will change?",
        board: `// Choose the best variable keyword for a counter`,
        moves: ["var", "let", "const"],
        solution: "let"
    },
    {
        puzzleId: 3,
        prompt: "Which keyword should you use if the value must NOT change?",
        board: `// Choose the best variable keyword for a constant`,
        moves: ["var", "let", "const", "switch"],
        solution: "const"
    },
    {
        puzzleId: 4,
        prompt: "What is the value of x after this code runs?",
        board: `let x = 3;\nx = x + 2;\nconsole.log(x);`,
        moves: ["3", "5", "32", "undefined"],
        solution: "5"
    },
    {
        puzzleId: 5,
        prompt: "Which operator checks both value AND type?",
        board: `// Choose the strict comparison operator`,
        moves: ["==", "===", "=", "!=="],
        solution: "==="
    },
    {
        puzzleId: 6,
        prompt: "What does this log?",
        board: `console.log(typeof 42);`,
        moves: ["number", "string", "object", "boolean"],
        solution: "number"
    },
    {
        puzzleId: 7,
        prompt: "Which method creates a new array with transformed values?",
        board: `const nums = [1,2,3];\n// Want: [2,4,6]`,
        moves: ["forEach", "map", "filter", "reduce"],
        solution: "map"
    },
    {
        puzzleId: 8,
        prompt: "Which method keeps only values that pass a test?",
        board: `const nums = [1,2,3,4];\n// Want: [2,4]`,
        moves: ["map", "filter", "push", "join"],
        solution: "filter"
    },
    {
        puzzleId: 9,
        prompt: "What will this output?",
        board: `let x = 10;\nif (true) {\n  let x = 5;\n}\nconsole.log(x);`,
        moves: ["5", "10", "undefined", "Error"],
        solution: "10"
    },
    {
        puzzleId: 10,
        prompt: "What will this output?",
        board: `const arr = [1, 2, 3];\nconsole.log(arr.length);`,
        moves: ["2", "3", "4", "undefined"],
        solution: "3"
    },
    {
        puzzleId: 11,
        prompt: "What will this output?",
        board: `console.log(Boolean(\"\"));`,
        moves: ["true", "false", "null", "undefined"],
        solution: "false"
    }
];

let currentPuzzleIndex = initialState.initialPuzzleId;

function updateState() {
    const puzzle = puzzles[currentPuzzleIndex % puzzles.length];
    if (!puzzle) return;
    initialState.hintShown = false;
    initialState.hasAnswered = false;

    puzzlePrompt.textContent = puzzle.prompt;

    let codeEl = board.querySelector('code');
    if (!codeEl) {
        board.innerHTML = '<pre><code></code></pre>';
        codeEl = board.querySelector('code');
    }
    codeEl.textContent = puzzle.board.replace(/\/n/g, '\n');

    moves.innerHTML = '';
    puzzle.moves.forEach((move) => {
        const btn = document.createElement('button');
        btn.className = 'move';
        btn.innerHTML = move;
        moves.appendChild(btn);
    });

    moves.dataset.solution = puzzle.solution;
    hintBtn.dataset.solution = puzzle.solution;
    if (feedback) {
        feedback.textContent = 'Select the best move.';
    }
}

function showHint() {
    const puzzle = puzzles[currentPuzzleIndex % puzzles.length];
    if (!puzzle) return;

    if (!initialState.hintShown) {
        initialState.rating -= 5;
        rating.textContent = initialState.rating;
        initialState.hintShown = true;
    }

    if (feedback) {
        feedback.textContent = `Hint: ${puzzle.hint || 'Review the intent of the code and the exact behavior needed.'}`;
    }
}

function nextPuzzle(bool) {
    if (bool && bool !== "skip") {
        showModal("Correct!", "correct");
        initialState.streak++;
        streak.textContent = initialState.streak;
        initialState.rating += 15;
        rating.textContent = initialState.rating;
    } else if (!bool) {
        showModal("Incorrect, try again.", "wrong");
        initialState.streak = 0;
        streak.textContent = initialState.streak;
        initialState.rating -= 10;
        rating.textContent = initialState.rating;
    } else if (bool === "skip") {
        showModal("Puzzle skipped.", "skip");
        initialState.streak = 0;
        streak.textContent = initialState.streak;
        initialState.rating -= 5;
        rating.textContent = initialState.rating;
    }
    currentPuzzleIndex++;
    updateState()
}



updateState();
nextBtn.addEventListener('click', () => nextPuzzle("skip"));
hintBtn.addEventListener('click', showHint);


moves.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('move')) {
        const selectedMove = target.innerHTML;
        const solution = moves.dataset.solution;
        if (selectedMove === solution) {
            nextPuzzle(true);
        } else {
            nextPuzzle(false);
        }
    }
});

function showModal(message, type = "") {
    if (!modalOverlay || !modal || !modalMessage) return;

    modalMessage.textContent = message;

    // reset + apply type class for styling
    modal.classList.remove("correct", "wrong", "skip");
    if (type) modal.classList.add(type);

    modalOverlay.classList.add("show");
    modalOverlay.setAttribute("aria-hidden", "false");

    // focus for keyboard users
    modalOkBtn?.focus();
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("show");
    modalOverlay.setAttribute("aria-hidden", "true");
}

modalOkBtn?.addEventListener("click", closeModal);

modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal(); // click outside modal
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay?.classList.contains("show")) {
        closeModal();
    }
});