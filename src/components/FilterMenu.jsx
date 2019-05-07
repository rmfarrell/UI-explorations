import React, { useState, useEffect } from 'react';
import styles from '../styles/FilterMenu.module.css';
import { TYPES } from '../lib/constants';

export default function(props) {
  const { onChange = () => {} } = props,
    [types, setTypes] = useState([]),
    [search, setSearch] = useState(''),
    isAll = !search && !types.length;

  useEffect(() => {
    onChange(types, search);
  }, [types, search]);

  return (
    <div className={styles.root}>
      <ul>
        <li>
          <button
            onClick={clearFilters}
            className={isAll ? styles.active : undefined}
          >
            All
          </button>
        </li>
        {TYPES.map(type => (
          <li key={type}>
            <button
              onClick={() => toggleTypeFilter(type)}
              className={types.includes(type) ? styles.active : null}
            >
              {type}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  function update() {
    onChange(types, search);
  }

  function clearFilters() {
    setSearch('');
    setTypes([]);
    // update();
  }

  function toggleTypeFilter(type) {
    const topics = toggleInArray(types, type);
    setTypes(topics);
    // update();
  }
}

function toggleInArray(arr, str) {
  if (arr.includes(str)) {
    return arr.filter(item => item !== str);
  }
  return arr.concat(str);
}
