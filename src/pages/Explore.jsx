import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/Explore.module.css';

// -- Libs
import {
  articlesToArray,
  articleCountByCountry,
  classNames,
  toggleInArray
} from '../lib/helpers';
import { TYPES, ISSUES, ENTITIES } from '../lib/constants';

// -- Modules
import Collection from '../components/Collection.jsx';
import TextSearch from '../components/TextSearch.jsx';
import Map from '../components/Map.jsx';
import MapTile from '../components/MapTile.jsx';
import Dropdown from 'react-dropdown';
import Calendar from 'react-calendar';

let all = [];
export default function(props) {
  const {} = props;
  const { articles } = useStoreon('articles'),
    [data, setData] = useState([]),
    [countriesFilter, setCountriesFilter] = useState([]),
    [searchFilter, setSearchFilter] = useState([]),
    [typeFilter, setTypeFilter] = useState(''),
    [entityFilter, setEntityFilter] = useState(''),
    [issueFilter, setIssueFilter] = useState(''),
    [sortParam, setSortParam] = useState(''),
    [topicFilter, setTopicFilter] = useState(''),
    articleCounts = data.reduce(articleCountByCountry, {}),
    typeOptions = [...TYPES, { value: '', label: 'All' }];

  useEffect(() => {
    all = articlesToArray(articles).sort((a, b) => {
      return b.date - a.date;
    });
    setData(all);
    console.log('used articles effect');
  }, [articles]);

  useEffect(() => {
    applyFilters();
  }, [typeFilter, countriesFilter, searchFilter]);

  const topics = {};

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
          {/* const count = articleCounts[countryCode];
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
    ); */}
          <Map />
        </div>
        <div className={classNames('grid--item__two-thirds')}>
          <div className={classNames(styles.filtersRow, styles.wide)}>
            <div>
              <label>From Date:</label>
              <Dropdown
                options={['', '', '']}
                className={styles.dropdown}
                placeholder="Select Date"
              />
            </div>
            <div>
              <label>To Date:</label>
              <Dropdown
                options={['', '', '']}
                className={styles.dropdown}
                placeholder="Select Date"
              />
            </div>
          </div>
          <div className={classNames(styles.filtersRow, styles.wide)}>
            <div>
              <label>Entities</label>
              <Dropdown
                className={styles.dropdown}
                options={ENTITIES}
                value={entityFilter}
                onChange={opt => setEntityFilter(opt.value)}
                placeholder="All"
              />
            </div>
            <div>
              <label>Topics</label>
              <Dropdown
                className={styles.dropdown}
                options={ISSUES}
                value={topicFilter}
                onChange={opt => setTopicFilter(opt.value)}
                placeholder="All"
              />
            </div>
          </div>

          <div className={styles.filtersRow}>
            <label>Issues</label>
            <Dropdown
              className={styles.dropdown}
              options={ISSUES}
              value={issueFilter}
              onChange={opt => setIssueFilter(opt.value)}
              placeholder="All"
            />
          </div>

          <div className={styles.filtersRow}>
            <label>Document Type</label>
            <Dropdown
              className={styles.dropdown}
              options={typeOptions}
              value={typeFilter}
              onChange={opt => setTypeFilter(opt.value)}
              placeholder="All"
            />
          </div>

          <div className={classNames(styles.filtersRow, styles.wide)}>
            <h4>{data.length} Items Found</h4>
            <Dropdown
              className={styles.dropdown}
              options={['Date', 'Relvance']}
              value={sortParam}
              onChange={opt => setSortParam(opt.value)}
              placeholder="Sort"
            />
          </div>
        </div>
      </div>
      <Collection articles={data} />;
    </article>
  );

  function nothing() {}

  function fromUpdated(val) {
    console.log(val);
  }

  function toUpdated(val) {
    console.log(val);
  }

  function applyFilters() {
    let out = all;
    out = filterByText(out, searchFilter);
    out = filterByType(out, typeFilter);
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
