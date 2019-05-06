import React from 'react';
import styles from '../styles/CustomArticle.module.css';
import { placeholderImage } from '../lib/helpers';
import Modal from './Modal.jsx';
import { Link, withRouter } from 'react-router-dom';

export default withRouter(CustomArticle);

function CustomArticle(props) {
  const {
    data,
    modalIsVisible = false,
    match: {
      params: { id }
    },
    history: { push }
  } = props;
  const { title = '', short_description = '', content = '' } = data;
  function img() {
    return (
      <div
        className={styles.imgContainer}
        style={placeholderImage('#ccc', 70)}
      />
    );
  }
  return (
    <article className={styles.root}>
      {img()}
      <h1>
        <Link to={`/deep-dives/${id}/article`}>{title}</Link>
      </h1>
      <p>
        {short_description} ...{' '}
        <Link to={`/deep-dives/${id}/article`}>READ MORE &raquo;</Link>
      </p>
      <Modal isOpen={modalIsVisible} close={closeModal}>
        {img()}
        <h1>{title}</h1>
        <p>{content}</p>
        <p>{content}</p>
      </Modal>
    </article>
  );

  function closeModal() {
    push(`/deep-dives/${id}`);
  }
}
