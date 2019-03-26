import React from 'react';
import styles from '../styles/Carousel.module.css';

export default function({ isOpen = false, children = [] }) {
  const openClass = isOpen ? styles.open : styles.closed;
  return (
    <aside className={[styles.root, openClass].join(' ')}>
      <div class={styles.top}>
        <button style={styles.close}>&times;</button>
      </div>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
