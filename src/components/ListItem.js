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
  const limit = image ? 10 : 25;
  return (
    <div className={styles.social}>
      <h4>
        {date}
        <a href="https://twitter.com" target="_blank">
          @{author}
        </a>
      </h4>
      {image && <div style={placeholderImage(image.color, image.ratio)} />}
      <p>
        {elipse(text, limit)} &nbsp;
        <a
          className={styles.readMore}
          href="https://twitter.com"
          target="_blank"
        >
          &laquo;{source}&raquo;
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
    <div className={styles.columnContainer}>
      <div className={styles.imgContainer}>
        <div style={placeholderImage(color, ratio)} />
      </div>
      <div className={styles.textContainer}>
        <h4>
          <a href="https://twitter.com" target="_blank">
            {source}
          </a>
          {date}
        </h4>
        <h3>
          <a href="#">{title}</a>
        </h3>
        <h5>By {author}</h5>
        <p>
          {summary} &nbsp;
          <a
            className={styles.readMore}
            href="https://twitter.com"
            target="_blank"
          >
            &laquo;{source}&raquo;
          </a>
        </p>
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
      <div
        className={styles.imgContainer}
        style={placeholderImage(color, ratio)}
      />
      <div class={styles.textContainer}>
        <h3>
          <a href="#">{title}</a>
        </h3>
        <h5>
          By {author},{' '}
          <a href="#">
            <em>{source}</em>
          </a>
        </h5>
        <h5>{date}</h5>
        <p>
          {summary} &nbsp;
          <a className={styles.readMore} href="#" target="_blank">
            &laquo;{source}&raquo;
          </a>
        </p>
      </div>
    </div>
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
    .join(' ')
    .concat(elipse);
}
