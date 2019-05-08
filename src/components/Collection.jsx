import React from 'react';
import Card from './Card';
import Masonry from 'react-masonry-component';
import styles from '../styles/Collection.module.css';

const masonryOptions = {
  // transitionDuration: 0
  columnWidth: 0
};

export default React.memo(function(props) {
  const { showType = true, articles = [], className = '' } = props;
  return (
    <div className={[className].join(' ')}>
      <Masonry options={masonryOptions} className={[styles.grid].join(' ')}>
        {articles.map(data => {
          return (
            <div className="grid--item__third" key={data.id}>
              <Card {...data}>
                {showType && (
                  <header>
                    <h3>{data.document_type || data.type}</h3>
                  </header>
                )}
              </Card>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
});
