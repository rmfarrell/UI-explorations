import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs

// -- Modules
import Map from '../components/Map.jsx';
import Description from '../components/Description.jsx';
import Collection from '../components/Collection.jsx';
import { Route, Link } from 'react-router-dom';

// TODO: Use hooks here
export default function(props) {
  const { match } = props,
    { articles } = useStoreon('articles'),
    deepdives = Object.keys(articles)
      .filter(id => id.includes('DDV'))
      .map(deepdiveId => {
        return Object.assign(articles[deepdiveId], { id: deepdiveId });
      });

  return (
    <article>
      <header className={[styles.header, 'constrain'].join(' ')}>
        <h1>All Deep Dives</h1>
      </header>
      <div className={['grid', styles.headerRow].join(' ')}>
        <div className={styles.mapContainer}>
          <Route
            path={`${match.path}`}
            exact
            render={() => <Map linkPrefix="/deep-dives/country/" size={0} />}
          />
          <Route
            path={`${match.path}/country/:id`}
            exact
            render={route => (
              <Map
                linkPrefix="/deep-dives/country/"
                indexUrl="/deep-dives"
                size={0}
                focus={route.match.params.id}
              />
            )}
          />
        </div>
        <div className={styles.descriptionContainer}>
          <Description />
        </div>
      </div>

      <Route
        path={`${match.path}`}
        exact
        render={() => (
          <Collection
            articles={deepdives}
            showType={false}
            className={styles.collection}
          />
        )}
      />

      <Route
        path={`${match.path}/country/:id`}
        exact
        render={route => (
          <Collection
            articles={deepdives.filter(
              filterByCountry.bind(this, route.match.params.id)
            )}
            showType={false}
            className={styles.collection}
          />
        )}
      />
    </article>
  );

  function filterByCountry(id, { meta: { countries = [] } }) {
    return countries.includes(id);
  }
}
