import React from 'react';
import styles from '../styles/Carousel.module.css';

// TODO: contain the contents in a slot
function CarouselControls({
  total = 0,
  limit = 0,
  current = 0,
  groupSize = 10,
  setOffset = () => {},
  variant = 'normal'
}) {
  const previous =
    variant === 'normal' ? (
      <li>
        <button disabled={current === 0} onClick={() => setOffset(--current)}>
          &lt; Previous
        </button>
      </li>
    ) : (
      ''
    );
  const next =
    variant === 'normal' ? (
      <li>
        <button
          disabled={current >= getPagesSize() - 1}
          onClick={() => setOffset(++current)}
        >
          Next &gt;{' '}
        </button>
      </li>
    ) : (
      ''
    );
  return (
    <ul className={[styles.root, styles[variant]].join(' ')}>
      {previous}
      {getPages().map(page => {
        const isCurrent = page === current;
        return (
          <li key={page}>
            <button
              className={isCurrent ? styles.active : ''}
              onClick={() => setOffset(page)}
            >
              {page}
            </button>
          </li>
        );
      })}
      {next}
    </ul>
  );

  function getPages() {
    const out = [];
    for (let x = 0; x < getPagesSize(); x++) {
      out.push(x);
    }
    return out;
  }

  function getPagesSize() {
    return Math.ceil(total / limit);
  }
}

export default CarouselControls;
