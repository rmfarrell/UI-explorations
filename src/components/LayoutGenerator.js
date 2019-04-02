import React, { Component } from 'react';
import { articles, socialMediaItems, Article } from '../mocks/generator';
import Carousel from './Carousel';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';

const categories = [
  'latestDevelopments',
  'policyDocuments',
  'analysis',
  'opinion',
  'media',
  'social',
  'data',
  'deepDives'
];
const mocks = {
  columns: {
    social: socialMediaItems(3),
    small: articles(6),
    medium: articles(3)
  }
};

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: true,
      categories: categories.reduce((acc, cat) => {
        acc[cat] = {
          total: 0,
          images: 0
        };
        return acc;
      }, {})
    };
  }
  setArticleQuantity = ({ target }) => {
    const { name, value } = target,
      [key, val] = name.split('-'),
      newVal = Object.assign(this.state.categories[key], { [val]: value });
    console.log(newVal);
    this.setState({
      categories: Object.assign(this.state.categories, {
        [key]: newVal
      })
    });
  };
  render() {
    const subject = Object.keys(this.state.categories).map(cat => {
      return (
        <div key={cat}>
          <h4>{cat}</h4>
          <label htmlFor={`${cat}-total`}>total</label>
          <input
            type="number"
            name={`${cat}-total`}
            value={this.state.categories[cat].total}
            onChange={this.setArticleQuantity}
            min="0"
          />
          {this.state.categories[cat].total > 0 && cat !== 'media' && (
            <span>
              <label htmlFor={`${cat}-images`}>with images</label>
              <input
                type="number"
                name={`${cat}-images`}
                value={this.state.categories[cat].images}
                onChange={this.setArticleQuantity}
                max={this.state.categories[cat].total}
                min="0"
              />
            </span>
          )}
        </div>
      );
    });
    return (
      <article className={[styles.root, 'constrain'].join(' ')}>
        <form>
          <label htmlFor="showStatus">Show Status</label>
          <input type="checkbox" checked={this.state.showStatus} />
          <div className={styles.articlesConfig}>
            <h3>Articles</h3>
            {subject}
          </div>
        </form>
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
      </article>
    );
  }
}
export default LayoutGenerator;
