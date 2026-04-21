import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const db = new Database(join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

const seeded = db.prepare('SELECT COUNT(*) AS c FROM recipes WHERE source = ?').get('seed').c;
if (seeded === 0) {
  const seed = JSON.parse(readFileSync(join(__dirname, 'seed-recipes.json'), 'utf8'));
  const insert = db.prepare(`
    INSERT INTO recipes (id, name, subtitle, time, difficulty, cal, cuisine, tone, tags, summary, nutrition, servings, ingredients, steps, source)
    VALUES (@id, @name, @subtitle, @time, @difficulty, @cal, @cuisine, @tone, @tags, @summary, @nutrition, @servings, @ingredients, @steps, 'seed')
  `);
  const tx = db.transaction((rows) => {
    for (const r of rows) {
      insert.run({
        ...r,
        tags: JSON.stringify(r.tags || []),
        nutrition: JSON.stringify(r.nutrition || {}),
        ingredients: JSON.stringify(r.ingredients || []),
        steps: JSON.stringify(r.steps || []),
      });
    }
  });
  tx(seed);
  console.log(`Seeded ${seed.length} recipes into the database.`);
}

export function parseRecipe(row) {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    nutrition: JSON.parse(row.nutrition || '{}'),
    ingredients: JSON.parse(row.ingredients || '[]'),
    steps: JSON.parse(row.steps || '[]'),
  };
}

export function parseMember(row) {
  if (!row) return null;
  return {
    ...row,
    loves: JSON.parse(row.loves || '[]'),
    avoids: JSON.parse(row.avoids || '[]'),
    diet: JSON.parse(row.diet || '[]'),
  };
}
