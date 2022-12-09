import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { WorkTypes } from '../types.ts';

const { SERVER_ADDRESS, WORK_TYPE } = config();

const makeUrl = ({ port, name }) => (
  `"${SERVER_ADDRESS}:${port}/${port === 3000 ? 'static/' + name : 'bundle.js'}", `
);

const winRep = (appConfig) => `
const apps = [
 ${appConfig.reduce((acc, { name, port }) => (`${acc}${!!port ? '"'+ name +'", ' : ''}`), '')}
].forEach(app => {
 const script = document.createElement("script");
 script.src = \`./applications/\${app}/bundle.js\`;
 script.type = "text/javascript";
 document.body.appendChild(script);
});

console.log = (args) => {
if (!document.getElementById('log-div')) {
  const newLogDiv = document.createElement('div');
  newLogDiv.setAttribute('id', 'log-div');
  newLogDiv.setAttribute('style', 'position: absolute; top: 0; left: 0;');
  document.body.appendChild(newLogDiv);
}

const logDiv = document.getElementById('log-div');
logDiv.innerText += '\\n' + args;
};
`;

const iRep = (appConfig) => `
[
${appConfig.reduce((acc, app) => (`${acc}${makeUrl(app)}`), '')}
].forEach(url => {
 const script = document.createElement("script");
 script.src = url;
 script.type = "text/javascript";
 document.body.appendChild(script);
});
`;

export default WORK_TYPE === WorkTypes.IREP ? iRep : winRep;
