import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { isEmpty } from 'lodash';

export class ExceptionResponse extends HttpException {
  constructor(status: number, message: string) {
    super({ status, message }, status);
  }
}

export class CatchError extends ExceptionResponse {
  constructor(error: Error) {
    super(error['status'] || HttpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
}

export const getMessageValidationError = (error: ValidationError[]) => {
  const errors = error.map((item) => {
    if (isEmpty(item?.children)) {
      return Object.values(item?.constraints || {}).join(', ');
    } else {
      return getMessageValidationError(item?.children || []);
    }
  });
  return errors.join(',');
};
