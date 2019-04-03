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
    this.state = this.reset();
  }
  render() {
    const subject = Object.keys(this.state.categories).map(cat => {
      return (
        <div key={cat} className={styles.categoryInput}>
          <h4>{cat}</h4>
          <div>
            <label htmlFor={`${cat}-total`}>total</label>
            <input
              type="number"
              name={`${cat}-total`}
              value={this.state.categories[cat].total}
              onChange={this.setArticleQuantity}
              min="0"
            />
          </div>
          {this.state.categories[cat].total > 0 && cat !== 'media' && (
            <div>
              <label htmlFor={`${cat}-images`}>w/ images</label>
              <input
                type="number"
                name={`${cat}-images`}
                value={this.state.categories[cat].images}
                onChange={this.setArticleQuantity}
                max={this.state.categories[cat].total}
                min="0"
              />
            </div>
          )}
          {this.state.categories[cat].total > 0 && (
            <div>
              <label htmlFor={`${cat}-wide`}>show wide</label>
              <input
                type="checkbox"
                name={`${cat}-wide`}
                value={this.state.categories[cat].wide}
                onChange={this.toggleWide}
              />
              <p>{JSON.stringify(this.state.categories[cat])}</p>
            </div>
          )}
        </div>
      );
    });
    return (
      <article className={styles.root}>
        <div className={styles.rightGutter}>
          <form>
            <div className={styles.categoryInput}>
              <div>
                <label htmlFor="showStatus">Show Status</label>
                <input
                  type="checkbox"
                  name="showStatus"
                  checked={this.state.showStatus}
                  onChange={this.setBoolean}
                />
              </div>
            </div>
            <div className={styles.categoryInput}>
              <div>
                <label htmlFor="featuredCount">Featured Count</label>
                <input
                  type="number"
                  name="featuredCount"
                  value={this.state.featuredCount}
                  onChange={this.setInput}
                  min="0"
                  max="3"
                />
              </div>
            </div>
            <div className={styles.articlesConfig}>{subject}</div>
            <p>
              <button onClick={this.reset}>Reset</button>
            </p>
          </form>
        </div>
        <div className={styles.main}>
          <p>{JSON.stringify(this.tiles)}</p>
          <h1>TILES</h1>
        </div>

        {/* <h1>Columns</h1>
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
        </div> */}
      </article>
    );
  }
  toggleWide = ({ target: { name = '' } }) => {
    const [key] = name.split('-'),
      newVal = Object.assign(this.state.categories[key], {
        wide: !this.state.categories[key].wide
      });
    this.setState({
      categories: Object.assign(this.state.categories, {
        [key]: newVal
      })
    });
  };
  get tiles() {
    return update(
      this.state.featuredCount,
      this.state.categories,
      this.state.showStatus
    );
  }
  setInput = ({ target: { name = '', value = '' } }) => {
    this.setState({ [name]: value });
  };
  setArticleQuantity = ({ target }) => {
    const { name, value } = target,
      [key, val] = name.split('-'),
      newVal = Object.assign(this.state.categories[key], {
        [val]: Number(value)
      });
    this.setState({
      categories: Object.assign(this.state.categories, {
        [key]: newVal
      })
    });
  };
  setBoolean = ({ target: { name = '' } }) => {
    this.setState({ [name]: !this.state[name] });
  };
  reset = () => {
    return {
      showStatus: true,
      featuredCount: 0,
      categories: categories.reduce((acc, cat) => {
        acc[cat] = {
          total: 0,
          images: 0,
          wide: false
        };
        return acc;
      }, {})
    };
  };
}
export default LayoutGenerator;

function update(featuredCount = 0, categories = {}, showStatus = false) {
  // TODO: Featured Articles and Short Article Lists may be made single- or double-wide
  // ?????

  // TODO: single article no image??

  const agg = Object.keys(categories).reduce(
      (acc = 0, item) => {
        acc.total += categories[item].total;
        acc.images += categories[item].images;
        return acc;
      },
      { images: 0, total: 0 }
    ),
    singleArticleTiles = [],
    shortListTiles = [],
    featuredTiles = [],
    statusTile = showStatus && newStatusTile();

  if (agg.total <= 4) {
    // If there are four or less articles and they all have images they are expanded as Single Article Tiles.
    if (agg.total === agg.images) {
      Object.keys(categories).forEach(cat => {
        for (let x = 0; x < categories[cat].total; x++) {
          singleArticleTiles.push(singleArticleTile(cat));
        }
      });
      // If there are four or less articles total and any one does not have an image they are
      // all put in one Short Article List.
    } else {
      shortListTiles.push(shortListTile(agg.total));
    }
  } else {
    // There must be at least two items in a list, otherwise the item becomes a Single Article Tile.
    Object.keys(categories).forEach(cat => {
      const count = categories[cat].total;
      if (count > 1) {
        shortListTiles.push(shortListTile(count, cat));
      } else if (count === 1) {
        singleArticleTiles.push(singleArticleTile(cat));
      }
    });
  }

  for (let x = 0; x < featuredCount; x++) {
    featuredTiles.push(featuredTile());
  }

  // double wide social media and video??

  // console.log(total);

  return sortTiles({
    singleArticleTiles,
    shortListTiles,
    featuredTiles,
    statusTile
  });

  function sortTiles({
    singleArticleTiles = [],
    shortListTiles = [],
    featuredTiles = [],
    statusTile
  }) {
    let sorted = [];
    sorted = sorted.concat(...shortListTiles, ...singleArticleTiles);

    if (featuredTiles.length) {
      sorted = [featuredTiles[0], ...sorted];

      if (featuredTiles.length > 1) {
        sorted = sorted.concat(featuredTiles[1]);
      }
      if (featuredTiles.length === 3) {
        sorted.splice(Math.floor(sorted.length / 2), 0, featuredTiles[2]);
      }
    }

    if (statusTile) {
      sorted = [statusTile, ...sorted];
    }
    return sorted;
  }
}

function shortListTile(length = 0, category = '') {
  const width = 1;
  return {
    length,
    category,
    width
  };
}

function singleArticleTile(category = '') {
  const width = 1;
  return {
    category
  };
}

function featuredTile() {
  return {
    featured: true,
    width: 2
  };
}

function newStatusTile(width = 1) {
  return {
    status: true,
    width
  };
}
