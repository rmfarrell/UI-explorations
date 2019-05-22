import { COUNTRIES } from './constants';
import { memoize } from 'lodash';

export const maxCount = memoize((counts = {}) => {
  return Object.values(counts).reduce((item, acc) => (item > acc ? item : acc));
});

export function formatDate(date = new Date()) {
  const dd = date.getDate(),
    mm = date.toLocaleString('en-us', { month: 'long' }),
    yy = date.getFullYear();
  return `${dd} ${mm} ${yy}`;
}

export function placeholderImage(color = '#888', ratio = 60) {
  return {
    background: `${color}`,
    height: '0',
    paddingBottom: `${ratio}%`
  };
}

export function articlesToArray(articles = {}) {
  return Object.keys(articles).map(id => {
    return Object.assign(articles[id], { id });
  });
}

export function articleCountByCountry(acc, item) {
  const { meta = {} } = item,
    { countries = [] } = meta;
  countries.forEach(country => {
    if (!country) return;
    acc[country] = acc[country] ? ++acc[country] : 1;
  });
  return acc;
}

export function isEU(countryCode = '') {
  return !!COUNTRIES[countryCode];
}

export function classNames(...names) {
  return [...names].join(' ');
}

export function toggleInArray(arr, str) {
  if (arr.includes(str)) {
    return arr.filter(item => item !== str);
  }
  return arr.concat(str);
}

export function dereferenceArticle(collection = {}, ...ids) {
  return ids.map(id => {
    const out = collection[id];
    if (!out) {
      throw new Error(`Could not find article ${id}`);
    }
    return Object.assign(out, { id });
  });
}

export function dereferenceArticles(collection = {}, ids = []) {
  return dereferenceArticle(collection, ...ids);
}
