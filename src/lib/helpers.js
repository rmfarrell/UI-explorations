import { COUNTRIES } from './constants';

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
    // console.log(articles[id]);
    // const out = Object.assign(articles[id], { id });
    // console.log(out);
    return Object.assign(articles[id], { id });
  });
}

export function articleCountByCountry(acc, item) {
  const { meta = {} } = item,
    { countries = [] } = meta;
  countries.forEach(country => {
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
