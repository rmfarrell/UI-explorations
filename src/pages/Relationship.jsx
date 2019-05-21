import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { Grid, Row } from '../lib/grid';
import { COUNTRIES } from '../lib/constants';
import { dereferenceArticles, classNames } from '../lib/helpers';

// -- Modules
import CountryDropdown from '../components/CountryDropdown.jsx';
import Empty from '../components/Empty.jsx';
import Map from '../components/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import List from '../components/List.jsx';
import ArticleModal from '../components/ArticleModal.jsx';
import { Link } from 'react-router-dom';

// TODO: Use hooks here
export default function(props) {
  let relationship, modal;
  const { country = '', history = {}, match } = props,
    { relationships, articles } = useStoreon('relationships', 'articles');

  relationship = country && relationships[`REL_${country.toUpperCase()}`];
  // TODO: temporary hack
  if (!country) {
    relationship = relationships['REL_GBR'];
  }
  if (!relationship) return error(new Error(`no relationship found`));
  const {
      relationship_status,
      articles: { featured, collection }
    } = relationship,
    featuredData = dereferenceArticles(
      // Filter out socials from filter :(
      articles,
      featured.filter(country => !country.includes('SOC'))
    ),
    collectionData = dereferenceArticles(articles, collection).reduce(
      reduceArticleCollection,
      {}
    );
  const tiles = [
      // Map
      // {
      //   cat: 'Map',
      //   width: 1
      // },
      // Custom article
      Object.assign(relationship_status, {
        cat: 'Relationship Status',
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
        <CountryDropdown
          className="big"
          initialValue={country || 'Europe'}
          onChange={onDropDownSelect}
        />
      </header>
      <div className={classNames('grid', 'constrain')}>
        <div className="grid--item__third">
          <Map
            country={country}
            // mapFills={id => {
            //   // const count = articleCounts[id] || 0;
            //   // const saturation = 100 * (count / articleCountsMax);
            //   // return `hsl(346, ${saturation}%, 50%)`;
            // }}
            tileClickHandler={id => history.push(`/relationship/${id}`)}
          >
            {country && (
              <Link to={'/relationship'} className={styles.zoomOutButton}>
                <i className="material-icons">zoom_out_map</i>
              </Link>
            )}
          </Map>
        </div>
      </div>
    </article>
  );
  /*
  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <CountryDropdown
          className={['big', styles.dropdown].join(' ')}
          initialValue={country}
          onChange={onDropDownSelect}
        />
      </header>
      <Link to="/relationship/DEU">GERMANY</Link>
      <Link to="/relationship">ALL</Link>
      {props.children}
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
  */

  function onDropDownSelect({ value }) {
    props.history.replace(`/relationship/${value}`);
  }

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
      case 'Map':
        return <Map indexUrl="/relationship" />;
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

function error(err) {
  console.error(err);
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
