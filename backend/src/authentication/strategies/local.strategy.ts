// noinspection JSUnusedGlobalSymbols

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../../users/entities/user.entity';

/** Class handling the business logic of the authentication based on credentials
 * @extends PassportStrategy
 * Use strategy from passport-local
 * @see Strategy
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /** Configure the strategy */
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Return an user from a JWT payload containing its ID
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @return {User | null} - The user if the token was valid, otherwise null
   */
  async validate(email: string, password: string): Promise<User> {
    return this.authenticationService.getUserFromCredentials(email, password);
  }
}
