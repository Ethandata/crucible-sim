const express = require('express');
const path    = require('path');
const crypto  = require('crypto');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Tiny file-based DB (no native deps — works on any host) ──────────────────
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'crucible_db.json');

function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
          fs.writeFileSync(DB_FILE, JSON.stringify({ keys: [], runs: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Generate a new API key: csk_<developer>_<16 random bytes hex>
function generateKey(developer) {
    const slug = developer.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `csk_${slug}_${crypto.randomBytes(16).toString('hex')}`;
}

// Store only SHA-256 hash of the key — never plaintext
function hashKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
}

// SHA-256 of the full trace body — for integrity / replay validation
function hashTrace(body) {
    return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
}

// Derive agent_name from trace (use explicit field or fall back to agent_id)
function deriveAgentName(trace) {
    return trace.agent_name || trace.agent_id || 'unknown-agent';
}

// Validate incoming trace — no HMAC required, just structural checks
function validateTrace(trace) {
    const errors = [];
    if (typeof trace.phi !== 'number')        errors.push('phi must be a number');
    if (trace.phi < 0 || trace.phi > 100)     errors.push('phi must be 0–100');
    if (!trace.agent_id)                       errors.push('missing agent_id');
    if (!trace.scenario)                       errors.push('missing scenario');
    if (!trace.framework)                      errors.push('missing framework');
    if (!Array.isArray(trace.events))          errors.push('events must be an array');
    // Law IV: reject implausibly perfect traces with no events
  if (trace.phi === 100 && Array.isArray(trace.events) && trace.events.length === 0) {
        errors.push('phi=100 with zero events — integrity check failed (Law IV)');
  }
    return errors;
}

// ── Auth middleware — Bearer <api_key>, validated against stored hash ─────────
function auth(req, res, next) {
    const header = req.headers['authorization'] || req.headers['x-crucible-key'] || '';
    const raw    = header.replace(/^Bearer\s+/i, '').trim();
    if (!raw) return res.status(401).json({ error: 'Authorization header required (Bearer <api_key>)' });

  const db      = loadDB();
    const keyHash = hashKey(raw);
    const record  = db.keys.find(k => k.key_hash === keyHash && k.active);

  if (!record) return res.status(403).json({ error: 'Invalid or revoked API key' });

  // Attach identity to request — never expose the raw key downstream
  req.developer = record.developer;
    req.team      = record.team;
    req.key_id    = record.id;
    next();
}

// ── Admin middleware — ADMIN_SECRET header, founder-only routes ───────────────
function admin(req, res, next) {
    const secret = req.headers['x-admin-secret'];
    if (!secret || secret !== process.env.ADMIN_SECRET) {
          return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.static('.'));

// ── Routes ────────────────────────────────────────────────────────────────────

// Health — shows live counts without exposing any data
app.get('/health', (req, res) => {
    const db = loadDB();
    res.json({
          status:      'ok',
          timestamp:   new Date().toISOString(),
          active_keys: db.keys.filter(k => k.active).length,
          total_runs:  db.runs.length
    });
});

// ── Key management (admin only) ───────────────────────────────────────────────

// Issue a new per-developer API key
// POST /api/keys/issue  { developer, team, email }
// Returns the plaintext key ONCE — not stored, not recoverable
app.post('/api/keys/issue', admin, (req, res) => {
    const { developer, team, email } = req.body;
    if (!developer || !team || !email) {
          return res.status(400).json({ error: 'developer, team, and email are all required' });
    }

           const db      = loadDB();
    const rawKey  = generateKey(developer);
    const keyHash = hashKey(rawKey);

           // Guard against duplicate hash (astronomically unlikely but safe)
           if (db.keys.find(k => k.key_hash === keyHash)) {
                 return res.status(409).json({ error: 'Key collision — try again' });
           }

           const record = {
                 id:         crypto.randomUUID(),
                 developer,
                 team,
                 email,
                 key_hash:   keyHash,          // only the hash is stored
                 key_prefix: rawKey.slice(0, 12) + '...',  // for display/identification
                 active:     true,
                 created_at: new Date().toISOString(),
                 last_used:  null
           };

           db.keys.push(record);
    saveDB(db);

           res.status(201).json({
                 id:          record.id,
                 developer,
                 team,
                 email,
                 key_prefix:  record.key_prefix,
                 api_key:     rawKey,          // shown ONCE — tell developer to store it now
                 warning:     'Store this key immediately. It cannot be recovered — only its hash is saved.',
                 created_at:  record.created_at
           });
});

// List all keys (no hashes or plaintext exposed)
app.get('/api/keys', admin, (req, res) => {
    const db = loadDB();
    res.json({
          keys: db.keys.map(k => ({
                  id:         k.id,
                  developer:  k.developer,
                  team:       k.team,
                  email:      k.email,
                  key_prefix: k.key_prefix,
                  active:     k.active,
                  created_at: k.created_at,
                  last_used:  k.last_used
          }))
    });
});

// Revoke a single key by ID — does not affect any other keys
app.delete('/api/keys/:id', admin, (req, res) => {
    const db  = loadDB();
    const key = db.keys.find(k => k.id === req.params.id);
    if (!key) return res.status(404).json({ error: 'Key not found' });
    key.active     = false;
    key.revoked_at = new Date().toISOString();
    saveDB(db);
    res.json({ revoked: true, developer: key.developer, id: key.id });
});

// Rotate a key — revoke old, issue new for same developer
app.post('/api/keys/:id/rotate', admin, (req, res) => {
    const db  = loadDB();
    const old = db.keys.find(k => k.id === req.params.id);
    if (!old) return res.status(404).json({ error: 'Key not found' });

           // Revoke old
           old.active     = false;
    old.revoked_at = new Date().toISOString();

           // Issue new
           const rawKey  = generateKey(old.developer);
    const keyHash = hashKey(rawKey);
    const record  = {
          id:         crypto.randomUUID(),
          developer:  old.developer,
          team:       old.team,
          email:      old.email,
          key_hash:   keyHash,
          key_prefix: rawKey.slice(0, 12) + '...',
          active:     true,
          created_at: new Date().toISOString(),
          last_used:  null,
          rotated_from: old.id
    };
    db.keys.push(record);
    saveDB(db);

           res.status(201).json({
                 id:         record.id,
                 developer:  record.developer,
                 team:       record.team,
                 key_prefix: record.key_prefix,
                 api_key:    rawKey,
                 warning:    'Store this key immediately. It cannot be recovered.',
                 created_at: record.created_at
           });
});

// ── Run submission ────────────────────────────────────────────────────────────

// POST /api/runs/submit
// Header: Authorization: Bearer <api_key>
// Body:   raw JSON-T trace — no HMAC signing required
app.post('/api/runs/submit', auth, (req, res) => {
    const trace  = req.body;
    const errors = validateTrace(trace);
    if (errors.length > 0) {
          return res.status(400).json({ error: 'Trace validation failed', details: errors });
    }

           // Update last_used on the key
           const db  = loadDB();
    const key = db.keys.find(k => k.id === req.key_id);
    if (key) key.last_used = new Date().toISOString();

           const failureCodes = (trace.events || [])
      .filter(e => e.type === 'failure')
      .map(e => e.code)
      .filter(Boolean);

           const run = {
                 id:           `run_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
                 // Identity — who submitted this
                 submitted_by: req.developer,
                 team:         req.team,
                 key_id:       req.key_id,
                 // Agent metadata — derived from trace
                 agent_name:   deriveAgentName(trace),
                 agent_id:     trace.agent_id,
                 scenario:     trace.scenario,
                 framework:    trace.framework || 'unknown',
                 // Scores
                 phi:          trace.phi,
                 d_scores: {
                         d1: trace.d_scores?.d1 ?? null,
                         d4: trace.d_scores?.d4 ?? null,
                         d5: trace.d_scores?.d5 ?? null,
                         d8: trace.d_scores?.d8 ?? null,
                         d9: trace.d_scores?.d9 ?? null
                 },
                 survival_ticks: trace.survival_ticks ?? null,
                 failure_codes:  failureCodes,
                 // Integrity
                 trace_hash:   hashTrace(trace),
                 certified:    true,
                 public:       trace.public !== false,
                 submitted_at: new Date().toISOString()
           };

           db.runs.push(run);
    saveDB(db);

           res.status(201).json({
                 run_id:        run.id,
                 submitted_by:  run.submitted_by,
                 team:          run.team,
                 agent_name:    run.agent_name,
                 phi:           run.phi,
                 trace_hash:    run.trace_hash,
                 certified:     true,
                 report_url:    `/api/runs/${run.id}`,
                 leaderboard_url: `/api/leaderboard`,
                 submitted_at:  run.submitted_at
           });
});

// ── Read routes ───────────────────────────────────────────────────────────────

// Get a single certified run report (public runs only)
app.get('/api/runs/:id', (req, res) => {
    const db  = loadDB();
    const run = db.runs.find(r => r.id === req.params.id && r.public);
    if (!run) return res.status(404).json({ error: 'Run not found or is private' });
    res.json(run);
});

// Public leaderboard — top 50 by phi, filterable
app.get('/api/leaderboard', (req, res) => {
    const db = loadDB();
    let runs = db.runs.filter(r => r.public);
    if (req.query.framework) runs = runs.filter(r => r.framework === req.query.framework);
    if (req.query.scenario)  runs = runs.filter(r => r.scenario  === req.query.scenario);
    if (req.query.team)      runs = runs.filter(r => r.team      === req.query.team);
    runs.sort((a, b) => b.phi - a.phi);
    res.json({ runs: runs.slice(0, 50), count: runs.length });
});

// My own runs — authenticated
app.get('/api/runs', auth, (req, res) => {
    const db   = loadDB();
    const runs = db.runs
      .filter(r => r.submitted_by === req.developer)
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
      .slice(0, 100);
    res.json({ developer: req.developer, team: req.team, runs, count: runs.length });
});

// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Crucible API running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Leaderboard: http://localhost:${PORT}/api/leaderboard`);
});
