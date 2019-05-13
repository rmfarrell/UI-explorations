import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import Modal from './Modal.jsx';
import { dereferenceArticle } from '../lib/helpers';
import styles from '../styles/ArticleModal.module.css';
console.log(styles);

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
      console.log(article);
      modal.headline = headline(article.document_type || article.type);
      modal.content = content(article);
    }
    setModal(modal);
  }

  function headline(content = '') {
    return <h2 className={styles.modalHeadline}>{content}</h2>;
  }

  function content(article) {
    const { title = '' } = article;
    return (
      <article className={styles.root}>
        {title && <h1>title</h1>}
        <div className={styles.columnLeft}>1</div>
        <div className={styles.columnRight}>2</div>
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
