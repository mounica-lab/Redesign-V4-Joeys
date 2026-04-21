import { useState, useEffect } from 'react';
import { DEFAULT_HOUSEHOLD, DEFAULT_PLAN, RECIPES } from './data.js';
import { LandingPage } from './pages/LandingPage.jsx';
import { RecipeOptionsPage } from './pages/RecipeOptionsPage.jsx';
import { RecipePage } from './pages/RecipePage.jsx';
import { SignInPage } from './pages/SignInPage.jsx';
import { OnboardingPage } from './pages/OnboardingPage.jsx';
import { ReviewPlanPage } from './pages/ReviewPlanPage.jsx';
import { MyMealsPage } from './pages/MyMealsPage.jsx';
import { api, getToken, setToken } from './api.js';

function Tweaks({ open, tweaks, setTweaks, route, setRoute, signedIn, setSignedIn, setHouseholdData }) {
  if (!open) return null;
  const goto = (r) => {
    if (r === 'myMeals' || r === 'onboarding') { setSignedIn(true); setHouseholdData(DEFAULT_HOUSEHOLD); }
    setRoute(r);
  };
  return (
    <div className="tweaks-panel">
      <h4>Tweaks</h4>
      <div className="tweak-row">
        <span>Jump to</span>
        <select
          className="seg"
          style={{ border: '1px solid var(--line-2)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
          value={route}
          onChange={e => goto(e.target.value)}
        >
          <option value="landing">1 · Landing</option>
          <option value="options">2 · Recipe options</option>
          <option value="recipe">3 · Recipe detail</option>
          <option value="signIn">4 · Sign in</option>
          <option value="onboarding">5 · Onboarding</option>
          <option value="reviewPlan">6 · Review plan</option>
          <option value="myMeals">7 · My meals</option>
        </select>
      </div>
      <div className="tweak-row">
        <span>Accent</span>
        <div className="seg">
          {['sage', 'coral', 'butter'].map(c => (
            <button key={c} className={tweaks.accent === c ? 'on' : ''} onClick={() => setTweaks({ ...tweaks, accent: c })}>{c}</button>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <span>Auth state</span>
        <div className="seg">
          <button className={!signedIn ? 'on' : ''} onClick={() => { setSignedIn(false); setRoute('landing'); }}>Anon</button>
          <button className={signedIn ? 'on' : ''} onClick={() => { setSignedIn(true); setHouseholdData(DEFAULT_HOUSEHOLD); setRoute('landing'); }}>Signed in</button>
        </div>
      </div>
      <div className="tweak-row">
        <span>Household</span>
        <div className="seg">
          <button className={tweaks.householdReady ? '' : 'on'} onClick={() => { setTweaks({ ...tweaks, householdReady: false }); setHouseholdData({ members: [] }); }}>Empty</button>
          <button className={tweaks.householdReady ? 'on' : ''} onClick={() => { setTweaks({ ...tweaks, householdReady: true }); setHouseholdData(DEFAULT_HOUSEHOLD); }}>Ready</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tweaks, setTweaks] = useState({ startRoute: 'landing', accent: 'sage', density: 'comfortable', householdReady: true });
  const [route, setRouteRaw] = useState(() => localStorage.getItem('joeys:route') || 'landing');
  const [signedIn, setSignedIn] = useState(() => !!getToken());
  const [household, setHousehold] = useState(() => {
    const raw = localStorage.getItem('joeys:household');
    return raw ? JSON.parse(raw) : DEFAULT_HOUSEHOLD;
  });
  const [recipes, setRecipes] = useState(RECIPES);
  const addRecipes = (newOnes) => setRecipes((prev) => {
    const ids = new Set(prev.map((r) => r.id));
    return [...prev, ...newOnes.filter((r) => !ids.has(r.id))];
  });
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [queryState, setQueryState] = useState(null);
  const [pendingPlan, setPendingPlan] = useState([]);
  const [plan, setPlan] = useState(DEFAULT_PLAN());
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const setRoute = (r) => { setRouteRaw(r); localStorage.setItem('joeys:route', r); window.scrollTo(0, 0); };

  const handleSignOut = () => {
    setToken(null);
    setSignedIn(false);
    setHousehold(DEFAULT_HOUSEHOLD);
  };

  useEffect(() => { localStorage.setItem('joeys:household', JSON.stringify(household)); }, [household]);

  // Restore session from token
  useEffect(() => {
    if (!getToken()) return;
    api.me().then((snapshot) => {
      if (snapshot?.household) {
        setHousehold({
          members: snapshot.household.members || [],
          budgetPerMeal: snapshot.household.budgetPerMeal,
          mealsPerWeek: snapshot.household.mealsPerWeek,
          cookTime: snapshot.household.cookTime,
          name: snapshot.household.name,
        });
      }
    }).catch(() => {
      setToken(null);
      setSignedIn(false);
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const map = {
      sage: 'oklch(0.55 0.13 165)',
      coral: 'oklch(0.62 0.18 20)',
      butter: 'oklch(0.65 0.14 80)',
    };
    root.style.setProperty('--sage', map[tweaks.accent] || map.sage);
  }, [tweaks.accent]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Keyboard shortcut: Ctrl+` toggles tweaks panel
  useEffect(() => {
    const handler = (e) => { if (e.key === '`' && (e.ctrlKey || e.metaKey)) setTweaksOpen(v => !v); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  let page;
  const signOutProps = { setRoute, signedIn, setSignedIn: (v) => v ? setSignedIn(true) : handleSignOut() };

  if (route === 'landing') {
    page = <LandingPage {...signOutProps} setQueryState={setQueryState} householdData={household} setHouseholdData={setHousehold} setPendingPlan={setPendingPlan} recipes={recipes} addRecipes={addRecipes} setSelectedRecipe={setSelectedRecipe} />;
  } else if (route === 'options') {
    page = <RecipeOptionsPage queryState={queryState} setRoute={setRoute} setSelectedRecipe={setSelectedRecipe} recipes={recipes} />;
  } else if (route === 'recipe') {
    page = <RecipePage recipe={selectedRecipe} setRoute={setRoute} signedIn={signedIn} />;
  } else if (route === 'signIn') {
    page = <SignInPage setRoute={setRoute} setSignedIn={setSignedIn} setHouseholdData={setHousehold} />;
  } else if (route === 'onboarding') {
    page = <OnboardingPage setRoute={setRoute} setHouseholdData={setHousehold} setSignedIn={setSignedIn} />;
  } else if (route === 'reviewPlan') {
    page = <ReviewPlanPage pendingPlan={pendingPlan} household={household} setRoute={setRoute} setSelectedRecipe={setSelectedRecipe} setSignedIn={setSignedIn} plan={plan} setPlan={setPlan} recipes={recipes} />;
  } else if (route === 'myMeals') {
    page = <MyMealsPage household={household} setRoute={setRoute} setSelectedRecipe={setSelectedRecipe} setSignedIn={setSignedIn} plan={plan} setPlan={setPlan} recipes={recipes} />;
  } else {
    page = <LandingPage {...signOutProps} setQueryState={setQueryState} householdData={household} setHouseholdData={setHousehold} setPendingPlan={setPendingPlan} recipes={recipes} addRecipes={addRecipes} setSelectedRecipe={setSelectedRecipe} />;
  }

  return (
    <>
      <div data-screen-label={route}>{page}</div>
      <Tweaks
        open={tweaksOpen}
        tweaks={tweaks}
        setTweaks={setTweaks}
        route={route}
        setRoute={setRoute}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        setHouseholdData={setHousehold}
      />
    </>
  );
}
