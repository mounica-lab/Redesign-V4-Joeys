import { useState } from 'react';
import { RECIPES } from '../data.js';
import { Event } from './Event.jsx';

export function Cell({ slotKey, plan, setPlan, recipes, onOpen, onSwap, onFeedback, feedback }) {
  const pool = recipes && recipes.length ? recipes : RECIPES;
  const recipeId = plan[slotKey];
  const r = pool.find(x => x.id === recipeId);
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
        <Event
          recipe={r}
          slotKey={slotKey}
          plan={plan}
          setPlan={setPlan}
          onOpen={onOpen}
          onSwap={onSwap}
          onFeedback={onFeedback}
          feedback={feedback}
        />
      ) : (
        <div className="cell-empty" style={{ height: '100%', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'transparent', fontSize: 12, transition: 'color 120ms' }}>
          + Add
        </div>
      )}
    </div>
  );
}
