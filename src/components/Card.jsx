import React, { Component } from 'react';
import { formatDate, placeholderImage } from '../lib/helpers';
import styles from '../styles/Card.module.css';
import Link from './Link.jsx';

export default React.memo(function Card(props) {
  const {
    children = [],
    date = '',
    title = '',
    image = {
      color: '#333',
      ratio: 60
    },
    summary = '',
    source = '',
    author = '',
    link = ''
  } = props;
  return (
    <div className={styles.root}>
      {children}
      <div style={placeholderImage()} className={styles.imgContainer} />
      <h2>
        <Link to={link}>{title}</Link>
      </h2>
      <h4>
        {formatDate(date)} | {source}
      </h4>
      <p>
        {summary}...<Link to={link}>Read More &raquo;</Link>
      </p>
    </div>
  );
});
