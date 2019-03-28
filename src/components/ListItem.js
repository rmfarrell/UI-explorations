import React from 'react';
import styles from '../styles/ListItem.module.css';

// TODO this could be merged with Card probably
export default function ListItem({
  data = {},
  className = '',
  size = 0,
  type = 'article'
}) {
  return (
    <li className={[styles.root, className, styles[`size-${size}`]].join(' ')}>
      {size === 0 && type === 'social' && <SmallSocialTeaser {...data} />}
      {size === 0 && type === 'article' && <SmallTeaser {...data} />}
      {size === 1 && type === 'article' && <MediumTeaser {...data} />}
      {size === 2 && type === 'article' && <LargeTeaser {...data} />}
    </li>
  );
}

function SmallSocialTeaser({
  date = '',
  text = '',
  author = '',
  source = '',
  image = ''
}) {
  return (
    <div>
      <h4>
        {date}{' '}
        <a href="https://twitter.com" target="_blank">
          @{author}
        </a>
      </h4>
      <p>
        {elipse(text, 25)}
        <a
          className={styles.readMore}
          href="https://twitter.com"
          target="_blank"
        >
          {source}&raquo;
        </a>
      </p>
    </div>
  );
}

function SmallTeaser({ date = '', title = '' }) {
  return (
    <a href="#">
      <h4>{date}</h4>
      <h3>{title}</h3>
    </a>
  );
}

function MediumTeaser({
  date = '',
  title = '',
  image = {},
  summary = '',
  source = '',
  author = ''
}) {
  const { color = '#000', ratio = 100 } = image;
  return (
    <a href="#" className={styles.columnContainer}>
      <div className={styles.imgContainer}>
        <div style={placeholderImage(color, ratio)} />
      </div>
      <div className={styles.textContainer}>
        <h4>{date}</h4>
        <h3>{title}</h3>
        <h5>
          By {author}, <em>{source}</em>
        </h5>
        <p>{summary}</p>
      </div>
    </a>
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
    <a href="#">
      <div
        className={styles.imgContainer}
        style={placeholderImage(color, ratio)}
      />
      <h3>{title}</h3>
      <h5>
        By {author}, <em>{source}</em>
      </h5>
      <h5>{date}</h5>
      <p>{summary}</p>
    </a>
  );
}

// -- Helpers

function placeholderImage(color, ratio) {
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
    .concat(elipse)
    .join(' ');
}
