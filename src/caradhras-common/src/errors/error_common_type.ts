export enum firmwareErrorCode {
  GENERICAL_ERROR = 10000,

  UNVALID_ARGUMENT_ERROR = 10001
} 

export class FirmwareError extends Error {
  constructor (code: firmwareErrorCode, message: string) {
    super(`${code} - ${message}`);
  }

}