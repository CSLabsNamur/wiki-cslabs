import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

/** Class handling the business logic about users
 * @see User
 */
@Injectable()
export class UsersService {
  /** Configure the instance and reference other services */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** Return an user by its email address
   * @param email - The email address of the user
   * @throws {HttpException} if the user does not exist
   */
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }

  /** Return an user by its ID
   * @param id - The ID of the user
   * @throws {HttpException} if the user does not exist
   */
  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this identifier does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }

  /** Return an user by its ID if the refresh token is valid
   * @param userId - The ID of the user
   * @param refreshToken - The associated refresh token
   * @return {user | null} The user if the refresh token is valid, otherwise null
   * @throws {HttpException} if the user ID is invalid
   */
  async getUserIfRefreshTokenMatches(
    userId: string,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    return isRefreshTokenMatching ? user : null;
  }

  /** Set a new refresh token for a specific user
   * @param userId - The ID of the user
   * @param refreshToken - The new refresh token
   */
  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { currentHashedRefreshToken });
  }

  /** Remove the refresh token of a specific user
   * @param userId - The ID of the user
   */
  async removeRefreshToken(userId: string) {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  /**
   * Create a new user from its data
   * @see CreateUserDto
   * @param userData - The data of the user
   * @return {User} The new user
   * @throws {Error} if the data is invalid
   */
  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  /** Replace an user's password by another one
   * @param userId - The ID of the user
   * @param newHashedPassword - The hashed new password
   */
  async changeUserPassword(userId: string, newHashedPassword: string) {
    await this.usersRepository.update(userId, {
      password: newHashedPassword,
    });
  }
}
