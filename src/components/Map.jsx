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
    animationTime = 900;

  const country = match && match.params.country;
  if (renderTile && typeof renderTile !== 'function') {
    throw new Error('renderTile must be function which retuns a MapTile');
  }

  function zoomToCountry(animate = false, svg) {
    if (!window) return;

    Object.keys(europe).forEach(k => {
      const target = svg.querySelector(`#${k}`);
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

  function zoomToTiles(svg) {
    Object.keys(europe).forEach(k => {
      if (!europe[k].d) return;
      const target = svg.querySelector(`#${k}`);
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

  function dFromTileData(id) {
    if (!id) throw new Error(`Expected id as string received ${id}`);
    const { tile } = europe[id];
    if (!tile) {
      console.warn(`${id} has no tile data`);
      return '';
    }
    const gap = 10;
    const multiplier = 90;
    const [c1, c2] = tile,
      x = c2 * multiplier + 10 * c2,
      y = c1 * multiplier + 10 * c1,
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
    const _isEu = isEU(id);

    if (_isEu) {
      fill = mapFills ? mapFills.call(this, id) : 'rgba(0,0,0,0.8)';
    } else {
      fill = 'rgba(0,0,0,0.2)';
    }

    return (
      <Tile
        fill={fill}
        clickHandler={_isEu ? tileClickHandler.bind(this, id) : () => {}}
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
              return zoomedIn(false, state);
            case 'entering':
              return zoomedOut(true, state);
            case 'exiting':
              return zoomedIn(true, state);
            case 'exited':
              return zoomedOut(false, state);
            default:
              return null;
          }
        }}
      </Transition>
    </div>
  );

  function zoomedOut(animate = false, state = '') {
    return (
      <Svg animate={animate} state={state}>
        {Object.keys(europe).map(k => {
          return tileCoordToSvg(k);
        })}
      </Svg>
    );
  }

  function zoomedIn(animate = false, state = '') {
    // TODO: for now always zoom in on italy
    return (
      <Svg animate={animate} state={state}>
        {Object.keys(europe).map(k => {
          const fill = k === 'ITA' ? 'white' : 'rgba(0,0,0,0.75)';
          return <Geography id={k} fill={fill} d={europe[k].d} key={k} />;
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
    const { children, animate = false, state } = props;
    useEffect(() => {
      if (!animate) return;
      if (country) {
        zoomToCountry(true, svg.current);
      } else {
        zoomToTiles(svg.current);
      }
    }, [country, animate]);

    const svg = useRef(null);
    // For now, it always zooms on italy
    const { scale, translate } = europe['ITA'].zoom;
    const style = ['entering', 'entered'].includes(state)
      ? {
          transform: `translate(${translate
            .map(val => `${val}%`)
            .join(', ')}) scale(${scale})`
        }
      : {};
    const strokeWidth = country ? 0.5 : 0;

    return (
      <svg
        className={styles[state]}
        ref={svg}
        style={style}
        // fill="transparent"
        // height="900"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        version="1.2"
        viewBox="0 0 1000 900"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    );
  }
}
