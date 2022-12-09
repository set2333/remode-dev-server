export default (path: string) => {
  const dir = [];

  for(const { name } of Deno.readDirSync(path)) {
    dir.push(name);
  }

  return dir;
};
