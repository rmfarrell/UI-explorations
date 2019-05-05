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

async function fetchJson(prefix = '', count = 0) {
  const out = {};
  const paths = [];
  for (let x = 0; x < count; x++) {
    let id = `${prefix}:${x}`;
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
