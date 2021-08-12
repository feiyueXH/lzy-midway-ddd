import { ExceptionCodeEnum } from '@lzy-plugin/common';
import { CommonException } from './common-exception';

export class ValidateException extends CommonException {
  msgArray: string[];
  errors: any[];
  constructor(errors: any[], status = 500) {
    super(ExceptionCodeEnum.VALIDATE_FAIL, '', status);
    this.errors = errors;
    this.msgArray = this.deepErrors(this.errors);
  }

  private deepErrors(errors: any[]): string[] {
    let msgArray: string[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        msgArray = msgArray.concat(Object.values(error.constraints));
      }

      if (error.children) {
        msgArray = msgArray.concat(this.deepErrors(error.children));
      }
    });
    return msgArray;
  }
}
