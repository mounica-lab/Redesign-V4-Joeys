import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { RECIPES } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';
import { FoodSwatch } from '../components/FoodSwatch.jsx';
import { Counter } from '../components/Counter.jsx';

export function RecipePage({ recipe, setRoute, signedIn }) {
  const r = recipe || RECIPES[0];
  const [servings, setServings] = useState(r.servings);
  const [checked, setChecked] = useState(new Set());
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const toggleCheck = (i) => {
    const s = new Set(checked);
    s.has(i) ? s.delete(i) : s.add(i);
    setChecked(s);
  };

  const scale = servings / r.servings;
  const scaleQty = (q) => {
    const m = q.match(/^([\d./]+)\s*(.*)$/);
    if (!m) return q;
    const n = m[1].includes('/') ? m[1].split('/').reduce((a, b) => a / b) : parseFloat(m[1]);
    if (!isFinite(n)) return q;
    const out = +(n * scale).toFixed(2);
    return `${out} ${m[2]}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
      <TopNav route="recipe" setRoute={setRoute} signedIn={signedIn} setSignedIn={() => {}} />

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute(signedIn ? 'myMeals' : 'options')} style={{ paddingLeft: 8, marginTop: 8 }}>
          <Icon.Back /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, marginTop: 20 }}>
          {/* Left: hero + meta */}
          <div>
            <FoodSwatch tone={r.tone} label={r.cuisine} ratio="4/5" style={{ borderRadius: 22 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 18, border: '1px solid var(--line)', borderRadius: 14, background: '#fff', padding: 18 }}>
              {[
                { label: 'Time', value: `${r.time}m`, icon: Icon.Clock },
                { label: 'Calories', value: r.nutrition.cal, icon: Icon.Flame },
                { label: 'Protein', value: r.nutrition.protein, icon: Icon.Dot },
                { label: 'Servings', value: r.servings, icon: Icon.Users },
              ].map((s, i) => { const I = s.icon; return (
                <div key={s.label} style={{ textAlign: 'center', borderLeft: i === 0 ? 0 : '1px solid var(--line)', padding: '0 8px' }}>
                  <I style={{ color: 'var(--muted)' }} />
                  <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>{s.value}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ); })}
            </div>
          </div>

          {/* Right: text */}
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {r.tags.map(t => <span key={t} className="badge sage">{t}</span>)}
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 8px', lineHeight: 1.02 }}>{r.name}</h1>
            <p style={{ fontSize: 18, color: 'var(--ink-2)', margin: '0 0 20px', lineHeight: 1.5 }}>{r.subtitle}</p>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6 }}>{r.summary}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-primary">{signedIn ? <>Add to this week</> : <>Start cooking</>}</button>
              <button className="btn btn-outline" onClick={() => setSaved(!saved)}>
                {saved ? <><Icon.HeartFilled style={{ color: 'var(--coral)' }} /> Saved</> : <><Icon.Heart /> Save</>}
              </button>
              <button className="btn btn-outline"><Icon.Cart /> Add to grocery list</button>
              <button className="btn btn-outline"><Icon.Swap /> Swap</button>
            </div>

            {/* Servings */}
            <div className="card" style={{ marginTop: 24, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Cooking for</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted)' }}>Scales quantities</div>
              </div>
              <Counter value={servings} setValue={setServings} min={1} max={12} />
            </div>

            {/* Ingredients */}
            <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 36, marginBottom: 12 }}>
              Ingredients · <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 14 }}>{r.ingredients.filter(i => i.have).length} in your kitchen</span>
            </h3>
            <div>
              {r.ingredients.map((ing, i) => {
                const c = checked.has(i);
                return (
                  <div key={i} onClick={() => toggleCheck(i)}
                    style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto auto', gap: 12, alignItems: 'center', padding: '10px 2px', borderBottom: '1px solid var(--line)', cursor: 'pointer', opacity: c ? 0.5 : 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${c ? 'var(--sage)' : 'var(--line-2)'}`, background: c ? 'var(--sage)' : 'transparent', display: 'grid', placeItems: 'center' }}>
                      {c && <Icon.Check style={{ color: '#fff' }} />}
                    </div>
                    <div style={{ fontSize: 14, textDecoration: c ? 'line-through' : 'none' }}>{ing.name}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{scaleQty(ing.qty)}</div>
                    {ing.have ? <span className="badge sage">pantry</span> : <span className="badge">buy</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Cook it</h3>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)' }}>{r.steps.length} STEPS · {r.time} MIN</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${r.steps.length}, 1fr)`, gap: 2, marginTop: 14 }}>
            {r.steps.map((_, i) => (
              <div key={i} onClick={() => setStep(i)}
                style={{ height: 3, background: i <= step ? 'var(--ink)' : 'var(--line-2)', cursor: 'pointer', borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, marginTop: 24 }}>
            <div>
              {r.steps.map((s, i) => (
                <div key={i} onClick={() => setStep(i)}
                  style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer', display: 'flex', gap: 14, opacity: i === step ? 1 : 0.55 }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', width: 20 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: 14, fontWeight: i === step ? 600 : 400 }}>{s.t}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--sage)', textTransform: 'uppercase' }}>Step {step + 1} of {r.steps.length}</div>
              <h4 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '8px 0 14px' }}>{r.steps[step].t}</h4>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)' }}>{r.steps[step].d}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button className="btn btn-outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><Icon.Back /> Prev</button>
                <button className="btn btn-primary" disabled={step === r.steps.length - 1} onClick={() => setStep(Math.min(r.steps.length - 1, step + 1))}>Next step →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="card" style={{ marginTop: 40, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>How was it?</h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>Your feedback trains Joey's on your family's taste.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="icon-circle" style={{ width: 48, height: 48 }}><Icon.Frown style={{ color: 'var(--muted)' }} /></button>
            <button className="icon-circle" style={{ width: 48, height: 48 }}><Icon.Heart style={{ color: 'var(--coral)' }} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
