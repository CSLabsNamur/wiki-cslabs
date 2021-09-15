import { IsEmail } from 'class-validator';

/** Data Transfer Object handling the data that is need for asking a password reset. */
export class AskPasswordResetDto {
  /** Email of the user that is concerned by the password reset. */
  @IsEmail()
  email: string;
}
