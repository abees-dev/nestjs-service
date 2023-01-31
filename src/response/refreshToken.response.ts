import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './index';

export class RefreshTokenResponse {
  @ApiProperty({
    example: 'token',
    description: 'access_token',
  })
  access_token: string;
}

export class RefreshTokenResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: RefreshTokenResponse,
  })
  data: RefreshTokenResponse;
}
