import to from 'await-to-js';
import { COUNTRIES } from './constants';
import 'unfetch/polyfill';

const CREDS = {
    u: 'govlab',
    p: 'LudoaHolAdHa'
  },
  ROOT = 'https://periscope.finity.app/api';

// -- List pages

export async function listIssues() {
  // https://periscope.finity.app/api/story-groups/?types=issue
  return await _get('/story-groups/?types=issue');
}

export async function listCountries() {
  // https://periscope.finity.app/api/story-groups/?types=country
}
export async function listDeepDives() {
  // https://periscope.finity.app/api/story-groups/?types=deepdive
}

async function _get(path) {
  let response, error, json;
  const Authorization = `Basic ${Buffer.from(CREDS.u + ':' + CREDS.p).toString(
    'base64'
  )}`;

  [response, error] = await to(
    fetch(`${ROOT}${path}`, {
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization
      }
    })
  );

  console.log(Authorization);
  console.log(response);

  if (error) {
    return [null, error];
  }

  console.log(response);

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
