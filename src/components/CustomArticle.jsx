import React from 'react';

export default function(props) {
  const { data } = props;
  const { title = '', short_description = '' } = data;
  console.log(data);
  return <p>Custom Article</p>;
}
