import React, { useState } from 'react';
import styles from '../styles/FilterMenu.module.css';
import { TYPES } from '../lib/constants';

export default function(props) {
  const {} = props,
    [types, setTypes] = useState([]),
    [search, setSearch] = useState(''),
    isAll = !search && !types.length;

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

  function clearFilters() {
    setSearch('');
    setTypes([]);
  }

  function toggleTypeFilter(type) {
    const topics = toggleInArray(types, type);
    setTypes(topics);
    // this.setState({
    //   filters: Object.assign(this.state.filters, { topics })
    // });
  }
}
/*
class FilterMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teasers: [],
      filters: {
        types: [],
        topics: []
      }
    };
  }

  render() {
    const { root, filterMenu, active } = styles;
    const results = this.state.teasers.filter(this.filterTeasers);
    return (
      <div className={root}>
        <ul>
          <li>
            <button
              onClick={this.clearFilters}
              className={this.isAll ? active : undefined}
            >
              All
            </button>
          </li>
          {TYPES.map(type => (
            <li key={type}>
              <button
                onClick={() => this.toggleTypeFilter(type)}
                className={
                  this.state.filters.types.includes(type) ? active : null
                }
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
        <ul>
          {TOPICS.map(topic => (
            <li key={topic}>
              <button
                onClick={() => this.toggleTopicFilter(topic)}
                className={
                  this.state.filters.topics.includes(topic) ? active : null
                }
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // -- Getters

  get isAll() {
    const { types, topics } = this.state.filters;
    return !(Object.keys(types).length || Object.keys(topics).length);
  }

  // -- Methods

  filterTeasers = ({ type = '', issues = [] }) => {
    if (this.isAll) return true;
    const { types, topics } = this.state.filters;
    let out = false;

    // apply type filter
    if (types.length && !types.includes(type)) {
      return false;
    }
    console.log(topics.length);
    // apply topics filter
    if (
      topics.length &&
      !topics.some(filteredTopic => issues.includes(filteredTopic))
    ) {
      return false;
    }

    return true;
  };

  toggleTypeFilter = t => {
    const types = toggleInArray(this.state.filters.types, t);
    this.setState({
      filters: Object.assign(this.state.filters, { types })
    });
  };

  toggleTopicFilter = t => {
    const topics = toggleInArray(this.state.filters.topics, t);
    this.setState({
      filters: Object.assign(this.state.filters, { topics })
    });
  };

  clearFilters = () => {
    this.setState({ filters: { types: [], topics: [] } });
  };

  // -- Lifecycle
  componentDidMount() {
    const teasers = [];
    for (let x = 0; x < totalResults; x++) {
      teasers.push(teaser());
    }
    this.setState({ teasers });
  }
}


  */

function toggleInArray(arr, str) {
  if (arr.includes(str)) {
    return arr.filter(item => item !== str);
  }
  return arr.concat(str);
}
