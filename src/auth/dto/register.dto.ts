import { IsEmail, IsEnum, IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'abeesdevjs@gmail.com',
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'first_name',
    description: 'First name',
  })
  @IsNotEmpty()
  @MaxLength(20)
  first_name: string;

  @ApiProperty({
    example: 'last_name',
    description: 'Last name',
  })
  @IsNotEmpty()
  @MaxLength(20)
  last_name: string;

  @ApiProperty({
    example: 1,
    description: 'gender',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum([0, 1, 2])
  gender: number;
}
