import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/Map.module.css';
import { CSSTransition } from 'react-transition-group';
import { interpolate } from 'flubber';

// -- Libs
import { data as europe } from '../../lib/europe_map';
import { classNames, animate, easing } from '../../lib/helpers';

// -- Components
import Islands from './Islands.jsx';
import EmptyTiles from './EmptyTiles.jsx';

export default function Svg(props) {
  const {
    children,
    state = '',
    country = '',
    geographyStroke = 'rgba(255,255,255,0.2)',
    geographyFill = 'rgba(20,10,0,0.5)',
    geographyActiveFill = '#ff003b',
    rows = 10,
    columns = 10,
    emptyTileFill = 'rgba(255, 255, 255, 0.3)',
    animationTime = 700,
    viewBox = '0 0 1200 1200',
    getD
  } = props;

  // -- State
  const [showGrid, setShowGrid] = useState(false);
  const [showIslands, setShowIslands] = useState(false);
  const [showFade, setShowFade] = useState(false);

  // For now, it always zooms on italy
  const { scale, translate } = europe['ITA'].zoom;
  const primay = useRef(null);
  const strokeWidth = country ? 0.5 : 0;
  const zoomedInTransform = `translate(${translate
    .map(val => `${val}%`)
    .join(', ')}) scale(${scale})`;
  const transform = zoomedInTransform;

  useEffect(() => {
    setShowFade(['entering', 'exiting'].includes(state));
    if (state === 'entering') {
      zoomToCountry(primay.current);
      primay.current.style.transform = zoomedInTransform;
    }
    if (state === 'exiting') {
      zoomToTiles(primay.current);
      primay.current.style.transform = '';
    }
  }, [state]);

  useEffect(() => {
    setShowGrid(!country);
    setShowIslands(!!country);
  }, [country]);

  return (
    <svg
      className={styles[state]}
      ref={primay}
      style={['exiting', 'entered'].includes(state) ? { transform } : {}}
      stroke={geographyStroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      version="1.2"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <CSSTransition
        in={showIslands}
        timeout={animationTime * 2}
        classNames="fade"
        enter={showFade}
      >
        <Islands
          className={classNames(styles.secondarySvg, styles.islands)}
          highlight={country ? 'ITA' : null}
          highlightColor={geographyActiveFill}
          defaultColor={geographyFill}
        />
      </CSSTransition>

      <CSSTransition
        in={showGrid}
        timeout={animationTime * 2}
        classNames="fade"
        enter={showFade}
      >
        <EmptyTiles
          rows={rows}
          columns={columns}
          className={styles.secondarySvg}
          emptyTileFill={emptyTileFill}
          getD={getD}
        />
      </CSSTransition>
      {children}
    </svg>
  );

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

      animate(
        animationTime,
        easing.easeOutQuint,
        val => {
          target.setAttribute('d', interpolator(val));
        },
        100
      );
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
      const aSquare = getD(tile);
      if (!aSquare) return;
      const interpolator = interpolate(geo, aSquare);
      animate(
        animationTime,
        easing.easeOutQuint,
        val => {
          target.setAttribute('d', interpolator(val));
        },
        100
      );
    });
  }
}
