import React from 'react';
import PagesMenu from './PagesMenu.jsx';
import styles from '../styles/Footer.module.css';

export default function(props) {
  return (
    <footer className={styles.root}>
      <PagesMenu activeClassName={styles.active} />
    </footer>
  );
}
