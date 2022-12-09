import { slides } from '../config.ts';
import getMediaPath from './getMediaPath.ts';
import readDir from './readDir.ts';

const HTML_DIR_MASK = /^\d+\_\d+\_\d+\_\d+\_\d+\_\d+\_.+$/;
const DIR_MASK = /^[0123456789abcdef]+-[0123456789abcdef]+$/;

export default () => slides.map((slide) => {
  const mediaPath = getMediaPath();
  const mediaDir = readDir(`${mediaPath}/${slide}`);
  const [filesDirectory] = mediaDir.filter(file => DIR_MASK.test(file));
  const [indexHtml] = mediaDir.filter(file => HTML_DIR_MASK.test(file));

  return {
    slide,
    trackedFilesDir: `${mediaPath}/${slide}/${filesDirectory}/${indexHtml}`,
  };
});
