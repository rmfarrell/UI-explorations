import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { Grid, Row } from '../lib/grid';
import { dereferenceArticles, classNames } from '../lib/helpers';

// -- Modules
import CustomArticle from '../components/CustomArticle.jsx';
import Map from '../components/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import List from '../components/List.jsx';
import Link from '../components/Link.jsx';
import ArticleModal from '../components/ArticleModal.jsx';

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
    featuredData = dereferenceArticles(
      // Filter out socials from filter :(
      articles,
      featured.filter(id => !id.includes('SOC'))
    ),
    collectionData = dereferenceArticles(articles, collection).reduce(
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

  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h2>
          <Link to="/deep-dives">&lt; Deep Dives</Link>
        </h2>
        <h1>{title}</h1>
      </header>
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
