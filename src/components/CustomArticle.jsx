import React from 'react';
import styles from '../styles/CustomArticle.module.css';
import modalStyles from '../styles/ArticleModal.module.css';
import { placeholderImage, classNames, formatDate } from '../lib/helpers';
import Modal from './Modal.jsx';
import { Link, withRouter, Route } from 'react-router-dom';

export default withRouter(CustomArticle);

function CustomArticle(props) {
  const {
    data,
    match,
    history: { push }
  } = props;
  const {
    title = '',
    short_description = '',
    content = '',
    curator = ''
  } = data;

  function img() {
    return (
      <div
        className={styles.imgContainer}
        style={placeholderImage('#ccc', 50)}
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

      <Route path={`${match.url}/article`} exact component={modal} />
    </article>
  );

  function modal() {
    console.log(data);
    return (
      <Modal isOpen={true} close={closeModal}>
        <article className={modalStyles.root}>
          {title && <h1>{title}</h1>}
          <div className={modalStyles.columnLeft}>
            <h3>{curator}</h3>
            <p>{short_description}</p>
            <div className={modalStyles.dateline}>{formatDate(new Date())}</div>
            <a className={classNames('button', modalStyles.readMore)}>
              Read More
            </a>
          </div>
          <div className={modalStyles.columnRight}>
            {img()}
            <p>{content}</p>
          </div>
        </article>

        {/* {img()}
        <h1 className={modalStyles.}>{title}</h1>
        <p>{content}</p>
        <p>{content}</p> */}
      </Modal>
    );
  }

  function closeModal() {
    push(`${match.url}`);
  }
}
