import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import InfiniteCollection from './components/InfiniteCollection';
import List from './components/List';
import styles from './styles/Nav.module.css';

function AppRouter() {
  return (
    <Router>
      <div>
        <nav className={styles.main}>
          <ul className="constrain">
            <li>
              <NavLink to="/collection" activeClassName={styles.active}>
                <h2>Infinite Scroll with Filters</h2>
                <p>
                  Pinterest-inspired infinite scroll with filters for type and
                  topic. This approach allows you to put all the content cards
                  in the same spot with easy filtering. It's a familiar design
                  pattern and allows for great information density. "Invisible"
                  pagination tends to front load newer content. Depending on the
                  backend capabilities filtering by headline may also be
                  possible with this approach. One limitation is that it has to
                  be the last thing on the page.
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/list" activeClassName={styles.active}>
                <h2>Links list with Carousel</h2>
                <p>
                  Simple carousel solution to displaying a very long list of
                  links. A couple possible design approaches are shown.
                </p>
              </NavLink>
            </li>
          </ul>
        </nav>
        <Route path="/collection" exact component={InfiniteCollection} />
        <Route path="/list" exact component={List} />
      </div>
    </Router>
  );
}

export default AppRouter;
