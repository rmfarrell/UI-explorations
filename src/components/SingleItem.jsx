import React from 'react';
import styles from '../styles/ListItem.module.css';
import LinesEllipsis from 'react-lines-ellipsis';

// TODO this could be merged with Card probably
export default function SingleItem({
  data = {},
  className = '',
  size = 0,
  children = [],
  type
}) {
  const modifier = data.type === 'Social Media Item' ? 'social' : 'article';
  return (
    <div className={[styles.root, className, styles[`size-${size}`]].join(' ')}>
      {children}
      {size === 0 && modifier === 'social' && <SmallSocialTeaser {...data} />}
      {size === 0 && modifier === 'article' && <SmallTeaser {...data} />}
      {size === 1 && modifier === 'article' && <MediumTeaser {...data} />}
      {size === 2 && modifier === 'article' && <LargeTeaser {...data} />}
    </div>
  );
}

function SmallTeaser({ date = '', title = '' }) {
  return (
    <a href="#">
      <h4>{date.toString()}</h4>
      <LinesEllipsis
        text={title}
        maxLine="3"
        ellipsis="..."
        trimRight
        basedOn="letters"
        component="h3"
      />
    </a>
  );
}

function MediumTeaser(data) {
  const {
    date = '',
    title = '',
    image = {},
    summary = '',
    source = '',
    author = ''
  } = data;

  return (
    <div>
      <div className={styles.imgContainer} style={placeholderImage()} />
      <div className={styles.textContainer}>
        <h3>
          <a href="#">{title}</a>
        </h3>
        <h4>
          <a href="#">{source}</a> | {String(date)}
        </h4>
        <h5>By {author}</h5>
        <LinesEllipsis
          text={summary}
          maxLine="6"
          ellipsis="..."
          trimRight
          basedOn="letters"
          component="p"
        />
      </div>
    </div>
  );
}

function LargeTeaser({
  date = '',
  title = '',
  image = {},
  summary = '',
  source = '',
  author = ''
}) {
  const { color = '#000', ratio = 100 } = image;
  return (
    <div>
      <figure className={styles.imgContainer} style={placeholderImage()}>
        <div className={styles.imgOverlay}>
          <h5>{source}</h5>
          <h5>{date.toString()}</h5>
        </div>
      </figure>
      <div className={styles.textContainer}>
        <h3>
          <a href="#">
            <LinesEllipsis
              text={title}
              maxLine="2"
              ellipsis="..."
              trimRight
              basedOn="letters"
            />
          </a>
        </h3>
        <p>
          <LinesEllipsis
            text={summary}
            maxLine="4"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </p>
      </div>
    </div>
  );
}

function SmallSocialTeaser(data) {
  const { date = '', summary = '', author = '', source = '' } = data;
  const limit = 25;
  return (
    <div className={styles.social}>
      <h4>
        {date.toString()}
        <a href="https://twitter.com" target="_blank">
          @{author}
        </a>
      </h4>
      {/* <div style={placeholderImage()} /> */}
      <p>
        {elipse(summary, limit)} &nbsp;
        <a
          className={styles.readMore}
          href="https://twitter.com"
          target="_blank"
        >
          ({source})
        </a>
      </p>
    </div>
  );
}

// -- Helpers

function placeholderImage(color = '#888', ratio = 60) {
  return {
    background: `${color}`,
    height: '0',
    paddingBottom: `${ratio}%`
  };
}

function elipse(text = '', limit = 25) {
  const words = text.split(' '),
    elipse = words.length > limit ? `...` : '';

  return words
    .slice(0, limit)
    .join(' ')
    .concat(elipse);
}