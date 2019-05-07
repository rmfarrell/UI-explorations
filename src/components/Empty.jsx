import React from 'react';
import styles from '../styles/Empty.module.css';

export default function(props) {
  const { children } = props;
  console.log(props);
  return (
    <article className={styles.root}>
      <div>{children}</div>
    </article>
  );
}