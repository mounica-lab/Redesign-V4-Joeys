// My Meals + Calendar page with drag & drop (Google Calendar-style)

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = [
  { k: 'breakfast', label: 'Breakfast', time: '8 AM' },
  { k: 'lunch', label: 'Lunch', time: '12 PM' },
  { k: 'dinner', label: 'Dinner', time: '6 PM' },
];

// Tone -> accent color for the event left-rail
const TONE_COLOR = {
  warm: 'oklch(0.68 0.13 60)',
  red: 'oklch(0.62 0.17 25)',
  green: 'oklch(0.60 0.12 155)',
  sage: 'oklch(0.58 0.09 155)',
  butter: 'oklch(0.68 0.14 80)',
  tomato: 'oklch(0.60 0.18 25)',
  cream: 'oklch(0.60 0.06 70)',
  forest: 'oklch(0.52 0.11 155)',
  rose: 'oklch(0.65 0.12 15)',
  mustard: 'oklch(0.65 0.14 85)',
};

function Event({ recipe, slotKey, plan, setPlan, onOpen, onSwap, onFeedback, feedback }) {
  const fb = feedback[slotKey];
  const color = TONE_COLOR[recipe.tone] || 'var(--sage)';
  const [hover, setHover] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', `${slotKey}|${recipe.id}`); e.dataTransfer.effectAllowed = 'move'; }}
      onClick={() => onOpen(recipe)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 6,
        padding: '8px 10px 8px 12px',
        borderLeft: `3px solid ${color}`,
        boxShadow: hover ? '0 2px 8px rgba(17,17,17,0.08)' : '0 1px 2px rgba(17,17,17,0.04)',
        cursor: 'grab',
        transition: 'box-shadow 140ms',
        fontSize: 12, lineHeight: 1.25,
      }}
    >
      <div style={{ fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {recipe.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>{recipe.time}m</span>
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {fb === 'love' && <Icon.HeartFilled style={{ color: 'var(--coral)', width: 11, height: 11 }} />}
          {fb === 'sad' && <Icon.Frown style={{ color: 'var(--muted)', width: 11, height: 11 }} />}
        </div>
      </div>

      {/* Hover toolbar */}
      {hover && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: -28, right: 0, display: 'flex', gap: 2, background: '#fff', border: '1px solid var(--line-2)', borderRadius: 6, padding: 2, boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
          <button title="Love" onClick={() => onFeedback(slotKey, fb === 'love' ? null : 'love')}
            style={{ width: 22, height: 22, border: 0, background: 'transparent', borderRadius: 4, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            {fb === 'love' ? <Icon.HeartFilled style={{ color: 'var(--coral)', width: 12, height: 12 }} /> : <Icon.Heart style={{ color: 'var(--muted)', width: 12, height: 12 }} />}
          </button>
          <button title="Not a fan" onClick={() => onFeedback(slotKey, fb === 'sad' ? null : 'sad')}
            style={{ width: 22, height: 22, border: 0, background: fb === 'sad' ? 'var(--bg-soft)' : 'transparent', borderRadius: 4, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon.Frown style={{ color: fb === 'sad' ? 'var(--ink)' : 'var(--muted)', width: 12, height: 12 }} />
          </button>
          <div style={{ width: 1, background: 'var(--line)', margin: '2px 0' }} />
          <button title="Swap" onClick={() => onSwap(slotKey)}
            style={{ width: 22, height: 22, border: 0, background: 'transparent', borderRadius: 4, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon.Swap style={{ color: 'var(--muted)', width: 12, height: 12 }} />
          </button>
          <button title="Remove" onClick={() => { const n = { ...plan }; delete n[slotKey]; setPlan(n); }}
            style={{ width: 22, height: 22, border: 0, background: 'transparent', borderRadius: 4, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icon.X style={{ color: 'var(--muted)', width: 11, height: 11 }} />
          </button>
        </div>
      )}
    </div>
  );
}

function Cell({ slotKey, plan, setPlan, recipes, onOpen, onSwap, onFeedback, feedback }) {
  const recipeId = plan[slotKey];
  const r = recipes.find(x => x.id === recipeId);
  const [over, setOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setOver(false);
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    const [fromKey, rid] = data.split('|');
    const next = { ...plan };
    if (fromKey && fromKey !== '__new') next[fromKey] = plan[slotKey];
    next[slotKey] = rid;
    if (!next[fromKey]) delete next[fromKey];
    setPlan(next);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => !r && onSwap(slotKey)}
      style={{
        minHeight: 62,
        padding: 4,
        borderRight: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: over ? 'var(--sage-soft)' : 'transparent',
        cursor: r ? 'default' : 'pointer',
        position: 'relative',
        transition: 'background 120ms',
      }}
    >
      {r ? (
        <Event recipe={r} slotKey={slotKey} plan={plan} setPlan={setPlan}
          onOpen={onOpen} onSwap={onSwap} onFeedback={onFeedback} feedback={feedback} />
      ) : (
        <div className="cell-empty" style={{ height: '100%', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'transparent', fontSize: 12, transition: 'color 120ms' }}>
          + Add
        </div>
      )}
    </div>
  );
}

function WeekCalendar({ plan, setPlan, recipes, onOpen, feedback, setFeedback, onSwap }) {
  const today = todayIdx();
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <style>{`
        .gcal-cell:hover .cell-empty { color: var(--muted); }
      `}</style>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '68px repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
        <div />
        {DAYS.map((d, i) => {
          const isToday = i === today;
          return (
            <div key={d} style={{ padding: '12px 10px 10px', textAlign: 'left', borderLeft: '1px solid var(--line)' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>{d.toUpperCase()}</div>
              <div style={{ marginTop: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: isToday ? 28 : 'auto', height: isToday ? 28 : 'auto',
                borderRadius: 999,
                background: isToday ? 'var(--sage)' : 'transparent',
                color: isToday ? '#fff' : 'var(--ink)',
                fontSize: 20, fontWeight: isToday ? 600 : 500,
                padding: isToday ? '0' : '0',
                minWidth: 28,
              }}>{13 + i}</div>
            </div>
          );
        })}
      </div>
      {/* Slot rows */}
      {SLOTS.map((slot, si) => (
        <div key={slot.k} style={{ display: 'grid', gridTemplateColumns: '68px repeat(7, 1fr)', borderBottom: si === SLOTS.length - 1 ? 0 : 'none' }}>
          <div style={{ padding: '10px 10px 0', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>{slot.time}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>{slot.label}</div>
          </div>
          {DAYS.map((_, di) => {
            const key = `${di}-${slot.k}`;
            return (
              <div key={key} className="gcal-cell" style={{ display: 'contents' }}>
                <Cell slotKey={key} plan={plan} setPlan={setPlan} recipes={recipes}
                  onOpen={onOpen} onSwap={onSwap}
                  onFeedback={(k, v) => setFeedback({ ...feedback, [k]: v })}
                  feedback={feedback} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SwapPanel({ slotKey, recipes, plan, setPlan, onClose }) {
  const current = plan[slotKey];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,17,17,0.4)', zIndex: 150, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 460, maxWidth: '95vw', background: '#fff', height: '100vh', overflow: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div className="mono-eyebrow">{slotKey ? slotKey.split('-').join(' · ') : ''}</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 0' }}>Swap this meal</h3>
          </div>
          <button className="icon-circle" onClick={onClose}><Icon.X /></button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Pick a replacement. Joey's weights results by family memory.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {recipes.filter(r => r.id !== current).map(r => (
            <div key={r.id} onClick={() => { setPlan({ ...plan, [slotKey]: r.id }); onClose(); }}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 14, padding: 10, border: '1px solid var(--line)', borderRadius: 12, cursor: 'pointer', transition: 'all 140ms' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}>
              <FoodSwatch tone={r.tone} label="" ratio="1" style={{ borderRadius: 8 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>{r.subtitle}</div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 6 }}>{r.time}m · {r.cal} cal · {r.cuisine.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyMealsPage({ household, setRoute, setSelectedRecipe, setSignedIn, plan: planProp, setPlan: setPlanProp }) {
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
      <TopNav route="myMeals" setRoute={setRoute} signedIn={true} setSignedIn={setSignedIn} />

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
              {generating ? <><span className="dots"><span/><span/><span/></span> Generating</> : <><Icon.Sparkle /> Regenerate</>}
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

        {/* Quick-add rail, simplified single line */}
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase', flexShrink: 0 }}>Drag to schedule</div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1 }}>
            {RECIPES.slice(4).map(r => (
              <div key={r.id}
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
                }}>
                <Icon.Drag style={{ color: 'var(--muted)' }} />
                <span style={{ fontWeight: 500 }}>{r.name}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{r.time}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <WeekCalendar plan={plan} setPlan={setPlan} recipes={RECIPES}
          onOpen={(r) => { setSelectedRecipe(r); setRoute('recipe'); }}
          feedback={feedback} setFeedback={setFeedback}
          onSwap={setSwapSlot} />

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
        <SwapPanel slotKey={swapSlot} recipes={RECIPES} plan={plan} setPlan={setPlan} onClose={() => setSwapSlot(null)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

Object.assign(window, { MyMealsPage, WeekCalendar, Cell, Event, SwapPanel, DAYS, SLOTS, TONE_COLOR });
