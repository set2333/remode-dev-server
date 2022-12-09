import { crc32 } from 'https://deno.land/x/crc32hash@v1.0.0/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { SERVER_ADDRESS } = config();

const STATIC_PORTS = 3000;

const ports = [3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009];

const staticFiles = ['os.1.0.1.js', 'slimcore.1.0.1.js'];

const getTrackedFiles = async () => await Promise.all(ports.map(
  port => fetch(`${SERVER_ADDRESS}:${port}/bundle.js`)
    .then(response => response.text())
    .then(file => ({
      file,
      name: file.match(/module.exports = JSON.parse\(\'\{\"name\":\"(.+?)\"/)[1],
      port,
      hash: <number>crc32(file),
    }))
    .catch(() => null)
));

const getStaticFiles = async () => await Promise.all(staticFiles.map(
  staticFile => fetch(`${SERVER_ADDRESS}:${STATIC_PORTS}/static/${staticFile}`)
    .then(response => response.text())
    .then(file => ({
      file,
      name: staticFile,
      port: STATIC_PORTS,
      hash: <number>crc32(file),
    }))
    .catch(() => null)
));

export default async () => {
  const applications = await getTrackedFiles();
  const staticFiles = await getStaticFiles();

  return [...applications, ...staticFiles].reduce((acc, app) => ({
    ...acc,
    ...(app ? { [app.name]: { ...app } } : {}),
  }), {});
}
