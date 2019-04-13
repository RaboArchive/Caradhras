export interface IFirmwareVersion {
  version: string;
}

export interface IFirmwareHardware {
  hardware: string;
}

export interface IFirmware {
  version: string;
  hardware: string;
  buffer: Buffer;
}

export interface IFirmwareDbSchema extends IFirmware {
  _infos: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
}