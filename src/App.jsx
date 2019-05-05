import React, { useState, useEffect } from 'react';
import StoreContext from 'storeon/react/context';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DeepDive from './pages/DeepDive.jsx';
import Explore from './pages/Explore.jsx';
import Relationship from './pages/Relationship.jsx';
import styles from './styles/Main.module.css';
import store from './store/index.js';
import useStoreon from 'storeon/react';
import { fetchDeepDives } from './lib/api';

function AppRouter() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Main />
      </Router>
    </StoreContext.Provider>
  );
}

function Main(props) {
  // TODO: figure out whyyyy this renders so many times
  console.log('Main rendered');

  const { dispatch } = useStoreon('deepdives');
  const [fetched, setFetched] = useState(false);

  async function fetchData() {
    const deepdives = await fetchDeepDives(20);
    dispatch('deepdives/update', deepdives);
    setFetched(true);
  }

  useEffect(() => {
    fetched || fetchData();
  }, [fetched]);

  return (
    <div className={styles.root}>
      <nav>
        <ul className="constrain">
          <li>
            <NavLink to="/explore" activeClassName={styles.active}>
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/relationship" activeClassName={styles.active}>
              Relationship
            </NavLink>
          </li>
          <li>
            <NavLink to="/deep-dives" activeClassName={styles.active}>
              Deep Dives
            </NavLink>
          </li>
        </ul>
      </nav>

      <Route path="/deep-dives" exact component={DeepDive} />
      <Route path="/deep-dives/:id" component={DeepDive} />
      <Route path="/relationship" exact component={Relationship} />
      <Route path="/relationship/:id" component={Relationship} />
      <Route path="/explore" component={Explore} />
    </div>
  );
}

export default AppRouter;
