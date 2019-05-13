import React, { useEffect } from 'react';
import styles from '../styles/Modal.module.css';

export default function(props) {
  const {
    isOpen = true,
    children = [],
    close = () => {},
    headline = ''
  } = props;
  const openClass = isOpen ? styles._open : styles._closed;

  // Prevent body from scrolling when modal is open
  useEffect(() => {
    const bodyClass = document.querySelector('body').classList;
    bodyClass.add('modal-is-open');
    return () => bodyClass.remove('modal-is-open');
  });

  return (
    <div className={[styles.root, openClass].join(' ')} onClick={close}>
      <aside className={[styles.modal, 'modal'].join(' ')}>
        <div className={styles.top}>
          {headline && headline}
          <button className={styles.closeBtn}>&times;</button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </div>
  );
}
