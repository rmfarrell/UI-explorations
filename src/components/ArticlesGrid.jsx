import React from 'react';
import styles from '../styles/CollectionPage.module.css';

// -- Libs
import {
  dereferenceArticle,
  placeholderImage,
  formatDate,
  classNames
} from '../lib/helpers';
import { Grid, Row } from '../lib/grid';

// -- Components
import ArticleModal from '../components/ArticleModal.jsx';
import Empty from './Empty.jsx';
import List from './List.jsx';
import SingleItem from './SingleItem.jsx';

export default function(props) {
  const { featured = [], collection = {} } = props;
  const tiles = featured
      .map(featured => {
        return Object.assign(featured, {
          cat: 'Featured',
          width: 1,
          canExpand: true,
          featured: true
        });
      })
      .concat(
        Object.keys(collection).map(cat => ({
          cat,
          content: collection[cat]
        }))
      )
      .map(addWidths),
    rows = makeGrid(tiles);

  return (
    <React.Fragment>
      {rows.map(({ items, size }, idx) => {
        return (
          <div className={classNames('grid', 'constrain')} key={idx}>
            {items.map(data => {
              return (
                <div
                  key={data.cat}
                  className={[
                    tileClassName(size, data.width),
                    styles.tile
                  ].join(' ')}
                >
                  <Tile
                    data={data}
                    category={data.cat}
                    width={data.width}
                    row={idx}
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      <ArticleModal />
    </React.Fragment>
  );
  /**
   * Factory funciton for rendering Tiles
   *
   */
  function Tile(props) {
    const { data, category, width, row = 0 } = props,
      { content } = data;

    switch (category) {
      case 'Relationship Status':
        return (
          <Empty className="emptyTile" style={{ background: 'white' }}>
            <h4 className="placeholderEmpty">Relationship Status</h4>
          </Empty>
        );
      case 'Featured':
        return single(data);
      default:
        const perpage = row > 0 ? 4 : 3;
        return content.length > 1 ? (
          <List items={content} groupSize={width} perpage={perpage}>
            <h3>{pluralize(category)}</h3>
          </List>
        ) : (
          single(content[0])
        );
    }

    function single(data = {}) {
      return (
        <SingleItem
          data={data}
          className=""
          size={row === 0 ? 2 : width}
          type="article"
          link={`#${data.id}`}
        />
      );
    }
  }
}

function addWidths(item) {
  item.width = item.width || 1;
  item.canExpand = item.width < 2;
  return item;
}

function makeGrid(tiles = []) {
  const grid = Grid(Row(3));
  grid.add(tiles);
  grid.separateFeatured();
  grid.balance();

  return grid.rows;
}

function tileClassName(rowSize = 4, width = 1) {
  const isWide = width > 1;
  if (rowSize === 3) {
    return isWide ? 'grid--item__two-thirds' : 'grid--item__third';
  }
  if (rowSize === 4) {
    return isWide ? 'grid--item__half' : 'grid--item__quarter';
  }
}

function pluralize(category = '') {
  switch (category) {
    case 'Deep Dive':
      return 'Deep Dives';
    case 'Policy Document':
      return 'Policy Documents';
    case 'Article':
      return 'Articles';
    case 'External Resource':
      return 'External Resources';
    case 'Social Media Item':
      return 'Social Media';
    default:
      return category;
  }
}
