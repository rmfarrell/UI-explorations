import React from 'react';
import styles from '../styles/Main.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
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
