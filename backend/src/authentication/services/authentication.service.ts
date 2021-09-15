import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../../database/postgres-error-code';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenPayload } from '../token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { EmailService } from '../../email/services/email.service';

/**
 * Class handling the business logic of the authentication.
 * Authentication includes:
 * - Registering a new user
 * - Log-in and log-out as an user
 * - Access and refresh tokens handling
 * - Password recovery
 */
@Injectable()
export class AuthenticationService {
  /** Configure the instance and reference other services */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /** Register a new user
   * @param {RegisterDto} registrationData - Data of the new user
   * @return {User} - The new user
   * @throws {HttpException} if the data of the new user are invalid
   *  Indeed, the email must be unique and the data must respect the constraints of the user entity
   */
  public async register(registrationData: RegisterDto): Promise<User> {
    const hashedPassword = await AuthenticationService.hashPassword(
      registrationData.password,
    );

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Something went wrong.', HttpStatus.BAD_REQUEST);
    }
  }

  /** Return an user from its credentials
   * @param {string} email - The email of the user
   * @param {string} plainTextPassword - The password of the user
   * @return {User} The user corresponding to the credentials
   * @throws {HttpException} The credentials must be valid
   */
  public async getUserFromCredentials(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.getByEmail(email);
      await AuthenticationService.verifyPassword(
        plainTextPassword,
        user.password,
      );
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /** Return the value of the "Access" cookie for JWT authentication
   * @param {string} userId - The user ID contained in the JWT payload.
   * @return {string} The value of the "Access" cookie
   */
  public getCookieWithJwtAccessToken(userId: string): string {
    const payload: TokenPayload = { userId };
    const maxAge = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: maxAge,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
  }

  /** Return the value of the "Refresh" cookie for JWT authentication
   * @param {string} userId - The user ID contained in the JWT payload.
   * @return {string} The value of the "Refresh" cookie
   */
  public getCookieWithJwtRefreshToken(userId: string): {
    cookie: string;
    token: string;
  } {
    const payload: TokenPayload = { userId };
    const maxAge = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: maxAge,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
    return {
      cookie,
      token,
    };
  }

  /** Return the value of the cookies for telling the client to clean "Access" and "Refresh" cookies.
   * @return {string} The value of the cookies
   */
  public getCookieForLogout(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  /** Send an email containing the link for resetting the password of the user associated to a specific email address.
   * The link is usable for a limited amount of time
   * If the email is not associated with any user, then this function does nothing.
   * @param email - The email that receives the reset password link
   */
  public async sendPasswordResetMail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user) {
      const token = await this.getPasswordResetToken(user.id);
      const domain = this.configService.get('FRONTEND_DOMAIN');
      await this.emailService.sendMail({
        to: email,
        subject: 'NestJS Template - Password Reset',
        text: `
        A new password has been requested from ${domain} website.
        If you are indeed the originator of this request, follow this link to perform the password reset:
        ${domain}/password-reset/${token}
        `,
      });
    }
  }

  /** Effectively reset the password of an user.
   * @param {string} passwordResetToken - Token that contains the needed user ID. It also validates the request
   *  The token must be signed by the server
   * @param {string} newPassword - The new password that replace the old one of the user.
   *  The new password must be a valid one.
   * @throws {HttpException} The token must be valid and not expired
   */
  public async resetPassword(passwordResetToken: string, newPassword: string) {
    try {
      this.jwtService.verify(passwordResetToken, {
        secret: this.configService.get('JWT_SIGN_SECRET'),
        maxAge: `${this.configService.get('JWT_SIGN_EXPIRATION_TIME')}s`,
      });
      const payload: any = this.jwtService.decode(passwordResetToken);
      await this.usersService.changeUserPassword(
        payload.userId,
        await AuthenticationService.hashPassword(newPassword),
      );
    } catch (error) {
      throw new HttpException(
        'Invalid password reset token.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Helpers

  /** Make a token asking a password reset
   * This token is signed by the server and can expire
   * @param {string} userId - The Id of the user that ask the token
   * @private
   */
  private async getPasswordResetToken(userId: string): Promise<string> {
    const payload = {
      userId,
      task: 'reset_password',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SIGN_SECRET'),
      expiresIn: this.configService.get<number>('JWT_SIGN_EXPIRATION_TIME'),
    });
  }

  /** Return an hashed version of a password
   * @param plainTextPassword - The initial password in plain text
   * @return {string} - The hashed password
   * @private
   */
  private static async hashPassword(plainTextPassword: string) {
    return await bcrypt.hash(plainTextPassword, 10);
  }

  /** Compare a password with a hashed one
   * @param plainTextPassword - plain text password
   * @param hashedPassword - hashed password
   * @private
   * @throws {Error} The passwords must corresponds
   */
  private static async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const matching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!matching) {
      throw new Error('Wrong password provided.');
    }
  }
}
