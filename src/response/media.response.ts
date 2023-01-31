import { ApiProperty } from '@nestjs/swagger';

export class MediaResponse {
  @ApiProperty({
    description: 'Media ID',
    example: '63d8b142aff35fe4d198d4c7',
  })
  _id: string;

  @ApiProperty({
    description: 'Media URL',
    example: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  })
  url: string;

  @ApiProperty({
    description: 'Media Type',
    example: 'image',
  })
  type: string;

  @ApiProperty({
    description: 'Media Mimetype',
  })
  mimetype: string;

  constructor(media: Partial<MediaResponse>) {
    this._id = media._id;
    this.url = media.url;
    this.type = media.type;
    this.mimetype = media.mimetype;
  }

  static mapList(medias: Partial<MediaResponse[]>) {
    return medias.map((media) => new MediaResponse(media));
  }
}
