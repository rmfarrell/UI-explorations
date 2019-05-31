import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import Carousel from './Carousel.jsx';
import styles from '../styles/TwitterCardTile.module.css';

export default React.memo(function(props) {
  const { tweets } = props;
  return (
    <div className={styles.root}>
      <Carousel
        size={1}
        onChange={changeHandler}
        className={styles.carousel}
        variant="progress"
      >
        {tweets.map(tweet => {
          return (
            <div
              className={styles.tweetContainer}
              key={getTwitterFromUrl(tweet['ext-url'])}
            >
              <TwitterTweetEmbed
                tweetId={getTwitterFromUrl(tweet['ext-url'])}
                onLoaded={onLoaded}
                options={{ cards: 'hidden' }}
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );

  function changeHandler(idx, el) {
    // TODO: lazy load tweet
  }
});

function getTwitterFromUrl(url = '') {
  return url.split('https://twitter.com/statuses/')[1] || '';
}

function onLoaded(el) {
  // console.log(window.__twttr.callbacks);
  if (!el) return;
  el.style.margin = '0';
  el.style.width = '100%';
  el.style.minWidth = '0';
}
