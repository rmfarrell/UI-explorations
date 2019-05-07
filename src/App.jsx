import React, { useState, useEffect } from 'react';
import StoreContext from 'storeon/react/context';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  withRouter
} from 'react-router-dom';
import styles from './styles/Main.module.css';
import store from './store/index.js';
import useStoreon from 'storeon/react';

// -- Libs
import {
  fetchDeepDives,
  fetchRssItems,
  fetchSocialMedia,
  fetchExternalResources,
  fetchRelationships
} from './lib/api';

// -- Modules
import DeepDive from './pages/DeepDive.jsx';
import DeepDivesAll from './pages/DeepDivesAll.jsx';
import DeepDivesByCountry from './pages/DeepDivesByCountry.jsx';
import Explore from './pages/Explore.jsx';
import Relationship from './pages/Relationship.jsx';
import Empty from './components/Empty.jsx';

function AppRouter() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Main>
          <Route path="/" exact component={Explore} />
          <Route path="/explore" exact component={Explore} />
          <Route path="/deep-dives" exact component={DeepDivesAll} />
          <Route
            path="/deep-dives/country/:id"
            exact
            component={DeepDivesByCountry}
          />
          <Route path="/deep-dives/:id" component={DeepDive} />
          <Route path="/relationship" exact component={Relationship} />
          <Route path="/relationship/:id" component={Relationship} />
          <Route
            path="/help"
            exact
            render={() => (
              <Empty>
                <h1>Help Page (TK)</h1>
              </Empty>
            )}
          />
        </Main>
      </Router>
    </StoreContext.Provider>
  );
}

function Main(props) {
  const { children } = props;

  const { dispatch } = useStoreon('deepdives');
  const [fetched, setFetched] = useState(false);

  async function fetchData() {
    const deepdives = await fetchDeepDives(20);
    dispatch('deepdives/update', deepdives);
    dispatch('relationships/update', await fetchRelationships(20));
    dispatch('articles/add', {
      data: Object.assign({}, deepdives),
      type: 'DDV'
    });
    dispatch('articles/add', { data: await fetchRssItems(60), type: 'RSS' });
    dispatch('articles/add', { data: await fetchSocialMedia(40), type: 'SOC' });
    dispatch('articles/add', {
      data: await fetchExternalResources(15),
      type: 'EXR'
    });
    setFetched(true);
  }

  useEffect(() => {
    fetched || fetchData();
  }, [fetched]);

  function loading() {
    return (
      <Empty>
        <h2>Loading...</h2>
      </Empty>
    );
  }

  return (
    <div className={styles.root}>
      <nav>
        <ul className="constrain">
          <li>
            <NavLink to="/relationship" activeClassName={styles.active}>
              Relationships
            </NavLink>
          </li>
          <li>
            <NavLink to="/deep-dives" activeClassName={styles.active}>
              Deep Dives
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" activeClassName={styles.active}>
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/help" activeClassName={styles.active}>
              Help
            </NavLink>
          </li>
        </ul>
      </nav>
      {fetched ? children : loading()}
    </div>
  );
}

export default AppRouter;
