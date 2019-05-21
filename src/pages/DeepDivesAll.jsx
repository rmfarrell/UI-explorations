import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { COUNTRIES } from '../lib/constants';
import { articleCountByCountry, classNames } from '../lib/helpers';

// -- Modules
import Map from '../components/Map.jsx';
import Collection from '../components/Collection.jsx';
import Empty from '../components/Empty.jsx';
import { Link, withRouter } from 'react-router-dom';

export default withRouter(function(props) {
  const { match, history } = props,
    { articles } = useStoreon('articles'),
    deepdives = Object.keys(articles)
      .filter(id => id.includes('DDV'))
      .map(deepdiveId => {
        return Object.assign(articles[deepdiveId], { id: deepdiveId });
      }),
    articleCounts = deepdives.reduce(articleCountByCountry, {}),
    articleCountsMax = Object.values(articleCounts).reduce((item, acc) =>
      item > acc ? item : acc
    );
  const country = match.params.country;

  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h1>Deep Dives {country && `: ${COUNTRIES[match.params.country]}`}</h1>
      </header>
      <div className="grid">
        <div className="grid--item__third">
          <Map
            country={country}
            mapFills={id => {
              const count = articleCounts[id] || 0;
              const saturation = 100 * (count / articleCountsMax);
              return `hsl(346, ${saturation}%, 50%)`;
            }}
            tileClickHandler={id =>
              articleCounts[id] && history.push(`/deep-dives/country/${id}`)
            }
            label={id => id}
          >
            {country && (
              <Link to={'/deep-dives'} className={styles.zoomOutButton}>
                <i className={classNames('material-icons')}>zoom_out_map</i>
              </Link>
            )}
          </Map>
        </div>
        <div className="grid--item__two-thirds">
          <Empty style={{ background: 'white' }}>
            <h4 className="placeholderEmpty">Description</h4>
          </Empty>
        </div>
      </div>
      <Collection
        articles={deepdives.filter(filterByCountry.bind(this, country))}
        showType={false}
        className={styles.collection}
      />
    </article>
  );
});

function filterByCountry(countryId, { meta: { countries = [] } }) {
  if (!countryId) {
    return true;
  }
  return countries.includes(countryId);
}
