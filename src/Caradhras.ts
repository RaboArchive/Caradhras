import { run } from 'f-promise';

import { FirmwareManagerService } from './caradhras-firmware-manager';

const main = (): Promise<any> => {
  return run(() => {
    return new FirmwareManagerService().startApp();
  });
};

main().catch((e) => {
  console.log('Crash with error', e);
});
