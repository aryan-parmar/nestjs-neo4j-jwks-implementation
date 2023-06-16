import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/JwtConstant';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants,
      signOptions: { expiresIn: '60s', algorithm: 'RS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
