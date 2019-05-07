import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { Grid, Row } from '../lib/grid';
import { COUNTRIES } from '../lib/constants';

// -- Modules
import CountryDropdown from '../components/CountryDropdown.jsx';
import RelationshipStatus from '../components/RelationshipStatus.jsx';
import Map from '../components/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import List from '../components/List.jsx';

// TODO: Use hooks here
export default function(props) {
  let relationship;
  const id = props.match.params.id || 'Europe',
    { relationships, articles } = useStoreon('relationships', 'articles');
  relationship = id && relationships[`REL_${id.toUpperCase()}`];
  if (id.toLowerCase() === 'europe') {
    relationship = relationships['REL_GBR'];
  }
  if (!relationship) return error(new Error(`no relationship found`));
  const {
      relationship_status,
      articles: { featured, collection }
    } = relationship,
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

  function onDropDownSelect({ value }) {
    props.history.replace(`/relationship/${value}`);
  }

  return (
    <React.Fragment>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <CountryDropdown
          className={['big', styles.dropdown].join(' ')}
          initialValue={id}
          onChange={onDropDownSelect}
        />
      </header>
      {rows.map(({ items, size }, idx) => {
        return (
          <div className="grid" key={idx}>
            {items.map((data, idx) => {
              return (
                <div
                  key={idx}
                  className={[
                    tileClassName(size, data.width),
                    styles.tile
                  ].join(' ')}
                >
                  <Tile data={data} category={data.cat} width={data.width} />
                </div>
              );
            })}
          </div>
        );
      })}
    </React.Fragment>
  );

  /**
   * Factory funciton for rendering Tiles
   *
   */
  function Tile(props) {
    const { data, category, width } = props,
      { content } = data;

    switch (category) {
      case 'Relationship Status':
        return <RelationshipStatus />;
      case 'Map':
        return <Map focus={id} />;
      case 'Featured':
        return featured(data);
      default:
        return content.length > 1 ? (
          <List items={content} groupSize={width}>
            <h3>{pluralize(category)}</h3>
          </List>
        ) : (
          featured(content[0])
        );
    }

    function featured(data = {}) {
      return (
        <SingleItem data={data} className="" size={width} type="article" />
      );
    }
  }
}

function error(err) {
  console.error(err);
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
