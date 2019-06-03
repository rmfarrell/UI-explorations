import { COUNTRIES } from './constants';
import { memoize } from 'lodash';
import i18Snippets from '../i18n';
import 'unfetch/polyfill';
import to from 'await-to-js';

export const easing = {
  linear: function(t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function(t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function(t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function(t) {
    return --t * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function(t) {
    return 1 - --t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function(t) {
    return 1 + --t * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

export async function wait(t = 1000) {
  return await new Promise(r => setTimeout(r, t));
}

export async function getHead(url) {
  let contentLength, contentType;
  const [error, res] = await to(
    fetch(url, {
      method: 'HEAD'
    })
  );
  if (error || !res.ok) {
    return {
      error: error || new Error(res.statusText),
      contentLength,
      contentType
    };
  }

  return {
    error,
    contentLength,
    contentType
  };
}

export const maxCount = memoize((counts = {}) => {
  return Object.values(counts).reduce((item, acc) => (item > acc ? item : acc));
});

export function i18n(...addressParts) {
  // TODO get language here
  return _i18n('en')(...addressParts);
}

function _i18n(lang) {
  return (...args) => {
    try {
      const loc = args.reduce((acc, part) => acc[part], i18Snippets);
      return loc[lang];
    } catch (e) {
      console.warn(
        `Could not find path ${args.reduce(
          (acc, item) => `${acc}.${item}`,
          '[root]'
        )}.${lang} in /i18n.js`
      );
      return '';
    }
  };
}

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

export function animate(duration = 1000, easeFn, fn, pause = 0) {
  if (!performance || !requestAnimationFrame) {
    throw new Error(
      'animate requires window.performance and window.requestAnimationFrame'
    );
  }
  let start;
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

  setTimeout(() => {
    start = performance.now();
    tick(start);
  }, pause);
}
