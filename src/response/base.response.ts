import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export default class BaseResponse {
  @ApiProperty({ example: HttpStatus.OK })
  status?: number;

  @ApiProperty({ example: 'success' })
  message?: string;
  data?: any;

  constructor({ status = HttpStatus.OK, message = 'success', data }: BaseResponse) {
    this.status = status;
    this.message = message;
    data && (this.data = data);
  }
}
