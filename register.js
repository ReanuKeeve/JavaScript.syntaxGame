const AUTH_STORAGE_KEY = "codeTacticsAuth";
const USERS_STORAGE_KEY = "codeTacticsUsers";
const MIN_PASSWORD_LENGTH = 6;
const LOGIN_PAGE = "login.html";
const REDIRECT_PAGE = "index.html";

const form = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const termsInput = document.getElementById("terms");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const termsError = document.getElementById("terms-error");
const formMessage = document.getElementById("form-message");
const registerButton = document.getElementById("register-btn");

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
  return users;
}

function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value) {
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return value.length >= MIN_PASSWORD_LENGTH && hasLetter && hasNumber;
}

function setFieldError(input, errorNode, message) {
  input.classList.add("input-error");
  errorNode.textContent = message;
}

function clearMessages() {
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  termsError.textContent = "";
  formMessage.textContent = "";
  formMessage.classList.remove("error", "success");

  nameInput.classList.remove("input-error");
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
  confirmPasswordInput.classList.remove("input-error");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove("error", "success");
  if (type) {
    formMessage.classList.add(type);
  }
}

if (loadAuth()) {
  window.location.href = REDIRECT_PAGE;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMessages();

  const name = nameInput.value.trim();
  const email = normalizeEmail(emailInput.value);
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const acceptedTerms = termsInput.checked;

  let hasError = false;

  if (name.length < 2) {
    setFieldError(nameInput, nameError, "Name must be at least 2 characters.");
    hasError = true;
  }

  if (!email) {
    setFieldError(emailInput, emailError, "Email is required.");
    hasError = true;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Enter a valid email address.");
    hasError = true;
  }

  if (!password) {
    setFieldError(passwordInput, passwordError, "Password is required.");
    hasError = true;
  } else if (!isStrongPassword(password)) {
    setFieldError(
      passwordInput,
      passwordError,
      `Use at least ${MIN_PASSWORD_LENGTH} characters with letters and numbers.`
    );
    hasError = true;
  }

  if (!confirmPassword) {
    setFieldError(confirmPasswordInput, confirmPasswordError, "Please confirm your password.");
    hasError = true;
  } else if (confirmPassword !== password) {
    setFieldError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
    hasError = true;
  }

  if (!acceptedTerms) {
    termsError.textContent = "You must accept the terms to continue.";
    hasError = true;
  }

  if (hasError) {
    showFormMessage("Please fix the highlighted fields.", "error");
    return;
  }

  const users = loadUsers();
  const alreadyExists = users.some((user) => normalizeEmail(user.email ?? "") === email);

  if (alreadyExists) {
    setFieldError(emailInput, emailError, "An account with this email already exists.");
    showFormMessage("Try logging in with your existing account.", "error");
    return;
  }

  registerButton.disabled = true;
  registerButton.textContent = "Creating account...";

  try {
    users.push({
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    });

    saveUsers(users);
    showFormMessage("Account created. Redirecting to login...", "success");

    setTimeout(() => {
      const url = `${LOGIN_PAGE}?registered=1&email=${encodeURIComponent(email)}`;
      window.location.href = url;
    }, 650);
  } catch {
    showFormMessage("Unable to create account. Please try again.", "error");
    registerButton.disabled = false;
    registerButton.textContent = "Create Account";
  }
});
