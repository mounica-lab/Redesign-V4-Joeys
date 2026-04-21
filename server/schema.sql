CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS households (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_per_meal INTEGER NOT NULL DEFAULT 22,
  meals_per_week INTEGER NOT NULL DEFAULT 5,
  cook_time INTEGER NOT NULL DEFAULT 35,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Adult',
  age INTEGER,
  loves TEXT NOT NULL DEFAULT '[]',
  avoids TEXT NOT NULL DEFAULT '[]',
  diet TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subtitle TEXT,
  time INTEGER,
  difficulty TEXT,
  cal INTEGER,
  cuisine TEXT,
  tone TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  summary TEXT,
  nutrition TEXT NOT NULL DEFAULT '{}',
  servings INTEGER,
  ingredients TEXT NOT NULL DEFAULT '[]',
  steps TEXT NOT NULL DEFAULT '[]',
  source TEXT NOT NULL DEFAULT 'seed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start TEXT NOT NULL,
  slots TEXT NOT NULL DEFAULT '{}',
  UNIQUE(user_id, week_start)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  slot_key TEXT,
  reaction TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
