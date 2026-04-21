import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, parseMember } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_TTL = '30d';

export function hashPassword(pw) {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw, hash) {
  return bcrypt.compareSync(pw, hash);
}

export function signToken(userId) {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token && verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Not signed in' });
  req.userId = payload.uid;
  next();
}

export function loadUserSnapshot(userId) {
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  const household = db.prepare('SELECT * FROM households WHERE user_id = ?').get(userId);
  const members = household
    ? db.prepare('SELECT * FROM members WHERE household_id = ?').all(household.id).map(parseMember)
    : [];
  return {
    user,
    household: household
      ? {
          id: household.id,
          name: household.name,
          budgetPerMeal: household.budget_per_meal,
          mealsPerWeek: household.meals_per_week,
          cookTime: household.cook_time,
          members,
        }
      : null,
  };
}
