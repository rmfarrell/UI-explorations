import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import Modal from './Modal.jsx';

import { dereferenceArticle } from '../lib/helpers';

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
      <h1>{modal.content}</h1>
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
      modal.headline = <h2>{article.document_type || article.type}</h2>;
      modal.content = 'content';
    }
    setModal(modal);
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
