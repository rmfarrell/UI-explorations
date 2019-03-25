import React from 'react';
import Card from './Card';
import Masonry from 'react-masonry-component';
import styles from '../styles/App.css';

const masonryOptions = {
  transitionDuration: 0
};

export default function({ teasers = [] }) {
  return (
    <div className="App">
      <Masonry options={masonryOptions} className={styles.masonryContainer}>
        {teasers.map(t => {
          return <Card data={t} key={t.id} />;
        })}
      </Masonry>
    </div>
  );
}
