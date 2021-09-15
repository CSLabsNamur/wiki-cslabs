import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/** Data Transfer Object handling the data that is needed when an user effectively send a new password. */
export class PasswordResetDto {
  /** JWT token validating the password change */
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;

  /** New password replacing the old one */
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  newPassword: string;
}
