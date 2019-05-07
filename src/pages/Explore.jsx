import React from 'react';
import { helpers } from 'handlebars';
import useStoreon from 'storeon/react';

// -- Libs
import { articlesToArray } from '../lib/helpers.js';

// -- Modules
import Collection from '../components/Collection.jsx';

export default function(props) {
  const { articles } = useStoreon('articles'),
    data = articlesToArray(articles);
  return <Collection articles={data} />;
}
