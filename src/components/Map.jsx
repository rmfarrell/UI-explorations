import React from 'react';
import data from '../lib/map';
import styles from '../styles/Map.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
  const { focus } = props,
    containerStyles = [styles.container, focus ? styles.focused : ''].join(' ');
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
              <Tile key={idx} data={tile}>
                {tile && tile.country}
              </Tile>
            );
          });
        })}
      </div>
    </div>
  );

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

function Tile({ data }) {
  if (!data) {
    return <div className={styles.sea} />;
  }
  const { weight, country } = data;
  if (!weight) {
    return (
      <div className={styles.land}>
        <span>{country}</span>
      </div>
    );
  }
  return (
    <NavLink
      to={`/relationship/${country}`}
      className={styles.eu}
      style={{ backgroundColor: `hsl(3,${75 * (weight / 10)}%, 50%)` }}
    >
      <span>{country}</span>
    </NavLink>
  );
}
