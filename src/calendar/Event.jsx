import { useState } from 'react';
import { Icon } from '../icons.jsx';
import { TONE_COLOR } from '../data.js';

export function Event({ recipe, slotKey, plan, setPlan, onOpen, onSwap, onFeedback, feedback }) {
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

      {hover && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: -28, right: 0, display: 'flex', gap: 2, background: '#fff', border: '1px solid var(--line-2)', borderRadius: 6, padding: 2, boxShadow: 'var(--shadow-md)', zIndex: 5 }}
        >
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
