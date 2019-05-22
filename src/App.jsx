import React, { useState, useEffect } from 'react';
import StoreContext from 'storeon/react/context';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link
} from 'react-router-dom';
import styles from './styles/Main.module.css';
import store from './store/index.js';
import useStoreon from 'storeon/react';

// -- Icons
import { RelationshipIcon } from './Icons.jsx';

// -- Libs
import {
  fetchDeepDives,
  fetchRssItems,
  fetchSocialMedia,
  fetchExternalResources,
  fetchRelationships
} from './lib/api';
import { classNames } from './lib/helpers';

// -- Modules
import DeepDive from './pages/DeepDive.jsx';
import DeepDivesAll from './pages/DeepDivesAll.jsx';
import Explore from './pages/Explore.jsx';
import Relationship from './pages/Relationship.jsx';
import Empty from './components/Empty.jsx';
import Map from './components/Map.jsx';

const collectionPages = [
  '/relationship/:country',
  '/deep-dives/country/:country',
  '/deep-dives/:id',
  '/relationship',
  '/deep-dives'
];

function AppRouter() {
  return (
    <StoreContext.Provider value={store}>
      <Router>
        <Main>
          <Route path="/" exact component={Explore} />
          <Route path="/explore" exact component={Explore} />
          <Route
            path={'/deep-dives'}
            render={({ match }) => {
              return (
                <React.Fragment>
                  <Route path="/deep-dives/:id" component={DeepDive} />
                  <Route
                    path={['/deep-dives', '/deep-dives/country/:country']}
                    exact
                    render={({ match, history }) => (
                      <DeepDivesAll history={history} match={match} />
                    )}
                  />
                </React.Fragment>
              );
            }}
          />
          <Route
            path={['/relationship', '/relationship/:country']}
            exact
            render={({ match, history }) => (
              <Relationship
                match={match}
                history={history}
                country={match && match.params.country}
              />
            )}
          />
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
        <div className={classNames(styles.topbar)}>
          <h1 className="constrain">
            <Link to="/">Transatlantic Periscope</Link>
          </h1>
          {tray()}
        </div>
        {sectionsMenu()}
      </header>
      {fetched ? children : loading()}
      <footer>{pagesMenu()}</footer>
    </div>
  );

  function tray() {
    const [isTrayOpen, setIsTrayOpen] = useState(false);
    return (
      <div
        className={classNames(styles.tray, isTrayOpen ? styles.trayOpen : '')}
      >
        <button
          onClick={toggleTray}
          className={classNames(styles.closeButton, styles.toggle)}
        >
          {isTrayOpen ? 'x' : '='}
        </button>
        {pagesMenu()}
      </div>
    );
    function toggleTray() {
      setIsTrayOpen(!isTrayOpen);
    }
  }

  function sectionsMenu() {
    return (
      <nav>
        <ul className={classNames('constrain', styles.sectionsMenu)}>
          <li>
            <NavLink to="/relationship" activeClassName={styles.active}>
              <RelationshipIcon />
            </NavLink>
          </li>
          <li>
            <NavLink to="/relationship" activeClassName={styles.active}>
              R
            </NavLink>
          </li>
          <li>
            <NavLink to="/deep-dives" activeClassName={styles.active}>
              D
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" activeClassName={styles.active}>
              X
            </NavLink>
          </li>
          <li className={styles.helpLink}>
            <NavLink to="/help" activeClassName={styles.active}>
              ?
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }

  function pagesMenu() {
    return (
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
    );
  }
}

export default AppRouter;
