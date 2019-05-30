import React from 'react';

export default function(props) {
  const { tweets } = props;
  console.log(tweets[0]['ext-url']);
  return '';
}
