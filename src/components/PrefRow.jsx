export function PrefRow({ label, items, tone = 'sage', icon: I, strike = false }) {
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
