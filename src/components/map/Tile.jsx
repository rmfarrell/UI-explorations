import React from 'react';

export default function Tile(props) {
  const {
    id = '',
    fill = '',
    clickHandler,
    d = '',
    tile,
    labelFn = id => id,
    showLabels = false,
    fontSize = 40,
    textFill = 'white'
  } = props;
  const [y, x] = tile;

  // TODO: use xhref for accessibility
  return clickHandler ? <a onClick={clickHandler}>{g()}</a> : g();

  function g() {
    return (
      <g>
        <path d={d} id={id} style={{ fill }} />;
        {showLabels && (
          <text
            x={`${x * 10 + 1.6}%`}
            y={`${y * 10 + 6.2}%`}
            fontSize={fontSize}
            fill={textFill}
          >
            {labelFn(id)}
          </text>
        )}
      </g>
    );
  }
}
