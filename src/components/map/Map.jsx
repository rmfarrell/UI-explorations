import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Map.module.css';
import { Transition } from 'react-transition-group';
import { toPathString } from 'flubber';

// -- Libs
import { data as europe } from '../../lib/europe_map';
import { isEU, classNames } from '../../lib/helpers';

// -- Components
import Svg from './Svg.jsx';
import Tile from './Tile.jsx';

export default function(props) {
  let start;
  const {
    renderTile,
    mapFills,
    tileClickHandler = () => {},
    country = '',
    label,
    children,
    geographyStroke = 'rgba(255,255,255,0.2)',
    geographyFill = 'rgba(20,10,0,0.5)',
    geographyActiveFill = '#ff003b',
    tileFill = 'rgba(0,0,0,0.25)',
    euTileFill = '#ff003b',
    rows = 10,
    columns = 10,
    emptyTileFill = 'rgba(255, 255, 255, 0.3)',
    animationTime = 700,
    viewBox = '0 0 1200 1200',
    zoomable = false
  } = props;

  if (renderTile && typeof renderTile !== 'function') {
    throw new Error('renderTile must be function which retuns a MapTile');
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
        clickHandler={_isEu ? tileClickHandler.bind(this, id) : null}
        d={dFromTileData(tile)}
        id={id}
        key={id}
        tile={tile}
        showLabels={!country}
        label={label}
      />
    );
  }

  function Geography(props) {
    const { id = '', fill = '', d = '' } = props;
    return <path d={d} id={id} fill={fill} />;
  }
  // 37 45 56

  return (
    <div className={classNames(styles.root, country && styles.focused)}>
      {children}
      <Transition in={!!country} timeout={animationTime}>
        {state => {
          switch (state) {
            case 'entered':
              return zoomedIn(state);
            case 'entering':
              return zoomedOut(state);
            case 'exiting':
              return zoomedIn(state);
            case 'exited':
              return zoomedOut(state);
            default:
              return null;
          }
        }}
      </Transition>
    </div>
  );

  function zoomedOut(state = '') {
    return (
      <Svg state={state} country={country} {...props} getD={dFromTileData}>
        {Object.keys(europe).map(k => {
          return tileCoordToSvg(k);
        })}
      </Svg>
    );
  }

  function zoomedIn(state = '') {
    // TODO: for now always zoom in on italy
    return (
      <Svg state={state} country={country} {...props} getD={dFromTileData}>
        {Object.keys(europe).map(k => {
          const fill = k === 'ITA' ? geographyActiveFill : geographyFill;
          return <Geography id={k} fill={fill} d={europe[k].d} key={k} />;
        })}
      </Svg>
    );
  }
}

function dFromTileData(tile) {
  const gap = 11;
  const multiplier = 110;
  const topOffset = 1;
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
