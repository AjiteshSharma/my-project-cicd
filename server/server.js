
// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

/* ---------------------------
   Root Route (for deployment check)
--------------------------- */
app.get('/', (req, res) => {
  res.send('Fitness Tracker API Running 🚀');
});

/* ---------------------------
   Helper: Read DB
--------------------------- */
async function readDB() {
  try {
    const txt = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return { logs: [], tips: [] };
  }
}

/* ---------------------------
   Helper: Write DB
--------------------------- */
async function writeDB(obj) {
  const tmpPath = DB_PATH + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(tmpPath, DB_PATH);
}

/* ---------------------------
   GET Logs
--------------------------- */
app.get('/api/logs', async (req, res) => {
  try {
    const db = await readDB();
    res.json({ logs: db.logs || [] });
  } catch (err) {
    res.status(500).json({ error: 'failed to read logs' });
  }
});

/* ---------------------------
   POST Log
--------------------------- */
app.post('/api/logs', async (req, res) => {
  try {
    const { date, type, durationMin, calories } = req.body;

    if (!date || !type || typeof durationMin !== 'number') {
      return res.status(400).json({
        error: 'date, type and numeric durationMin required'
      });
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
    console.error('POST /api/logs error', err);
    res.status(500).json({ error: 'failed to save log' });
  }
});

/* ---------------------------
   DELETE Log
--------------------------- */
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
    console.error('DELETE /api/logs error', err);
    res.status(500).json({ error: 'failed to delete' });
  }
});

/* ---------------------------
   GET Tips
--------------------------- */
app.get('/api/tips', async (req, res) => {
  try {
    const db = await readDB();
    res.json({ tips: db.tips || [] });
  } catch (err) {
    res.status(500).json({ error: 'failed to read tips' });
  }
});

/* ---------------------------
   POST Tip
--------------------------- */
app.post('/api/tips', async (req, res) => {
  try {
    const { tip } = req.body;

    if (!tip) {
      return res.status(400).json({ error: 'tip required' });
    }

    const db = await readDB();

    db.tips = db.tips || [];
    db.tips.push(tip);

    await writeDB(db);

    res.status(201).json({ tip });

  } catch (err) {
    res.status(500).json({ error: 'failed to save tip' });
  }
});

/* ---------------------------
   Start Server
--------------------------- */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

