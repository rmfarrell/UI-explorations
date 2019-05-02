import React, { Component } from 'react';
import styles from '../styles/Card.module.css';

function Card({ data = {} }) {
  const {
      title,
      source,
      author,
      date,
      country,
      issues,
      image,
      type,
      summary
    } = data,
    imgPlaceholder = {
      background: `${image.color}`,
      height: '0',
      paddingBottom: `${image.ratio}%`
    };
  return (
    <div className={styles.root}>
      <h3>{type}</h3>
      <div style={imgPlaceholder} className={styles.imgContainer} />
      <h3>{issues.join(', ')}</h3>
      <h2>{title}</h2>
      <h4>
        {date} | {source}
      </h4>
      <p>{summary}</p>
    </div>
  );
}

export default Card;
