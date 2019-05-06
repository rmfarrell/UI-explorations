import React from 'react';
import useStoreon from 'storeon/react';
import { Link } from 'react-router-dom';

export default function(props) {
  const { deepdives } = useStoreon('deepdives');
  return (
    <ul>
      {Object.keys(deepdives).map(key => {
        return (
          <li key={key}>
            <Link to={`deep-dives/${key.split('_')[1]}`}>{key}</Link>
          </li>
        );
      })}
    </ul>
  );
}
