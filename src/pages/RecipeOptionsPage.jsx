import { useMemo } from 'react';
import { Icon } from '../icons.jsx';
import { RECIPES } from '../data.js';
import { TopNav } from '../components/TopNav.jsx';
import { RecipeCard } from '../components/RecipeCard.jsx';

export function RecipeOptionsPage({ queryState, setRoute, setSelectedRecipe, recipes }) {
  const { query, pantry, tags, cuisine, optionIds } = queryState || { query: '', pantry: [], tags: [], cuisine: 'Any' };
  const pool = recipes && recipes.length ? recipes : RECIPES;

  const options = useMemo(() => {
    // If AI provided specific option IDs, use those
    if (optionIds && optionIds.length) {
      const ai = optionIds.map((id) => pool.find((r) => r.id === id)).filter(Boolean);
      if (ai.length >= 2) return ai.slice(0, 2);
    }
    let working = [...pool];
    if (tags?.length) {
      const scored = working.map(r => ({ r, s: r.tags.filter(t => tags.includes(t)).length }));
      scored.sort((a, b) => b.s - a.s);
      working = scored.map(x => x.r);
    }
    if (cuisine && cuisine !== 'Any') {
      working = [...working.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase())), ...working];
    }
    return [working[0] || pool[0], working[1] || pool[1]];
  }, [tags, cuisine, optionIds, pool]);

  return (
    <div className="dotted-bg" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <TopNav route="options" setRoute={setRoute} signedIn={false} setSignedIn={() => {}} />

      <section style={{ maxWidth: 1100, margin: '24px auto 0', padding: '0 24px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute('landing')} style={{ paddingLeft: 8 }}>
          <Icon.Back /> Back
        </button>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <div className="mono-eyebrow" style={{ marginBottom: 10 }}>Two for you, based on your context</div>
          <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Two ways to cook
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, marginTop: 10 }}>
            {query ? <>You said: <span style={{ fontStyle: 'italic', color: 'var(--ink)' }}>"{query}"</span>. </> : null}
            {pantry?.length ? <>Using <b>{pantry.join(', ')}</b>.</> : null}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 32 }}>
          {options.map((r, i) => (
            <div key={r.id}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                Option {String.fromCharCode(65 + i)} · {i === 0 ? 'Best match' : 'Wildcard'}
              </div>
              <RecipeCard
                recipe={r}
                onClick={() => { setSelectedRecipe(r); setRoute('recipe'); }}
              />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-outline" onClick={() => setRoute('landing')}>
            <Icon.Swap /> Show me two different ones
          </button>
        </div>
      </section>
    </div>
  );
}
