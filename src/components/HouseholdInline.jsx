import { Icon } from '../icons.jsx';
import { Counter } from './Counter.jsx';

export function HouseholdInline({ expanded, setExpanded, household, setHousehold, onSetup, signedIn, householdData }) {
  const members = householdData?.members || [];
  const hasFamily = signedIn && members.length > 0;

  return (
    <div
      className={`card household-widget ${hasFamily ? 'is-signed' : ''}`}
      style={{ padding: expanded ? '16px 22px 18px' : '16px 22px', transition: 'padding 180ms' }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: hasFamily ? 'var(--sage-soft, oklch(0.95 0.04 160))' : 'var(--bg-soft)',
            display: 'grid', placeItems: 'center',
            color: hasFamily ? 'var(--sage-ink)' : 'var(--ink-2)',
            flexShrink: 0,
          }}>
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
            <span className="chip active" style={{ fontSize: 11, padding: '3px 10px' }}>
              <Icon.Check /> saved
            </span>
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
                <button className="btn btn-primary btn-sm" onClick={onSetup}>{signedIn ? "Set up family →" : "Sign up, it's free →"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
