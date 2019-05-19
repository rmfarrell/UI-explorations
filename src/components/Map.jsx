import React, { useEffect, useState, useRef } from 'react';
import data from '../lib/map';
import styles from '../styles/Map.module.css';
import { TweenRex } from '@tweenrex/core';
// import { interpolate } from 'polymorph-js';
import { Transition } from 'react-transition-group';
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

export default function(props) {
  let start;
  const {
      focus,
      linkPrefix = '/relationship/',
      size = 1,
      renderTile,
      mapFills,
      tileClickHandler = () => {},
      indexUrl = '',
      match
    } = props,
    svg = useRef(null),
    animationTime = 900;

  const country = match && match.params.country;
  if (renderTile && typeof renderTile !== 'function') {
    throw new Error('renderTile must be function which retuns a MapTile');
  }

  function zoomToCountry(animate = false) {
    if (!window) return;
    console.log('test');
    let start;

    Object.keys(europe).forEach(k => {
      const target = document.querySelector(`#${k}`);
      if (!europe[k].d) {
        // target.style = { display: 'none' };
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
      if (animate) {
        requestAnimationFrame(time => draw(time, interpolator, target));
      } else {
        target.setAttribute('d', interpolator(1));
      }
    });
  }

  function zoomToTiles() {
    Object.keys(europe).forEach(k => {
      if (!europe[k].d) return;
      const target = document.querySelector(`#${k}`);
      if (!target) return;
      const d = target.getAttribute('d');
      const combinedVectors = splitPathString(d);
      const aSquare = dFromTileData(k);
      const interpolator = combine(combinedVectors.slice(0, 30), aSquare, {
        single: true
      });
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

  function Svg(props) {
    const { children, animate = false } = props;
    useEffect(() => {
      console.log(country);
      // start = 0;
      // // transition animations
      if (!animate) return;
      if (country) {
        zoomToCountry(true);
      } else {
        zoomToTiles(true);
      }
      // isNew = false;
      // // svg.current.style.display = 'block';
      // previousCountry.current = country;
    }, [country]);
    return (
      <div className={classNames(styles.root, styles[`size-${size}`])}>
        <svg
          ref={svg}
          // fill="transparent"
          // height="900"
          // stroke="white"
          strokeWidth="1"
          version="1.2"
          viewBox="0 0 1000 900"
          width="1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </svg>
      </div>
    );
  }

  function dFromTileData(id) {
    if (!id) throw new Error(`Expected id as string received ${id}`);
    const { tile } = europe[id];
    if (!tile) {
      console.warn(`${id} has no tile data`);
      return '';
    }
    const multiplier = 50;
    const [c1, c2] = tile,
      x = c2 * multiplier,
      y = c1 * multiplier,
      d = toPathString([
        [x, y],
        [x + multiplier, y],
        [x + multiplier, y + multiplier],
        [x, y + multiplier]
      ]);
    return d;
  }

  function tileCoordToSvg(id) {
    let fill = '';
    const { tile } = europe[id];
    if (!tile) return '';

    if (isEU(id)) {
      fill = mapFills ? mapFills.call(this, id) : 'rgba(0,0,0,0.8)';
    } else {
      fill = 'rgba(0,0,0,0.2)';
    }

    return (
      <Tile
        fill={fill}
        clickHandler={tileClickHandler.bind(this, id)}
        d={dFromTileData(id)}
        id={id}
        key={id}
      />
    );
  }

  function Geography(props) {
    const { id = '', fill = '', d = '' } = props;
    return <path d={d} id={id} fill={fill} />;
  }

  function Tile(props) {
    const { id = '', fill = '', clickHandler = () => {}, d = '' } = props;
    return (
      <a onClick={clickHandler}>
        <path d={d} id={id} fill={fill} />;
      </a>
    );
  }

  return (
    <div
      className={classNames(
        styles.root,
        styles[`size-${size}`],
        country && styles.focused
      )}
    >
      <Transition in={!!country} timeout={animationTime}>
        {state => {
          switch (state) {
            case 'entered':
              return zoomedIn(false);
            case 'entering':
              return zoomedOut(true);
            case 'exiting':
              return zoomedIn(true);
            case 'exited':
              return zoomedOut(false);
            default:
              return null;
          }
        }}
      </Transition>
    </div>
  );

  function zoomedOut(animate = false) {
    return (
      <Svg animate={animate}>
        {Object.keys(europe).map(k => {
          return tileCoordToSvg(k);
        })}
      </Svg>
    );
  }

  function zoomedIn(animate = false) {
    return (
      <Svg animate={animate}>
        {Object.keys(europe).map(k => {
          return (
            <Geography id={k} fill="rgba(0,0,0,0.75)" d={europe[k].d} key={k} />
          );
        })}
      </Svg>
    );
  }

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

  function Svg(props) {
    const { children, animate = false } = props;
    useEffect(() => {
      if (!animate) return;
      if (country) {
        zoomToCountry(true);
      } else {
        zoomToTiles(true);
      }
    }, [country, animate]);
    return (
      <svg
        ref={svg}
        // fill="transparent"
        // height="900"
        // stroke="white"
        strokeWidth="1"
        version="1.2"
        viewBox="0 0 1000 900"
        width="1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    );
  }
}
