import React from 'react';
import Card from './Card';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  // transitionDuration: 0
};

export default function({ teasers = [] }) {
  return (
    <div className="App constrain">
      <Masonry options={masonryOptions}>
        {teasers.map(t => {
          return <Card data={t} key={t.id} />;
        })}
      </Masonry>
    </div>
  );
}
