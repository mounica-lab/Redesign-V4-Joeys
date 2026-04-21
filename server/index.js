import './env.js';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { db, parseRecipe, parseMember } from './db.js';
import { hashPassword, verifyPassword, signToken, requireAuth, loadUserSnapshot } from './auth.js';
import { generateRecipeOptions, generateWeeklyPlan } from './claude.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    hasClaudeKey: !!process.env.ANTHROPIC_API_KEY,
  });
});

// ===== Auth =====

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email and password (6+ chars) required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const { lastInsertRowid } = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hashPassword(password));
  const token = signToken(lastInsertRowid);
  res.json({ token, user: { id: lastInsertRowid, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signToken(user.id);
  const snapshot = loadUserSnapshot(user.id);
  res.json({ token, ...snapshot });
});

app.get('/api/me', requireAuth, (req, res) => {
  const snapshot = loadUserSnapshot(req.userId);
  if (!snapshot) return res.status(404).json({ error: 'User not found' });
  res.json(snapshot);
});

// ===== Household =====

app.put('/api/household', requireAuth, (req, res) => {
  const { name, budgetPerMeal, mealsPerWeek, cookTime, members } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Household name required' });

  const tx = db.transaction(() => {
    const existing = db.prepare('SELECT id FROM households WHERE user_id = ?').get(req.userId);
    let householdId;
    if (existing) {
      db.prepare('UPDATE households SET name = ?, budget_per_meal = ?, meals_per_week = ?, cook_time = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .run(name, budgetPerMeal || 22, mealsPerWeek || 5, cookTime || 35, existing.id);
      householdId = existing.id;
      db.prepare('DELETE FROM members WHERE household_id = ?').run(householdId);
    } else {
      const ins = db.prepare('INSERT INTO households (user_id, name, budget_per_meal, meals_per_week, cook_time) VALUES (?, ?, ?, ?, ?)')
        .run(req.userId, name, budgetPerMeal || 22, mealsPerWeek || 5, cookTime || 35);
      householdId = ins.lastInsertRowid;
    }
    const insertMember = db.prepare('INSERT INTO members (household_id, name, role, age, loves, avoids, diet) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const m of members || []) {
      insertMember.run(
        householdId,
        m.name || '',
        m.role || 'Adult',
        m.age || null,
        JSON.stringify(m.loves || []),
        JSON.stringify(m.avoids || []),
        JSON.stringify(m.diet || []),
      );
    }
  });
  tx();
  res.json(loadUserSnapshot(req.userId));
});

// ===== Recipes =====

app.get('/api/recipes', (req, res) => {
  const rows = db.prepare('SELECT * FROM recipes WHERE source = ? ORDER BY id').all('seed').map(parseRecipe);
  res.json(rows);
});

app.get('/api/recipes/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Recipe not found' });
  res.json(parseRecipe(row));
});

// ===== Generate via Claude =====

function saveGeneratedRecipes(userId, recipes) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO recipes (id, user_id, name, subtitle, time, difficulty, cal, cuisine, tone, tags, summary, nutrition, servings, ingredients, steps, source)
    VALUES (@id, @user_id, @name, @subtitle, @time, @difficulty, @cal, @cuisine, @tone, @tags, @summary, @nutrition, @servings, @ingredients, @steps, 'ai')
  `);
  const tx = db.transaction((rows) => {
    for (const r of rows) {
      insert.run({
        id: r.id,
        user_id: userId || null,
        name: r.name,
        subtitle: r.subtitle || '',
        time: r.time || 30,
        difficulty: r.difficulty || 'Easy',
        cal: r.cal || 500,
        cuisine: r.cuisine || '',
        tone: r.tone || 'warm',
        tags: JSON.stringify(r.tags || []),
        summary: r.summary || '',
        nutrition: JSON.stringify(r.nutrition || {}),
        servings: r.servings || 2,
        ingredients: JSON.stringify(r.ingredients || []),
        steps: JSON.stringify(r.steps || []),
      });
    }
  });
  tx(recipes);
}

function handleClaudeError(err, res) {
  console.error('Claude error:', err);
  if (err instanceof Anthropic.AuthenticationError) {
    return res.status(500).json({ error: 'Invalid or missing ANTHROPIC_API_KEY. Check server/.env' });
  }
  if (err instanceof Anthropic.RateLimitError) {
    return res.status(429).json({ error: 'Rate limited by Claude. Try again in a moment.' });
  }
  if (err instanceof Anthropic.APIError) {
    return res.status(err.status || 500).json({ error: `Claude API error: ${err.message}` });
  }
  return res.status(500).json({ error: err.message || 'Generation failed' });
}

app.post('/api/generate/recipes', async (req, res) => {
  try {
    const recipes = await generateRecipeOptions(req.body || {});
    const userId = (req.headers.authorization || '').startsWith('Bearer ') ? null : null;
    saveGeneratedRecipes(userId, recipes);
    res.json({ recipes });
  } catch (err) {
    handleClaudeError(err, res);
  }
});

app.post('/api/generate/plan', requireAuth, async (req, res) => {
  try {
    const numMeals = Math.max(1, Math.min(14, parseInt(req.body?.numMeals) || 5));
    const household = loadUserSnapshot(req.userId)?.household;
    const recipes = await generateWeeklyPlan({ ...req.body, household }, numMeals);
    saveGeneratedRecipes(req.userId, recipes);
    res.json({ recipes });
  } catch (err) {
    handleClaudeError(err, res);
  }
});

// ===== Plans =====

app.get('/api/plan', requireAuth, (req, res) => {
  const weekStart = req.query.weekStart || new Date().toISOString().slice(0, 10);
  const row = db.prepare('SELECT * FROM plans WHERE user_id = ? AND week_start = ?').get(req.userId, weekStart);
  res.json({
    weekStart,
    slots: row ? JSON.parse(row.slots) : {},
  });
});

app.put('/api/plan', requireAuth, (req, res) => {
  const { weekStart, slots } = req.body || {};
  if (!weekStart) return res.status(400).json({ error: 'weekStart required' });
  db.prepare(`
    INSERT INTO plans (user_id, week_start, slots) VALUES (?, ?, ?)
    ON CONFLICT(user_id, week_start) DO UPDATE SET slots = excluded.slots
  `).run(req.userId, weekStart, JSON.stringify(slots || {}));
  res.json({ ok: true });
});

// ===== Feedback =====

app.post('/api/feedback', requireAuth, (req, res) => {
  const { recipeId, slotKey, reaction } = req.body || {};
  if (!recipeId || !reaction) return res.status(400).json({ error: 'recipeId and reaction required' });
  db.prepare('INSERT INTO feedback (user_id, recipe_id, slot_key, reaction) VALUES (?, ?, ?, ?)').run(req.userId, recipeId, slotKey || null, reaction);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Joey's server listening on http://localhost:${PORT}`);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.log('\nHEADS UP: ANTHROPIC_API_KEY is not set.');
    console.log('  1. Check that server/.env exists and contains:');
    console.log('       ANTHROPIC_API_KEY=sk-ant-api03-...');
    console.log('  2. Restart the server after editing .env.');
  } else {
    console.log(`Claude API key loaded (${key.slice(0, 15)}...)`);
  }
});
