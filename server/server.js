// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Helper: read DB file and parse JSON
async function readDB() {
  try {
    const txt = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    // If file missing or invalid, return default structure
    return { logs: [], tips: [] };
  }
}

// Helper: write DB object to file (atomic-ish: write temp then rename)
async function writeDB(obj) {
  const tmpPath = DB_PATH + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(tmpPath, DB_PATH);
}

// GET /api/logs
app.get('/api/logs', async (req, res) => {
  try {
    const db = await readDB();
    res.json({ logs: db.logs || [] });
  } catch (err) {
    res.status(500).json({ error: 'failed to read logs' });
  }
});

// POST /api/logs
// body: { date, type, durationMin, calories }  (durationMin numeric)
app.post('/api/logs', async (req, res) => {
  try {
    const { date, type, durationMin, calories } = req.body;
    if (!date || !type || typeof durationMin !== 'number') {
      return res.status(400).json({ error: 'date, type and numeric durationMin required' });
    }

    const db = await readDB();
    const newLog = {
      id: Date.now(), // simple unique id
      date,
      type,
      durationMin,
      calories: Number(calories || 0)
    };
    db.logs.unshift(newLog);
    await writeDB(db);
    res.status(201).json({ log: newLog });
  } catch (err) {
    console.error('POST /api/logs error', err);
    res.status(500).json({ error: 'failed to save log' });
  }
});

// DELETE /api/logs/:id
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDB();
    const before = db.logs.length;
    db.logs = db.logs.filter(l => l.id !== id);
    if (db.logs.length === before) {
      return res.status(404).json({ error: 'log not found' });
    }
    await writeDB(db);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/logs/:id error', err);
    res.status(500).json({ error: 'failed to delete' });
  }
});

// GET /api/tips
app.get('/api/tips', async (req, res) => {
  try {
    const db = await readDB();
    res.json({ tips: db.tips || [] });
  } catch (err) {
    res.status(500).json({ error: 'failed to read tips' });
  }
});

// Optional: add new tip (not required)
app.post('/api/tips', async (req, res) => {
  try {
    const { tip } = req.body;
    if (!tip) return res.status(400).json({ error: 'tip required' });
    const db = await readDB();
    db.tips = db.tips || [];
    db.tips.push(tip);
    await writeDB(db);
    res.status(201).json({ tip });
  } catch (err) {
    res.status(500).json({ error: 'failed to save tip' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
