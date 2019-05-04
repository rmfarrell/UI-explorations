export async function fetchDeepDives(count = 0) {
  const paths = [];
  const out = {};

  for (let x = 0; x < count; x++) {
    let id = `DDV:${x}`;
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
