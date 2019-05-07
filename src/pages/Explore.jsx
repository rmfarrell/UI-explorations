import React from 'react';
import { helpers } from 'handlebars';
import useStoreon from 'storeon/react';
import styles from '../styles/Explore.module.css';

// -- Libs
import { articlesToArray } from '../lib/helpers.js';

// -- Modules
import Collection from '../components/Collection.jsx';
import FilterMenu from '../components/FilterMenu.jsx';

export default function(props) {
  const { articles } = useStoreon('articles'),
    data = articlesToArray(articles);

  return (
    <div className={styles.root}>
      <FilterMenu onChange={updateFilters} />
      <Collection articles={data} />;
    </div>
  );

  function updateFilters(types, search) {}
}
