import React, { useState, useEffect } from 'react';
import CustomArticle from '../components/CustomArticle.jsx';
import Map from '../components/Map.jsx';
import useStoreon from 'storeon/react';

export default function(props) {
  const {
      match: {
        params: { id }
      }
    } = props,
    { deepdives, rss, socialMedia, externalResources } = useStoreon(
      'deepdives',
      'rss',
      'socialMedia',
      'externalResources'
    ),
    deepdive = id && deepdives[`DDV:${id}`];
  if (!deepdive) return loading();
  const {
      custom_article,
      articles: { featured, collection }
    } = deepdive,
    featuredData = dereferenceArticles(featured),
    collectionData = dereferenceArticles(collection);
  // articles = collection.reduce(reduceArticleCollection, {});

  // console.log(articles);
  console.log(rss);
  console.log(deepdives);
  console.log(socialMedia);
  console.log(externalResources);

  const tiles = [<Map />, <CustomArticle />];

  function loading() {
    return <div>loading</div>;
  }
  return (
    <div>
      <Map />
    </div>
  );
}

function dereferenceArticles(ids = []) {
  return ids;
}

function reduceArticleCollection(acc, item) {
  const type = item.document_type || item.type;
  acc[type] = acc[type] ? acc[type].concat(item) : [item];
  return acc;
}
