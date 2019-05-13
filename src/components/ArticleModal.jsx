import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';
import Modal from './Modal.jsx';

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
    <Modal close={closeModal}>
      <h1>{modal.content}</h1>
    </Modal>
  ) : (
    ''
  );

  function hashChangeHandler(e) {
    const {
      location: { hash = '' }
    } = window;
    const modal = hash
      ? {
          headline: '',
          content: 'content'
        }
      : {};
    setModal(modal);
  }

  function closeModal() {
    const scrollPosition = window.scrollY;
    window.location.hash = '';
    window.scrollTo(window.scrollX, scrollPosition);
  }
}
