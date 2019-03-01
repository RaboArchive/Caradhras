import * as _ from 'lodash';

import { FirmwareError, firmwareErrorCode } from '../../../caradhras-common';

export class Firmware {
  private readonly version: string;
  private readonly numericalVersion: number;
  private readonly hardware: string;
  private readonly buffer: Buffer;

  constructor (version: string, hardware: string, buffer: Buffer) {
    if (!version.match(/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/g)) {
      throw new FirmwareError(firmwareErrorCode.UNVALID_ARGUMENT_ERROR, `Unvalid version passed : ${version}`)
    }
    this.version = version;
    this.numericalVersion = this.generateNumericalVersion(this.version);
    this.hardware = hardware;
    this.buffer = buffer;
  }

  public get getVersion () : string {
    return this.version;
  }
  public get getNumericalVersion () : number {
    return this.numericalVersion;
  }
  public get getHardware () : string {
    return this.hardware;
  }
  public get getFirmware () : Buffer {
    return this.buffer;
  }

  private generateNumericalVersion (version: string) : number {
    let num = 0;
    let splitedVersion = _.split(version, '.');  
    num += Number(splitedVersion[2]);
    num += Number(splitedVersion[1]) * 100;
    num += Number(splitedVersion[0]) * 10000;
    return num;
  }
}