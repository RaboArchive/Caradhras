import { expect } from 'chai';

import { Firmware } from '../lib/Firmware';

let firmware: Firmware;
const buffer = Buffer.alloc(4, 'test');


describe('Firmware', () => {
  before(() => {
    firmware = new Firmware('1.0.0', 'A', buffer);
  })
  it('> getVersion should work', () => {
    expect(firmware.getVersion).to.be.equal('1.0.0');
  })
  it('> getNumericalVersion should work', () => {
    expect(firmware.getNumericalVersion).to.be.equal(10000);
  })
  it('> getHardware should work', () => {
    expect(firmware.getHardware).to.be.equal('A');
  })
  it('> getFirmware should work', () => {
    expect(firmware.getFirmware).to.be.equal(buffer);
  })
});