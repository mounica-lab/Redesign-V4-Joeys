import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { DIET_TAGS } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';
import { Counter } from '../components/Counter.jsx';
import { TagInput } from '../components/TagInput.jsx';
import { api, getToken } from '../api.js';

export function OnboardingPage({ setRoute, setHouseholdData, setSignedIn }) {
  const [step, setStep] = useState(0);
  const [household, setHousehold] = useState({
    name: "Priya's house",
    size: 4,
    members: [
      { id: 'h1', name: 'Priya', role: 'Adult', age: 34, loves: [], avoids: [], diet: [] },
    ],
    budgetPerMeal: 22,
    mealsPerWeek: 5,
    cookTime: 35,
  });
  const [currentMember, setCurrentMember] = useState(0);

  const steps = ['Household', 'Members', 'Each member', 'Constraints', 'Done'];

  const addMember = () => {
    const n = household.members.length + 1;
    setHousehold({ ...household, members: [...household.members, { id: 'h' + n, name: '', role: 'Adult', age: 30, loves: [], avoids: [], diet: [] }] });
  };

  const updateMember = (idx, patch) => {
    const m = [...household.members];
    m[idx] = { ...m[idx], ...patch };
    setHousehold({ ...household, members: m });
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const finish = async () => {
    setSaveError('');
    if (getToken()) {
      setSaving(true);
      try {
        const snapshot = await api.saveHousehold(household);
        setHouseholdData({
          members: snapshot.household?.members || household.members,
          budgetPerMeal: snapshot.household?.budgetPerMeal ?? household.budgetPerMeal,
          mealsPerWeek: snapshot.household?.mealsPerWeek ?? household.mealsPerWeek,
          cookTime: snapshot.household?.cookTime ?? household.cookTime,
          name: snapshot.household?.name || household.name,
        });
      } catch (err) {
        setSaveError(err.message);
        setSaving(false);
        return;
      }
      setSaving(false);
    } else {
      setHouseholdData(household);
    }
    setSignedIn(true);
    setRoute('landing');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav route="onboarding" setRoute={setRoute} signedIn={true} setSignedIn={setSignedIn} />

      <section style={{ maxWidth: 720, margin: '24px auto 0', padding: '0 24px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 30 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, background: i <= step ? 'var(--sage)' : 'var(--line-2)', borderRadius: 2, transition: 'background 200ms' }} />
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: i <= step ? 'var(--sage-ink)' : 'var(--muted)', marginTop: 6 }}>
                {String(i + 1).padStart(2, '0')} {s}
              </div>
            </div>
          ))}
        </div>

        <div className="card fade-up" key={step} style={{ padding: 36 }}>
          {step === 0 && (
            <>
              <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 10px' }}>Name your household</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, margin: '0 0 24px' }}>We'll remember everyone who eats at this table.</p>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>Household name</label>
              <input className="input" style={{ marginTop: 6, fontSize: 18 }}
                value={household.name} onChange={e => setHousehold({ ...household, name: e.target.value })} />
              <label style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20, display: 'block' }}>How many people eat here?</label>
              <div style={{ marginTop: 10 }}>
                <Counter value={household.size} setValue={(v) => setHousehold({ ...household, size: v })} min={1} max={10} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 10px' }}>Add everyone</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, margin: '0 0 24px' }}>Quick pass, we'll detail each one next.</p>
              {household.members.map((m, i) => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <input className="input" placeholder="Name" value={m.name} onChange={e => updateMember(i, { name: e.target.value })} />
                  <select className="input" value={m.role} onChange={e => updateMember(i, { role: e.target.value })}>
                    <option>Adult</option><option>Teen</option><option>Kid</option><option>Toddler</option>
                  </select>
                  <input className="input" type="number" value={m.age} onChange={e => updateMember(i, { age: +e.target.value })} />
                  <button className="btn btn-ghost btn-sm" onClick={() => setHousehold({ ...household, members: household.members.filter((_, j) => j !== i) })}>
                    <Icon.X />
                  </button>
                </div>
              ))}
              <button className="btn btn-outline" onClick={addMember}><Icon.Plus /> Add member</button>
            </>
          )}

          {step === 2 && household.members.length > 0 && (() => {
            const m = household.members[currentMember];
            if (!m) return null;
            const toggleIn = (field, val) => {
              const arr = m[field] || [];
              updateMember(currentMember, { [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
            };
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="mono-eyebrow" style={{ marginBottom: 6 }}>Member {currentMember + 1} of {household.members.length}</div>
                    <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
                      What does <span style={{ color: 'var(--sage)' }}>{m.name || 'this person'}</span> eat?
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" disabled={currentMember === 0} onClick={() => setCurrentMember(currentMember - 1)}><Icon.Back /></button>
                    <button className="btn btn-outline btn-sm" disabled={currentMember === household.members.length - 1} onClick={() => setCurrentMember(currentMember + 1)}>Next →</button>
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--sage-ink)' }}>Loves</label>
                  <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', margin: '2px 0 10px' }}>Foods that make them happy</p>
                  <TagInput tags={m.loves} setTags={(arr) => updateMember(currentMember, { loves: arr })} placeholder="add a food they love..." color="sage" />
                </div>

                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--coral)' }}>Avoids</label>
                  <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', margin: '2px 0 10px' }}>Strong dislikes, not allergies</p>
                  <TagInput tags={m.avoids} setTags={(arr) => updateMember(currentMember, { avoids: arr })} placeholder="add something to avoid..." color="coral" />
                </div>

                <div style={{ marginTop: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500 }}>Dietary needs</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {DIET_TAGS.map(t => (
                      <button key={t.k} className={`chip ${m.diet?.includes(t.k) ? 'active' : ''}`}
                        onClick={() => toggleIn('diet', t.k)}>{t.label}</button>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}

          {step === 3 && (
            <>
              <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 10px' }}>Household constraints</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, margin: '0 0 28px' }}>How much time and money are we working with?</p>

              {[
                { key: 'mealsPerWeek', label: 'Meals per week', icon: Icon.Cal, min: 1, max: 21 },
                { key: 'budgetPerMeal', label: 'Budget per meal (per person)', icon: Icon.Dollar, min: 5, max: 100, prefix: '$' },
                { key: 'cookTime', label: 'Max cook time', icon: Icon.Clock, min: 10, max: 120, suffix: ' min' },
              ].map(f => { const I = f.icon; return (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
                      <I />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{f.label}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {f.prefix && <span style={{ color: 'var(--muted)' }}>{f.prefix}</span>}
                    <Counter value={household[f.key]} setValue={(v) => setHousehold({ ...household, [f.key]: v })} min={f.min} max={f.max} suffix={f.suffix} />
                  </div>
                </div>
              ); })}
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="mono-eyebrow" style={{ marginBottom: 12 }}>Family memory created</div>
              <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
                <span style={{ color: 'var(--sage)' }}>{household.name}</span>, saved.
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 480, margin: '0 auto 28px' }}>
                We'll remember {household.members.length} {household.members.length === 1 ? 'person' : 'people'}, their preferences, and your {household.mealsPerWeek}-meal weekly rhythm.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {household.members.map(m => (
                  <div key={m.id} style={{ padding: '10px 16px', borderRadius: 999, border: '1px solid var(--line-2)', fontSize: 13 }}>
                    <b>{m.name || 'Unnamed'}</b> <span style={{ color: 'var(--muted)' }}>· {m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, borderTop: '1px solid var(--line)', paddingTop: 18 }}>
            <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><Icon.Back /> Back</button>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>{step + 1} / {steps.length}</div>
            {step < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={() => {
                if (step === 1) { setCurrentMember(0); setStep(2); return; }
                if (step === 2 && currentMember < household.members.length - 1) { setCurrentMember(currentMember + 1); return; }
                setStep(step + 1);
              }}>
                Continue →
              </button>
            ) : (
              <button className="btn btn-primary" disabled={saving} onClick={finish}>
                {saving ? 'Saving...' : 'Take me to Joey\'s →'}
              </button>
            )}
          </div>
          {saveError && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--coral-soft)', color: 'oklch(0.45 0.18 20)', borderRadius: 8, fontSize: 13 }}>
              {saveError}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
