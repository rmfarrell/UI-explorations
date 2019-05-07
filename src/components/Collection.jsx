import React from 'react';
import Card from './Card';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  // transitionDuration: 0
};

export default React.memo(function({ articles = [] }) {
  return (
    <div className="App constrain">
      <Masonry options={masonryOptions}>
        {articles.map(data => {
          return <Card {...data} key={data.id} />;
        })}
      </Masonry>
    </div>
  );
});
