const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'joeys:token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/api/health'),

  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/me', { auth: true }),

  saveHousehold: (household) =>
    request('/api/household', { method: 'PUT', body: household, auth: true }),

  recipes: () => request('/api/recipes'),

  generateRecipes: (context) =>
    request('/api/generate/recipes', { method: 'POST', body: context }),
  generatePlan: (context) =>
    request('/api/generate/plan', { method: 'POST', body: context, auth: true }),

  getPlan: (weekStart) =>
    request(`/api/plan?weekStart=${weekStart}`, { auth: true }),
  savePlan: (weekStart, slots) =>
    request('/api/plan', { method: 'PUT', body: { weekStart, slots }, auth: true }),

  feedback: (recipeId, reaction, slotKey) =>
    request('/api/feedback', { method: 'POST', body: { recipeId, reaction, slotKey }, auth: true }),
};
