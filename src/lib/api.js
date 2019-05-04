export async function fetchDeepDives(count = 0) {
  const paths = [];

  for (let x = 0; x < count; x++) {
    paths.push(`${process.env.PUBLIC_URL}/data/DDV:${x}.json`);
  }
  return await Promise.all(paths.map(path => fetch(path).then(r => r.json())));
}
