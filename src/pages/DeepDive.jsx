import React from 'react';
import Map from '../components/Map.jsx';

export default function(props) {
  const {
    match: {
      params: { id }
    }
  } = props;
  return (
    <div>
      <Map />
    </div>
  );
}
