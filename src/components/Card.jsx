import React, { Component } from 'react';
import styles from '../styles/Card.module.css';
import { formatDate, placeholderImage } from '../lib/helpers';

export default React.memo(function Card(props) {
  const {
      date = '',
      title = '',
      image = {
        color: '#333',
        ratio: 60
      },
      summary = '',
      source = '',
      author = '',
      link = '#',
      type = '',
      document_type = ''
    } = props,
    cardType = document_type || type;

  return (
    <div className={styles.root}>
      <h3>{cardType}</h3>
      <div style={placeholderImage()} className={styles.imgContainer} />
      <h2>{title}</h2>
      <h4>
        {formatDate(date)} | {source}
      </h4>
      <p>{summary}</p>
    </div>
  );
});
