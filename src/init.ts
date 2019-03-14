import { run } from 'f-promise';

const init = (): Promise<any> => {
  return run(() => {
    console.log('INIT');
  });
};

init().catch((e) => {
  console.log('Crash with error', e);
});