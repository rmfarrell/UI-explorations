import React, { Component } from 'react';
import { articles, socialMediaItems, Article } from '../mocks/generator';
import Carousel from './Carousel';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';

const mocks = {
    expandingArticles: [articles(3), articles(3), articles(3)],
    columns: {
      social: socialMediaItems(3),
      small: articles(6),
      medium: articles(3)
    }
  },
  expanderText = {
    more: `${String.fromCharCode(8249)} Read more ${String.fromCharCode(8250)}`,
    less: `${String.fromCharCode(8250)} Read less ${String.fromCharCode(8249)}`
  };

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flexGroup: resetFlexGroupSizes()
    };
  }
  render() {
    return (
      <article className={[styles.root, 'constrain'].join(' ')}>
        <h1>Columns</h1>
        <div className={styles.group}>
          <ul className={styles.medium}>
            <h2>Article (medium)</h2>
            {mocks.columns.medium.map(t => {
              return <ListItem data={t} size={1} key={t.id} />;
            })}
          </ul>
          <ul className={styles.small}>
            <h2>Article (small)</h2>
            {mocks.columns.small.map(t => {
              return <ListItem data={t} key={t.id} />;
            })}
          </ul>
          <div className={styles.small}>
            <h2>Social (small)</h2>
            <ul>
              {mocks.columns.social.map(t => {
                return <ListItem data={t} key={t.id} type="social" />;
              })}
            </ul>
          </div>
        </div>
        <h1>Article (large)</h1>
        <div className={styles.group}>
          <ul className={styles.large}>
            {articles(3).map(t => {
              return <ListItem data={t} size={2} key={t.id} />;
            })}
          </ul>
        </div>
        <h1>Mixed Layouts</h1>
        <div className={styles.group}>
          <ul className={styles.medium}>
            <ListItem data={Article()} size={2} />
          </ul>
          <Carousel className={styles.small}>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
            <ul>
              {articles(4).map(t => {
                return <ListItem data={t} key={t.id} size={0} />;
              })}
            </ul>
          </Carousel>
          <ul className={styles.small}>
            {articles(4).map(t => {
              return <ListItem data={t} key={t.id} />;
            })}
          </ul>
        </div>
        <h1>Togglable Flexbox Group</h1>
        <div className={styles.group}>
          {mocks.expandingArticles.map((list, idx) => {
            return (
              <div
                className={[
                  styles[this.state.flexGroup[idx].width],
                  styles.expandable
                ].join(' ')}
                key={idx}
              >
                <header>
                  <h2>Group {idx} </h2>
                  <button
                    onClick={() => this.toggleSize(idx)}
                    className={styles.expander}
                  >
                    {this.state.flexGroup[idx].size === 0
                      ? expanderText.more
                      : expanderText.less}
                  </button>
                </header>
                <ul>
                  {}
                  {list.map(t => {
                    return (
                      <ListItem
                        data={t}
                        size={this.state.flexGroup[idx].size}
                        key={t.id}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </article>
    );
  }
  toggleSize = idx => {
    const newSizes = resetFlexGroupSizes();
    if (this.state.flexGroup[idx].size == 1) {
      this.setState({ flexGroup: newSizes });
      return;
    }
    newSizes[idx] = {
      size: 1,
      width: 'medium'
    };
    this.setState({ flexGroup: newSizes });
  };
}
export default LayoutGenerator;

function resetFlexGroupSizes() {
  return [
    {
      size: 0,
      width: 'small'
    },
    {
      size: 0,
      width: 'small'
    },
    {
      size: 0,
      width: 'small'
    }
  ];
}
