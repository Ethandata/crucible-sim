const express = require('express');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 8080;

// ── Database ──────────────────────────────────────────────────────────────────
const db = new Database(process.env.DB_PATH || 'data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
              team TEXT NOT NULL,
                  email TEXT NOT NULL,
                      created_at TEXT DEFAULT (datetime('now')),
                          active INTEGER DEFAULT 1
                            );

                              CREATE TABLE IF NOT EXISTS runs (
                                  id TEXT PRIMARY KEY,
                                      team TEXT NOT NULL,
                                          agent_id TEXT NOT NULL,
                                              scenario TEXT NOT NULL,
                                                  framework TEXT NOT NULL,
                                                      phi REAL NOT NULL,
                                                          d1 REAL, d4 REAL, d5 REAL, d8 REAL, d9 REAL,
                                                              survival_ticks INTEGER,
                                                                  failure_codes TEXT,
                                                                      trace_hash TEXT NOT NULL,
                                                                          submitted_at TEXT DEFAULT (datetime('now')),
                                                                              certified INTEGER DEFAULT 1,
                                                                                  public INTEGER DEFAULT 1
                                                                                    );
                                                                                    `);

app.use(express.json({ limit: '2mb' }));
app.use(express.static('.'));

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateKey(team) {
      const slug = team.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      return `csk_${slug}_${crypto.randomBytes(16).toString('hex')}`;
}

function hashTrace(body) {
      return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
}

function validateTrace(trace) {
      const errors = [];
      if (typeof trace.phi !== 'number') errors.push('missing or invalid phi (must be a number)');
      if (trace.phi < 0 || trace.phi > 100) errors.push('phi out of range — must be 0-100');
      if (!trace.agent_id) errors.push('missing agent_id');
      if (!trace.scenario) errors.push('missing scenario');
      if (!trace.framework) errors.push('missing framework');
      if (!Array.isArray(trace.events)) errors.push('missing events array');
      // Law IV: reject suspiciously clean traces
  if (trace.phi === 100 && Array.isArray(trace.events) && trace.events.length === 0) {
          errors.push('perfect phi with zero events — trace integrity check failed (Law IV)');
  }
      return errors;
}

function authMiddleware(req, res, next) {
      const key = req.headers['x-crucible-key'] ||
              (req.headers['authorization'] || '').replace('Bearer ', '');
      if (!key) return res.status(401).json({ error: 'missing x-crucible-key header' });
      const row = db.prepare('SELECT * FROM api_keys WHERE key = ? AND active = 1').get(key);
      if (!row) return res.status(403).json({ error: 'invalid or revoked key' });
      req.team = row.team;
      next();
}

function adminMiddleware(req, res, next) {
      const secret = req.headers['x-admin-secret'];
      if (!secret || secret !== process.env.ADMIN_SECRET) {
              return res.status(403).json({ error: 'admin access required' });
      }
      next();
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
      const keyCount = db.prepare('SELECT COUNT(*) as n FROM api_keys WHERE active = 1').get();
      const runCount = db.prepare('SELECT COUNT(*) as n FROM runs').get();
      res.json({
              status: 'ok',
              timestamp: new Date().toISOString(),
              active_keys: keyCount.n,
              total_runs: runCount.n
      });
});

// Issue a new API key — founder only via ADMIN_SECRET
app.post('/api/keys/issue', adminMiddleware, (req, res) => {
      const { team, email } = req.body;
      if (!team || !email) {
              return res.status(400).json({ error: 'team and email are required' });
      }
      const key = generateKey(team);
      try {
              db.prepare('INSERT INTO api_keys (key, team, email) VALUES (?, ?, ?)').run(key, team, email);
              res.json({
                        team,
                        email,
                        key,
                        note: 'This is your CRUCIBLE_SUBMIT_SECRET. Store it securely — it cannot be recovered.'
              });
      } catch (e) {
              if (e.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'a key for this team may already exist' });
              }
              res.status(500).json({ error: 'key generation failed', detail: e.message });
      }
});

// List all keys — founder only
app.get('/api/keys', adminMiddleware, (req, res) => {
      const keys = db.prepare('SELECT id, team, email, created_at, active FROM api_keys').all();
      res.json({ keys });
});

// Revoke a key — founder only
app.delete('/api/keys/:id', adminMiddleware, (req, res) => {
      db.prepare('UPDATE api_keys SET active = 0 WHERE id = ?').run(req.params.id);
      res.json({ revoked: true });
});

// Submit a run
app.post('/api/runs/submit', authMiddleware, (req, res) => {
      const trace = req.body;
      const errors = validateTrace(trace);
      if (errors.length > 0) {
              return res.status(400).json({ error: 'trace validation failed', details: errors });
      }

           const runId = `run_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const traceHash = hashTrace(trace);
      const failureCodes = (trace.events || [])
        .filter(e => e.type === 'failure')
        .map(e => e.code)
        .join(',');

           try {
                   db.prepare(`
                         INSERT INTO runs (
                                 id, team, agent_id, scenario, framework, phi,
                                         d1, d4, d5, d8, d9, survival_ticks,
                                                 failure_codes, trace_hash, certified, public
                                                       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                                                           `).run(
                             runId,
                             req.team,
                             trace.agent_id,
                             trace.scenario,
                             trace.framework || 'unknown',
                             trace.phi,
                             trace.d_scores?.d1 ?? null,
                             trace.d_scores?.d4 ?? null,
                             trace.d_scores?.d5 ?? null,
                             trace.d_scores?.d8 ?? null,
                             trace.d_scores?.d9 ?? null,
                             trace.survival_ticks ?? null,
                             failureCodes,
                             traceHash,
                             trace.public === false ? 0 : 1
                           );

        res.status(201).json({
                  run_id: runId,
                  team: req.team,
                  phi: trace.phi,
                  trace_hash: traceHash,
                  certified: true,
                  report_url: `https://crucible-ai.net/api/runs/${runId}`,
                  leaderboard_url: `https://crucible-ai.net/api/leaderboard`,
                  submitted_at: new Date().toISOString()
        });
           } catch (e) {
                   res.status(500).json({ error: 'submission failed', detail: e.message });
           }
});

// Get a single certified run report
app.get('/api/runs/:id', (req, res) => {
      const run = db.prepare('SELECT * FROM runs WHERE id = ? AND public = 1').get(req.params.id);
      if (!run) return res.status(404).json({ error: 'run not found or is private' });
      run.failure_codes = run.failure_codes ? run.failure_codes.split(',').filter(Boolean) : [];
      res.json(run);
});

// Public leaderboard — top 50 runs by phi
app.get('/api/leaderboard', (req, res) => {
      const framework = req.query.framework;
      const scenario = req.query.scenario;

          let query = `
              SELECT id, team, agent_id, scenario, framework, phi,
                         d1, d4, d5, d8, d9, survival_ticks, failure_codes, submitted_at
                             FROM runs WHERE public = 1
                               `;
      const params = [];
      if (framework) { query += ' AND framework = ?'; params.push(framework); }
      if (scenario)  { query += ' AND scenario = ?';  params.push(scenario); }
      query += ' ORDER BY phi DESC LIMIT 50';

          const rows = db.prepare(query).all(...params);
      rows.forEach(r => {
              r.failure_codes = r.failure_codes ? r.failure_codes.split(',').filter(Boolean) : [];
      });
      res.json({ runs: rows, count: rows.length });
});

// My team's runs (authenticated)
app.get('/api/runs', authMiddleware, (req, res) => {
      const rows = db.prepare(
              'SELECT * FROM runs WHERE team = ? ORDER BY submitted_at DESC LIMIT 100'
            ).all(req.team);
      rows.forEach(r => {
              r.failure_codes = r.failure_codes ? r.failure_codes.split(',').filter(Boolean) : [];
      });
      res.json({ team: req.team, runs: rows, count: rows.length });
});

// Landing page
app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
});

// 404
app.use((req, res) => {
      res.status(404).json({ error: 'not found' });
});

app.listen(PORT, () => {
      console.log(`Crucible API running on port ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log(`Leaderboard: http://localhost:${PORT}/api/leaderboard`);
});
