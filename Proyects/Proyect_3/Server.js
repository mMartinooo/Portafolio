const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const DB_FILE = "database.json";

// Helpers
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Home → Login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "loginP3.html"));
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.username === username);
  if (!user) return res.send("Usuario no encontrado");

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.send("Contraseña incorrecta");

  res.redirect("/dashboard.html");
});

// API - generar logs simulados
app.get("/api/log", (req, res) => {
  const db = readDB();

  const log = {
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    event: ["Login exitoso", "Intento fallido", "Escaneo de puertos", "Acceso sospechoso"][Math.floor(Math.random() * 4)],
    time: new Date().toLocaleString()
  };

  db.logs.push(log);
  if (db.logs.length > 20) db.logs.shift();

  writeDB(db);
  res.json(log);
});

// API - obtener logs
app.get("/api/logs", (req, res) => {
  const db = readDB();
  res.json(db.logs);
});

app.listen(PORT, () => {
  console.log(`SOC Dashboard corriendo en http://localhost:${PORT}`);
});
