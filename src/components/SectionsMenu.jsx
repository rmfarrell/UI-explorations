import React from 'react';
import { NavLink } from 'react-router-dom';
import { RelationshipIcon, ExploreIcon, DeepDiveIcon } from '../Icons.jsx';
import styles from '../styles/SectionsMenu.module.css';
import { classNames } from '../lib/helpers';

export default function(props) {
  return (
    <nav className={classNames(styles.root, 'constrain')}>
      <p>View</p>
      <ul>
        <li>
          <NavLink to="/relationship" activeClassName={styles.active}>
            <RelationshipIcon />
          </NavLink>
        </li>
        <li>
          <NavLink to="/deep-dives" activeClassName={styles.active}>
            <DeepDiveIcon />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/'}
            exact
            onlyActiveOnIndex
            activeClassName={styles.active}
          >
            <ExploreIcon />
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
