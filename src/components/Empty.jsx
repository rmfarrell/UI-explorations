import React from 'react';
import styles from '../styles/Empty.module.css';

export default function(props) {
  const { children, style } = props;
  return (
    <article className={styles.root} style={style}>
      <div>{children}</div>
    </article>
  );
}
