import React from 'react';
import styles from '../styles/ListItem.module.css';

// TODO this could be merged with Card probably
export default function ListItem({ data = {}, className = '', size = 0 }) {
  return (
    <li className={[styles.root, className, styles[`size-${size}`]].join(' ')}>
      <a href="#">
        {size === 0 && <SmallTeaser {...data} />}
        {size === 1 && <MediumTeaser {...data} />}
        {size === 2 && <LargeTeaser {...data} />}
      </a>
    </li>
  );
}

function SmallTeaser({ date = '', title = '' }) {
  return (
    <div>
      <h4>{date}</h4>
      <h3>{title}</h3>
    </div>
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
        <div style={horizontalImageStyle(color, ratio)} />
      </div>
      <div className={styles.textContainer}>
        <h4>{date}</h4>
        <h3>{title}</h3>
        <h5>
          By {author}, <em>{source}</em>
        </h5>
        <p>{summary}</p>
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
        style={horizontalImageStyle(color, ratio)}
      />
      <h3>{title}</h3>
      <h5>
        By {author}, <em>{source}</em>
      </h5>
      <h5>{date}</h5>
      <p>{summary}</p>
    </div>
  );
}

// -- Helpers

function horizontalImageStyle(color, ratio) {
  return {
    background: `${color}`,
    height: '0',
    paddingBottom: `${ratio}%`
  };
}
