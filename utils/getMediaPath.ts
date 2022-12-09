import { config } from 'https://deno.land/x/dotenv/mod.ts';
import readDir from './readDir.ts';

const { SIMULATOR_NAME } = config();

// const PATH = `/Users/${'os.userInfo().username'}/Library/Developer/CoreSimulator/Devices/`;
const PATH = `/Users/${'set'}/Library/Developer/CoreSimulator/Devices/`;

const checkOnlyId = id => !!id
  .match(/^[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+$/);

const decoder = new TextDecoder();

export default () => {
  const deviceId = readDir(PATH)
    .filter(deviceId => !!deviceId.match(
      /^[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+-[0123456789ABCDEF]+$/),
    )
    .find(deviceId => {
      const fileData = Deno.readFileSync(`${PATH}${deviceId}/device.plist`);
      const decodedData = decoder.decode(fileData);

      return !!decodedData.match(new RegExp(`\<string\>${SIMULATOR_NAME}\<\/string\>`))
    });

  if (!deviceId) {
    return null;
  }

  const applicationId = readDir(`${PATH}${deviceId}/data/Containers/Data/Application`)
    .filter(checkOnlyId)
    .find(
      appId => readDir(`${PATH}${deviceId}/data/Containers/Data/Application/${appId}/Library/`)
        .find(name => name === 'Veeva')
    );

  if (!applicationId) {
    return null;
  }

  const mediaPaths = readDir(`${PATH}${deviceId}/data/Containers/Data/Application/${applicationId}/Library/Veeva`)
    .filter(path => path.match(/.+\=\=/))

  if (!mediaPaths) {
    return null;
  }

  const documents = readDir(`${PATH}${deviceId}/data/Containers/Data/Application/${applicationId}/Documents`);

  if (!documents) {
    return null;
  }

  const mediaPath = mediaPaths.find(path => documents.includes(path));

  return `${PATH}${deviceId}/data/Containers/Data/Application/${applicationId}/Documents/${mediaPath}/Media`;
}
