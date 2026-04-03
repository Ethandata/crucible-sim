const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 8080;

const supabase = createClient(
  process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
    );

    function generateKey(developer) {
      const slug = developer.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        return `csk_${slug}_${crypto.randomBytes(16).toString('hex')}`;
        }
        function hashKey(key) { return crypto.createHash('sha256').update(key).digest('hex'); }
        function hashTrace(body) { return crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex'); }

        function validateTrace(trace) {
          const e = [];
            if (typeof trace.phi !== 'number') e.push('phi must be a number');
              if (trace.phi < 0 || trace.phi > 100) e.push('phi must be 0-100');
                if (!trace.agent_id) e.push('missing agent_id');
                  if (!trace.scenario) e.push('missing scenario');
                    if (!trace.framework) e.push('missing framework');
                      if (!Array.isArray(trace.events)) e.push('events must be an array');
                        if (trace.phi === 100 && Array.isArray(trace.events) && trace.events.length === 0)
                            e.push('phi=100 with zero events - integrity check failed (Law IV)');
                              return e;
                              }

                              async function auth(req, res, next) {
                                const header = req.headers['authorization'] || req.headers['x-crucible-key'] || '';
                                  const raw = header.replace(/^Bearer\s+/i, '').trim();
                                    if (!raw) return res.status(401).json({ error: 'Authorization: Bearer <api_key> required' });
                                      const { data, error } = await supabase.from('api_keys').select('*').eq('key_hash', hashKey(raw)).eq('active', true).single();
                                        if (error || !data) return res.status(403).json({ error: 'Invalid or revoked API key' });
                                          req.developer = data.developer;
                                            req.team = data.team;
                                              req.key_id = data.id;
                                                next();
                                                }

                                                function admin(req, res, next) {
                                                  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET)
                                                      return res.status(403).json({ error: 'Admin access required' });
                                                        next();
                                                        }

                                                        app.use(express.json({ limit: '2mb' }));
                                                        app.use(express.static('.'));

                                                        app.get('/health', async (req, res) => {
                                                          const { count: k } = await supabase.from('api_keys').select('*', { count: 'exact', head: true }).eq('active', true);
                                                            const { count: r } = await supabase.from('runs').select('*', { count: 'exact', head: true });
                                                              res.json({ status: 'ok', timestamp: new Date().toISOString(), active_keys: k, total_runs: r });
                                                              });

                                                              app.post('/api/keys/issue', admin, async (req, res) => {
                                                                const { developer, team, email } = req.body;
                                                                  if (!developer || !team || !email) return res.status(400).json({ error: 'developer, team, and email required' });
                                                                    const rawKey = generateKey(developer);
                                                                      const { data, error } = await supabase.from('api_keys').insert({ developer, team, email, key_hash: hashKey(rawKey), key_prefix: rawKey.slice(0, 12) + '...', active: true }).select().single();
                                                                        if (error) return res.status(500).json({ error: error.message });
                                                                          res.status(201).json({ id: data.id, developer, team, email, key_prefix: data.key_prefix, api_key: rawKey, warning: 'Store this key immediately - it cannot be recovered.', created_at: data.created_at });
                                                                          });

                                                                          app.get('/api/keys', admin, async (req, res) => {
                                                                            const { data, error } = await supabase.from('api_keys').select('id, developer, team, email, key_prefix, active, created_at, last_used').order('created_at', { ascending: false });
                                                                              if (error) return res.status(500).json({ error: error.message });
                                                                                res.json({ keys: data });
                                                                                });

                                                                                app.delete('/api/keys/:id', admin, async (req, res) => {
                                                                                  const { error } = await supabase.from('api_keys').update({ active: false, revoked_at: new Date().toISOString() }).eq('id', req.params.id);
                                                                                    if (error) return res.status(500).json({ error: error.message });
                                                                                      res.json({ revoked: true });
                                                                                      });

                                                                                      app.post('/api/keys/:id/rotate', admin, async (req, res) => {
                                                                                        const { data: old, error: fe } = await supabase.from('api_keys').select('*').eq('id', req.params.id).single();
                                                                                          if (fe || !old) return res.status(404).json({ error: 'Key not found' });
                                                                                            await supabase.from('api_keys').update({ active: false, revoked_at: new Date().toISOString() }).eq('id', req.params.id);
                                                                                              const rawKey = generateKey(old.developer);
                                                                                                const { data, error } = await supabase.from('api_keys').insert({ developer: old.developer, team: old.team, email: old.email, key_hash: hashKey(rawKey), key_prefix: rawKey.slice(0, 12) + '...', active: true, rotated_from: old.id }).select().single();
                                                                                                  if (error) return res.status(500).json({ error: error.message });
                                                                                                    res.status(201).json({ id: data.id, developer: data.developer, team: data.team, key_prefix: data.key_prefix, api_key: rawKey, warning: 'Store this key immediately - it cannot be recovered.', created_at: data.created_at });
                                                                                                    });

                                                                                                    app.post('/api/runs/submit', auth, async (req, res) => {
                                                                                                      const trace = req.body;
                                                                                                        const errors = validateTrace(trace);
                                                                                                          if (errors.length > 0) return res.status(400).json({ error: 'Trace validation failed', details: errors });
                                                                                                            await supabase.from('api_keys').update({ last_used: new Date().toISOString() }).eq('id', req.key_id);
                                                                                                              const failureCodes = (trace.events || []).filter(e => e.type === 'failure').map(e => e.code).filter(Boolean);
                                                                                                                const run = { id: `run_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`, submitted_by: req.developer, team: req.team, key_id: req.key_id, agent_name: trace.agent_name || trace.agent_id, agent_id: trace.agent_id, scenario: trace.scenario, framework: trace.framework || 'unknown', phi: trace.phi, d1: trace.d_scores?.d1 ?? null, d4: trace.d_scores?.d4 ?? null, d5: trace.d_scores?.d5 ?? null, d8: trace.d_scores?.d8 ?? null, d9: trace.d_scores?.d9 ?? null, survival_ticks: trace.survival_ticks ?? null, failure_codes: failureCodes, trace_hash: hashTrace(trace), certified: true, public: trace.public !== false };
                                                                                                                  const { data, error } = await supabase.from('runs').insert(run).select().single();
                                                                                                                    if (error) return res.status(500).json({ error: error.message });
                                                                                                                      res.status(201).json({ run_id: data.id, submitted_by: data.submitted_by, team: data.team, agent_name: data.agent_name, phi: data.phi, trace_hash: data.trace_hash, certified: true, report_url: `/api/runs/${data.id}`, leaderboard_url: '/api/leaderboard', submitted_at: data.submitted_at });
                                                                                                                      });

                                                                                                                      app.get('/api/runs/:id', async (req, res) => {
                                                                                                                        const { data, error } = await supabase.from('runs').select('*').eq('id', req.params.id).eq('public', true).single();
                                                                                                                          if (error || !data) return res.status(404).json({ error: 'Run not found or private' });
                                                                                                                            res.json(data);
                                                                                                                            });

                                                                                                                            app.get('/api/leaderboard', async (req, res) => {
                                                                                                                              let query = supabase.from('runs').select('id, submitted_by, team, agent_name, scenario, framework, phi, d1, d4, d5, d8, d9, survival_ticks, failure_codes, submitted_at').eq('public', true);
                                                                                                                                if (req.query.framework) query = query.eq('framework', req.query.framework);
                                                                                                                                  if (req.query.scenario) query = query.eq('scenario', req.query.scenario);
                                                                                                                                    if (req.query.team) query = query.eq('team', req.query.team);
                                                                                                                                      const { data, error } = await query.order('phi', { ascending: false }).limit(50);
                                                                                                                                        if (error) return res.status(500).json({ error: error.message });
                                                                                                                                          res.json({ runs: data, count: data.length });
                                                                                                                                          });

                                                                                                                                          app.get('/api/runs', auth, async (req, res) => {
                                                                                                                                            const { data, error } = await supabase.from('runs').select('*').eq('submitted_by', req.developer).order('submitted_at', { ascending: false }).limit(100);
                                                                                                                                              if (error) return res.status(500).json({ error: error.message });
                                                                                                                                                res.json({ developer: req.developer, team: req.team, runs: data, count: data.length });
                                                                                                                                                });

                                                                                                                                                app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
                                                                                                                                                app.use((req, res) => res.status(404).json({ error: 'Not found' }));

                                                                                                                                                app.listen(PORT, () => {
                                                                                                                                                  console.log(`Crucible API on port ${PORT}`);
                                                                                                                                                    console.log(`Supabase: ${process.env.SUPABASE_URL}`);
                                                                                                                                                    });