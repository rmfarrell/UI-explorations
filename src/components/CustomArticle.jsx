import React from 'react';
import styles from '../styles/CustomArticle.module.css';
import { placeholderImage } from '../lib/helpers';

export default function(props) {
  const { data } = props;
  const { title = '', short_description = '' } = data;
  console.log(data);
  return (
    <article className={styles.root}>
      <div
        className={styles.imgContainer}
        style={placeholderImage('#ccc', 70)}
      />
      <h1>
        <a onClick={openModal}>{title}</a>
      </h1>
      <p>
        {short_description} ... <a onClick={openModal}>READ MORE &raquo;</a>
      </p>
    </article>
  );

  function openModal() {
    console.log('openmodal');
  }
}
