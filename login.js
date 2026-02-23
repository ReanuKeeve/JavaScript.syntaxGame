const AUTH_STORAGE_KEY = "codeTacticsAuth";
const USERS_STORAGE_KEY = "codeTacticsUsers";
const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_PAGE = "index.html";

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const formMessage = document.getElementById("form-message");
const loginButton = document.getElementById("login-btn");

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function loadAuth() {
  const localAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (localAuth) return safeParse(localAuth, null);

  const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (sessionAuth) return safeParse(sessionAuth, null);

  return null;
}

function loadUsers() {
  const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
  const users = safeParse(usersRaw, []);

  if (!Array.isArray(users)) return [];
  return users.filter((user) => user?.email && user?.password);
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function clearMessages() {
  emailError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";
  formMessage.classList.remove("error", "success");
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove("error", "success");
  if (type) {
    formMessage.classList.add(type);
  }
}

function showFieldError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function saveAuth(user, rememberMe) {
  const payload = {
    email: user.email,
    name: user.name ?? "",
    loggedInAt: new Date().toISOString(),
  };

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getUserByEmail(email) {
  const users = loadUsers();
  const normalizedEmail = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.email) === normalizedEmail);
}

function hydrateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const prefillEmail = params.get("email");
  const registered = params.get("registered");

  if (prefillEmail && isValidEmail(prefillEmail)) {
    emailInput.value = prefillEmail;
  }

  if (registered === "1") {
    showFormMessage("Account created. Please sign in.", "success");
  }

  if (prefillEmail || registered) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

if (loadAuth()) {
  window.location.href = REDIRECT_PAGE;
}

hydrateFromQuery();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessages();

  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;
  const rememberMe = rememberInput.checked;

  let hasError = false;

  if (!email) {
    showFieldError(emailInput, emailError, "Email is required.");
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError(emailInput, emailError, "Enter a valid email address.");
    hasError = true;
  }

  if (!password) {
    showFieldError(passwordInput, passwordError, "Password is required.");
    hasError = true;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    showFieldError(
      passwordInput,
      passwordError,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    );
    hasError = true;
  }

  if (hasError) {
    showFormMessage("Please fix the highlighted fields.", "error");
    return;
  }

  const user = getUserByEmail(email);
  if (!user) {
    showFieldError(emailInput, emailError, "No account found for this email.");
    showFormMessage("Create an account first, then log in.", "error");
    return;
  }

  if (user.password !== password) {
    showFieldError(passwordInput, passwordError, "Incorrect password.");
    showFormMessage("Email/password did not match.", "error");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";

  try {
    saveAuth(user, rememberMe);
    showFormMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = REDIRECT_PAGE;
    }, 450);
  } catch {
    showFormMessage("Unable to save session. Try again.", "error");
    loginButton.disabled = false;
    loginButton.textContent = "Log In";
  }
});
