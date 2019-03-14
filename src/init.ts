import { run } from 'f-promise';

const init = (): Promise<any> => {
  return run(() => {
    console.log('INIT - Populate Dbs with data');

  });
};

init().catch((e) => {
  console.log('Crash with error', e);
});