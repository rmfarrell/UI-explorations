import React, { useEffect, useState } from 'react';
import data from '../lib/map';
import styles from '../styles/Map.module.css';
import { TweenRex } from '@tweenrex/core';
// import { interpolate } from 'polymorph-js';
import { NavLink, Link } from 'react-router-dom';
import { COUNTRIES } from '../lib/constants';
import { isEU, classNames } from '../lib/helpers';
import {
  toRect,
  fromRect,
  toPathString,
  toCircle,
  interpolate,
  splitPathString,
  separate,
  combine
} from 'flubber';
import MapTile from './MapTile.jsx';
import europe from '../lib/europe_map';

const animationTime = 2000;
let start;

export default function(props) {
  const {
      focus,
      linkPrefix = '/relationship/',
      size = 1,
      renderTile,
      indexUrl = '',
      params = {}
    } = props,
    containerStyles = [styles.container, isFocused ? styles.focused : ''].join(
      ' '
    ),
    isFocused = !focus || focus.toLowerCase() === 'europe';

  if (renderTile && typeof renderTile !== 'function') {
    throw new Error('renderTile must be function which retuns a MapTile');
  }

  useEffect(() => {
    if (!window) return;
    start = 0;
    setTimeout(zoomToCountry, 500);
    return () => {
      console.log('did this shit get unmounted???');
    };
  }, [params.country]);

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
              return renderTile && tile && isEU(tile.country) ? (
                renderTile.call(this, tile.country)
              ) : (
                <MapTile
                  key={idx}
                  isLand={tile}
                  weight={tile && tile.weight}
                  link={`${linkPrefix}${tile && tile.country}`}
                >
                  <span>{tile && tile.country}</span>
                </MapTile>
              );
            });
          })}
        </div>
      </div>
    );
  }

  function zoomToCountry() {
    let start;

    Object.keys(europe).forEach(k => {
      const target = document.querySelector(`#${k}`);
      if (!europe[k].d) {
        target.style = { display: 'none' };
        return;
      }
      if (!target) {
        console.warn(`no target`);
        return;
      }
      const d = target.getAttribute('d');
      const combinedVectors = splitPathString(europe[k].d);
      var interpolator = separate(d, combinedVectors.slice(0, 30), {
        single: true
      });

      // target.setAttribute('d', interpolator(0.75));

      requestAnimationFrame(time => draw(time, interpolator, target));
    });
  }

  function zoomToTiles() {
    let start;

    Object.keys(europe).forEach(k => {
      if (!europe[k].d) return;
      const target = document.querySelector(`#${k}`);
      const d = target.getAttribute('d');
      const combinedVectors = splitPathString(d);
      const aSquare = [[0, 0], [100, 0], [100, 100], [0, 100]];

      var interpolator = combine(combinedVectors, aSquare, { single: true });

      requestAnimationFrame(time => draw(time, interpolator, target));
    });
  }

  function draw(time, interpolator, target) {
    start = start || time;
    const progress = time - start,
      interpolatorProgress = progress / animationTime;
    target.setAttribute('d', interpolator(interpolatorProgress));
    if (progress < animationTime) {
      requestAnimationFrame(t => draw(t, interpolator, target));
    }
  }

  function focused() {
    return (
      <div className={classNames(styles.focused, styles[`size-${size}`])}>
        <svg
          // fill="transparent"
          height="900"
          // stroke="white"
          strokeWidth="1"
          version="1.2"
          viewBox="0 0 1000 900"
          width="1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Object.keys(europe).map(k => {
            return tileCoordToSvg(k);
          })}
          {/* <path d={europe.IT.d} id="IT" /> */}
        </svg>
      </div>
    );
  }

  function tileCoordToSvg(id) {
    const { tile } = europe[id];
    if (!tile) return '';
    const multiplier = 50;
    const [c1, c2] = tile,
      x = c2 * multiplier,
      y = c1 * multiplier,
      d = toPathString([
        [x, y],
        [x + multiplier, y],
        [x + multiplier, y + multiplier],
        [x, y + multiplier]
      ]),
      fill = isEU(id) ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)';

    return <path d={d} id={id} key={id} fill={fill} />;
  }

  return focused();

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
