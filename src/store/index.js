import createStore from 'storeon';
import 'unfetch/polyfill';

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

  store.on('articles/add', ({ articles }, { data, type }) => {
    for (let x in data) {
      data[x] = normalizeArticle(data[x], type);
    }
    return {
      articles: Object.assign(articles, data)
    };
  });
}

function normalizeArticle(data, type) {
  let out = {
    date: '',
    title: '',
    summary: '',
    source: '',
    author: '',
    type: data.type,
    document_type: data.document_type
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

      out.date = new Date();
      out.title = custom_article.title;
      out.summary = custom_article.short_description;
      out.source = custom_article.curator;
      out.author = data.author;
      return out;
    default:
      return data;
  }
}
