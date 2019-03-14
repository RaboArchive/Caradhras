export interface IFirmwareVersion {
  version?: string;
}

export interface IFirmwareHardware {
  hardware?: string;
}

export interface IFirmware {
  version: string;
  numericalVersion: number;
  hardware: string;
  buffer: Buffer;
}

export interface IFirmwareDbSchema extends IFirmware {
  $infos: {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  };
}