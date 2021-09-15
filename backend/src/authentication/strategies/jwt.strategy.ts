// noinspection JSUnusedGlobalSymbols

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { Request } from 'express';
import { TokenPayload } from '../token-payload.interface';
import { User } from '../../users/entities/user.entity';

/** Class handling the business logic of the authentication based on JWT access token
 * @extends PassportStrategy
 * Use strategy from passport-jwt
 * @see Strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /** Configure the strategy */
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * Return an user from a JWT payload containing its ID
   * @param payload - JWT payload containing the user ID
   * @return {User} - The user associated with the ID
   */
  async validate(payload: TokenPayload): Promise<User> {
    return this.userService.getById(payload.userId);
  }
}
