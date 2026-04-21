import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { RECIPES, DEFAULT_PLAN, TONE_COLOR } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';
import { WeekCalendar } from '../calendar/WeekCalendar.jsx';
import { SwapPanel } from '../calendar/SwapPanel.jsx';

export function MyMealsPage({ household, setRoute, setSelectedRecipe, setSignedIn, plan: planProp, setPlan: setPlanProp, recipes: recipesProp }) {
  const pool = recipesProp && recipesProp.length ? recipesProp : RECIPES;
  const [planLocal, setPlanLocal] = useState(DEFAULT_PLAN());
  const plan = planProp || planLocal;
  const setPlan = setPlanProp || setPlanLocal;
  const [feedback, setFeedback] = useState({ '0-dinner': 'love', '4-dinner': 'sad' });
  const [generating, setGenerating] = useState(false);
  const [swapSlot, setSwapSlot] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(''), 2200); };
  const setup = household && household.members?.length >= 2;

  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const rids = RECIPES.map(r => r.id);
      const next = {};
      for (let d = 0; d < 7; d++) {
        next[`${d}-dinner`] = rids[(d + 2) % rids.length];
        if (d < 3) next[`${d}-lunch`] = rids[(d + 5) % rids.length];
      }
      setPlan(next);
      setFeedback({});
      setGenerating(false);
      showToast('Plan regenerated from your family memory');
    }, 1100);
  };

  const planned = Object.values(plan).filter(Boolean).length;
  const loved = Object.values(feedback).filter(v => v === 'love').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      <TopNav route="myMeals" setRoute={setRoute} signedIn={true} setSignedIn={setSignedIn} householdData={household} />

      <section style={{ maxWidth: 1340, margin: '12px auto 0', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
          <div>
            <div className="mono-eyebrow" style={{ marginBottom: 8 }}>Week of Apr 13-19 · {household?.name || "Priya's house"}</div>
            <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.02 }}>
              This week, <span style={{ color: 'var(--sage)' }}>figured out.</span>
            </h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 14, color: 'var(--ink-2)' }}>
              <span><b>{planned}</b> meals planned</span>
              <span><b>{household?.members?.length || 4}</b> eaters</span>
              <span><b>{loved}</b> family favorites</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={() => setRoute('landing')}><Icon.Sparkle /> New plan</button>
            <button className="btn btn-outline"><Icon.Cart /> Grocery list</button>
            <button className="btn btn-primary" onClick={regenerate} disabled={generating}>
              {generating ? <><span className="dots"><span /><span /><span /></span> Generating</> : <><Icon.Sparkle /> Regenerate</>}
            </button>
          </div>
        </div>

        {/* Household strip */}
        {setup && (
          <div className="card" style={{ padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>Cooking for</div>
            {household.members.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: m.role === 'Kid' ? 'var(--butter-soft)' : 'var(--sage-soft)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, color: m.role === 'Kid' ? 'oklch(0.4 0.12 80)' : 'var(--sage-ink)' }}>
                  {m.name?.[0] || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>
                    {m.avoids?.length ? `avoids ${m.avoids.slice(0, 2).join(', ')}` : m.role}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRoute('onboarding')}><Icon.Edit /> Edit household</button>
            </div>
          </div>
        )}

        {/* Drag rail */}
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', flexShrink: 0 }}>Drag to schedule</div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1 }}>
            {RECIPES.slice(4).map(r => (
              <div
                key={r.id}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', `__new|${r.id}`); e.dataTransfer.effectAllowed = 'copy'; }}
                onClick={() => { setSelectedRecipe(r); setRoute('recipe'); }}
                style={{
                  flexShrink: 0,
                  padding: '6px 10px 6px 8px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderLeft: `3px solid ${TONE_COLOR[r.tone]}`,
                  borderRadius: 6,
                  cursor: 'grab',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12,
                }}
              >
                <Icon.Drag style={{ color: 'var(--muted)' }} />
                <span style={{ fontWeight: 500 }}>{r.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{r.time}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <WeekCalendar
          plan={plan}
          setPlan={setPlan}
          recipes={pool}
          onOpen={(r) => { setSelectedRecipe(r); setRoute('recipe'); }}
          feedback={feedback}
          setFeedback={setFeedback}
          onSwap={setSwapSlot}
        />

        {/* Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 18 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="mono-eyebrow" style={{ marginBottom: 6 }}>Grocery estimate</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>$94<span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 400 }}>.20</span></div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>For {planned} meals · {household?.members?.length || 4} eaters</div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="mono-eyebrow" style={{ marginBottom: 6 }}>Total cook time</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>3h 42m</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>Avg {Math.round(222 / Math.max(planned, 1))}m per meal</div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div className="mono-eyebrow" style={{ marginBottom: 6 }}>Family fit</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--sage)' }}>92%</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>Based on Maya's & Leo's memory</div>
          </div>
        </div>
      </section>

      {swapSlot && (
        <SwapPanel slotKey={swapSlot} plan={plan} setPlan={setPlan} recipes={pool} onClose={() => setSwapSlot(null)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
