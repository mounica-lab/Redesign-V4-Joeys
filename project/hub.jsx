// Signed-in action hub: choose "plan a week" vs "single meal" (like landing but post-login)
// Plus a pending-plan state that hands off to calendar scheduling

const { useState: useStateHub } = React;

function ActionHubPage({ household, setRoute, setQueryState, setPendingPlan, setSelectedRecipe, setSignedIn }) {
  const [mode, setMode] = useState('plan'); // 'plan' | 'single'
  const [query, setQuery] = useState('');
  const [pantry, setPantry] = useState(['rice', 'eggs', 'spinach']);
  const [pantryInput, setPantryInput] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [activeTags, setActiveTags] = useState(new Set());
  const [numMeals, setNumMeals] = useState(household?.mealsPerWeek || 5);
  const [generating, setGenerating] = useState(false);

  const ALL_CHIPS = [...DIET_TAGS, ...LIFESTYLE_TAGS];
  const toggleTag = (k) => { const s = new Set(activeTags); s.has(k) ? s.delete(k) : s.add(k); setActiveTags(s); };
  const addPantry = () => { const v = pantryInput.trim().toLowerCase(); if (v && !pantry.includes(v)) setPantry([...pantry, v]); setPantryInput(''); };

  const firstName = household?.members?.[0]?.name || 'Priya';

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      if (mode === 'plan') {
        // Build N unscheduled recipes
        const rids = RECIPES.map(r => r.id);
        const pool = [];
        for (let i = 0; i < numMeals; i++) pool.push(rids[(i * 3 + 1) % rids.length]);
        setPendingPlan(pool);
        setRoute('reviewPlan');
      } else {
        setQueryState({ query, pantry, cuisine, tags: [...activeTags], household });
        setRoute('options');
      }
    }, 1200);
  };

  return (
    <div className="dotted-bg" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <TopNav route="hub" setRoute={setRoute} signedIn={true} setSignedIn={setSignedIn} />

      {/* Hero */}
      <section style={{ maxWidth: 980, margin: '32px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <div className="mono-eyebrow" style={{ marginBottom: 16 }}>Welcome back, {firstName} · {household?.members?.length || 4} at the table</div>
        <h1 className="hero-display">
          <span className="accent">What's cooking</span> today?
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 520, margin: '22px auto 0', lineHeight: 1.5 }}>
          Plan a whole week, or just figure out tonight. Joey's remembers {household?.members?.filter(m => m.role === 'Kid').map(m => m.name).join(' and ') || 'everyone'}'s preferences.
        </p>
      </section>

      {/* Mode toggle */}
      <section style={{ maxWidth: 820, margin: '36px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div className="mode-toggle" role="tablist" aria-label="Planning mode">
            <button role="tab" aria-selected={mode === 'plan'} className={mode === 'plan' ? 'on' : ''} onClick={() => setMode('plan')}>
              <Icon.Cal /> Plan the week
            </button>
            <button role="tab" aria-selected={mode === 'single'} className={mode === 'single' ? 'on' : ''} onClick={() => setMode('single')}>
              <Icon.Sparkle /> One meal
            </button>
          </div>
        </div>

        {/* Query card (same pattern as landing) */}
        <div className="query-card">
          <div className="query-card-inner">
            <input
              className="input"
              style={{ border: 0, padding: '6px 0 14px', fontSize: 16, background: 'transparent' }}
              placeholder={mode === 'plan' ? 'Make this week cozy and gluten-free...' : 'I want something quick for tonight...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={{ height: 1, background: 'var(--line)', margin: '0 -24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 220px', alignItems: 'start', gap: 20, paddingTop: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon.Search style={{ color: 'var(--muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>Also in my kitchen</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  {pantry.map(p => (
                    <button key={p} className="chip" onClick={() => setPantry(pantry.filter(x => x !== p))}>
                      {p} <Icon.X className="x" />
                    </button>
                  ))}
                  <input value={pantryInput} onChange={e => setPantryInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPantry()} onBlur={addPantry}
                    placeholder="add more..."
                    style={{ border: 0, outline: 'none', background: 'transparent', padding: '4px 6px', fontSize: 13, color: 'var(--muted)', width: 90, fontFamily: 'inherit' }} />
                </div>
              </div>
              <div className="v-divider" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Icon.Globe style={{ color: 'var(--muted)' }} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>Cuisine</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="input" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 12px' }} onClick={() => setCuisineOpen(!cuisineOpen)}>
                    <span style={{ color: cuisine === 'Any' ? 'var(--muted)' : 'var(--ink)' }}>{cuisine === 'Any' ? 'Pick a cuisine' : cuisine}</span>
                    <Icon.Chevron style={{ color: 'var(--muted)' }} />
                  </button>
                  {cuisineOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid var(--line-2)', borderRadius: 10, boxShadow: 'var(--shadow-md)', padding: 4, zIndex: 20, maxHeight: 240, overflow: 'auto' }}>
                      {CUISINES.map(c => (
                        <div key={c} onClick={() => { setCuisine(c); setCuisineOpen(false); }}
                          style={{ padding: '8px 10px', borderRadius: 6, fontSize: 13, cursor: 'pointer', background: c === cuisine ? 'var(--bg-soft)' : 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-soft)'}
                          onMouseLeave={e => e.currentTarget.style.background = c === cuisine ? 'var(--bg-soft)' : 'transparent'}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan-only: how many meals */}
        {mode === 'plan' && (
          <div className="card" style={{ marginTop: 14, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center' }}>
                <Icon.Cal />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>How many meals this week?</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>
                  Breakfasts, lunches, or dinners, schedule them after
                </div>
              </div>
            </div>
            <Counter value={numMeals} setValue={setNumMeals} min={1} max={21} />
          </div>
        )}

        {/* Who-it's-for chip row (household memory compact) */}
        {household?.members?.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '0 4px' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Remembering</span>
            {household.members.map(m => (
              <div key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 10px 4px 4px' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, background: m.role === 'Kid' ? 'var(--butter-soft)' : 'var(--sage-soft)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: m.role === 'Kid' ? 'oklch(0.4 0.12 80)' : 'var(--sage-ink)' }}>{m.name?.[0]}</div>
                <span style={{ fontSize: 12 }}>{m.name}</span>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ height: 28, fontSize: 12, padding: '0 10px' }} onClick={() => setRoute('onboarding')}>Edit</button>
          </div>
        )}
      </section>

      {/* Tag picker */}
      <section style={{ maxWidth: 820, margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Add extra context</div>
        <div className="tagpill-row">
          {ALL_CHIPS.map(t => (
            <button key={t.k}
              className={`tagpill tone-${t.tone || 'sage'} ${activeTags.has(t.k) ? 'active' : ''}`}
              aria-label={t.label} onClick={() => toggleTag(t.k)}>
              {(() => { const I = Icon[t.icon] || Icon.Dot; return <I width="18" height="18" />; })()}
              <span className="tagpill-label">{t.label}</span>
            </button>
          ))}
        </div>
        {activeTags.size > 0 && (
          <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 12 }}>
            {[...activeTags].map(k => {
              const t = ALL_CHIPS.find(x => x.k === k);
              return <span key={k} className="chip active" onClick={() => toggleTag(k)}>{t?.label} <Icon.X className="x" /></span>;
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', marginTop: 36 }}>
        <button className="btn btn-primary btn-lg" onClick={generate} disabled={generating} style={{ minWidth: 260 }}>
          {generating
            ? <><span className="dots"><span/><span/><span/></span>&nbsp; Generating...</>
            : (mode === 'plan' ? <>Generate {numMeals}-meal plan →</> : <>Find me a meal →</>)}
        </button>
        <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 14 }}>
          {mode === 'plan' ? "You'll schedule them next · Drag into the calendar" : 'Pick one · Start cooking'}
        </div>
        <div style={{ marginTop: 18 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setRoute('myMeals')}>
            <Icon.Cal /> Or just open this week's calendar
          </button>
        </div>
      </section>
    </div>
  );
}

// Review / schedule page, shows generated meals as unscheduled cards, user drags them into the calendar
function ReviewPlanPage({ pendingPlan, household, setRoute, setSelectedRecipe, setSignedIn, plan, setPlan }) {
  const [pending, setPending] = useState(pendingPlan || []);
  const [hoverId, setHoverId] = useState(null);

  const meals = pending.map(id => RECIPES.find(r => r.id === id)).filter(Boolean);
  const scheduledCount = Object.values(plan).filter(Boolean).length;
  const scheduleAuto = () => {
    // Place remaining into dinners, skipping filled
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

        {/* Progress step */}
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
                color: '#fff', display: 'grid', placeItems: 'center'
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
            <div key={r.id}
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
              }}>
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

Object.assign(window, { ActionHubPage, ReviewPlanPage });
