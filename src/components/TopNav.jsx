export function TopNav({ route, setRoute, signedIn, setSignedIn, householdData }) {
  const firstName = householdData?.members?.[0]?.name;
  return (
    <header className="topnav">
      <div
        className="wordmark"
        style={{ cursor: 'pointer' }}
        onClick={() => setRoute('landing')}
        role="link"
        aria-label="Joey's, home"
      >
        Joey<em>'s</em>
      </div>
      <nav className="nav-links">
        <a className={route === 'myMeals' ? 'active' : ''} onClick={() => signedIn && setRoute('myMeals')}>Plans</a>
        <a className={route === 'recipes' ? 'active' : ''} onClick={() => setRoute(signedIn ? 'myMeals' : 'landing')}>Recipes</a>
        <a>Grocery list</a>
        {signedIn ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {firstName && (
              <div className="badge sage" style={{ fontSize: 10 }}>Household · {firstName}</div>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => { setSignedIn(false); setRoute('landing'); }}>Sign out</button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setRoute('signIn')}>Sign in</button>
        )}
      </nav>
    </header>
  );
}
