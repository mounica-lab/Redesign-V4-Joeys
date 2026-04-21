import { useMemo } from 'react';
import { Icon } from '../icons.jsx';
import { PrefRadio } from './PrefRadio.jsx';
import { PrefRow } from './PrefRow.jsx';

export function OneMealPrefs({ hasSavedFamily, householdData, useFamilyMemory, setUseFamilyMemory, signedIn, onSignIn, onManage }) {
  const members = householdData?.members || [];

  const applied = useMemo(() => {
    const loves = new Set(), avoids = new Set(), diets = new Set();
    members.forEach(m => {
      (m.loves || []).forEach(x => loves.add(x));
      (m.avoids || []).forEach(x => avoids.add(x));
      (m.diet || []).forEach(x => diets.add(x));
    });
    return {
      loves: [...loves].slice(0, 4),
      avoids: [...avoids].slice(0, 4),
      diets: [...diets],
    };
  }, [members]);

  if (hasSavedFamily) {
    const memberNames = members.map(m => m.name).join(', ');
    return (
      <div className="card" style={{ padding: '14px 18px' }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Who's this meal for?</div>
        <div style={{ display: 'grid', gap: 8 }}>
          <PrefRadio
            selected={useFamilyMemory}
            onClick={() => setUseFamilyMemory(true)}
            icon={<Icon.Home />}
            title="My whole family"
            desc={`${members.length} ${members.length === 1 ? 'person' : 'people'}, ${memberNames}. We'll use their saved loves, avoids, and diets.`}
          />
          <PrefRadio
            selected={!useFamilyMemory}
            onClick={() => setUseFamilyMemory(false)}
            icon={<Icon.Sparkle />}
            title="Just this meal"
            desc="Skip saved preferences. Pick exactly what you want with the tags below, nothing gets saved to your family."
          />
        </div>

        {useFamilyMemory && (applied.loves.length > 0 || applied.avoids.length > 0 || applied.diets.length > 0) && (
          <div className="fade-up" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', display: 'grid', gap: 8 }}>
            {applied.diets.length > 0 && <PrefRow label="Diet" tone="sage" items={applied.diets} />}
            {applied.loves.length > 0 && <PrefRow label="Loves" tone="sage" items={applied.loves} icon={Icon.Heart} />}
            {applied.avoids.length > 0 && <PrefRow label="Avoiding" tone="warn" items={applied.avoids} strike />}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <button onClick={onManage} style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>
                Manage family →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-soft)', display: 'grid', placeItems: 'center', color: 'var(--muted)', flexShrink: 0 }}>
          <Icon.Sparkle />
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}>
          Cooking just for this meal. Pick preferences with the tags below.
        </div>
      </div>
      <button
        onClick={signedIn ? onManage : onSignIn}
        style={{ background: 'none', border: 0, color: 'var(--sage)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        {signedIn ? 'Set up family memory →' : 'Sign in to use family preferences →'}
      </button>
    </div>
  );
}
