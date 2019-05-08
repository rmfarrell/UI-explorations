import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/DeepDive.module.css';

// -- Libs

// -- Modules
import Map from '../components/Map.jsx';
import Description from '../components/Description.jsx';
import Collection from '../components/Collection.jsx';

// TODO: Use hooks here
export default function(props) {
  const id = props.match.params.id || 'Europe',
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
        <div className="grid--item__third">
          <Map linkPrefix="deep-dives/country/" />
        </div>
        <div className="grid--item__two-thirds">
          <Description />
        </div>
      </div>
      <Collection
        articles={deepdives}
        showType={false}
        className={styles.collection}
      />
    </article>
  );
}
