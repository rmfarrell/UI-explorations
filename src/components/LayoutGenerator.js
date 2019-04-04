import React, { Component } from 'react';
import {
  articles,
  socialMediaItems,
  Article,
  randomInt
} from '../mocks/generator';
import Carousel from './Carousel';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';
import { Z_FULL_FLUSH } from 'zlib';

const categories = [
    'latestDevelopments',
    'policyDocuments',
    'analysis',
    'opinion',
    'media',
    'social',
    'data',
    'deepDives'
  ],
  colorMap = {
    map: '#A13D63',
    status: '#351E29',
    featured: '#C8E9A0',
    single: '#F7A278',
    list: '#6DD3CE'
  };

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: true,
      featuredCount: 0,
      categories: {}
    };
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
            </div>
          )}
        </div>
      );
    });
    return (
      <article className={styles.root}>
        <div className={styles.rightGutter}>
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

          <div className={styles.categoryInput}>
            <div>
              <button onClick={this.reset}>Reset</button>
              <button onClick={this.randomize}>🎲</button>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className="grid">
            {this.items.map((item, idx) => {
              return (
                <div className={item.className} key={idx}>
                  <Block backgroundColor={colorMap[item.type]}>
                    <div>{JSON.stringify(item, null, '\t')}</div>
                  </Block>
                </div>
              );
            })}
          </div>
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
  get items() {
    return makeGrid(
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
    this.setState({ showStatus: true });
    this.setState({ featuredCount: 0 });
    this.setState({
      categories: categories.reduce((acc, cat) => {
        acc[cat] = {
          total: 0,
          images: 0,
          wide: false
        };
        return acc;
      }, {})
    });
  };
  randomize = () => {
    this.setState({ showStatus: coinToss() });
    this.setState({ featuredCount: randomInt(0, 4) });
    this.setState({
      categories: categories.reduce((acc, cat) => {
        const total = coinToss() ? (coinToss() ? randomInt(0, 12) : 1) : 0,
          images = randomInt(0, total);
        acc[cat] = {
          total,
          images,
          wide: false
        };
        return acc;
      }, {})
    });

    function coinToss() {
      return randomInt(0, 2) === 0;
    }
  };
  componentDidMount() {
    this.reset();
  }
}
export default LayoutGenerator;

function Block({
  height = '250px',
  backgroundColor = '#000',
  className = '',
  children = []
}) {
  return (
    <div
      className={[className, styles.block].join(' ')}
      style={{ backgroundColor, height }}
    >
      {children}
    </div>
  );
}

function update(featuredCount = 0, categories = {}, showStatus = false) {
  // TODO: Featured Articles and Short Article Lists may be made single- or double-wide
  // ?????

  // TODO: single article no image??
  const keys = Object.keys(categories);
  const agg = keys.reduce(
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
    statusTile = showStatus && newStatusTile(),
    uniqueCategories = keys.filter(cat => categories[cat].total > 0);

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
      shortListTiles.push(
        shortListTile(
          agg.total,
          uniqueCategories.length > 1 ? 'mixed' : keys[0]
        )
      );
    }
  } else {
    // There must be at least two items in a list, otherwise the item becomes a Single Article Tile.
    keys.forEach(cat => {
      const count = categories[cat].total;
      if (count > 1) {
        shortListTiles.push(shortListTile(count, cat, categories[cat].wide));
      } else if (count === 1) {
        singleArticleTiles.push(singleArticleTile(cat));
      }
    });
  }

  for (let x = 0; x < featuredCount; x++) {
    featuredTiles.push(featuredTile());
  }

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

function makeGrid(featuredCount = 0, categories = {}, showStatus = false) {
  // TODO: Featured Articles and Short Article Lists may be made single- or double-wide
  // ?????

  // TODO: single article no image??
  const keys = Object.keys(categories),
    agg = keys.reduce(
      (acc = 0, item) => {
        acc.total += categories[item].total;
        acc.images += categories[item].images;
        return acc;
      },
      { images: 0, total: 0 }
    ),
    statusTile = showStatus && newStatusTile(),
    tiles = statusTile ? [mapTile(), statusTile] : [mapTile()],
    uniqueCategories = keys.filter(cat => categories[cat].total > 0),
    grid = Grid(Row(3));

  for (let x = 0; x < featuredCount; x++) {
    tiles.push(featuredTile());
  }

  if (agg.total <= 4) {
    // If there are four or less articles and they all have images they are expanded as Single Article Tiles.
    if (agg.total === agg.images) {
      keys.forEach(cat => {
        for (let x = 0; x < categories[cat].total; x++) {
          tiles.push(singleArticleTile(cat));
        }
      });
      // If there are four or less articles total and any one does not have an image they are
      // all put in one Short Article List.
    } else {
      tiles.push(
        shortListTile(
          agg.total,
          uniqueCategories.length > 1 ? 'mixed' : keys[0]
        )
      );
    }
  } else {
    keys.forEach(cat => {
      if (!categories[cat].total) {
        return;
      }
      tiles.push(categoryTile(categories[cat].total, cat));
    });
  }

  // Make the grid
  tiles.forEach(tile => {
    grid.addItem(tile);
  });
  grid.balance();

  return grid.items;
}

function Grid(head) {
  let tail = head;

  function addItem(item) {
    tail.add(item);
    tail = findTail();
  }

  function separateFeatured() {}

  function findTail() {
    let row = head,
      out;
    while (row) {
      out = row;
      row = row.next;
    }
    return out;
  }

  function balance() {
    let row = head;
    while (row) {
      // push featured down
      if (row.gap) {
        const fit = findFirstFit(row.next, 1);
        fit && row.add(fit);
      }
      row = row.next;
    }
  }

  function findFirstFit(row, size = 1) {
    let out = null;
    while (row && !out) {
      const fitIdx = row.items.findIndex(({ width }) => width <= size);
      if (fitIdx >= 0) {
        out = row.remove(fitIdx);
      }
      row = row.next;
    }
    return out;
  }

  return {
    addItem,
    separateFeatured,
    head,
    balance,
    get rows() {
      const out = [];
      let row = head;
      while (row) {
        out.push([row.items]);
        row = row.next;
      }
      return out;
    },
    get items() {
      const classNames = {
        first: ['grid--item__third', 'grid--item__two-thirds'],
        rest: ['grid--item__quarter', 'grid--item__half']
      };
      return this.rows.reduce((acc = [], row, idx) => {
        const isFirst = idx === 0;
        const items = row.map((items, idx) => {
          return items.map(item => {
            let className =
              classNames[isFirst ? 'first' : 'rest'][item.width - 1];
            item.className = className;
            return item;
          });
        });
        acc = acc.concat(...items);
        return acc;
      }, []);
    }
  };
}

function Row(size = 4) {
  let capacity = size;

  return {
    next: null,
    items: [],
    get gap() {
      return capacity;
    },
    add(item) {
      if (!item.width) {
        throw new Error('Cannot add item without width');
      }
      if (!capacity || capacity < item.width) {
        const newRow = Row();
        newRow.add(item);
        this.next = newRow;
        return;
      }
      this.items.push(item);
      capacity = capacity - item.width;
    },
    remove(idx = 0) {
      return this.items.splice(idx, 1)[0];
    }
  };
}

function categoryTile() {
  return shortListTile(...arguments);
}

function shortListTile(length = 2, category = 'mixed', wide = false) {
  if (length < 2) {
    return singleArticleTile(category);
  }
  return {
    type: 'list',
    length,
    category,
    width: wide ? 2 : 1
  };
}

function singleArticleTile(category = '') {
  return {
    type: 'single',
    category,
    width: 1
  };
}

function featuredTile() {
  return {
    type: 'featured',
    width: 2
  };
}

function newStatusTile() {
  return {
    type: 'status',
    width: 1
  };
}

function mapTile() {
  return {
    type: 'map',
    width: 1
  };
}
