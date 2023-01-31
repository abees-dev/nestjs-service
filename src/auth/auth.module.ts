import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthProvider } from './entities/auth.entity';
import { AUTH_SERVICE } from '../contrains';
import { UserProvider } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';
import { UserService } from '../user/user.service';
import { RefreshTokenStrategy } from './refreshToken.strategy';

@Global()
@Module({
  imports: [MongooseModule.forFeature([AuthProvider, UserProvider]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    AuthService,
    GoogleStrategy,
    RefreshTokenStrategy,
    UserService,
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
