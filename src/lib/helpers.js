import { COUNTRIES } from './constants';
import { memoize } from 'lodash';

export const easing = {
  easeOut: t => Math.pow(--t, 5) + 1,
  easeOutQuart: t => {
    return 1 - --t * t * t * t;
  }
};

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

export function animate(duration = 1000, easeFn, fn) {
  if (!performance || !requestAnimationFrame) {
    throw new Error(
      'animate requires window.performance and window.requestAnimationFrame'
    );
  }
  const start = performance.now();
  const total = duration;
  let elapsed;

  function tick(now) {
    elapsed = now - start;
    const progress = getProgress();
    fn(easeFn(progress));
    if (progress < 1) requestAnimationFrame(tick);
  }

  function getProgress() {
    return Math.max(Math.min(elapsed / total, 1), 0);
  }

  tick(start);
}
