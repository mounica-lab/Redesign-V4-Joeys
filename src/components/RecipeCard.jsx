import { Icon } from '../icons.jsx';
import { FoodSwatch } from './FoodSwatch.jsx';

export function RecipeCard({ recipe, onClick, compact, saved, onToggleSave }) {
  return (
    <div
      className="card fade-up"
      style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 180ms, box-shadow 180ms' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      onClick={onClick}
    >
      <FoodSwatch tone={recipe.tone} label={recipe.cuisine} ratio={compact ? '16/9' : '4/3'} style={{ borderRadius: '18px 18px 0 0' }} />
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {recipe.tags.slice(0, 3).map(t => <span key={t} className="badge">{t}</span>)}
        </div>
        <h3 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.15 }}>{recipe.name}</h3>
        <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.45 }}>{recipe.subtitle}</p>
        <div style={{ display: 'flex', gap: 18, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon.Clock style={{ color: 'var(--muted)' }} /> {recipe.time} min</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon.Flame style={{ color: 'var(--muted)' }} /> {recipe.cal} cal</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>· {recipe.difficulty}</span>
          {onToggleSave && (
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', padding: 0 }} onClick={(e) => { e.stopPropagation(); onToggleSave(); }}>
              {saved ? <Icon.HeartFilled style={{ color: 'var(--coral)' }} /> : <Icon.Heart style={{ color: 'var(--muted)' }} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
