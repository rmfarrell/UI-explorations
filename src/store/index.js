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
      articles: []
    };
  });

  store.on('deepdives/update', ({ deepdives }, value) => {
    console.log('deepdives update');
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