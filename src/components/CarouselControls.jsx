import React from 'react';
import styles from '../styles/Carousel.module.css';

function CarouselControls({
  size = 0,
  current = 0,
  setOffset = () => {},
  variant = 'normal',
  showControls = true
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
          disabled={current >= size - 1}
          onClick={() => setOffset(++current)}
        >
          Next &gt;{' '}
        </button>
      </li>
    ) : (
      ''
    );
  return (
    showControls && (
      <ul className={[styles.controls, styles[variant]].join(' ')}>
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
    )
  );

  function getPages() {
    const out = [];
    for (let x = 0; x < size; x++) {
      out.push(x);
    }
    return out;
  }
}

export default CarouselControls;
