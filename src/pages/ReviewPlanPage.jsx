import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { RECIPES, TONE_COLOR } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';

export function ReviewPlanPage({ pendingPlan, household, setRoute, setSelectedRecipe, setSignedIn, plan, setPlan, recipes }) {
  const [pending, setPending] = useState(
    (pendingPlan || []).map(item => typeof item === 'string' ? item : item.recipeId).filter(Boolean)
  );
  const [hoverId, setHoverId] = useState(null);
  const pool = recipes && recipes.length ? recipes : RECIPES;

  const meals = pending.map(id => pool.find(r => r.id === id)).filter(Boolean);

  const scheduleAuto = () => {
    const next = { ...plan };
    let di = 0;
    const remaining = [...pending];
    while (remaining.length && di < 7) {
      const k = `${di}-dinner`;
      if (!next[k]) { next[k] = remaining.shift(); }
      di++;
    }
    setPlan(next);
    setPending(remaining);
    setTimeout(() => setRoute('myMeals'), 400);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      <TopNav route="reviewPlan" setRoute={setRoute} signedIn={true} setSignedIn={setSignedIn} />

      <section style={{ maxWidth: 1100, margin: '12px auto 0', padding: '0 24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute('landing')} style={{ paddingLeft: 8 }}>
          <Icon.Back /> Back
        </button>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', margin: '20px 0 32px' }}>
          {[
            { t: 'Described', done: true },
            { t: 'Generated', done: true, current: false },
            { t: 'Schedule', done: false, current: true },
          ].map((s, i) => (
            <div key={s.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: s.done ? 'var(--sage)' : (s.current ? '#fff' : 'var(--bg-soft)'),
                border: s.current ? '2px solid var(--sage)' : '2px solid transparent',
                color: '#fff', display: 'grid', placeItems: 'center',
              }}>
                {s.done ? <Icon.Check /> : <span className="mono" style={{ fontSize: 11, color: 'var(--sage)' }}>{i + 1}</span>}
              </div>
              <div style={{ fontSize: 13, fontWeight: s.current ? 600 : 400, color: s.current ? 'var(--ink)' : 'var(--ink-2)' }}>{s.t}</div>
              {i < 2 && <div style={{ width: 40, height: 1, background: 'var(--line-2)', marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="mono-eyebrow" style={{ marginBottom: 8 }}>{meals.length} meals ready</div>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.05 }}>
            You've planned <span style={{ color: 'var(--sage)' }}>{meals.length} meals.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', margin: '10px auto 0', maxWidth: 540 }}>
            Now drag them onto the week, or let Joey's auto-place them for you.
          </p>
        </div>

        {/* Meals list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
          {meals.map(r => (
            <div
              key={r.id}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', `__new|${r.id}`); e.dataTransfer.effectAllowed = 'copy'; }}
              onClick={() => { setSelectedRecipe(r); setRoute('recipe'); }}
              onMouseEnter={() => setHoverId(r.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderLeft: `3px solid ${TONE_COLOR[r.tone]}`,
                borderRadius: 10,
                padding: '12px 14px',
                cursor: 'grab',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                transition: 'all 140ms',
                boxShadow: hoverId === r.id ? 'var(--shadow-md)' : 'none',
                transform: hoverId === r.id ? 'translateY(-1px)' : 'none',
              }}
            >
              <Icon.Drag style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subtitle}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 4 }}>
                  {r.time}M · {r.cal} CAL · {r.cuisine.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Ready to schedule?</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Drop them into the calendar week, or auto-place.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={() => setRoute('landing')}>
              <Icon.Swap /> Regenerate
            </button>
            <button className="btn btn-outline" onClick={scheduleAuto}>
              <Icon.Sparkle /> Auto-schedule
            </button>
            <button className="btn btn-primary" onClick={() => setRoute('myMeals')}>
              <Icon.Cal /> Open calendar →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
