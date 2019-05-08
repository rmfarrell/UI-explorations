import React, { useState, useEffect } from 'react';
import styles from '../styles/TextSearch.module.css';
import { TYPES } from '../lib/constants';
import { classNames, toggleInArray } from '../lib/helpers';

// TODO: probably don't need text/type
// can pass as props
export default function(props) {
  const {
      // onChange = () => {},
      className = '',
      setSearchFilter,
      setTypeFilters
    } = props,
    // [types, setTypes] = useState([]),
    [search, setSearch] = useState(''),
    [text, setText] = useState('');
  // isAll = !types.length;

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
      {/* <ul>
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
      </ul> */}
    </div>
  );

  function textSearch(e) {
    e.preventDefault();
    setSearch(text);
    setSearchFilter(text);
  }

  function clearSearch() {
    setSearch('');
    setText('');
    setSearchFilter('');
  }

  // function clearFilters() {
  //   setSearch('');
  //   setTypes([]);
  //   setTypeFilters([]);
  // }

  // function toggleTypeFilter(type) {
  //   const topics = toggleInArray(types, type);
  //   setTypes(topics);
  //   setTypeFilters(topics);
  // }
}
