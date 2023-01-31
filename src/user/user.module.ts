import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProvider } from './entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([UserProvider])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
