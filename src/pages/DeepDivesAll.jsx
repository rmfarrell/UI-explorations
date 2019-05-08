import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs
import { COUNTRIES } from '../lib/constants';

// -- Modules
import Map from '../components/Map.jsx';
import Description from '../components/Description.jsx';
import Collection from '../components/Collection.jsx';
import DeepDive from './DeepDive.jsx';
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
    <React.Fragment>
      <Route path="/deep-dives/:id" component={DeepDive} />
      <Route path={`${match.path}`} exact component={DeepDiveCollection} />
      <Route
        path="/deep-dives/country/:country"
        exact
        component={DeepDiveCollection}
      />
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
        <header className={[styles.header, 'constrain'].join(' ')}>
          <h1>{heading}</h1>
        </header>
        <div className={['grid', styles.headerRow].join(' ')}>
          <div className="grid--item__third">
            <Map
              linkPrefix="/deep-dives/country/"
              indexUrl="/deep-dives"
              size={0}
              focus={country}
            />
          </div>
          <div className="grid--item__two-thirds">
            <Description />
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

  function filterByCountry(countryId, { meta: { countries = [] } }) {
    if (!countryId) {
      return true;
    }
    return countries.includes(countryId);
  }
}
