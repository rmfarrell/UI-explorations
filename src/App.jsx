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
          <Route path="/deep-dives" component={DeepDivesAll} />
          <Route path="/relationship" exact component={Relationship} />
          <Route path="/relationship/:id" component={Relationship} />
          <Route
            path="/help"
            exact
            render={() => (
              <Empty>
                <h1>Help Page</h1>
              </Empty>
            )}
          />
          <Route
            path="/static1"
            exact
            render={() => (
              <Empty>
                <h1>Static Page One</h1>
              </Empty>
            )}
          />
          <Route
            path="/static2"
            exact
            render={() => (
              <Empty>
                <h1>Static Page Two</h1>
              </Empty>
            )}
          />
          <Route
            path="/static3"
            exact
            render={() => (
              <Empty>
                <h1>Static Page Three</h1>
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
      <header>
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
            <li className={styles.helpLink}>
              <NavLink to="/help" activeClassName={styles.active}>
                Help
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      {fetched ? children : loading()}
      <footer>
        <nav>
          <ul className="constrain">
            <li>
              <NavLink to="/static1" activeClassName={styles.active}>
                Static page
              </NavLink>
            </li>
            <li>
              <NavLink to="/static2" activeClassName={styles.active}>
                Static page
              </NavLink>
            </li>
            <li>
              <NavLink to="/static3" activeClassName={styles.active}>
                Static page
              </NavLink>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default AppRouter;
