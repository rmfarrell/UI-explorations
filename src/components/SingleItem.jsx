import React from 'react';
import styles from '../styles/ListItem.module.css';
import LinesEllipsis from 'react-lines-ellipsis';
import { formatDate, placeholderImage } from '../lib/helpers';
import Link from './Link';

// TODO this could be merged with Card probably
export default React.memo(function SingleItem(props) {
  const { data = {}, className = '', size = 0, children = [] } = props;
  const modifier = data.type === 'Social Media Item' ? 'social' : 'article';
  const link =
    data.document_type === 'Deep Dive'
      ? `/deep-dives/${data.id.split('_')[1]}`
      : '#';
  return (
    <div className={[styles.root, className, styles[`size-${size}`]].join(' ')}>
      {children}
      {size === 0 && modifier === 'social' && <SmallSocialTeaser {...data} />}
      {size === 0 && modifier === 'article' && (
        <SmallTeaser link={link} {...data} />
      )}
      {size === 1 && modifier === 'article' && (
        <MediumTeaser link={link} {...data} />
      )}
      {size === 2 && modifier === 'article' && (
        <LargeTeaser link={link} {...data} />
      )}
    </div>
  );
});

function SmallTeaser({ date, title = '', link = '#' }) {
  return (
    <Link to={link}>
      <h4>{formatDate(date)}</h4>
      <LinesEllipsis
        text={title}
        maxLine="3"
        ellipsis="..."
        trimRight
        basedOn="words"
        component="h3"
      />
    </Link>
  );
}

function MediumTeaser(props) {
  const {
    date = new Date(),
    title = '',
    image = {},
    summary = '',
    source = '',
    author = '',
    link = '#'
  } = props;

  return (
    <div>
      <div className={styles.imgContainer} style={placeholderImage()} />
      <div className={styles.textContainer}>
        <h3>
          <Link to={link}>{title}</Link>
        </h3>
        <h4>
          <Link to={link}>{source} </Link>| {formatDate(date)}
        </h4>
        <h5>By {author}</h5>
        <LinesEllipsis
          text={summary}
          maxLine="6"
          ellipsis="..."
          trimRight
          basedOn="words"
          component="p"
        />
      </div>
    </div>
  );
}

function LargeTeaser(props) {
  const {
    date = '',
    title = '',
    image = {},
    summary = '',
    source = '',
    author = '',
    link = '#'
  } = props;
  return (
    <div>
      <figure className={styles.imgContainer} style={placeholderImage()}>
        <div className={styles.imgOverlay}>
          <h5>{source}</h5>
          <h5>{formatDate(date)}</h5>
        </div>
      </figure>
      <div className={styles.textContainer}>
        <h3>
          <Link to={link}>
            <LinesEllipsis
              text={title}
              maxLine="2"
              ellipsis="..."
              trimRight
              basedOn="words"
            />
          </Link>
        </h3>
        <LinesEllipsis
          text={summary}
          maxLine="4"
          ellipsis="..."
          trimRight
          basedOn="words"
          component="p"
        />
      </div>
    </div>
  );
}

function SmallSocialTeaser(data) {
  const { date, summary = '', author = '', source = '' } = data;
  const limit = 25;
  return (
    <div className={styles.social}>
      <h4>
        {formatDate(date)}
        <Link to={'https://twitter.com'} target="_blank">
          &nbsp;@{author}
        </Link>
      </h4>
      {/* <div style={placeholderImage()} /> */}
      <LinesEllipsis
        text={summary}
        maxLine="3"
        ellipsis="..."
        trimRight
        basedOn="words"
        component="h3"
      >
        test
      </LinesEllipsis>
      {/* <p>
        {elipse(summary, limit)} &nbsp;
        <a
          className={styles.readMore}
          href="https://twitter.com"
          target="_blank"
        >
          ({source})
        </a>
      </p> */}
    </div>
  );
}
