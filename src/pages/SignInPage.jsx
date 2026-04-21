import { useState } from 'react';
import { TopNav } from '../components/TopNav.jsx';
import { api, setToken } from '../api.js';

export function SignInPage({ setRoute, setSignedIn, setHouseholdData }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password required.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { token } = await api.register(email, password);
        setToken(token);
        setSignedIn(true);
        setRoute('onboarding');
      } else {
        const { token, household } = await api.login(email, password);
        setToken(token);
        setSignedIn(true);
        if (household) {
          setHouseholdData({
            members: household.members || [],
            budgetPerMeal: household.budgetPerMeal,
            mealsPerWeek: household.mealsPerWeek,
            cookTime: household.cookTime,
            name: household.name,
          });
          setRoute('landing');
        } else {
          setRoute('onboarding');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dotted-bg" style={{ minHeight: '100vh' }}>
      <TopNav route="signIn" setRoute={setRoute} signedIn={false} setSignedIn={setSignedIn} />
      <section style={{ maxWidth: 460, margin: '60px auto 0', padding: '0 24px' }}>
        <div className="card" style={{ padding: 36 }}>
          <div className="mono-eyebrow" style={{ marginBottom: 14 }}>Joey's · household memory</div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 10px' }}>
            {mode === 'signin' ? 'Welcome back.' : 'Start your family memory.'}
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 14, margin: '0 0 24px' }}>
            {mode === 'signin' ? 'Pick up where you left off.' : "We'll remember what your family likes so you don't have to."}
          </p>

          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Email</label>
            <input
              className="input"
              placeholder="you@house.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginTop: 8 }}>Password</label>
            <input
              className="input"
              type="password"
              placeholder={mode === 'signup' ? '6+ characters' : ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          {error && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--coral-soft)', color: 'oklch(0.45 0.18 20)', borderRadius: 8, fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 20 }}
            disabled={loading}
            onClick={submit}
          >
            {loading ? 'One sec...' : (mode === 'signin' ? 'Sign in' : 'Create account →')}
          </button>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
            {mode === 'signin'
              ? <>New here? <a onClick={() => { setMode('signup'); setError(''); }} style={{ color: 'var(--sage)', cursor: 'pointer', fontWeight: 500 }}>Create account</a></>
              : <>Already have one? <a onClick={() => { setMode('signin'); setError(''); }} style={{ color: 'var(--sage)', cursor: 'pointer', fontWeight: 500 }}>Sign in</a></>}
          </div>
        </div>
      </section>
    </div>
  );
}
