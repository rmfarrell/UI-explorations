import React from 'react';

import Tile from './Tile';

export default React.memo(props => {
  const {
    rows = 10,
    columns = 10,
    className = '',
    emptyTileFill = '#000',
    getD = () => {}
  } = props;
  let tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      tiles.push({
        fill: emptyTileFill,
        d: getD([row, col]),
        tile: [row, col]
      });
    }
  }

  return (
    <svg
      version="1.2"
      viewBox="0 0 1201 1201"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      id="empty-tiles"
    >
      {tiles.map((props, i) => (
        <Tile {...props} key={i} />
      ))}
    </svg>
  );
});
