import React, { useState } from 'react';
import styles from '../styles/Header.module.css';
import { Link, NavLink } from 'react-router-dom';

import { classNames } from '../lib/helpers';
import PagesMenu from './PagesMenu';

export default function(props) {
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  return (
    <header>
      <div className={classNames(styles.root)}>
        <h1 className="constrain">
          <Link to="/">Transatlantic Periscope</Link>
        </h1>
        {tray()}
      </div>
    </header>
  );

  function tray() {
    return (
      <div
        className={classNames(styles.tray, isTrayOpen ? styles.trayOpen : '')}
      >
        <button onClick={toggleTray} className={styles.toggle}>
          <span>Menu</span>
          <div className={styles.hamburger}>
            <i />
            <i />
            <i />
          </div>
        </button>
        <PagesMenu activeClassName={styles.active} />
      </div>
    );
    function toggleTray() {
      setIsTrayOpen(!isTrayOpen);
    }
  }
}
