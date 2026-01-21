//state elements
const streak = getElementById('streak');
const rating = getElementById('rating');

//game elements
const puzzlePrompt = getElementById('prompt');
const board = getElementById('board');
const moves = getElementById('moves-btn'); //container
const hintBtn = getElementById('hint-btn');
const nextBtn = getElementById('next-btn');

const initialState = {
    streak: 0,
    rating: 400,
    currentPuzzleId: 0,
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
 