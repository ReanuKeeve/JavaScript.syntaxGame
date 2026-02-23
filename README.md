# Code Tactics

Code Tactics is a small browser-based JavaScript syntax game.

## Project Task

Build an interactive frontend game where users solve JavaScript multiple-choice puzzles, track performance (streak + rating), and sign in through a basic client-side login flow before playing.

## Features

- Multiple JavaScript puzzles rendered dynamically from `script.js`.
- Score system:
  - `Streak` increases on correct answers and resets on wrong/skip.
  - `Rating` changes based on actions:
    - `+15` correct answer
    - `-10` wrong answer
    - `-5` hint use
    - `-5` skip puzzle
- Hint and Skip controls.
- Result modal feedback (correct/wrong/skip).
- Toast UI support (included in game layout/styles).
- Responsive login page with client-side validation.
- Responsive registration page with client-side validation.
- Client-side auth persistence:
  - `localStorage` when "Remember me" is checked
  - `sessionStorage` otherwise
- Login credential checks against registered local users.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no framework)

## Project Structure

- `index.html`: main game UI
- `style.css`: game styling
- `script.js`: game state, puzzles, scoring, interaction logic
- `login.html`: login page
- `login.css`: login page styling
- `login.js`: login validation + local/session storage auth logic
- `register.html`: registration page
- `register.css`: registration page styling
- `register.js`: registration validation + local user storage logic

## How to Run

1. Clone or download this repository.
2. Open `register.html` and create an account.
3. You will be redirected to `login.html`.
4. Sign in with the registered credentials and continue to `index.html`.

You can also open `index.html` directly for game-only access.

## Login Behavior

- Registered users are stored in localStorage under `codeTacticsUsers`.
- Login checks submitted credentials against `codeTacticsUsers`.
- On successful login, auth data is saved under `codeTacticsAuth`.
- If a valid auth object already exists, `login.html` and `register.html` redirect to `index.html`.
- This is frontend-only authentication (no backend/API).

## Notes

- Puzzle content is stored in the `puzzles` array inside `script.js`, making it easy to add/edit questions.
- This project currently has no build step and runs as static files.

## Possible Next Improvements

1. Enforce route protection in `index.html` by checking auth and redirecting to login when missing.
2. Add logout functionality and clear stored auth state.
3. Persist streak/rating across sessions.
4. Connect to a backend for real user accounts and secure authentication.
