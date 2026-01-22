//state elements
const streak = document.getElementById('streak');
const rating = document.getElementById('rating');

//game elements
const puzzlePrompt = document.getElementById('prompt');
const board = document.getElementById('board');
const moves = document.getElementById('moves-btn'); //container
const hintBtn = document.getElementById('hint-btn');
const nextBtn = document.getElementById('next-btn');
const initialState = {
    streak: 0,
    rating: 400,
    initialPuzzleId: 0,
    hintShown: false,
    hasAnswered: false,
}

const puzzles = [
    {
        puzzleId: 0,
        prompt: "Return an array of user names.",
        board: `const users = [/n{ name: "Alice" },/n{ name: "Bob" }/n];`,
        moves:[
            "users.map(u =&gt; u.name)",
            "users.filter(u =&gt; u.name)",
            "users.forEach(u =&gt; u.name)",
            "users.reduce(u =&gt; u.name)"
        ],
        solution: "users.map(u =&gt; u.name)"
    },
    {
        puzzleId: 1,
        prompt: "Why does this function return 10?",
        board: `var x = 5; /n var x = 15; /n function getX() {/n var x = 10 return x; } /n getX();`,
        moves:[
            "Variable redeclaration causes the second x to overwrite the first.",
            "The function getX is hoisted and uses the latest value of x.",
            "JavaScript uses function scope, so the local declaration of x is used.",
            "The return statement always returns the last assigned value."
        ],
        solution: "JavaScript uses function scope, so the local declaration of x is used."
    }
];

let currentPuzzleIndex = initialState.initialPuzzleId;

function updateState() {
    const puzzle = puzzles[currentPuzzleIndex % puzzles.length];
    if (!puzzle) return;

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
}

function nextPuzzle() {
    currentPuzzleIndex++;
    updateState()
}

updateState();
nextBtn.addEventListener('click', nextPuzzle);
