import { IsObjectId } from '../../decorator/vaidator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePostParamsDto {
  @ApiProperty({
    description: 'Post ID',
    example: '63d8b142aff35fe4d198d4c7',
  })
  @IsObjectId()
  id: string;
}
