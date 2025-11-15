const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// SQLite DB
const db = new sqlite3.Database("./notices.db");

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS notices(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT,
    category TEXT
  )
`);

// GET all notices
app.get("/notices", (req, res) => {
  db.all("SELECT * FROM notices ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// ADD notice
app.post("/notices", (req, res) => {
  const { title, content, date, category } = req.body;
  db.run(
    "INSERT INTO notices(title, content, date, category) VALUES(?,?,?,?)",
    [title, content, date, category],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// DELETE notice
app.delete("/notices/:id", (req, res) => {
  db.run("DELETE FROM notices WHERE id = ?", [req.params.id], () => {
    res.json({ message: "Deleted" });
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));