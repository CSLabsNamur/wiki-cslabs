import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Data Transfer Object handling the data that is needed for registering a new user. */
export class RegisterDto {
  /** The email of the new user. */
  @IsEmail()
  email: string;

  /** The username of the new user */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  /** The password of the new user. It is later hashed. */
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
