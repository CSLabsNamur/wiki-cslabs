// noinspection JSUnusedGlobalSymbols

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../token-payload.interface';

/** Class handling the business logic of the authentication based on JWT refresh token
 * @extends PassportStrategy
 * Use strategy from passport-jwt
 * @see Strategy
 */
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  /** Configure the strategy */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Return an user from a JWT payload containing its ID
   * @param {Request} request - The request containing the JWT payload
   * @param payload - JWT payload containing the user ID
   * @return {User | null} - The user if the token was valid, otherwise null
   */
  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.usersService.getUserIfRefreshTokenMatches(
      payload.userId,
      refreshToken,
    );
  }
}
