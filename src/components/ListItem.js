import React from 'react';
import styles from '../styles/ListItem.module.css';

// TODO this could be merged with Card probably
export default function ListItem({ data = {}, className = '', size = 0 }) {
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
    <li className={[styles.root, className].join(' ')}>
      <h4>{date}</h4>
      <h3>{title}</h3>
    </li>
  );
}
