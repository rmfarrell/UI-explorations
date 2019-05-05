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
      socialMedia: [],
      rss: [],
      externalResources: []
    };
  });

  store.on('deepdives/update', ({ deepdives }, value) => {
    console.log('deepdives update');
    return {
      deepdives: value
    };
  });

  store.on('socialMedia/update', ({ socialMedia }, value) => {
    return {
      socialMedia: value
    };
  });

  store.on('rss/update', ({ rss }, value) => {
    return {
      rss: value
    };
  });

  store.on('externalResources/update', ({ externalResources }, value) => {
    return {
      externalResources: value
    };
  });
}
