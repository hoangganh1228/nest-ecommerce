import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpAuthDTO } from './dto/sign-up-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInAuthDTO } from './dto/sign-in-auth.dto';
import * as bcrypt from 'bcrypt';
import { generateToken } from 'src/utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpAuthDto: SignUpAuthDTO) {
    const user = await this.userService.create(signUpAuthDto);

    return generateToken(user, this.jwtService);
  }

  async signIn(signInAuthDTO: SignInAuthDTO) {
    const user = await this.userService.findByEmail(signInAuthDTO.email);

    if (!user) throw new BadRequestException('Bad Credentials');

    const isMatch = await bcrypt.compare(signInAuthDTO.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Bad Credentials');
    }

    return generateToken(user, this.jwtService);
  }
}
