import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { Grid, Row } from '../lib/grid';

// -- Modules
import CustomArticle from '../components/CustomArticle.jsx';
import Map from '../components/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import List from '../components/List.jsx';
import Link from '../components/Link.jsx';
import TileGrid from '../components/TileGrid.jsx';

export default React.memo(function(props) {
  const {
      match: {
        params: { id }
      }
    } = props,
    { deepdives, articles } = useStoreon('deepdives', 'articles'),
    deepdive = id && deepdives[`DDV_${id}`];
  if (!deepdive) return error();
  const title = deepdive.custom_article.title,
    {
      custom_article,
      articles: { featured, collection }
    } = deepdive,
    // Filter out socials from filter :(
    featuredData = dereferenceArticles(
      featured.filter(id => !id.includes('SOC')),
      articles
    ),
    collectionData = dereferenceArticles(collection, articles).reduce(
      reduceArticleCollection,
      {}
    );
  const featuredTiles = featuredData.map((data, idx) => (
    <SingleItem
      key={`featured-${idx}`}
      data={data}
      className=""
      size={1}
      summaryLines={4}
      width={1}
      featured
      canExpand
      // size={firstRow ? 2 : width}
      // summaryLines={firstRow ? 0 : 4}
      // type="article"
    />
  ));

  const collectionTiles = Object.keys(collectionData).map(cat => {
    const items = collectionData[cat],
      tileProps = { width: 1, canExpand: true, key: cat };
    return items.length === 1 ? (
      <SingleItem
        {...tileProps}
        data={items[0]}
        size={1}
        summaryLines={4}
        width={1}
        canExpand
      />
    ) : (
      <List {...tileProps} items={items} groupSize={1} perpage={4} />
    );
  });
  // const tiles = [
  //     .concat(
  //       ...featuredData.map(featured => {
  //         return Object.assign(featured, {
  //           cat: 'Featured',
  //           width: 1,
  //           canExpand: true,
  //           featured: true
  //         });
  //       })
  //     )
  //     .concat(
  //       Object.keys(collectionData).map(cat => ({
  //         cat,
  //         content: collectionData[cat]
  //       }))
  //     )
  //     .map(addWidths),

  // rows = makeGrid(tiles);

  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h2>
          <Link to="/deep-dives">&lt; Deep Dives</Link>
        </h2>
        <h1>{title}</h1>
      </header>
      <TileGrid
        featured={featuredTiles}
        collection={collectionTiles}
        tiles={[...featured, ...collection]}
      >
        <Map width={1} key="Map" />
        <CustomArticle
          key="CustomArticle"
          data={custom_article}
          width="1"
          canExpand
        />
      </TileGrid>
      {/* {rows.map(({ items, size }, idx) => {
        return (
          <div className="grid" key={idx}>
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
      })} */}
    </article>
  );

  /**
   * Factory funciton for rendering Tiles
   *
   */
  function Tile(props) {
    const { data, category, width, row = 0 } = props,
      { content } = data,
      firstRow = row === 0;

    switch (category) {
      case 'Custom Article':
        return <CustomArticle data={custom_article} />;
      case 'Map':
        return <Map />;
      case 'Featured':
        return featured(data);
      default:
        const perpage = row > 0 ? 4 : 3;
        return content.length > 1 ? (
          <List items={content} groupSize={width} perpage={perpage}>
            <h3>{pluralize(category)}</h3>
          </List>
        ) : (
          featured(content[0])
        );
    }

    function featured(data = {}) {
      return (
        <SingleItem
          data={data}
          className=""
          size={firstRow ? 2 : width}
          summaryLines={firstRow ? 0 : 4}
          type="article"
        />
      );
    }
  }
});

function error() {
  return '';
}

function dereferenceArticles(ids = [], collection = {}) {
  return ids.map(id => {
    const out = collection[id];
    if (!out) {
      throw new Error(`Could not find article ${id}`);
    }
    return Object.assign(out, { id });
  });
}

function reduceArticleCollection(acc, item) {
  const type = item.document_type || item.type;
  acc[type] = acc[type] ? acc[type].concat(item) : [item];
  return acc;
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
