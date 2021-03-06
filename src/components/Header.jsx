import React, { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';
import { Link, withRouter } from 'react-router-dom';
import { classNames, i18n } from '../lib/helpers';
import PagesMenu from './PagesMenu';

export default withRouter(function(props) {
  const { location } = props;
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  useEffect(() => {
    setIsTrayOpen(false);
  }, [location.pathname]);

  return (
    <header className={classNames(styles.root)}>
      <h1 className="constrain">
        <Link to="/">{i18n('title')}</Link>
      </h1>
      <Tray setIsTrayOpen={setIsTrayOpen} isTrayOpen={isTrayOpen} />
    </header>
  );
});

function Tray(props) {
  const { setIsTrayOpen, isTrayOpen = false } = props;
  return (
    <div className={classNames(styles.tray, isTrayOpen ? styles.trayOpen : '')}>
      <button onClick={toggleTray} className={styles.toggle}>
        <span>{i18n('header', 'menu')}</span>
        <div className={styles.hamburger}>
          <i />
          <i />
          <i />
        </div>
      </button>
      <div className={styles.dimmer} onClick={toggleTray} />
      <PagesMenu activeClassName={styles.active} className={styles.pagesMenu} />
    </div>
  );

  function toggleTray() {
    setIsTrayOpen(!isTrayOpen);
  }
}
