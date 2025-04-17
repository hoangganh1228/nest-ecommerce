import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDTO } from './dto/sign-up-auth.dto';
import { SignInAuthDTO } from './dto/sign-in-auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpAuthDTO: SignUpAuthDTO) {
    const accessToken = await this.authService.signUp(signUpAuthDTO);

    return {
      message: 'Sign Up successfully',
      data: accessToken,
    };
  }

  @Post('/sign-in')
  async ignIn(@Body() SignInAuthDTO: SignInAuthDTO) {
    const accessToken = await this.authService.signIn(SignInAuthDTO);
    return {
      message: 'Sign Up successfully',
      data: accessToken,
    };
  }
}
