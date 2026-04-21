import { todayIdx } from '../data.js';
import { Cell } from './Cell.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = [
  { k: 'breakfast', label: 'Breakfast', time: '8 AM' },
  { k: 'lunch', label: 'Lunch', time: '12 PM' },
  { k: 'dinner', label: 'Dinner', time: '6 PM' },
];

export function WeekCalendar({ plan, setPlan, recipes, onOpen, feedback, setFeedback, onSwap }) {
  const today = todayIdx();
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <style>{`.gcal-cell:hover .cell-empty { color: var(--muted) !important; }`}</style>
      <div style={{ display: 'grid', gridTemplateColumns: '68px repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
        <div />
        {DAYS.map((d, i) => {
          const isToday = i === today;
          return (
            <div key={d} style={{ padding: '12px 10px 10px', textAlign: 'left', borderLeft: '1px solid var(--line)' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>{d.toUpperCase()}</div>
              <div style={{
                marginTop: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: isToday ? 28 : 'auto', height: isToday ? 28 : 'auto',
                borderRadius: 999,
                background: isToday ? 'var(--sage)' : 'transparent',
                color: isToday ? '#fff' : 'var(--ink)',
                fontSize: 20, fontWeight: isToday ? 600 : 500,
                minWidth: 28,
              }}>
                {13 + i}
              </div>
            </div>
          );
        })}
      </div>
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
                <Cell
                  slotKey={key}
                  plan={plan}
                  setPlan={setPlan}
                  recipes={recipes}
                  onOpen={onOpen}
                  onSwap={onSwap}
                  onFeedback={(k, v) => setFeedback({ ...feedback, [k]: v })}
                  feedback={feedback}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
