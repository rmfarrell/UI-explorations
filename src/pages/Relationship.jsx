import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/CollectionPage.module.css';

// -- Libs
import { dereferenceArticles, classNames } from '../lib/helpers';
import { fetchEntries } from '../lib/api';

// -- Modules
import CountryDropdown from '../components/CountryDropdown.jsx';
import Empty from '../components/Empty.jsx';
import Map from '../components/map/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import ArticlesGrid from '../components/ArticlesGrid.jsx';
import { Link } from 'react-router-dom';

export default function(props) {
  const mock = Mock();
  const { country = '', history = {}, match } = props,
    { relationships, articles } = useStoreon('relationships', 'articles'),
    // -- State
    [socialItems, setSocialItems] = useState([]),
    [finityArticles, setFinityArticles] = useState([]),
    [error, setError] = useState(null),
    [collectionData, setCollectionData] = useState({}),
    [featuredData, setFeaturedData] = useState([]),
    [firstFeatured] = featuredData ? featuredData.splice(0, 1) : null;

  // Temporary logic until document-types are sorted out on the backend
  const relationship = country
    ? relationships[`REL_${country.toUpperCase()}`]
    : relationships['REL_GBR'];

  useEffect(() => {
    if (finityArticles.length) return;
    (async function() {
      const [err, articles] = await fetchEntries({
        limit: mock.total,
        offset: mock.offset,
        'content-types': 'finity-data:article',
        fields: [] //TODO
      });
      if (err) {
        setError(err);
        return;
      }
      articles.forEach(article => {
        mock.add(article);
      });
      setCollectionData(mock.collection);
    })();

    async function _fetch(limit = 6, offset = 0) {
      return await fetchEntries({
        limit,
        offset,
        'content-types': 'finity-data:article',
        fields: [] //TODO
      });
    }
  }, [country]);

  // set social items
  useEffect(() => {
    if (socialItems.length) return;
    (async function() {
      const [error, entries] = await fetchEntries({
        'content-types': 'finity-data:post:tweet',
        limit: 10,
        fields: ['ext-url']
      });
      error && setError(error);
      setSocialItems(entries);
    })();
  }, [setSocialItems]);

  // errors
  useEffect(() => {
    error && console.error(error);
  }, [error]);

  return (
    <article className={styles.root}>
      <header className="constrain">
        <CountryDropdown
          className="big"
          initialValue={country || 'Europe'}
          onChange={onDropDownSelect}
        />
      </header>
      <div className={classNames('grid', 'constrain')}>
        <div className="grid--item__third">
          <Map
            country={country}
            tileClickHandler={id => history.push(`/relationship/${id}`)}
          >
            {country && (
              <Link to={'/relationship'} className={styles.zoomOutButton}>
                <i className="material-icons">zoom_out_map</i>
              </Link>
            )}
          </Map>
        </div>
        {relationshipStatus(!firstFeatured)}
        {firstFeatured && (
          <div className="grid--item__third">
            <SingleItem
              data={firstFeatured}
              className=""
              size={2}
              type="article"
              summaryLines={2}
              link={`#${firstFeatured.id}`}
            />
          </div>
        )}
      </div>
      <ArticlesGrid
        featured={featuredData}
        collection={collectionData}
        socialItems={socialItems}
      />
    </article>
  );

  function relationshipStatus(isWide = false) {
    const className = isWide ? 'grid--item__two-thirds' : 'grid--item__third';
    return (
      <div className={className}>
        <Empty className="emptyTile" style={{ background: 'white' }}>
          <h4 className="placeholderEmpty">Relationship Status</h4>
        </Empty>
      </div>
    );
  }

  function onDropDownSelect({ value }) {
    props.history.replace(`/relationship/${value}`);
  }
}

function error(err) {
  console.error(err);
  return '';
}

function reduceArticleCollection(acc, item) {
  const type = item.document_type || item.type;
  acc[type] = acc[type] ? acc[type].concat(item) : [item];
  return acc;
}

// TODO: Temporary logic to fill in tiles until the backend has
// sorted out how document-types get assigned
function Mock() {
  const counts = {
    Analysis: 12,
    Opinion: 8,
    Media: 9,
    'Policy Documents': 2,
    Articles: 20
  };
  const offset = Math.round(getRandomArbitrary(10, 900));
  const collection = Object.keys(counts).reduce((acc, item) => {
    acc[item] = [];
    return acc;
  }, {});
  const map = Object.keys(counts).map(key => {
    return [key, counts[key]];
  });

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  return {
    get total() {
      return Object.values(counts).reduce((acc, c) => (acc += c), 0);
    },
    counts,
    offset,
    add(article = {}, index) {
      for (let x = 0; x < map.length; x++) {
        const [key, max] = map[x];
        if (collection[key].length < max) {
          collection[key].push(article);
          break;
        }
      }
    },
    collection
  };
}
