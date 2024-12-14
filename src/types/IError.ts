export class IError extends Error {
  public messageClient: string;
  public errorCode: number;
  public statusHttp: number;

  constructor(message: string, errorCode: number, statusHttp: number = 0, messageClient?: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IError);
    }

    this.name = this.constructor.name;
    this.messageClient = !messageClient ? message : messageClient;
    this.errorCode = errorCode;
    this.statusHttp = statusHttp;
  }
}
