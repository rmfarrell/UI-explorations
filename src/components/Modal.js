import React from 'react';
import styles from '../styles/Modal.module.css';

export default function({ isOpen = true, children = [], close = () => {} }) {
  const openClass = isOpen ? styles.open : styles.closed;
  return (
    <div className={[styles.root, openClass].join(' ')} onClick={close}>
      <aside className={[styles.modal, 'modal'].join(' ')}>
        <div className={styles.top}>
          <button className={styles.closeBtn}>&times;</button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </div>
  );
}
