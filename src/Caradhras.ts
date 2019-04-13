import { run } from 'f-promise';
import { CaradhrasApplication } from './lib/CaradhrasApplication';

const main = (): Promise<any> => {
  return run(() => {
    return new CaradhrasApplication().startApp();
  });
};

main().catch((e) => {
  console.log('Crash with error', e);
});
