import makeApplicationsJs from '../templates/applications.ts';
import { mkDir } from './fs.ts';

const createApplicationJsFile = (path, trackedFiles) => {
  const file = makeApplicationsJs(trackedFiles)
  Deno.writeTextFile(`${path}/applications.js`, file);
}

export default (files: { trackedFilesDir }[], trackedFiles): void => {
  const apps = Object.values(trackedFiles);

  files.forEach(({ trackedFilesDir }) => {
    mkDir(`${trackedFilesDir}/applications`);
    apps.forEach(({ name }) => mkDir(`${trackedFilesDir}/applications/${name}`));
    createApplicationJsFile(trackedFilesDir, apps);
  })
};
