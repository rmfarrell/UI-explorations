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
    { deepdives } = useStoreon('deepdives'),
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

function dereferenceArticles(ids = []) {}

function reduceArticleCollection(acc, item) {
  const type = item.document_type || item.type;
  acc[type] = acc[type] ? acc[type].concat(item) : [item];
  return acc;
}
