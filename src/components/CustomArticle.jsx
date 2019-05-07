import React from 'react';
import styles from '../styles/CustomArticle.module.css';
import { placeholderImage } from '../lib/helpers';
import Modal from './Modal.jsx';
import { Link, withRouter, Route } from 'react-router-dom';

export default withRouter(CustomArticle);

function CustomArticle(props) {
  const {
    data,
    match,
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
        <Link to={`${match.url}/article`}>{title}</Link>
      </h1>
      <p>
        {short_description} ...{' '}
        <Link to={`${match.url}/article`}>READ MORE &raquo;</Link>
      </p>

      <Route path={`${match.url}/article`} component={modal} />
    </article>
  );

  function modal() {
    return (
      <Modal isOpen={true} close={closeModal}>
        {img()}
        <h1>{title}</h1>
        <p>{content}</p>
        <p>{content}</p>
      </Modal>
    );
  }

  function closeModal() {
    push(`${match.url}`);
  }
}
