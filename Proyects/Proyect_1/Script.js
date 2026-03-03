const passwordInput = document.getElementById("password");
const bar = document.getElementById("bar");
const strengthText = document.getElementById("strength");
const entropyText = document.getElementById("entropy");
const timeText = document.getElementById("time");

const rules = {
  length: document.getElementById("length"),
  upper: document.getElementById("upper"),
  lower: document.getElementById("lower"),
  number: document.getElementById("number"),
  symbol: document.getElementById("symbol"),
};

function analyze() {
  const pw = passwordInput.value;
  let score = 0;
  let pool = 0;

  // Reglas
  const hasLength = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);

  updateRule(rules.length, hasLength);
  updateRule(rules.upper, hasUpper);
  updateRule(rules.lower, hasLower);
  updateRule(rules.number, hasNumber);
  updateRule(rules.symbol, hasSymbol);

  if (hasLength) score++;
  if (hasUpper) {
    score++;
    pool += 26;
  }
  if (hasLower) {
    score++;
    pool += 26;
  }
  if (hasNumber) {
    score++;
    pool += 10;
  }
  if (hasSymbol) {
    score++;
    pool += 32;
  }

  const percent = (score / 5) * 100;
  bar.style.width = percent + "%";

  let strength = "Muy débil";
  if (score >= 2) strength = "Débil";
  if (score >= 3) strength = "Media";
  if (score >= 4) strength = "Fuerte";
  if (score === 5) strength = "Muy fuerte";

  strengthText.textContent = strength;

  // Entropía
  const entropy = pw.length * Math.log2(pool || 1);
  entropyText.textContent = entropy.toFixed(1);

  // Tiempo estimado (simplificado)
  let time = "Instantáneo";
  if (entropy > 30) time = "Minutos";
  if (entropy > 50) time = "Horas";
  if (entropy > 70) time = "Días";
  if (entropy > 90) time = "Años";

  timeText.textContent = time;
}

function updateRule(element, valid) {
  element.textContent = valid
    ? "✔ " + element.textContent.slice(2)
    : "❌ " + element.textContent.slice(2);
}

function generatePassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?";
  let pw = "";
  for (let i = 0; i < 16; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  passwordInput.value = pw;
  analyze();
}
