import React from 'react';
import Card from './Card';
import Masonry from 'react-masonry-component';

const masonryOptions = {
  // transitionDuration: 0
};

export default React.memo(function(props) {
  const { showType = true, articles = [], className = '' } = props;
  return (
    <div className={['constrain', className].join(' ')}>
      <Masonry options={masonryOptions}>
        {articles.map(data => {
          return (
            <Card {...data} key={data.id}>
              {showType && (
                <header>
                  <h3>{data.document_type || data.type}</h3>
                </header>
              )}
            </Card>
          );
        })}
      </Masonry>
    </div>
  );
});
