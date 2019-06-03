import React from 'react';
import { classNames } from '../lib/helpers';
import styles from '../styles/List.module.css';
import Carousel from './Carousel';
import SingleItem from './SingleItem';

export default function List({
  className = '',
  children,
  variant,
  groupSize = 1,
  showControls = true,
  showReadMore = false,
  perpage = 5,
  expand = false,
  items = []
}) {
  let slide = [],
    slides = [];
  items.forEach(item => {
    if (slide.length < perpage * groupSize) {
      slide.push(item);
    } else {
      slides.push(slide);
      slide = [item];
    }
  });
  slides.push(slide);

  return (
    <aside className={[styles.root, className].join(' ')}>
      {children && <header>{children}</header>}
      <Carousel
        variant={variant}
        showControls={showControls && items.length > perpage * groupSize}
      >
        {slides.map((collection, idx) => {
          return (
            <ul
              key={idx}
              className={classNames(
                styles.itemList,
                styles[`width-${groupSize}`]
              )}
            >
              {collection.map(item => {
                return (
                  <li key={item.id}>
                    <SingleItem data={item} size={0} link={`#${item.id}`} />
                  </li>
                );
              })}
            </ul>
          );
        })}
      </Carousel>
      {showReadMore && (
        <button onClick={expand} className={styles.readmore}>
          Read more ({items.length})
        </button>
      )}
    </aside>
  );
}
