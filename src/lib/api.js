import to from 'await-to-js';
import { COUNTRIES } from './constants';
import 'unfetch/polyfill';
import queryString from 'query-string';
import { API_ROOT as ROOT, PROXY } from '../lib/constants';

const CREDS = {
  u: 'govlab',
  p: 'LudoaHolAdHa'
};

// -- List pages

export async function fetchEntries(opts = {}) {
  opts = Object.assign({ index: 'entries' }, opts);
  const { error, query } = newOptions(opts);
  if (error) {
    return [error, null];
  }
  return await _get(`/entries/?${query}`);
}

export async function fetchList(...types) {
  return await _get(`/story-groups/?types=${types.join(',')}`);
}

export async function fetchDetail(id, opts = {}) {
  if (!id) {
    return [new Error('story-groupd id is required'), null];
  }
  const { error, query } = newOptions(opts);
  if (error) {
    return [error, null];
  }
  return await _get(`/story-group/${id}?${query}`);
}

function newOptions(options = {}) {
  let error, query;

  // validate
  error = _validateDetailOptions(options);
  query = error
    ? null
    : queryString.stringify(options, { arrayFormat: 'comma' });
  return {
    error,
    query
  };

  function _validateDetailOptions() {
    let error;
    return error;
  }
}

async function _get(path) {
  let response, error, json;
  const Authorization = `Basic ${Buffer.from(CREDS.u + ':' + CREDS.p).toString(
    'base64'
  )}`;

  [error, response] = await to(
    fetch(`${PROXY}${ROOT}${path}`, {
      headers: {
        origin: 'http://localhost:3000',
        Authorization
      }
    })
  );

  if (error || !response.ok) {
    return [
      null,
      error ||
        new Error(
          `status: ${response.status}; status text: ${response.statusText}`
        )
    ];
  }

  return await to(response.json());
}

// -- Stubs

export async function fetchDeepDives(count = 0) {
  return await fetchJson('DDV', count);
}

export async function fetchRssItems(count = 0) {
  return await fetchJson('RSS', count);
}

export async function fetchSocialMedia(count = 0) {
  return await fetchJson('SOC', count);
}

export async function fetchExternalResources(count = 0) {
  return await fetchJson('EXR', count);
}

export async function fetchRelationships() {
  const paths = [],
    out = {};
  Object.keys(COUNTRIES).forEach(country => {
    let id = `REL_${country}`;
    paths.push([id, `${process.env.PUBLIC_URL}/data/${id}.json`]);
  });
  await Promise.all(
    paths.map(([id, path]) =>
      fetch(path)
        .then(r => r.json())
        .then(data => (out[id] = data))
        .catch(console.error)
    )
  );
  return out;
}

async function fetchJson(prefix = '', count = 0) {
  const out = {};
  const paths = [];
  for (let x = 0; x < count; x++) {
    let id = `${prefix}_${x}`;
    paths.push([id, `${process.env.PUBLIC_URL}/data/${id}.json`]);
  }
  await Promise.all(
    paths.map(([id, path]) => {
      return fetch(path)
        .then(r => r.json())
        .then(data => (out[id] = data));
    })
  );
  return out;
}
