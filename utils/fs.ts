export const copy = (from: string, to: string): void => {
  try {
    Deno.copyFileSync(from, to);
  } catch (err) {
    console.log(`???err`,err);
  }
};

export const mkDir = (path: string): void => {
  try {
    Deno.statSync(path);
  } catch (err) {
    Deno.mkdirSync(path);
  }
};
