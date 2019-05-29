import to from 'await-to-js';
import { COUNTRIES } from './constants';
import 'unfetch/polyfill';

const CREDS = {
    u: 'govlab',
    p: 'LudoaHolAdHa'
  },
  ROOT = 'https://periscope.finity.app/api',
  // Using a proxy for now until CORS is implemented
  PROXY = 'http://localhost:8080/';

// -- List pages

export async function listIssues() {
  return await list('issue');
}
export async function listCountries() {
  return await list('country');
}
export async function listDeepDives() {
  return await list('deepdive');
}

export async function list(...types) {
  return await _get(`/story-groups/?types=${types.join(',')}`);
}

async function _get(path) {
  let response, error, json;
  const Authorization = `Basic ${Buffer.from(CREDS.u + ':' + CREDS.p).toString(
    'base64'
  )}`;

  [error, response] = await to(
    fetch(`${PROXY}${ROOT}${path}`, {
      // credentials: 'include',
      // mode: 'cors',
      headers: {
        origin: 'http://localhost:3000',
        Authorization
      }
    })
  );

  if (error || !response.ok) {
    return [null, error || new Error(`Returned response: ${response}`)];
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
