import { Controller, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserDto } from 'src/dto/userDto';


@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private Auth: AuthService) {
    this.Auth.init();
  }

  @Get('login')
  login(@Body() user: LoginDto) {
    return this.Auth.login(user.email, user.password);
  }

  @Get('register')
  register(@Body() user: UserDto) {
    return this.Auth.register(user.name, user.email ,user.password);
  }
}
