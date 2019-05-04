import React, { useState, useEffect } from 'react';
import Map from '../components/Map.jsx';
import useStoreon from 'storeon/react';

export default function(props) {
  // const {
  //   match: {
  //     params: { id }
  //   }
  // } = props;

  const { deepdives, dispatch } = useStoreon('deepdives');
  console.log(deepdives);

  return (
    <div>
      <Map />
    </div>
  );
}
