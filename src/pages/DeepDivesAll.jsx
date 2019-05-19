import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { COUNTRIES } from '../lib/constants';
import { articleCountByCountry } from '../lib/helpers';

// -- Modules
import Map from '../components/Map.jsx';
import Description from '../components/Description.jsx';
import Collection from '../components/Collection.jsx';
import MapTile from '../components/MapTile.jsx';
import DeepDive from './DeepDive.jsx';
import Empty from '../components/Empty.jsx';
import { Route, Link, withRouter } from 'react-router-dom';

export default withRouter(function(props) {
  const { match, history } = props,
    { articles } = useStoreon('articles'),
    deepdives = Object.keys(articles)
      .filter(id => id.includes('DDV'))
      .map(deepdiveId => {
        return Object.assign(articles[deepdiveId], { id: deepdiveId });
      }),
    articleCounts = deepdives.reduce(articleCountByCountry, {});

  return (
    <React.Fragment>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h1>Figure out how the heading goes here</h1>
      </header>
      <div className="grid">
        <Route
          path={`${match.url}/country/:country`}
          children={({ match }) => (
            <div className="grid--item__third">
              {match && <Link to={'/deep-dives'}>All</Link>}
              <Map
                match={match}
                mapFills={id => 'red'}
                tileClickHandler={id =>
                  history.push(`/deep-dives/country/${id}`)
                }
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/country/:country`}
          children={({ match }) => (
            <Empty className="emptyTile" style={{ background: 'white' }}>
              <h4 className="placeholderEmpty">Description</h4>
            </Empty>
          )}
        />
      </div>
      <Route
        path={`${match.url}/country/:country`}
        exact
        component={DeepDiveCollection}
      />
      <Route path={`${match.url}`} exact component={DeepDiveCollection} />
    </React.Fragment>
  );
  function DeepDiveCollection(props) {
    const {
      match: {
        params: { country }
      }
    } = props;
    const heading = country
      ? `Deep Dives: ${COUNTRIES[country]}`
      : 'All Deep Dives';
    return (
      <article>
        <div className={['grid', styles.headerRow].join(' ')}>
          <div className="grid--item__third">
            {/* <Map
              linkPrefix="/deep-dives/country/"
              indexUrl="/deep-dives"
              size={0}
              focus={country}
              renderTile={country ? null : renderTile}
            /> */}
          </div>
        </div>
        <Collection
          articles={deepdives.filter(filterByCountry.bind(this, country))}
          showType={false}
          className={styles.collection}
        />
      </article>
    );
  }

  function renderTile(countryCode) {
    const count = articleCounts[countryCode];
    return (
      <MapTile
        weight={count * 2}
        link={`/deep-dives/country/${countryCode}`}
        key={countryCode}
        isLand
      >
        <span>
          {countryCode} ({count})
        </span>
      </MapTile>
    );
  }
});

function filterByCountry(countryId, { meta: { countries = [] } }) {
  if (!countryId) {
    return true;
  }
  return countries.includes(countryId);
}
