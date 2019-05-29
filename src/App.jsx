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
import { RelationshipIcon, DeepDiveIcon, ExploreIcon } from './Icons.jsx';

// -- Libs
import {
  fetchDeepDives,
  fetchRssItems,
  fetchSocialMedia,
  fetchExternalResources,
  fetchRelationships,

  // new
  fetchList,
  fetchDetail
} from './lib/api';
import { classNames } from './lib/helpers';

// -- Components
import DeepDive from './pages/DeepDive.jsx';
import DeepDivesAll from './pages/DeepDivesAll.jsx';
import Explore from './pages/Explore.jsx';
import Relationship from './pages/Relationship.jsx';
import Empty from './components/Empty.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SectionsMenu from './components/SectionsMenu.jsx';

const collectionPages = [
  '/relationship/:country',
  '/deep-dives/country/:country',
  '/deep-dives/:id',
  '/relationship',
  '/deep-dives'
];

_testApi();

async function _testApi() {
  const [error, json] = await fetchDetail('1503fb50669a11e9b998fb57436f5124', {
    // fields: ['created-at', 'meta']
  });
  console.log(json);
}

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
      <Header />
      <SectionsMenu />
      {fetched ? children : loading()}
      <Footer />
    </div>
  );
}

export default AppRouter;
