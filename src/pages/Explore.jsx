import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/Explore.module.css';

// -- Libs
import {
  articlesToArray,
  articleCountByCountry,
  classNames,
  toggleInArray
} from '../lib/helpers.js';

// -- Modules
import Collection from '../components/Collection.jsx';
import TextSearch from '../components/TextSearch.jsx';
import Map from '../components/Map.jsx';
import MapTile from '../components/MapTile.jsx';

let all = [];
export default function(props) {
  const {} = props;
  const { articles } = useStoreon('articles'),
    [data, setData] = useState([]),
    [countriesFilter, setCountriesFilter] = useState([]),
    [searchFilter, setSearchFilter] = useState([]),
    [typeFilters, setTypeFilters] = useState([]),
    articleCounts = data.reduce(articleCountByCountry, {});

  useEffect(() => {
    all = articlesToArray(articles).sort((a, b) => {
      return b.date - a.date;
    });
    setData(all);
    console.log('used articles effect');
  }, [articles]);

  useEffect(() => {
    applyFilters();
  }, [typeFilters, countriesFilter, searchFilter]);

  return (
    <article className={styles.root}>
      <div className={classNames(styles.menu, 'grid')}>
        <div className={styles.textContainer}>
          <TextSearch
            onChange={applyFilters}
            setSearchFilter={setSearchFilter}
          />
        </div>
        <div className={classNames(styles.mapContainer, 'grid--item__third')}>
          <Map renderTile={renderTile} />
        </div>
        <div className={classNames('grid--item__two-thirds')}>
          <p>test</p>
          <p>test</p>
          <p>test</p>
          <p>test</p>
        </div>
      </div>
      <Collection articles={data} />;
    </article>
  );

  function applyFilters() {
    let out = all;
    out = filterByText(out, searchFilter);
    out = filterByType(out, typeFilters);
    out = filterByCountry(out, countriesFilter);
    setData(out);
  }

  function renderTile(countryCode) {
    const count = articleCounts[countryCode];
    return (
      <MapTile
        weight={count * 0.75}
        onClick={onCountryClick.bind(this, countryCode)}
        key={countryCode}
        isLand
      >
        <span>
          {countryCode} ({count || 0})
        </span>
      </MapTile>
    );
  }

  function onCountryClick(country) {
    const c = toggleInArray(countriesFilter, country);
    setCountriesFilter(c);
  }
}

function filterByCountry(items = [], targets) {
  if (!targets.length) return items;
  return items.filter(item => {
    const {
      meta: { countries = [] }
    } = item;
    console.log(countries.some(ct => countries.includes(ct)));
    return countries.some(ct => targets.includes(ct));
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
