enum CommonDbErrorCode {
  DB_NOT_FOUND = 1000,
  DB_INSERT_FAILED = 1001,

} 

export class CommonDbError extends Error {
  constructor (code: CommonDbErrorCode, message?: string) {
    super(`(${code}) - ${message}`);
  }

  public static get CODES () {
    return CommonDbErrorCode;
  }
}