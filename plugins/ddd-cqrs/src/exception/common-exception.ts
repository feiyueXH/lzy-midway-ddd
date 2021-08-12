import { ExceptionCodeEnum, IExceptionCode } from '@lzy-plugin/common';

export class CommonException extends Error {
  status: number;
  msg: string;
  code: string;
  label: string;
  constructor(exceptionCode: IExceptionCode, msg: string, status = 500) {
    super(msg);
    let _exceptionCode = null;
    // for (const key in ExceptionCodeEnum) {
    //   const item = ExceptionCodeEnum[key];
    //   if (item.code === exceptionCode.code) {
    //     _exceptionCode = exceptionCode;
    //     break;
    //   }
    // }
    _exceptionCode = exceptionCode
      ? exceptionCode
      : ExceptionCodeEnum.UNKNOWN_ERR;
    this.status = status;
    this.msg = msg ? msg : _exceptionCode.label;
    this.code = _exceptionCode.code;
    this.label = _exceptionCode.label;
  }
}
