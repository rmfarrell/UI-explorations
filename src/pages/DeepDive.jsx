import React, { useState, useEffect } from 'react';
import useStoreon from 'storeon/react';
import styles from '../styles/CollectionPage.module.css';

// -- Libs
import { dereferenceArticles, classNames } from '../lib/helpers';

// -- Modules
import CustomArticle from '../components/CustomArticle.jsx';
import Map from '../components/Map.jsx';
import SingleItem from '../components/SingleItem.jsx';
import Link from '../components/Link.jsx';
import ArticlesGrid from '../components/ArticlesGrid.jsx';

export default React.memo(function(props) {
  const {
      history,
      match: {
        params: { id }
      }
    } = props,
    { deepdives, articles } = useStoreon('deepdives', 'articles'),
    deepdive = id && deepdives[`DDV_${id}`];
  if (!deepdive) return error();
  const title = deepdive.custom_article.title,
    {
      custom_article,
      articles: { featured, collection }
    } = deepdive,
    featuredData = dereferenceArticles(
      // Filter out socials from filter :(
      articles,
      featured.filter(id => !id.includes('SOC'))
    ),
    collectionData = dereferenceArticles(articles, collection).reduce(
      reduceArticleCollection,
      {}
    ),
    [firstFeatured] = featuredData.splice(0, 1);

  return (
    <article className={styles.root}>
      <header className="constrain">
        <h2>
          <Link to="/deep-dives">&lt; Deep Dives</Link>
        </h2>
        <h1>{title}</h1>
      </header>
      <div className={classNames('grid', 'constrain')}>
        <div className="grid--item__third">
          <Map
            tileClickHandler={id => history.push(`/deep-dives/country/${id}`)}
          />
        </div>
        <div
          className={
            firstFeatured ? 'grid--item__third' : 'grid--item__two-thirds'
          }
        >
          <CustomArticle data={custom_article} />
        </div>
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
      <ArticlesGrid featured={featuredData} collection={collectionData} />
    </article>
  );
});

function error() {
  return '';
}

function reduceArticleCollection(acc, item) {
  const type = item.document_type || item.type;
  acc[type] = acc[type] ? acc[type].concat(item) : [item];
  return acc;
}
