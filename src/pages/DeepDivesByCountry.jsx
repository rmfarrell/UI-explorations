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
import Description from '../components/Description.jsx';

// TODO: Use hooks here
export default function(props) {
  const id = props.match.params.id || 'Europe',
    { articles } = useStoreon('articles'),
    deepdives = Object.keys(articles)
      .filter(id => id.includes('DDV'))
      .map(deepdiveId => {
        return Object.assign(articles[deepdiveId], { id: deepdiveId });
      });

  const tiles = [
      // Map
      {
        cat: 'Map',
        width: 1
      },
      // Custom article
      Object.assign(
        {},
        {
          cat: 'Description',
          width: 2,
          canExpand: false
        }
      )
    ]
      .concat(
        deepdives.map(dd => {
          return Object.assign(dd, {
            cat: 'Single',
            width: 1,
            canExpand: true
          });
        })
      )
      .map(addWidths),
    rows = makeGrid(tiles);

  function onDropDownSelect({ value }) {
    props.history.replace(value);
  }

  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h1>Deep Dives: {COUNTRIES[id]}</h1>
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
    </article>
  );

  /**
   * Factory funciton for rendering Tiles
   *
   */
  function Tile(props) {
    const { data, category, width } = props,
      { content } = data;

    switch (category) {
      case 'Description':
        return <Description />;
      case 'Single':
        return featured(data);
      case 'Relationship Status':
        return <RelationshipStatus />;
      case 'Map':
        return <Map focus={id} linkPrefix="/deep-dives/country/" />;
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
