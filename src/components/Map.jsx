import React from 'react';
import data from '../lib/map';
import styles from '../styles/Map.module.css';
import { NavLink, Link } from 'react-router-dom';
import { COUNTRIES } from '../lib/constants';
import MapTile from './MapTile.jsx';

export default function(props) {
  const { focus, linkPrefix = '/relationship/', size = 0 } = props,
    containerStyles = [styles.container, isFocused ? styles.focused : ''].join(
      ' '
    ),
    isFocused = !focus || focus.toLowerCase() === 'europe';
  function unfocused() {
    return (
      <div className={containerStyles}>
        <div
          className={styles.map}
          style={
            focus && {
              transform: `translate(${getFocus()}) scale(5)`,
              transformOrigin: '0 0'
            }
          }
        >
          {data.map(tiles => {
            return tiles.map((tile, idx) => {
              return (
                <MapTile
                  key={idx}
                  country={tile && tile.country}
                  weight={tile && tile.weight}
                  link={`${linkPrefix}${tile && tile.country}`}
                >
                  {tile && tile.country}
                </MapTile>
              );
            });
          })}
        </div>
      </div>
    );
  }

  function focused() {
    return (
      <div className={styles.focused}>
        <div>
          <h1>{COUNTRIES[focus]}</h1>
          <Link to="/relationship" className={styles.back}>
            &larr; All relationships
          </Link>
        </div>
      </div>
    );
  }

  return isFocused ? unfocused() : focused();

  function getFocus() {
    let x, y;
    for (let i = 0; i < data.length; i++) {
      const containsCountry = data[i].some(col => {
        return col && col.country === focus;
      });
      if (containsCountry) {
        y = i;
        x = data[i].findIndex(tile => {
          return tile && tile.country === focus;
        });
        break;
      }
    }
    const out = `-${x * 40}%, -${y * 50}%`;
    return out;
  }
}
