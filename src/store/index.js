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

  store.on('articles/add', ({ articles }, newArticles) => {
    return {
      articles: Object.assign(articles, newArticles)
    };
  });
}
