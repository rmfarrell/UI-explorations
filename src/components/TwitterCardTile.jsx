import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import Carousel from './Carousel.jsx';
import styles from '../styles/TwitterCardTile.module.css';

export default function(props) {
  const { tweets } = props;
  console.log(tweets[1]);
  return (
    <div className={styles.root}>
      {/* <TwitterTweetEmbed
        tweetId={getTwitterFromUrl(tweets[0]['ext-url'])}
        options={{ chrome: 'noborders' }}
        data-chrome="noborders"
        onLoaded={onLoaded}
      /> */}
      <Carousel
        size={1}
        onChange={changeHandler}
        className={styles.carousel}
        variant="progress"
      >
        {tweets.map(tweet => {
          return (
            <div className={styles.tweetContainer}>
              <TwitterTweetEmbed
                key={getTwitterFromUrl(tweet['ext-url'])}
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
    console.log(el);
  }
}

function getTwitterFromUrl(url = '') {
  return url.split('https://twitter.com/statuses/')[1] || '';
}

function onLoaded(el) {
  el.style.margin = '0';
  el.style.width = '100%';
  el.style.minWidth = '0';
  // el.querySelector('.EmbeddedTweet').style.border = 'none';
}
