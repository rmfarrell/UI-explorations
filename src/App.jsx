import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DeepDive from './pages/DeepDive.jsx';
import Explore from './pages/Explore.jsx';
import Relationship from './pages/Relationship.jsx';
import styles from './styles/Main.module.css';

function AppRouter() {
  return (
    <Router>
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
    </Router>
  );
}

export default AppRouter;
