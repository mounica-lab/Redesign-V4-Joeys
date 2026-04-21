import { Icon } from '../icons.jsx';

export function SignupWall({ reason = 'plan', onClose, onContinue }) {
  const isPlan = reason === 'plan';
  const heading = isPlan ? "Let's plan your week." : "Let's remember your family.";
  const sub = isPlan
    ? "Weekly plans work best when Joey's knows your family. Sign in once, we'll handle the rest."
    : "Tell us who's eating. We'll save their loves, dislikes, and allergies so every plan just fits.";
  const perks = [
    { icon: 'Users',   title: 'One family memory',      body: "Each person's loves, dislikes, and allergies, kept in one place." },
    { icon: 'Cal',     title: 'A full week, planned',   body: 'Seven days balanced across your cook times, budget, and leftovers.' },
    { icon: 'Cart',    title: 'Virtual pantry',         body: "We skip what you already have, so your grocery list stays short." },
    { icon: 'Sparkle', title: 'Swap anything, anytime', body: 'Move meals between days or regenerate the whole week in one tap.' },
  ];
  return (
    <div className="wall-backdrop" onClick={onClose}>
      <div className="wall-card" onClick={(e) => e.stopPropagation()}>
        <button className="wall-x" onClick={onClose} aria-label="Close"><Icon.X /></button>
        <div className="mono-eyebrow" style={{ marginBottom: 10 }}>Free · Takes 30 seconds</div>
        <h2 style={{ fontSize: 32, letterSpacing: '-0.02em', margin: '0 0 10px', lineHeight: 1.1 }}>
          {heading}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0, maxWidth: 460, lineHeight: 1.5 }}>
          {sub}
        </p>

        <div className="wall-perks">
          {perks.map(p => {
            const I = Icon[p.icon] || Icon.Dot;
            return (
              <div key={p.title} className="wall-perk">
                <div className="wall-perk-icon"><I width="18" height="18" /></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{p.body}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onContinue} style={{ flex: '1 1 auto', minWidth: 220 }}>
            Continue with Google
          </button>
          <button className="btn btn-outline btn-lg" onClick={onContinue}>
            Use email instead
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14, lineHeight: 1.5 }}>
          We'll only use your info to personalize meals. Never sold.{' '}
          <a style={{ color: 'var(--ink-2)' }} href="#">Privacy</a> · <a style={{ color: 'var(--ink-2)' }} href="#">Terms</a>
        </p>
        <button className="wall-skip" onClick={onClose}>
          {isPlan ? 'Not now, just cook one meal →' : 'Skip for now →'}
        </button>
      </div>
    </div>
  );
}
