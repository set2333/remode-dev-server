export type Application = {
  name: string,
  port: number,
  hash: number,
};

export enum WorkTypes {
  IREP = 'irep',
  WINREP = 'winrep',
};
