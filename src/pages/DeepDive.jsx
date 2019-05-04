import React, { useState, useEffect } from 'react';
import Map from '../components/Map.jsx';
import useStoreon from 'storeon/react';

export default function(props) {
  const {
      match: {
        params: { id }
      }
    } = props,
    { deepdives } = useStoreon('deepdives'),
    deepdive = id && deepdives[`DDV:${id}`];
  console.log(deepdive);

  return (
    <div>
      <Map />
    </div>
  );
}
