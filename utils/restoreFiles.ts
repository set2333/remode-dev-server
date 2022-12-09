import logger from './logger.ts';
import { copy } from './fs.ts';

export default (files) => {
  files.forEach(({ trackedFilesDir }) => {
    copy(`${trackedFilesDir}/index.html.backup`, `${trackedFilesDir}/index.html`);
  });
  logger('Restored:', files.map(({ slide }) => slide));
};
