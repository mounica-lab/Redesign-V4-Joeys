import { Icon } from '../icons.jsx';

export function PrefRadio({ selected, onClick, icon, title, desc }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '12px 14px',
        borderRadius: 10,
        border: `1.5px solid ${selected ? 'var(--sage)' : 'var(--line-2)'}`,
        background: selected ? 'var(--sage-soft)' : '#fff',
        cursor: 'pointer',
        transition: 'all 140ms',
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: 999,
        border: `2px solid ${selected ? 'var(--sage)' : 'var(--line-2)'}`,
        background: selected ? 'var(--sage)' : 'transparent',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}>
        {selected && <Icon.Check style={{ color: '#fff', width: 10, height: 10 }} />}
      </div>
      <div style={{ width: 22, height: 22, flexShrink: 0, color: selected ? 'var(--sage-ink)' : 'var(--muted)', display: 'grid', placeItems: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: selected ? 'var(--sage-ink)' : 'var(--ink)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>{desc}</div>
      </div>
    </div>
  );
}
