import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { User } from './User';
import { JwtService, SignOptions } from './jwt.service';

@Controller('/api/auth')
export class AuthController {


  constructor(private readonly jwtService: JwtService) {

  }

  @Post()
  authenticate(@Body() user: User) {
    console.log(user);
    if (user.username != 'admin' || user.password != 'admin') {
      throw new UnauthorizedException();
    }

    const response = new User(user.username);

    const secret = 'The secret ingredient is... nothing!';
    const header = new class implements SignOptions {
      algorithm: 'HS256';
    };
    const payload = {
      name: 'admin',
    };
    response.token = this.jwtService.sign(payload, secret, header);
    return response;
  }

}
