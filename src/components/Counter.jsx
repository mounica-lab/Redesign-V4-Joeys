export function Counter({ value, setValue, min = 0, max = 20, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
      <button
        className="icon-circle"
        style={{ width: 32, height: 32 }}
        onClick={() => setValue(Math.max(min, value - 1))}
      >
        −
      </button>
      <div style={{ minWidth: 48, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
        {value}{suffix}
      </div>
      <button
        className="icon-circle"
        style={{ width: 32, height: 32 }}
        onClick={() => setValue(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
