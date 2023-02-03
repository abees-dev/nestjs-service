import { Post } from '../post/entities/post.entity';
import { MediaResponse } from './media.response';
import { UserResponse } from './user.response';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './index';

export class PostResponse {
  @ApiProperty({
    description: 'Post ID',
    example: '63d8b142aff35fe4d198d4c7',
  })
  _id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'title',
  })
  title: string;

  @ApiProperty({
    description: 'Post Caption',
    example: 'Caption',
  })
  caption: string;

  @ApiProperty({
    description: 'Post Content',
    example: 'Content',
  })
  content: string;

  @ApiProperty({
    description: 'Post Location',
    example: 'Location',
  })
  location: string;

  @ApiProperty({
    description: 'Post No of Angry',
    example: 0,
  })
  no_of_angry: number;

  @ApiProperty({
    description: 'Post No of Comments',
    example: 0,
  })
  no_of_comment: number;

  @ApiProperty({
    description: 'Post No of Dear',
    example: 0,
  })
  no_of_dear: number;

  @ApiProperty({
    description: 'Post No of Haha',
    example: 0,
  })
  no_of_haha: number;

  @ApiProperty({
    description: 'Post No of Like',
    example: 0,
  })
  no_of_like: number;

  @ApiProperty({
    description: 'Post no_of_love',
    example: 0,
  })
  no_of_love: number;

  @ApiProperty({
    description: 'Post no_of_reaction',
    example: 0,
  })
  no_of_reaction: number;

  @ApiProperty({
    description: 'Post no_of_sad',
    example: 0,
  })
  no_of_sad: number;

  @ApiProperty({
    description: 'Post no_of_shares',
    example: 0,
  })
  no_of_shares: number;

  @ApiProperty({
    description: 'Post no_of_wow',
    example: 0,
  })
  no_of_wow: number;

  @ApiProperty({
    description: 'Post status',
    example: 0,
  })
  status: number;

  @ApiProperty({
    description: 'Post view: 0: public, 1: friend, 2: private',
    example: 0,
  })
  view: number;

  @ApiProperty({
    type: [MediaResponse],
  })
  medias: MediaResponse[];

  @ApiProperty({
    type: [UserResponse],
  })
  tag: UserResponse[];

  @ApiProperty({
    type: UserResponse,
  })
  user: UserResponse;

  position: number;

  createdAt: Date;

  updatedAt: Date;

  my_reaction: number;


  constructor(post: Partial<PostResponse>) {
    this._id = post?._id ?? '';
    this.caption = post?.caption ?? '';
    this.content = post?.content ?? '';
    this.location = post?.location ?? '';
    this.title = post?.title ?? '';
    this.no_of_angry = post?.no_of_angry ?? 0;
    this.no_of_comment = post?.no_of_comment ?? 0;
    this.no_of_dear = post?.no_of_dear ?? 0;
    this.no_of_haha = post?.no_of_haha ?? 0;
    this.no_of_like = post?.no_of_like ?? 0;
    this.no_of_love = post?.no_of_love ?? 0;
    this.no_of_reaction = post?.no_of_reaction ?? 0;
    this.no_of_sad = post?.no_of_sad ?? 0;
    this.no_of_shares = post?.no_of_shares ?? 0;
    this.no_of_wow = post?.no_of_wow ?? 0;
    this.status = post?.status ?? 0;
    this.view = post?.view ?? 0;
    this.tag = UserResponse.mapList(post.tag);
    this.user = new UserResponse(post.user);
    this.medias = MediaResponse.mapList(post.medias);
    this.position = post?.createdAt ? new Date(post.createdAt).getTime() : 0;
    this.createdAt = post?.createdAt ?? null;
    this.updatedAt = post?.updatedAt ?? null;
    this.my_reaction = post?.my_reaction ?? 0;

  }

  static mapList(posts: Partial<PostResponse>[]): PostResponse[] {
    return posts.map((post) => new PostResponse(post));
  }
}

export class PostResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: [PostResponse],
  })
  data: PostResponse[];
}
