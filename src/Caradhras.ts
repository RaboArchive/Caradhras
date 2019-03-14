import { run } from 'f-promise';

const main = (): Promise<any> => {
  return run(() => {
    console.log('CARADHRAS');
  });
};

main().catch((e) => {
  console.log('Crash with error', e);
});
