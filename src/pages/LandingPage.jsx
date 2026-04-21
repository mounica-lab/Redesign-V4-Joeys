import { useState, useEffect } from 'react';
import { Icon } from '../icons.jsx';
import { CUISINES, DIET_TAGS, LIFESTYLE_TAGS, RECIPES } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';
import { HouseholdInline } from '../components/HouseholdInline.jsx';
import { OneMealPrefs } from '../components/OneMealPrefs.jsx';
import { SignupWall } from '../components/SignupWall.jsx';
import { api } from '../api.js';

export function LandingPage({ setRoute, signedIn, setSignedIn, setQueryState, householdData, setHouseholdData, setPendingPlan, recipes, addRecipes, setSelectedRecipe }) {
  const [query, setQuery] = useState('');
  const [pantry, setPantry] = useState(['rice', 'eggs', 'spinach']);
  const [pantryInput, setPantryInput] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [cuisineOpen, setCuisineOpen] = useState(false);
  const [activeTags, setActiveTags] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const [household, setHousehold] = useState({ family: 2, budget: 22, meals: 5, cook: 35 });
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState(signedIn ? 'week' : 'one');
  const [showWall, setShowWall] = useState(false);
  const [wallReason, setWallReason] = useState('plan');

  const hasSavedFamily = signedIn && (householdData?.members || []).length > 0;
  const [useFamilyMemory, setUseFamilyMemory] = useState(hasSavedFamily);
  useEffect(() => { setUseFamilyMemory(hasSavedFamily); }, [hasSavedFamily]);

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

  const [genError, setGenError] = useState('');

  const generate = async () => {
    if (mode === 'week' && !signedIn) {
      setWallReason('plan');
      setShowWall(true);
      return;
    }
    setGenError('');
    setGenerating(true);
    const context = {
      query,
      pantry,
      cuisine,
      tags: [...activeTags],
      household: mode === 'one' && !useFamilyMemory ? null : householdData,
      numMeals: householdData?.mealsPerWeek || household.meals || 5,
    };
    setQueryState(context);

    try {
      if (mode === 'week' && signedIn) {
        const { recipes: ai } = await api.generatePlan(context);
        addRecipes && addRecipes(ai);
        setPendingPlan && setPendingPlan(ai.map((r, i) => ({ tempId: `p${i}-${Date.now()}`, recipeId: r.id })));
        setRoute('reviewPlan');
      } else {
        const { recipes: ai } = await api.generateRecipes(context);
        addRecipes && addRecipes(ai);
        if (ai[0]) setSelectedRecipe && setSelectedRecipe(ai[0]);
        // Pass IDs through queryState so options page can find them
        setQueryState({ ...context, optionIds: ai.map((r) => r.id) });
        setRoute('options');
      }
    } catch (err) {
      setGenError(err.message || 'Could not reach Joey\'s kitchen. Is the server running?');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dotted-bg" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <TopNav route="landing" setRoute={setRoute} signedIn={signedIn} setSignedIn={setSignedIn} />

      {/* Hero */}
      <section style={{ maxWidth: 980, margin: '40px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <div className="mono-eyebrow" style={{ marginBottom: 20 }}>
          {signedIn
            ? `Hi${householdData?.members?.[0]?.name ? ', ' + householdData.members[0].name : ''}, what are we cooking?`
            : 'Your family meal memory'}
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
            : "One meal or a whole week, Joey's plans around your family, pantry, and time."}
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

        {/* Preferences */}
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
        {genError && (
          <div style={{ maxWidth: 460, margin: '0 auto 14px', padding: '10px 14px', background: 'var(--coral-soft)', color: 'oklch(0.45 0.18 20)', borderRadius: 10, fontSize: 13 }}>
            {genError}
          </div>
        )}
        <button className="btn btn-primary btn-lg" onClick={generate} disabled={generating} style={{ minWidth: 220 }}>
          {generating
            ? (<><span className="dots"><span /><span /><span /></span>&nbsp; Generating...</>)
            : (mode === 'week' ? <>Plan my week →</> : <>Generate my meal</>)}
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

      {showWall && (
        <SignupWall
          reason={wallReason}
          onClose={() => setShowWall(false)}
          onContinue={() => { setShowWall(false); setRoute('onboarding'); setSignedIn(true); }}
        />
      )}
    </div>
  );
}
