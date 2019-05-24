import React from 'react';
import styles from '../styles/Main.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
  const { activeClassName = 'active' } = props;
  return (
    <nav>
      <ul className="constrain">
        <li>
          <NavLink to="/static1" activeClassName={activeClassName}>
            Static page
          </NavLink>
        </li>
        <li>
          <NavLink to="/static2" activeClassName={activeClassName}>
            Static page
          </NavLink>
        </li>
        <li>
          <NavLink to="/static3" activeClassName={activeClassName}>
            Static page
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
