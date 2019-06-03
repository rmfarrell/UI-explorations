import React, { useEffect, useState } from 'react';
import { path } from 'ramda';
import styles from '../styles/ListItem.module.css';
import LinesEllipsis from 'react-lines-ellipsis';
import {
  formatDate,
  placeholderImage,
  getHead,
  classNames
} from '../lib/helpers';
import Link from './Link.jsx';
import { PROXY } from '../lib/constants';

// TODO this could be merged with Card probably
export default React.memo(function SingleItem(props) {
  const {
    data = {},
    className = '',
    size = 0,
    children = [],
    summaryLines = 4
  } = props;
  const {
    title = '',
    link = '#',
    entities: [entity],
    'ext-url': url,
    'published-at': publishedAt,
    id,
    value = ''
  } = data;
  const imgUrl = path(['views', 'large', 'url'], entity);
  const date = formatDate(new Date(publishedAt));
  return (
    <div className={classNames(styles.root, className, styles[`size-${size}`])}>
      {children}
      {/* {size === 0 && modifier === 'social' && <SmallSocialTeaser {...data} />} */}
      {size === 0 && (
        <SmallTeaser
          title={title}
          imgUrl={imgUrl}
          date={date}
          id={id}
          value={value}
        />
      )}
      {size === 1 && (
        <MediumTeaser link={link} {...data} summaryLines={summaryLines} />
      )}
      {size === 2 && (
        <LargeTeaser link={link} {...data} summaryLines={summaryLines} />
      )}
    </div>
  );
});

function SmallTeaser(props) {
  const { title = '', date = '', id = '', value = '', imgUrl = '' } = props;
  // TODO: if height and width are available figure out dimensions
  // const [] = useState(null);
  // useEffect(() => {
  //   if (!imgUrl) return;
  //   getImgData(imgUrl);
  // }, [imgUrl]);

  return (
    <Link to={`#${id}`}>
      {imgUrl && (
        <div className={styles.imgContainer}>
          <img alt={title} src={imgUrl} className={styles} />
        </div>
      )}
      {date && <h4>{date}</h4>}
      {title && <h3>{title}</h3>}
      {imgUrl ? '' : <p>{value}</p>}
    </Link>
  );

  // TODO: Figure out if we need this or its a backend thing
  async function getImgData(url) {
    const result = await getHead(`${PROXY}${url}`);
    console.log(result);
  }
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
    link = '#',
    summaryLines = 4
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
        {summaryLines > 0 && (
          <LinesEllipsis
            text={summary}
            maxLine={summaryLines}
            ellipsis="..."
            trimRight
            basedOn="words"
            component="p"
          />
        )}
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
    </div>
  );
}
