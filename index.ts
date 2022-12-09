import getTrackedFiles from './utils/getTrackedFiles.ts';
import readFiles from './utils/readFiles.ts';
import backUpFiles from './utils/backUpFiles.ts';
import restoreFiles from './utils/restoreFiles.ts';
import prepareDirectory from './utils/prepareDirectory.ts';
import prepareIndexHtml from './utils/prepareIndexHtml.ts';
import logger from './utils/logger.ts';

const REQUEST_INTERVAL = 3 * 1000;

const fileHash = {};

const isOnlyRestore = Deno.args.includes('--only-restore')

const files = readFiles();
restoreFiles(files);

if(!isOnlyRestore) {
  backUpFiles(files);
}

while (!isOnlyRestore) {
  const trackedFiles = await getTrackedFiles();

  Object.values(trackedFiles).forEach(({ name, file, hash }) => {
    if (hash !== fileHash[name]) {
      prepareDirectory(files, trackedFiles);

      files.forEach(({ trackedFilesDir }) => {
        prepareIndexHtml(trackedFilesDir, trackedFiles);
        Deno.writeTextFile(`${trackedFilesDir}/applications/${name}/bundle.js`, file);
      });

      fileHash[name] = hash;
      logger(`UPDATE`, name);
    }
  });

  await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL));
}
