// server/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

/* -------------------------------
   Ensure DB file exists
--------------------------------*/
async function ensureDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData = {
      logs: [],
      tips: [
        "Consistency beats intensity. Keep showing up.",
        "Hydrate before and after workouts.",
        "Stretch to prevent injury.",
        "Rest days are important for recovery."
      ]
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

/* -------------------------------
   Read DB
--------------------------------*/
async function readDB() {
  await ensureDB();
  const txt = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(txt);
}

/* -------------------------------
   Write DB
--------------------------------*/
async function writeDB(data) {
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, DB_PATH);
}

/* -------------------------------
   Health Route
--------------------------------*/
app.get("/", (req, res) => {
  res.send("Fitness Tracker API Running 🚀");
});

/* -------------------------------
   GET Logs
--------------------------------*/
app.get("/api/logs", async (req, res) => {
  try {
    const db = await readDB();
    res.json({ logs: db.logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

/* -------------------------------
   Add Log
--------------------------------*/
app.post("/api/logs", async (req, res) => {
  try {
    const { date, type, durationMin, calories } = req.body;

    if (!date || !type || typeof durationMin !== "number") {
      return res
        .status(400)
        .json({ error: "date, type and numeric durationMin required" });
    }

    const db = await readDB();

    const newLog = {
      id: Date.now(),
      date,
      type,
      durationMin,
      calories: Number(calories || 0)
    };

    db.logs.unshift(newLog);
    await writeDB(db);

    res.status(201).json({ log: newLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save log" });
  }
});

/* -------------------------------
   Delete Log
--------------------------------*/
app.delete("/api/logs/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();

    const before = db.logs.length;
    db.logs = db.logs.filter((l) => l.id !== id);

    if (before === db.logs.length) {
      return res.status(404).json({ error: "Log not found" });
    }

    await writeDB(db);

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete log" });
  }
});

/* -------------------------------
   Get Tips
--------------------------------*/
app.get("/api/tips", async (req, res) => {
  try {
    const db = await readDB();
    res.json({ tips: db.tips });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tips" });
  }
});

/* -------------------------------
   Add Tip
--------------------------------*/
app.post("/api/tips", async (req, res) => {
  try {
    const { tip } = req.body;

    if (!tip) {
      return res.status(400).json({ error: "Tip is required" });
    }

    const db = await readDB();

    db.tips.push(tip);
    await writeDB(db);

    res.status(201).json({ tip });
  } catch (err) {
    res.status(500).json({ error: "Failed to save tip" });
  }
});

/* -------------------------------
   Start Server
--------------------------------*/
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});