import React, { useState } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/Explore.module.css';

// -- Libs
import { articlesToArray, articleCountByCountry } from '../lib/helpers.js';

// -- Modules
import Collection from '../components/Collection.jsx';
import FilterMenu from '../components/FilterMenu.jsx';
import Map from '../components/Map.jsx';

let dataMem;

export default function(props) {
  const {} = props;
  const { articles } = useStoreon('articles'),
    [data, setData] = useState([]),
    countryCount = data.reduce(articleCountByCountry, {});

  console.log(countryCount);

  return (
    <article className={styles.root}>
      <div className={[styles.menu, 'constrain'].join(' ')}>
        <div className={styles.mapContainer}>
          <Map />
        </div>
        <FilterMenu onChange={applyFilters} />
      </div>
      <Collection articles={data} />;
    </article>
  );

  function applyFilters(types, search) {
    console.log(search);
    dataMem = dataMem || memoizeData(articles);
    setData(filterByType(filterByText(dataMem, search), types));
  }
}

function memoizeData(items = []) {
  return articlesToArray(items).sort((a, b) => {
    return b.date - a.date;
  });
}

function filterByType(items = [], types) {
  if (!types.length) return items;
  return items.filter(item => {
    return types.includes(item.document_type);
  });
}

function filterByText(items = [], text) {
  if (!text) return items;
  return items.filter(({ title }) => {
    return title.toLowerCase().includes(text);
  });
}
