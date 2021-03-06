import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import Modal from './Modal.jsx';
import {
  dereferenceArticle,
  placeholderImage,
  formatDate,
  classNames
} from '../lib/helpers';
import styles from '../styles/ArticleModal.module.css';

export default function() {
  const [modal, setModal] = useState({}),
    { articles } = useStoreon('articles');

  useEffect(() => {
    hashChangeHandler();
    window && window.addEventListener('hashchange', hashChangeHandler, false);
    return () => {
      window && window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, [setModal]);

  return Object.keys(modal).length ? (
    <Modal close={closeModal} headline={modal.headline}>
      {modal.content && modal.content}
    </Modal>
  ) : (
    ''
  );

  function hashChangeHandler(e) {
    let modal = {},
      article;
    const {
      location: { hash = '' }
    } = window;

    if (hash) {
      article = getArticle(hash.split('#')[1]);
      modal.headline = headline(article.document_type || article.type);
      modal.content = content(article);
    }
    setModal(modal);
  }

  function headline(content = '') {
    return <h2 className={styles.modalHeadline}>{content}</h2>;
  }

  function content(article) {
    const {
      title = '',
      summary = '',
      date = '',
      source = '',
      author = ''
    } = article;
    return (
      <article className={styles.root}>
        {title && <h1>{title}</h1>}
        <div className={styles.columnMain}>
          <header>
            <h3>
              <a>{source}</a> <br />
              {author}
            </h3>
            <h3>{formatDate(date)} </h3>
          </header>
          <div style={placeholderImage()} />
          <p>{summary}</p>
        </div>
        <div className={styles.columnAncillary}>
          <a className={classNames('button', styles.readMore)}>View Article</a>
        </div>
      </article>
    );
  }

  function getArticle(id) {
    return dereferenceArticle(articles, id)[0];
  }

  function closeModal() {
    const scrollPosition = window.scrollY;
    window.location.hash = '';
    window.scrollTo(window.scrollX, scrollPosition);
  }
}
