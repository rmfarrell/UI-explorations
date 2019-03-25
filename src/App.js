import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import InfiniteCollection from './components/InfiniteCollection';
import List from './components/List';

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/collection">Collection</Link>
            </li>
            <li>
              <Link to="/list">List</Link>
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
