import React from 'react';

export default function(props) {
  const {
    match: {
      params: { id }
    }
  } = props;
  return (
    <div>
      <h1>Deep Dive</h1>
    </div>
  );
}
