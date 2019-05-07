import React, { useState, useEffect } from 'react';
import styles from '../styles/FilterMenu.module.css';
import { TYPES } from '../lib/constants';

export default function(props) {
  const { onChange = () => {} } = props,
    [types, setTypes] = useState([]),
    [search, setSearch] = useState(''),
    [text, setText] = useState(''),
    isAll = !types.length;

  useEffect(() => {
    onChange(types, search.toLowerCase());
  }, [types, search]);

  return (
    <div className={[styles.root, 'constrain'].join(' ')}>
      <form onSubmit={textSearch}>
        <input
          type="text"
          name="text"
          placeholder="All Items"
          onChange={e => setText(e.target.value)}
          value={text}
        />
        {search && (
          <button role="button" onClick={clearSearch}>
            &times;
          </button>
        )}
        {search !== text ? <input type="submit" value="SEARCH" /> : ''}
      </form>
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

  function textSearch(e) {
    e.preventDefault();
    setSearch(text);
  }

  function clearSearch() {
    setSearch('');
    setText('');
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
