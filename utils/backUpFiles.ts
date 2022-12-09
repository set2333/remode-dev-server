import logger from './logger.ts';
import { copy } from './fs.ts';

export default (files) => {
  files.forEach(({ trackedFilesDir }) => {
    copy(`${trackedFilesDir}/index.html`, `${trackedFilesDir}/index.html.backup`);
  });
  logger('Backup:', files.map(({ slide }) => slide));
};
