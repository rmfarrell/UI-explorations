import React, { Component } from 'react';
import {
  articles,
  socialMediaItems,
  Article,
  randomInt
} from '../mocks/generator';
import Carousel from './Carousel';
import changeCase from 'change-case';
import List from './List';
import ListItem from './ListItem';
import styles from '../styles/LayoutGenerator.module.css';
import { Grid, Row } from '../grid';

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

class LayoutGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatus: true,
      featuredCount: 0,
      categories: {},
      debug: false
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
          <div className={styles.categoryInput} style={{ marginTop: '8em' }}>
            <div>
              <label htmlFor="showStatus">Debug</label>
              <input
                type="checkbox"
                name="debug"
                checked={this.state.debug}
                onChange={this.setBoolean}
              />
            </div>
          </div>
        </div>
        <div className={styles.main}>
          {this.items.map(({ items }, idx) => {
            return (
              <div
                className="grid"
                key={idx}
                style={{
                  outline: this.state.debug ? '1px dotted Fuchsia' : ''
                }}
              >
                {items.map((item, idx) => {
                  return (
                    <div className={item.className} key={idx}>
                      {this.tile(item)}
                    </div>
                  );
                })}
              </div>
            );
          })}
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
  tile = tile => {
    let data = {};
    const { type, length = 0, width = 1, category = '' } = tile,
      colorMap = {
        map: '#A13D63',
        status: '#351E29',
        featured: '#C8E9A0',
        single: '#F7A278',
        list: '#6DD3CE'
      };

    if (this.state.debug) {
      return (
        <Block backgroundColor={colorMap[type]}>
          <div>{JSON.stringify(tile, null, '\t')}</div>
        </Block>
      );
    }

    switch (type) {
      case 'list':
        return (
          <List
            className={styles.list}
            variant="progress"
            showControls={true}
            total={length}
            groupSize={width}
            perpage={4}
          >
            <h4 className={styles.categoryHeader}>
              {category !== 'mixed' && changeCase.title(category)}
            </h4>
          </List>
        );
      case 'single':
        data = Object.assign(Article(), {
          category
        });
        // TODO: width is shifted since lsat prototype
        return (
          <ListItem data={data} size={width}>
            <h4 className={styles.categoryHeader}>
              {changeCase.title(category)}
            </h4>
          </ListItem>
        );
      case 'featured':
        return (
          <ListItem data={Article()} size={2}>
            <h4 className={styles.categoryHeader}>
              {changeCase.title(category)}
            </h4>
          </ListItem>
        );
      default:
        return (
          <Block>
            <p>{type}</p>
          </Block>
        );
    }
  };
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
    tiles = {
      map: mapTile(),
      status: showStatus && newStatusTile(),
      rest: [],
      featured: []
    },
    uniqueCategories = keys.filter(cat => categories[cat].total > 0),
    grid = Grid(Row(3));

  if (agg.total <= 4) {
    // If there are four or less articles and they all have images they are expanded as Single Article Tiles.
    if (agg.total === agg.images) {
      keys.forEach(cat => {
        for (let x = 0; x < categories[cat].total; x++) {
          tiles.rest.push(singleArticleTile(cat));
        }
      });
      // If there are four or less articles total and any one does not have an image they are
      // all put in one Short Article List.
    } else {
      tiles.rest.push(
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
      tiles.rest.push(
        categoryTile(categories[cat].total, cat, categories[cat].images)
      );
    });
  }
  // featuredCount = 3;
  for (let x = 0; x < featuredCount; x++) {
    tiles.featured.push(featuredTile(x === 0 ? 1 : 2));
  }

  // const tilesArr = [tiles.map, tiles.status, ...tiles.featured, ...tiles.rest]

  // let tilesArr = [tiles.map];
  // tiles.status && tilesArr.push(tiles.status);
  // tilesArr = tilesArr.concat(...tiles.featured);
  // tilesArr = tilesArr.concat(...tiles.rest);
  let tilesArr = [
    tiles.map,
    tiles.status,
    ...tiles.featured,
    ...tiles.rest
  ].filter(tile => tile);

  grid.add(tilesArr);
  grid.separateFeatured();
  grid.balance();

  // Make the grid
  // tiles
  //   .sort((a, b) => b.sortWeight - a.sortWeight)
  //   .forEach(tile => {
  //     grid.addItem(tile);
  //   });
  // grid.expand();

  // TODO: there is a bug here that adds "rows"
  // grid.balance();

  // return grid.items;

  return grid.rows;
}

function categoryTile() {
  return shortListTile(...arguments);
}

function shortListTile(length = 2, category = 'mixed', images = 0) {
  let width = 1;
  if (length < 2) {
    return singleArticleTile(category);
  }
  if (category === 'media' || (category === 'social' && images > 1)) {
    width = 2;
  }
  return {
    type: 'list',
    length,
    category,
    width,
    sortWeight: 10,
    canExpand: width < 2 && length > 3
  };
}

function singleArticleTile(category = '') {
  return {
    type: 'single',
    category,
    width: 1,
    sortWeight: 1,
    canExpand: true
  };
}

function featuredTile(width = 1) {
  const canExpand = width <= 1;
  return {
    type: 'featured',
    width,
    sortWeight: 20,
    canExpand
  };
}

function newStatusTile() {
  return {
    type: 'status',
    width: 1,
    sortWeight: 30,
    canExpand: true
  };
}

function mapTile() {
  return {
    type: 'map',
    width: 1,
    sortWeight: 40
  };
}
