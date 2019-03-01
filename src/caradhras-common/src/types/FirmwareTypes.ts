export interface IFirmwareVersion {
  version?: string;
}

export interface IFirmwareHardware {
  hardware?:string;
}

export interface IFirmware {
  version: string;
  numericalVersion: number;
  hardware: string;
  buffer: Buffer;
}