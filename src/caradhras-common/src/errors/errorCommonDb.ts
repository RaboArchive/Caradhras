enum CommonDbErrorCode {
  DB_NOT_FOUND = 1000,

} 

export class CommonDbError extends Error {
  constructor (code: CommonDbErrorCode, message?: string) {
    super(`(${code}) - ${message}`);
  }

  public static get CODES () {
    return CommonDbErrorCode;
  }
}