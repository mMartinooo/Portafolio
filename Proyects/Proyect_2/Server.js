const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/indexP2.html");
});


// Endpoint educativo
app.post("/login", (req, res) => {
  const { email } = req.body;

  const log = {
    email: email || "No ingresado",
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    time: new Date().toISOString()
  };

  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync("logs.json"));
  } catch (e) {
    logs = [];
  }

  logs.push(log);
  fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2));

  res.redirect("/education.html");
});

// Panel simple de visualización
app.get("/admin", (req, res) => {
  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync("logs.json"));
  } catch (e) {
    logs = [];
  }

  let html = `
  <html>
  <head>
    <title>Panel Educativo - Registros</title>
    <style>
      body { background:#020617; color:white; font-family: Inter, sans-serif; padding:20px; }
      table { width:100%; border-collapse: collapse; }
      th, td { border:1px solid #0ea5e9; padding:8px; text-align:left; }
      th { background:#020024; }
    </style>
  </head>
  <body>
    <h2>📊 Registros educativos de intentos</h2>
    <p>Solo se almacenan emails de prueba e IP con fines educativos</p>
    <table>
      <tr>
        <th>Email</th>
        <th>IP</th>
        <th>Fecha</th>
      </tr>
  `;

  logs.forEach(l => {
    html += `
      <tr>
        <td>${l.email}</td>
        <td>${l.ip}</td>
        <td>${l.time}</td>
      </tr>
    `;
  });

  html += `
    </table>
  </body>
  </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
