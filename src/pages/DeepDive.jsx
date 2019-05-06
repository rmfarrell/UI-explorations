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

export default function(props) {
  const {
      match: {
        params: { id }
      }
    } = props,
    { deepdives, articles } = useStoreon('deepdives', 'articles'),
    deepdive = id && deepdives[`DDV:${id}`];
  if (!deepdive) return error();
  console.log(deepdives);
  console.log(articles);
  const {
      custom_article,
      articles: { featured, collection }
    } = deepdive,
    featuredData = dereferenceArticles(
      // Filter out socials from filter :(
      featured.filter(id => !id.includes('SOC')),
      articles
    ),
    collectionData = dereferenceArticles(collection, articles).reduce(
      reduceArticleCollection,
      {}
    );
  const tiles = [
      // Map
      {
        cat: 'Map',
        width: 1
      },
      // Custom article
      Object.assign(custom_article, {
        cat: 'Custom Article',
        width: 1,
        canExpand: true
      })
    ]
      .concat(
        ...featuredData.map(featured => {
          return Object.assign(featured, {
            cat: 'Featured',
            width: 1,
            canExpand: true,
            featured: true
          });
        })
      )
      .concat(
        Object.keys(collectionData).map(cat => ({
          cat,
          content: collectionData[cat]
        }))
      )
      .map(addWidths),
    rows = makeGrid(tiles);

  return rows.map(({ items, size }, idx) => {
    return (
      <div className="grid" key={idx}>
        {items.map((data, idx) => {
          return (
            <div
              key={idx}
              className={[tileClassName(size, data.width), styles.tile].join(
                ' '
              )}
            >
              <Tile data={data} category={data.cat} />
            </div>
          );
        })}
      </div>
    );
  });
}

function error() {
  return '';
}

/**
 * Factory funciton for rendering Tiles
 *
 */
function Tile(props) {
  const { data, category } = props,
    { content } = data;

  switch (category) {
    case 'Custom Article':
      return <CustomArticle />;
    case 'Map':
      return <Map />;
    case 'Featured':
      return featured(data);
    default:
      return content.length > 1 ? (
        <List items={content}>
          <h3>{category}</h3>
        </List>
      ) : (
        featured(content[0])
      );
  }

  function featured(data = {}) {
    return <SingleItem data={data} className="" size={1} type="article" />;
  }
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

function tileClassName(rowSize = 4, width = 1) {
  const isWide = width > 1;
  if (rowSize === 3) {
    return isWide ? 'grid--item__two-thirds' : 'grid--item__third';
  }
  if (rowSize === 4) {
    return isWide ? 'grid--item__half' : 'grid--item__quarter';
  }
}