import React, { useState, useEffect } from 'react';
import styles from '../styles/FilterMenu.module.css';
import { TYPES } from '../lib/constants';
import { classNames } from '../lib/helpers';

export default function(props) {
  const { onChange = () => {}, className = '' } = props,
    [types, setTypes] = useState([]),
    [search, setSearch] = useState(''),
    [text, setText] = useState(''),
    isAll = !types.length;

  useEffect(() => {
    onChange(types, search.toLowerCase());
  }, [types, search]);

  return (
    <div className={classNames(styles.root, className)}>
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
