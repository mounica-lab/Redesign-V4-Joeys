// Landing / anonymous home page

const { useState, useMemo, useRef, useEffect } = React;

function TopNav({ route, setRoute, signedIn, setSignedIn }) {
  return (
    <header className="topnav">
      <div className="wordmark" style={{ cursor: 'pointer' }} onClick={() => setRoute('landing')} role="link" aria-label="Joey's, home">
        Joey<em>'s</em>
      </div>
      <nav className="nav-links">
        <a className={route === 'myMeals' ? 'active' : ''} onClick={() => signedIn && setRoute('myMeals')}>Plans</a>
        <a className={route === 'recipes' ? 'active' : ''} onClick={() => setRoute(signedIn ? 'myMeals' : 'landing')}>Recipes</a>
        <a>Grocery list</a>
        {signedIn ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="badge sage" style={{ fontSize: 10 }}>Household · Priya</div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSignedIn(false); setRoute('landing'); }}>Sign out</button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setRoute('signIn')}>Sign in</button>
        )}
      </nav>
    </header>
  );
}

function IconCircle({ name, active, onClick }) {
  const Cmp = Icon[name] || Icon.Dot;
  return (
    <button className={`icon-circle ${active ? 'active' : ''}`} onClick={onClick} title={name}>
      <Cmp style={{ color: active ? 'oklch(0.45 0.14 165)' : 'var(--muted)' }} />
    </button>
  );
}

function Counter({ value, setValue, min = 0, max = 20, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
      <button className="icon-circle" style={{ width: 32, height: 32 }} onClick={() => setValue(Math.max(min, value - 1))}>−</button>
      <div style={{ minWidth: 48, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>{value}{suffix}</div>
      <button className="icon-circle" style={{ width: 32, height: 32 }} onClick={() => setValue(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function OneMealPrefs({ hasSavedFamily, householdData, useFamilyMemory, setUseFamilyMemory, signedIn, onSignIn, onManage }) {
  const members = householdData?.members || [];
  // Aggregate loves/avoids/diet across members when family memory is on
  const applied = React.useMemo(() => {
    const loves = new Set(), avoids = new Set(), diets = new Set();
    members.forEach(m => {
      (m.loves || []).forEach(x => loves.add(x));
      (m.avoids || []).forEach(x => avoids.add(x));
      (m.diet || []).forEach(x => diets.add(x));
    });
    return {
      loves: [...loves].slice(0, 4),
      avoids: [...avoids].slice(0, 4),
      diets: [...diets],
    };
  }, [members]);

  // Case A: signed-in with saved family — radio cards (Google-style: "pick a path")
  if (hasSavedFamily) {
    const memberNames = members.map(m => m.name).join(', ');
    return (
      <div className="card" style={{ padding: '14px 18px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Who's this meal for?</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <PrefRadio
            selected={useFamilyMemory}
            onClick={() => setUseFamilyMemory(true)}
            icon={<Icon.Home />}
            title="My whole family"
            desc={`${members.length} ${members.length === 1 ? 'person' : 'people'}, ${memberNames}. We'll use their saved loves, avoids, and diets.`}
          />
          <PrefRadio
            selected={!useFamilyMemory}
            onClick={() => setUseFamilyMemory(false)}
            icon={<Icon.Sparkle />}
            title="Just this meal"
            desc="Skip saved preferences. Pick exactly what you want with the tags below, nothing gets saved to your family."
          />
        </div>

        {useFamilyMemory && (applied.loves.length > 0 || applied.avoids.length > 0 || applied.diets.length > 0) && (
          <div className="fade-up" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', display: 'grid', gap: 8 }}>
            {applied.diets.length > 0 && (
              <PrefRow label="Diet" tone="sage" items={applied.diets} />
            )}
            {applied.loves.length > 0 && (
              <PrefRow label="Loves" tone="sage" items={applied.loves} icon={Icon.Heart} />
            )}
            {applied.avoids.length > 0 && (
              <PrefRow label="Avoiding" tone="warn" items={applied.avoids} strike />
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <button onClick={onManage} style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>Manage family →</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Case B: anon or signed-in with no saved family — keep it light
  return (
    <div className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center', color: 'var(--muted)', flexShrink: 0 }}>
          <Icon.Sparkle />
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>
          Cooking just for this meal. Pick preferences with the tags below.
        </div>
      </div>
      <button
        onClick={signedIn ? onManage : onSignIn}
        style={{ background: 'none', border: 0, color: 'var(--sage)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {signedIn ? 'Set up family memory →' : 'Sign in to use family preferences →'}
      </button>
    </div>
  );
}

function PrefRow({ label, items, tone = 'sage', icon: I, strike = false }) {
  const bg = tone === 'warn' ? 'oklch(0.96 0.03 60)' : 'var(--sage-soft, oklch(0.96 0.04 160))';
  const border = tone === 'warn' ? 'oklch(0.85 0.06 60)' : 'oklch(0.85 0.06 160)';
  const color = tone === 'warn' ? 'oklch(0.45 0.12 50)' : 'var(--sage-ink)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', minWidth: 70 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {items.map((x, i) => (
          <span key={i} className="chip" style={{ background: bg, borderColor: border, color, fontSize: 11, padding: '2px 9px', textDecoration: strike ? 'line-through' : 'none', textDecorationColor: 'oklch(0.7 0.1 50 / 0.5)' }}>
            {I && <I width="12" height="12" />}
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

function HouseholdInline({ expanded, setExpanded, household, setHousehold, onSetup, signedIn, householdData }) {
  const members = householdData?.members || [];
  const hasFamily = signedIn && members.length > 0;

  return (
    <div className={`card household-widget ${hasFamily ? 'is-signed' : ''}`} style={{ padding: expanded ? '16px 22px 18px' : '16px 22px', transition: 'padding 180ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: hasFamily ? 'var(--sage-soft, oklch(0.95 0.04 160))' : 'var(--bg-soft)', display: 'grid', placeItems: 'center', color: hasFamily ? 'var(--sage-ink)' : 'var(--ink-2)', flexShrink: 0 }}>
            <Icon.Home />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Your family meal memory</div>
            {!expanded && (
              hasFamily
                ? <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    Remembering {members.length} {members.length === 1 ? 'person' : 'people'} · {members.map(m => m.name).join(', ')}
                  </div>
                : <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                    {signedIn ? 'tap to set up' : 'optional, sign in to save'}
                  </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {!expanded && !hasFamily && (
            <span style={{ color: 'var(--sage)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
              {signedIn ? 'Add your family →' : 'Remember my family →'}
            </span>
          )}
          {!expanded && hasFamily && (
            <span className="chip active" style={{ fontSize: 11, padding: '3px 10px' }}><Icon.Check /> saved</span>
          )}
          <Icon.Chevron style={{ color: 'var(--muted)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
        </div>
      </div>

      {expanded && (
        <div className="fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            {[
              { key: 'family', label: 'Family of', icon: Icon.Users, min: 1, max: 10 },
              { key: 'budget', label: 'Cost per meal', icon: Icon.Dollar, prefix: '$', min: 5, max: 100 },
              { key: 'meals', label: 'No. of meals', icon: Icon.Cal, min: 1, max: 21 },
              { key: 'cook', label: 'Cook in', icon: Icon.Clock, suffix: ' min', min: 10, max: 120 },
            ].map((f, i) => {
              const I = f.icon;
              return (
                <div key={f.key} style={{ padding: '0 16px', textAlign: 'center', borderLeft: i === 0 ? 0 : '1px solid var(--line)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-2)', marginBottom: 10 }}>
                    <I style={{ color: 'var(--muted)' }} />
                    <span>{f.label}</span>
                  </div>
                  <Counter
                    value={household[f.key]}
                    setValue={(v) => setHousehold({ ...household, [f.key]: v })}
                    min={f.min} max={f.max}
                    suffix={f.key === 'budget' ? '' : f.suffix || ''}
                  />
                  {f.key === 'budget' && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: -4 }}>per person</div>}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            {hasFamily ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>Remembering:</span>
                  {members.map(m => (
                    <span key={m.id} className="chip" style={{ background: 'var(--sage-soft, oklch(0.96 0.04 160))', borderColor: 'oklch(0.85 0.06 160)', color: 'var(--sage-ink)', fontWeight: 500 }}>
                      {m.name}
                      {m.diet && m.diet.length > 0 && <span style={{ opacity: 0.6, marginLeft: 4 }}>· {m.diet[0]}</span>}
                    </span>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--sage)', color: 'var(--sage-ink)' }} onClick={onSetup}>Manage →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', maxWidth: 520, lineHeight: 1.5 }}>
                  {signedIn ? (
                    <>Tell Joey's who's eating. We'll remember their loves, dislikes, and allergies so every plan just fits.</>
                  ) : (
                    <>Want Joey's to remember your family? <span style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }} onClick={onSetup}>Sign in to save</span> likes, dislikes, and allergies for everyone.</>
                  )}
                </div>
                <button className="btn btn-primary btn-sm" onClick={onSetup}>{signedIn ? 'Set up family →' : 'Sign up, it\'s free →'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LandingPage({ setRoute, signedIn, setSignedIn, setQueryState, householdData, setHouseholdData, setPendingPlan }) {
  const [query, setQuery] = useState('');
  const [pantry, setPantry] = useState(['rice', 'eggs', 'spinach']);
  const [pantryInput, setPantryInput] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [activeTags, setActiveTags] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const [household, setHousehold] = useState({ family: 2, budget: 22, meals: 5, cook: 35 });
  const [generating, setGenerating] = useState(false);
  // Default: signed-in users land on "week" planning; anon users on "one meal"
  const [mode, setMode] = useState(signedIn ? 'week' : 'one');
  const [showWall, setShowWall] = useState(false);
  const [wallReason, setWallReason] = useState('plan'); // 'plan' | 'family'
  // One-meal mode: whether to apply saved family preferences to this single meal
  const hasSavedFamily = signedIn && (householdData?.members || []).length > 0;
  const [useFamilyMemory, setUseFamilyMemory] = useState(hasSavedFamily);
  useEffect(() => { setUseFamilyMemory(hasSavedFamily); }, [hasSavedFamily]);

  // Cycling hero word
  const heroWords = ['Dinner', 'Lunch', 'Breakfast', 'Snacks', 'Sundays'];
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroWords.length), 2400);
    return () => clearInterval(t);
  }, []);

  const ALL_CHIPS = [...DIET_TAGS, ...LIFESTYLE_TAGS];

  const toggleTag = (k) => {
    const s = new Set(activeTags);
    s.has(k) ? s.delete(k) : s.add(k);
    setActiveTags(s);
  };

  const addPantry = () => {
    const v = pantryInput.trim().toLowerCase();
    if (v && !pantry.includes(v)) setPantry([...pantry, v]);
    setPantryInput('');
  };

  const generate = () => {
    // Anon + week => signup wall
    if (mode === 'week' && !signedIn) {
      setWallReason('plan');
      setShowWall(true);
      return;
    }
    setGenerating(true);
    setQueryState({ query, pantry, cuisine, tags: [...activeTags], household });
    setTimeout(() => {
      setGenerating(false);
      if (mode === 'week' && signedIn) {
        // Build N unscheduled recipes for review
        const n = householdData?.mealsPerWeek || household.meals || 5;
        const rids = RECIPES.map(r => r.id);
        const picks = [];
        for (let i = 0; i < n; i++) picks.push(rids[i % rids.length]);
        setPendingPlan && setPendingPlan(picks.map((id, i) => ({ tempId: `p${i}-${Date.now()}`, recipeId: id })));
        setRoute('reviewPlan');
      } else {
        setRoute('options');
      }
    }, 1400);
  };

  return (
    <div className="dotted-bg" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <TopNav route="landing" setRoute={setRoute} signedIn={signedIn} setSignedIn={setSignedIn} />

      {/* Hero */}
      <section style={{ maxWidth: 980, margin: '40px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <div className="mono-eyebrow" style={{ marginBottom: 20 }}>
          {signedIn ? `Hi${householdData?.members?.[0]?.name ? ', ' + householdData.members[0].name : ''}, what are we cooking?` : 'Your family meal memory'}
        </div>
        <h1 className="hero-display">
          <span style={{ display: 'inline-block', position: 'relative', minWidth: 260 }}>
            <span key={heroIdx} className="accent fade-up" style={{ display: 'inline-block' }}>{heroWords[heroIdx]}</span>
          </span>{' '}
          figured out.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-2)', maxWidth: 460, margin: '22px auto 0', lineHeight: 1.5 }}>
          {signedIn
            ? "Tell Joey's what you're in the mood for. We'll handle the rest."
            : 'One meal or a whole week, Joey\'s plans around your family, pantry, and time.'}
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="tablist" aria-label="Planning mode">
          <button role="tab" aria-selected={mode === 'one'} className={mode === 'one' ? 'on' : ''} onClick={() => setMode('one')}>
            <Icon.Sparkle /> One meal
          </button>
          <button role="tab" aria-selected={mode === 'week'} className={mode === 'week' ? 'on' : ''} onClick={() => setMode('week')}>
            <Icon.Cal /> Plan the week
          </button>
        </div>
      </section>

      {/* Query card */}
      <section style={{ maxWidth: 820, margin: '40px auto 0', padding: '0 24px' }}>
        <div className="query-card">
          <div className="query-card-inner">
            <input
              className="input"
              style={{ border: 0, padding: '6px 0 14px', fontSize: 16, background: 'transparent' }}
              placeholder={mode === 'week'
                ? 'Make this week cozy, gluten-free, and easy to pack for lunches...'
                : "What's the vibe tonight? Quick and spicy? Something cozy?"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={{ height: 1, background: 'var(--line)', margin: '0 -24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 260px', alignItems: 'start', gap: 20, paddingTop: 14 }}>
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
                  <input
                    value={pantryInput}
                    onChange={e => setPantryInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPantry()}
                    onBlur={addPantry}
                    placeholder="add more..."
                    style={{ border: 0, outline: 'none', background: 'transparent', padding: '4px 6px', fontSize: 13, color: 'var(--muted)', width: 90, fontFamily: 'inherit' }}
                  />
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
                    <span style={{ color: cuisine === 'Any' ? 'var(--muted)' : 'var(--ink)' }}>
                      {cuisine === 'Any' ? 'Pick a cuisine' : cuisine}
                    </span>
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

        {/* Preferences: household memory (week) vs. per-meal prefs (one) */}
        {mode === 'week' ? (
          <div style={{ marginTop: 14 }}>
            <HouseholdInline
              expanded={expanded}
              setExpanded={setExpanded}
              household={household}
              setHousehold={setHousehold}
              signedIn={signedIn}
              householdData={householdData}
              onSetup={() => {
                if (signedIn) { setRoute('onboarding'); }
                else { setWallReason('family'); setShowWall(true); }
              }}
            />
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <OneMealPrefs
              hasSavedFamily={hasSavedFamily}
              householdData={householdData}
              useFamilyMemory={useFamilyMemory}
              setUseFamilyMemory={setUseFamilyMemory}
              signedIn={signedIn}
              onSignIn={() => { setWallReason('family'); setShowWall(true); }}
              onManage={() => setRoute('onboarding')}
            />
          </div>
        )}
      </section>

      {/* Tag picker */}
      <section style={{ maxWidth: 820, margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-2)', marginBottom: 16 }}>Try adding these to your context</div>
        <div className="tagpill-row">
          {ALL_CHIPS.map(t => (
            <button key={t.k}
              className={`tagpill tone-${t.tone || 'sage'} ${activeTags.has(t.k) ? 'active' : ''}`}
              aria-label={t.label}
              onClick={() => toggleTag(t.k)}
            >
              {(() => { const I = Icon[t.icon] || Icon.Dot; return <I width="18" height="18" />; })()}
              <span className="tagpill-label">{t.label}</span>
            </button>
          ))}
        </div>
        {/* Show active tags as readable chips */}
        {activeTags.size > 0 && (
          <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 14 }}>
            {[...activeTags].map(k => {
              const t = ALL_CHIPS.find(x => x.k === k);
              return (
                <span key={k} className="chip active" onClick={() => toggleTag(k)}>
                  {t?.label} <Icon.X className="x" />
                </span>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', marginTop: 40 }}>
        <button className="btn btn-primary btn-lg" onClick={generate} disabled={generating} style={{ minWidth: 220 }}>
          {generating
            ? (<><span className="dots"><span/><span/><span/></span>&nbsp; Generating...</>)
            : (mode === 'week'
                ? (signedIn ? <>Plan my week →</> : <>Plan my week →</>)
                : <>Generate my meal</>)}
        </button>
        <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 14 }}>
          {mode === 'week'
            ? (signedIn
                ? <>Fits your family · Schedule next · Takes under a minute</>
                : <>Free to try · Takes 30 seconds to set up</>)
            : (signedIn
                ? <>Personalized for your family · Under 10 seconds</>
                : <>No account needed · Results in under 10 seconds</>)}
        </div>
      </section>

      {/* Feedback floating */}
      <div style={{ position: 'fixed', right: 20, bottom: 20 }}>
        <button className="btn btn-outline btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Feedback
        </button>
      </div>

      {showWall && <SignupWall reason={wallReason} onClose={() => setShowWall(false)} onContinue={() => { setShowWall(false); setRoute('onboarding'); setSignedIn(true); }} />}
    </div>
  );
}

function SignupWall({ reason = 'plan', onClose, onContinue }) {
  const isPlan = reason === 'plan';
  const heading = isPlan ? 'Let\'s plan your week.' : 'Let\'s remember your family.';
  const sub = isPlan
    ? "Weekly plans work best when Joey's knows your family. Sign in once, we'll handle the rest."
    : "Tell us who's eating. We'll save their loves, dislikes, and allergies so every plan just fits.";
  const perks = [
    { icon: 'Users',   title: 'One family memory',      body: 'Each person\'s loves, dislikes, and allergies, kept in one place.' },
    { icon: 'Cal',     title: 'A full week, planned',   body: 'Seven days balanced across your cook times, budget, and leftovers.' },
    { icon: 'Cart',    title: 'Virtual pantry',         body: 'We skip what you already have, so your grocery list stays short.' },
    { icon: 'Sparkle', title: 'Swap anything, anytime', body: 'Move meals between days or regenerate the whole week in one tap.' },
  ];
  return (
    <div className="wall-backdrop" onClick={onClose}>
      <div className="wall-card" onClick={(e) => e.stopPropagation()}>
        <button className="wall-x" onClick={onClose} aria-label="Close"><Icon.X /></button>
        <div className="mono-eyebrow" style={{ marginBottom: 10 }}>Free · Takes 30 seconds</div>
        <h2 style={{ fontSize: 32, letterSpacing: '-0.02em', margin: '0 0 10px', lineHeight: 1.1 }}>
          {heading}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0, maxWidth: 460, lineHeight: 1.5 }}>
          {sub}
        </p>

        <div className="wall-perks">
          {perks.map(p => {
            const I = Icon[p.icon] || Icon.Dot;
            return (
              <div key={p.title} className="wall-perk">
                <div className="wall-perk-icon"><I width="18" height="18" /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{p.body}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onContinue} style={{ flex: '1 1 auto', minWidth: 220 }}>
            Continue with Google
          </button>
          <button className="btn btn-outline btn-lg" onClick={onContinue}>
            Use email instead
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14, lineHeight: 1.5 }}>
          We'll only use your info to personalize meals. Never sold. <a style={{ color: 'var(--ink-2)' }}>Privacy</a> · <a style={{ color: 'var(--ink-2)' }}>Terms</a>
        </p>
        <button className="wall-skip" onClick={onClose}>
          {isPlan ? 'Not now, just cook one meal →' : 'Skip for now →'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { LandingPage, TopNav, IconCircle, Counter, HouseholdInline, OneMealPrefs, PrefRow });
