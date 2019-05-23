import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/Map.module.css';
import { Transition } from 'react-transition-group';
import { isEU, classNames, animate, easing } from '../lib/helpers';
import { toPathString, interpolate } from 'flubber';
import { data as europe } from '../lib/europe_map';

import MapIslands from './MapIslands.jsx';
import { CSSTransition } from 'react-transition-group';

const tempDesaturate = 'rgba(20,10,0,0.5)';

// Temporarily expose animation vars on window
window.speed = null;
window.easing = null;

export default function(props) {
  let start;
  const {
    size = 1,
    renderTile,
    mapFills,
    tileClickHandler = () => {},
    country = '',
    label,
    children,
    geographyStroke = 'rgba(255,255,255,0.2)',
    // geographyFill = 'rgba(20,10,0,0.5)',
    // geographyActiveFill = '#ff003b',
    // tileFill = 'rgba(0,0,0,0.25)',
    // euTileFill = '#ff003b',

    geographyFill = tempDesaturate,
    geographyActiveFill = tempDesaturate,
    tileFill = tempDesaturate,
    euTileFill = tempDesaturate,
    animationTime = window.speed || 500
  } = props;

  if (renderTile && typeof renderTile !== 'function') {
    throw new Error('renderTile must be function which retuns a MapTile');
  }

  function zoomToCountry(svg) {
    if (!window) return;

    Object.keys(europe).forEach(k => {
      const { d } = europe[k];
      const target = svg.querySelector(`#${k}`);
      if (!d) {
        target.setAttribute('d', '');
        return;
      }
      if (!target) return;
      const geo = target.getAttribute('d');
      const interpolator = interpolate(geo, d);

      animate(animationTime, window.easing || easing.easeOutQuart, val => {
        target.setAttribute('d', interpolator(val));
      });
    });
  }

  function zoomToTiles(svg) {
    Object.keys(europe).forEach(k => {
      const { d, tile } = europe[k];
      if (!d) return;
      const target = svg.querySelector(`#${k}`);
      if (!target) return;
      const geo = target.getAttribute('d');
      if (!tile) return;
      const aSquare = dFromTileData(tile);
      if (!aSquare) return;
      const interpolator = interpolate(geo, aSquare);
      animate(animationTime, window.easing || easing.easeOutQuart, val => {
        target.setAttribute('d', interpolator(val));
      });
    });
  }

  function dFromTileData(tile) {
    const gap = 11;
    const multiplier = 109;
    const topOffset = 50;
    const [c1, c2] = tile,
      x = c2 * multiplier + gap * c2,
      y = c1 * multiplier + gap * c1 + topOffset,
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
      fill = mapFills ? mapFills.call(this, id) : euTileFill;
    } else {
      fill = tileFill;
    }

    return (
      <Tile
        fill={fill}
        clickHandler={_isEu ? tileClickHandler.bind(this, id) : () => {}}
        d={dFromTileData(tile)}
        id={id}
        key={id}
        tile={tile}
      />
    );
  }

  function Geography(props) {
    const { id = '', fill = '', d = '' } = props;
    return <path d={d} id={id} fill={fill} />;
  }
  // 37 45 56

  function Tile(props) {
    const { id = '', fill = '', clickHandler = () => {}, d = '', tile } = props;
    const [y, x] = tile;
    return (
      // TODO: use xhref for accessibility
      <a onClick={clickHandler}>
        <g>
          <path d={d} id={id} fill={fill} />;
          {country || (
            <text
              x={`${x * 10 + 1}%`}
              y={`${y * 10 + 9.5}%`}
              fontSize="40"
              fill="white"
            >
              {label ? label(id) : id}
            </text>
          )}
        </g>
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
      {children}
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
      <Svg state={state} country={country}>
        {Object.keys(europe).map(k => {
          return tileCoordToSvg(k);
        })}
      </Svg>
    );
  }

  function zoomedIn(animate = false, state = '') {
    // TODO: for now always zoom in on italy
    return (
      <Svg state={state} country={country}>
        {Object.keys(europe).map(k => {
          const fill = k === 'ITA' ? geographyActiveFill : geographyFill;
          return <Geography id={k} fill={fill} d={europe[k].d} key={k} />;
        })}
      </Svg>
    );
  }

  function Svg(props) {
    const { children, state = '', country = '' } = props;
    // For now, it always zooms on italy
    const { scale, translate } = europe['ITA'].zoom;
    const primay = useRef(null);
    const secondary = useRef(null);
    const strokeWidth = country ? 0.5 : 0;
    const zoomedInTransform = `translate(${translate
      .map(val => `${val}%`)
      .join(', ')}) scale(${scale})`;
    const transform = zoomedInTransform;
    const [isCountry, setIsCountry] = useState(false);

    useEffect(() => {
      setIsCountry(['entering', 'entered'].includes(state));
      if (state === 'entering') {
        zoomToCountry(primay.current);
        // primay.current.style.transform = zoomedInTransform;
      }
      if (state === 'exiting') {
        zoomToTiles(primay.current);
        // primay.current.style.transform = '';
      }
    }, [state]);

    return (
      <React.Fragment>
        <CSSTransition
          in={isCountry}
          timeout={10}
          unmountOnExit
          appear
          classNames="fade"
        >
          <MapIslands
            className={styles.islands}
            highlight={country ? 'ITA' : null}
            highlightColor={geographyActiveFill}
            defaultColor={geographyFill}
          />
        </CSSTransition>
        <svg
          className={styles[state]}
          ref={primay}
          // style={['exiting', 'entered'].includes(state) ? { transform } : {}}
          stroke={geographyStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          version="1.2"
          viewBox="0 0 1201 1201"
          xmlns="http://www.w3.org/2000/svg"
        >
          {children}
        </svg>
      </React.Fragment>
    );
  }
}
