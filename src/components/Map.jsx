import React, { useEffect } from 'react';
import data from '../lib/map';
import styles from '../styles/Map.module.css';
import { TweenRex } from '@tweenrex/core';
// import { interpolate } from 'polymorph-js';
import { NavLink, Link } from 'react-router-dom';
import { COUNTRIES } from '../lib/constants';
import { isEU } from '../lib/helpers';
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

export default function(props) {
  const {
      focus,
      linkPrefix = '/relationship/',
      size = 1,
      renderTile,
      indexUrl = ''
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

    let start;
    let animend = 2000;
    // const geo = Germany().paths.geo,
    //   square = Germany().paths.square,
    //   alt = Germany().paths.alt;
    const target = document.querySelector('#IT');
    const d = target.getAttribute('d');
    const combinedVectors = splitPathString(d);
    const aSquare = [[0, 0], [100, 0], [100, 100], [0, 100]];

    var interpolator = combine(combinedVectors, aSquare, { single: true });
    // return console.log(interpolator);
    // var interpolator = interpolate(geo, alt);
    // maxSegmentLength: Infinity
    // });

    // setTimeout(() => {
    //   requestAnimationFrame(draw);
    // }, 400);
    requestAnimationFrame(draw);
    function draw(time) {
      start = start || time;
      const progress = time - start,
        interpolatorProgress = progress / animend;

      target.setAttribute('d', interpolator(interpolatorProgress));
      if (progress < animend) {
        requestAnimationFrame(draw);
      }
    }

    // const target = document.querySelector('#SQ_DE');
    // const morph = interpolate(['#SQ_DE', '#GEO_DE'], {
    //   precision: 0,
    //   addPoints: 6
    // });

    // const tween = TweenRex({
    //   duration: 1200,
    //   subscribe(o) {
    //     // subscribe to changes in the timeline and update the path as the offset changes
    //     target.setAttribute('d', morph(o));
    //   }
    // });

    // // start playing immediately
    // setTimeout(() => {
    //   tween.play();
    // }, 600);

    // // restart the animation on click
    // target.addEventListener('click', () => {
    //   tween.restart();
    // });
  });

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

  function focused() {
    return (
      <div className={[styles.focused, styles[`size-${size}`]].join(' ')}>
        <svg
          fill="red"
          height="684"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0"
          version="1.2"
          viewBox="0 0 1000 684"
          width="1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={europe.IT.d} id="IT" />
          <path d={europe.BE.d} id="BE" />
        </svg>
      </div>
    );
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

function Germany() {
  const paths = {
    geo:
      'M567.9 355.2l-3.4-0.1-0.2-1.7-1.1-1-0.1-1 4.7 2.6 0.1 1.2z m-34.8-8.1l-1.8 0-1.4-0.7 0.8-1 1.7 0.4 0.7 1.3z m28.3 0.5l-1.3 0.7-1.3 0-1.3 1.3-2.1-1.1-0.5-1.1 0.1-2.2 0.6-1.4 2-0.9 0.9 1.2 1.7 0.6-0.5 1.7 1.7 1.2z m-46.6-6.6l1.8 0.7 1.6 1.6 0.1 1.4-1.7 1.6 3.2-0.3 0.8 1.2 1.7-0.4 4.5 1.8 3.2-0.9 0.7 1.4-0.6 1.5-2.2 1.6 1.4 1.2 2.1-0.2 3.6 0.9 3.3-2.5 1.1-0.5 3.6-0.3 5.1-4.5 5.3 0.9 1.5 1.9 3.7 2.1 3.2-0.2 1.3 2 0.8 2.5 1.9 1.3 2.8 0.5 0.7 2.6 1.8 4.1-0.3 2.7-1.9 1.8-0.7 1.6 1.6 1.4 3.3 2.1 1.4 1.7-0.6 2.6 2 2.3 0.8 1.9-0.7 2.6-0.8 1.1 1.9 3.1 0 1.6 2.2 0.9 1.6 3.2-0.4 2.3-1.6 3.6-0.9 0.7-1.4-0.6 0-0.9-1.5-1.5-2.2-0.4-0.8 0.6 1.5 1.5-1.9 0.6-3.5 1.5-4.4 1-0.6 1.2-1.1-0.1-1.6 0.7-0.6 1-2 0.3-0.8 1.3-2.1-0.4-2.6 0.6-1.1 0.6-1.9 2.6-1.9-2-0.5 0.7 2.5 3.4 2.3 1.3 0.6 1.6-1.2 1.7 1.4 1.5 1.8 2.7 2.3 2 1.3 0 2.9 2.6 2.5 1.5 1.3 1.6 1.3 0 2.9 2.2 0.6 0.7-0.2 2.8-1.3 0.9-2.3-0.9-0.7 2.9-1 1-2.9 0.8-3.1 1.8-0.6 1.3 2.5 2.8 0.1 1.3-0.6 1.3 1.7 0.3 0.3 1.9-0.3 1.5-1.7-0.4-1.2-0.9-0.2-1.1-1.1-0.5-2.5 0.5-1.5-0.8-2-0.3-0.1 1.4-5.7 0.5-3.9 1.5-1.1 0.9-3.8 0.5-1.4-1.9-2.7-0.4-2.8 0.1-0.2 1.9-1 1.6-1.6 0.5 0.1-1.3-1.2-0.3-0.9-1.4-3.5-1.6-0.7 0.5-2.2-1.2-5.1-2.3 1 1.6-3.7 0.2-1.1-0.9-0.8 0.2-1.4-1-1.3 0-1.3 1.2 0.2 1.5-2.6-0.2-3.3 0.6-2.8-0.1-1-0.3-1.1-1.3 0-1.5 0.6-2-0.2-2.4 0.3-1.5 1-1.8 1.4-5.5 3.5-3.8-0.1-1.3-1.6-0.6-4.8-0.8-2-1.4-3 0.6-2.1-0.1-0.3-0.9-1.4-0.4-1.8 0.7-3.5-4.3-1.4-0.1 0.6-3 0.9-0.9 0-1.4-2.8-1.1-1.5-1.6-0.3-2.2 0.6-1.7 2.3-1.3-0.4-2-1.7-0.7 0.4-1.5-3-2.3 0.6-2.4-1.9-1.2 0.5-0.8 2.2-1.6-0.7-1.2 1.3-2.8 0-1.2-3.1-4.1 0.7-1.1 1.8-0.7 2.3 0.8 4.5-1.3 0.7-1-1-0.9 0.3-0.9 2.6-1.6 0.6-2.6-0.8-1-2.6-0.3-0.7-1 0.6-1.6 3.1 0.1 1.1-3.8 0.7-1.7-0.1-4.3-1.7-1.4 0.5-2.7 1.1-1.4 0.9-0.4 4-0.3 4.5 0.1 1.9 2.2-0.6 1.2 1.6 0.3 0.9-2.4 1.4 0.8 1.1-0.1-0.5-1.7 0.2-1.6 0.9-1.4 3.3 0.6 3.6-0.3 0.1-0.6-2.8-0.5-0.9-1.1-0.2-3.9-1.5-0.8-1.6 0.3 0-1.5 3.4-1.1 0-1-3.4-3.8-0.2-1.6 2.7 0.1 5.2 1.3 3.1-0.7 1.5 0.4z',
    square: toPathString([[0, 0], [0, 100], [100, 100], [100, 0]]),
    alt:
      'M470 401.8l1.6-0.5 0.8 0.8 1.2 0.1 3 2.3-0.4 1.5 1.7 0.7 0.4 2-2.3 1.3-0.6 1.7-1.7-0.7-1.3 1.3-1.4 2.5-0.2 1.7 2 2.4-1.1 1.7-3.4 0.4-2.8-2.6-3.3-1.5-1.7-0.1-0.4-2-0.6-0.6 0.8-2.7-1.9 0.6-0.5 1.4-1.3 0.6-2.2 0.3-2.3-0.3-0.5-0.6 0.7-1.4-0.7-0.7 0.4-1.6-1.6-1.1-3.6-0.4-0.9 0.3-0.6-2-4.2-1.1-0.5-2-1.6-1.8-3.2 1-2.9-2.4 0-1.2-0.9-2.2 5.1-2.5 4.7-1.7 0.3 1.3 1.2 0.7 1.2-0.6 3.9 1.1 3.2-1.5 0.6-1.2 2.1 0.3-0.2-0.9 1.4-0.7 1.5 0.8 1.5-1 1.1 1.3 2.5-0.8 0.5 1.6 2.6 1.4 1.9-0.4 1.7 1.3 2.6 1.1-1 2.9-1.1 1.3 0.7 1.1z'
  };
  const country = (
    <path
      d="M602.6 595.6l-1.2 2.5-2.8 4.3-1.5 5.1 0.3 2 1.6 1.4-0.7 0.5 1.6 1.8 0.1 1.3-1.8 1.9-0.4 1.7 0.1 1.5-2.9-0.6-1.4 0.3-3.7-1.4-1.9-2.8-3-2-3 0-1.4-0.5-2.9-1.9-3-1.4-2.6-2.1-1.7-0.4-1.5-1-2.9 0-2.3-1.6-1.3-2.3 1.3-3.7 1.4-0.8 0.9-1.2 2.3 2.3 1.8-0.8 1.4-1.6 2.4 0.1 0.5 0.9 1.4 0.3 2.5 1.6 1.4 0.4 3.4-1 3 0.4 2.8-0.5 1.7-0.6 1.2-1 1.4-0.3 3.5 0.3 2-1.2 0.8 0.2 2-1.2 1.1 1.1z m-78.3-41.5l0.7 0.9 1.8 5-0.6 1.6-1.3 2 0.8 2.8-0.6 11.5-0.6 2.9-0.9 0.4-2.9-1.2-1.5 0.3-1.2-0.6-0.3 3-1.8 2.1-3-0.2-0.7-0.6-2.4-3.8-0.4-4.3 0.6-1.3 0-2.5 1.1-0.1 0-1.7-1.8-1.2 0-1.9 0.7-1.4-0.1-2.6-0.8-0.9-0.8-2.3-2.2-2.4 0.1-3.4 3.4 0.6 1.3-0.3 3.1-1.5 2.1-2.5 1.4-0.5 1.5-1.8 0.7 0.9 2.2 0.8 1.2 1.5 0.9 0.5-0.7 1.4 1 0.8z m8.3-30.8l0.3 1.4-2.5 0.5-1.1-1.1 2.9-0.2 0.4-0.6z m37.9-56.6l-0.2 0.9-3.3 2.3 0.7 1.4 2.3 0.7-1.6 2.1 0.3 1 1.3 0.2-0.4 2 1.9 1.1 1.5 1.3 0.2 1.3-1.5 0.1 0.7-0.6-2-2.2-2 0.9-3.2-0.9-2.1 2-1.5 0.4-1.7 1.1-3.2 1.2-1.8-0.4-1 0.7-0.4 3.1 0.8 0.6 1.5 2.6 1.7 1.1-0.7 1.9-0.9 0.7-1.3-0.5-0.3 1.7 0.9 4.5 1.4 3.2 1.2 1.3 2.7 2.2 2.7 1.1 5.1 3.7 2.8 1.1 0.7 0.7 1.8 2.8 1.6 3.2 1.8 5.1 1.3 2.5 2.3 2.9 4.8 4.1 4.3 2.9 4 1.9 3 0.3 7-0.4 2.6 0.7 0.4 1.2-0.4 0.9-2.9 2.1 0 1.7 1.5 1.2 7.1 3.2 7.2 2.6 2.2 1.4 2.7 2.1 6.4 2.9 1.1 1.4 4 3 1.8 2.4 0.5 1.8-1.5 4.4-1.6-0.5-1.9-1.3-3.1-5.4-5-0.5-2.9-1.3-0.7-1.4-2.3-0.4-1.3 0.9-1.4 2-1.5 3-1.5 4.3 0 1.7 1.1 1.7 2.9 1 2.4 1.5 1.6 1.6 0.3 3.8 0.9 2.1-0.9 1.3-1.9-0.3-2.5 0.7-1.7 1.4-0.7 1.4 0.5 3.4-0.3 1.4-3.3 2.5-1.6 2.5-1 2.3-4.3 0-1.1-1.5-0.1-2.2 0.6-1.3 1.6-0.7 0.9-2.8-0.5-2 1.1-1.6 2.8-0.7 0-2.9-1.4-1.3-1.4-5.1-2.4-4.3-1.4-3.8-1.1-1.8-1.4-1-3.7-0.3-4.6-2.6-0.3-1.1 0.6-1.1-1.1-2.8-2-1.7-2.6 0.6-1.2-0.1-0.1-1.5-2-1.3-2.7-0.2-0.7-0.7-2.6-4-1.7-1.7-2.3 0.1-3.9-0.9-2 0.7-3.2-2.6-2.8-0.9-5.7-5.3-1.8-2-3.5-2.2-2.3-3.2-1.8-1.2-4-1.4-0.3-1.3-3.1-3.1-1.7-1-1.3-2.1-2.5-0.5 0.1-2.7-1.2-3.5-1.7-2.2-1.2-5.3-0.8-1.5-1.8-1.1-4-1.2-5.7-3.4-1.1-0.1-3.4-1.3-2.1-0.2-2.6 1.2-3.1 3.2-2.5 3.4-0.9 0.6-3.4 1.2-3 0.5-0.2-1.5 2.1-2.6-0.3-2-3.3 0.6-5.1-2.4-0.9-0.9-0.1-1.4-0.7-1.3 1.4-2.5 0.8-0.7-0.5-1.7-3.2-1.4-1.5-3.1 0.8-0.4 1.9 0.2 1.7-1.3 1.2-0.3 0.8-2.5-1.8-1.6-1.7-2.6-0.9-0.6-0.1-1.6 2.6-1.7 1.4 0.7 2.4-0.5 2.6-1 3.1 0.8 2.4-1.4 1.6-2.2-0.6-1.5 3.4-2.9 1 0.6 0.2 2.5 2.4 2 2.2 0.6-0.4 1.2 1.3 1.2 0.9 1.4 1.2-0.7-0.7-1.7 0.2-1 2.2-2.6 0.5-1.1 0-2.9 2-0.1 0.8 2.1 2 0.8 2.9-1.1 0.7 0.1 1.4 1.9 1.2-0.3-1.5-3.5 0.6-1.8 1.3-0.3 1 0.9 1.9 0.2-0.5-1.8 0.5-3.1 3 0.3 0.9 0.8 2.1 0.4 1.1-0.4 1.2-2.2 1.4-0.6 3.4-0.3 3.1 0.2 4.7-1.5 0 2.3 3.1 3.5 1.1 0.5 8.6 1.5 4 0.3 2.6 0.5z"
      id="GEO_DE"
      name="Germany"
    />
  );

  const poly = (
    // <path id="SQ_DE" name="Germany" d="M.559.969v133.324H152.71V.969z" />
    // <path id="SQ_DE" name="Germany" d="M.559.969v133.324H152.71V.969z" />
    <polygon
      id="Path"
      stroke="#979797"
      points="0 0 0 50 0 100 50 100 100 100 100 50 100 0"
    />
  );

  const square = <path d="M0 0v100h100V0z" id="SQ_DE" name="Germany" />;

  return { country, square, paths };
}
