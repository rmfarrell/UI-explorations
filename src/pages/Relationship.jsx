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

// TODO: Use hooks here
export default function(props) {
  let relationship;
  const { country = '', history = {}, match } = props,
    { relationships, articles } = useStoreon('relationships', 'articles'),
    // -- State
    [socialItems, setSocialItems] = useState([]),
    [error, setError] = useState(null);

  relationship = country && relationships[`REL_${country.toUpperCase()}`];
  // TODO: temporary hack
  if (!country) {
    relationship = relationships['REL_GBR'];
  }
  if (!relationship) setError(new Error(`no relationship found`));
  const {
      relationship_status,
      articles: { featured, collection }
    } = relationship,
    featuredData = dereferenceArticles(
      articles,
      // Filter out socials from filter :(
      featured.filter(country => !country.includes('SOC'))
    ),
    collectionData = dereferenceArticles(articles, collection).reduce(
      reduceArticleCollection,
      {}
    ),
    [firstFeatured] = featuredData.splice(0, 1);

  // delete social media mocks
  delete collectionData['Social Media Item'];

  // set social items
  useEffect(() => {
    if (socialItems.length) return;
    (async function() {
      const [error, entries] = await fetchEntries({
        'content-types': 'finity-data:post:tweet',
        limit: 10
      });
      error && setError(error);
      setSocialItems(entries);
    })();
  }, [socialItems.length]);

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
