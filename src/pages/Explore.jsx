import React, { useState } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/Explore.module.css';

// -- Libs
import { articlesToArray } from '../lib/helpers.js';

// -- Modules
import Collection from '../components/Collection.jsx';
import FilterMenu from '../components/FilterMenu.jsx';

let dataMem;

export default function(props) {
  const {} = props;
  const { articles } = useStoreon('articles'),
    [data, setData] = useState([]);

  return (
    <div className={styles.root}>
      <FilterMenu onChange={applyFilters} />
      <Collection articles={data} />;
    </div>
  );

  function applyFilters(types, search) {
    if (!dataMem) {
      console.log('datamem undefined');
    }
    dataMem = dataMem || articlesToArray(articles);
    setData(filterByType(dataMem, types));
  }

  function filterByType(items = [], types) {
    if (!types.length) return items;
    return items.filter(item => {
      return types.includes(item.document_type);
    });
  }
}
