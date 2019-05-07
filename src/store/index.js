import createStore from 'storeon';
import 'unfetch/polyfill';

// For faking the date on deep dives :(
let counter = 0;

export default createStore([
  data,
  process.env.NODE_ENV !== 'production' && require('storeon/devtools')
]);

function data(store) {
  store.on('@init', () => {
    return {
      deepdives: [],
      articles: [],
      relationships: []
    };
  });

  store.on('relationships/update', ({ relationships }, value) => {
    return {
      relationships: value
    };
  });

  store.on('deepdives/update', ({ deepdives }, value) => {
    return {
      deepdives: value
    };
  });

  store.on('@dispatch', ({}, b) => {
    console.debug(b);
  });

  store.on('articles/add', ({ articles, articlesArr }, { data, type }) => {
    for (let x in data) {
      data[x] = normalizeArticle(data[x], type);
    }
    return {
      articles: Object.assign(articles, data)
    };
  });
}

function normalizeArticle(data, type) {
  const { relationships = {} } = data,
    { primary_country, countries = [] } = relationships;
  let out = {
    date: '',
    title: '',
    summary: '',
    source: '',
    author: '',
    type: data.type,
    document_type: data.document_type,
    meta: {
      countries: [primary_country, ...countries]
    }
  };
  switch (type) {
    case 'EXR':
      out.date = new Date(data.publication_date);
      out.title = data.title;
      out.summary = data.description;
      out.source = data.author;
      out.author = data.author;
      return out;

    case 'RSS':
      out.date = new Date(data.item.publication_date);
      out.title = data.item.title;
      out.summary = data.item.description;
      out.source = data.channel.title;
      out.author = data.item.author;
      return out;

    case 'SOC':
      out.date = new Date(data.date);
      out.title = '';
      out.summary = data.text;
      out.source = 'Twitter';
      out.author = `${data.author.split(' ')[0].toLowerCase()}`;
      return out;

    case 'DDV':
      const { custom_article } = data;

      // fake date
      const fakeDate = new Date();
      fakeDate.setDate(fakeDate.getDate() - ++counter);
      out.date = fakeDate;
      out.title = custom_article.title;
      out.summary = custom_article.short_description;
      out.source = custom_article.curator;
      out.author = data.author;
      return out;
    default:
      return data;
  }
}
