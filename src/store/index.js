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
      fetched: false
    };
  });

  // store.on('@init', async () => {
  //   const deepdives = await fetchDeepDives(20);
  //   console.log(deepdives);
  //   return {
  //     deepdives,
  //     fetched: false
  //   };
  // });

  // store.on('fetchall', async (state, value) => {
  //   if (state.fetched === true) {
  //     return;
  //   }
  //   const deepdiveCount = 20;
  //   const deepdives = await fetchDeepDives(deepdiveCount);
  //   return {
  //     deepdives: 'test',
  //     fetched: true
  //   };
  // });

  // store.on('@init', () => ({
  //   deepdive: JSON.parse(readCached('deepdive_mock')) || {},
  //   relationship: JSON.parse(readCached('relationship_mock')) || {}
  // }));
  store.on('deepdives/update', (state, value) => ({
    deepdives: value
  }));
  // store.on('relationship/update', (state, value) => ({
  //   relationship: value
  // }));
  // store.on('@changed', ({ deepdive, relationship }) => {
  //   try {
  //     localStorage.setItem('relationship_mock', JSON.stringify(relationship));
  //     localStorage.setItem('deepdive_mock', JSON.stringify(deepdive));
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });
}

// async function fetchAll() {
//   const out = [];
//   const paths = [];
//   return await fetch(`${process.env.PUBLIC_URL}/data/DDV:0.json`).then(r =>
//     r.json()
//   );

//   // return await Promise.all(
//   //   [`../data/DDV:${0}.json`].map(path => require(path))
//   // );

//   for (let x = 0; x < count; x++) {
//     paths.push(`../data/DDV:${x}.json`);
//   }
//   // return await Promise.all(paths.map(path => require(path)));
// }
