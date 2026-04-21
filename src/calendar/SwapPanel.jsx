import { Icon } from '../icons.jsx';
import { RECIPES } from '../data.js';
import { FoodSwatch } from '../components/FoodSwatch.jsx';

export function SwapPanel({ slotKey, plan, setPlan, recipes, onClose }) {
  const pool = recipes && recipes.length ? recipes : RECIPES;
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
          {pool.filter(r => r.id !== current).map(r => (
            <div
              key={r.id}
              onClick={() => { setPlan({ ...plan, [slotKey]: r.id }); onClose(); }}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 14, padding: 10, border: '1px solid var(--line)', borderRadius: 12, cursor: 'pointer', transition: 'all 140ms' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
            >
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
