const checkIsHasOs = (trackedFiles) => !!trackedFiles['os.1.0.1.js'];

const checkIsHasSlimcore = (trackedFiles) => !!trackedFiles['slimcore.1.0.1.js'];

export default (path: string, trackedFiles) => {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const indexHtml = Deno.readFileSync(`${path}/index.html`);
  const data = [
    { test: '"shared/applications.js"', value : '"./applications.js"' },
    checkIsHasOs(trackedFiles)
      ? { test: '<script src="shared/shamango-os/bundle.js"></script>', value: ''}
      : null,
    checkIsHasSlimcore(trackedFiles)
      ? { test: '<!-- Slimcore(.|\\n)+Slimcore end -->', value: ''}
      : null,
  ]
    .filter(Boolean)
    .reduce((acc, { test, value }) => (
      acc.replace(new RegExp(test, 'g'), value)
    ), decoder.decode(indexHtml));

  Deno.writeFileSync(`${path}/index.html`, encoder.encode(data));
}
