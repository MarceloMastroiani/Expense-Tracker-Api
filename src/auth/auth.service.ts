import { Injectable } from '@nestjs/common';
import { comparePassword } from 'src/common/helpers/hash-password.utils';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    const passwordIsMatch = await comparePassword(password, user.password);

    if (user && passwordIsMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.id };
    return {
      // Create a JWT token with the user payload
      access_token: this.jwtService.sign(payload),
    };
  }
}
