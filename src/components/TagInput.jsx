import { useState } from 'react';
import { Icon } from '../icons.jsx';

export function TagInput({ tags, setTags, placeholder, color = 'sage' }) {
  const [v, setV] = useState('');
  const add = () => { if (v.trim()) { setTags([...tags, v.trim()]); setV(''); } };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, border: '1px solid var(--line-2)', borderRadius: 10, padding: 8, background: '#fff' }}>
      {tags.map((t, i) => (
        <span
          key={i}
          className={`chip ${color === 'coral' ? '' : 'active'}`}
          style={color === 'coral' ? { background: 'var(--coral-soft)', color: 'oklch(0.45 0.18 20)', borderColor: 'transparent' } : {}}
          onClick={() => setTags(tags.filter((_, j) => j !== i))}
        >
          {t} <Icon.X className="x" />
        </span>
      ))}
      <input
        value={v}
        onChange={e => setV(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && add()}
        onBlur={add}
        placeholder={placeholder}
        style={{ border: 0, outline: 'none', background: 'transparent', flex: 1, minWidth: 140, padding: '4px 6px', fontSize: 13, fontFamily: 'inherit' }}
      />
    </div>
  );
}
