const AUTH_STORAGE_KEY = "codeTacticsAuth";
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

function loadAuth() {
  try {
    const localAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (localAuth) return JSON.parse(localAuth);

    const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (sessionAuth) return JSON.parse(sessionAuth);
  } catch {
    return null;
  }

  return null;
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

function saveAuth(email, rememberMe) {
  const payload = {
    email,
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

if (loadAuth()) {
  window.location.href = REDIRECT_PAGE;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessages();

  const email = emailInput.value.trim();
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

  loginButton.disabled = true;
  loginButton.textContent = "Signing in...";

  try {
    saveAuth(email, rememberMe);
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
