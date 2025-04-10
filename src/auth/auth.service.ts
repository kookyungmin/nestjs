import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(@Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>) {}

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret, {
      algorithm: 'HS512',
      expiresIn: '1d',
      audience: 'happykoo.net',
      issuer: 'happykoo.net'
    })
  }

  verify(jwtValue: string) {
    try {
      const payload = jwt.verify(jwtValue, this.config.jwtSecret) as (jwt.JwtPayload | string) & User;
      return payload;
    } catch(e) {
      throw new UnauthorizedException("jwt is not vaild");
    }
  }
}
