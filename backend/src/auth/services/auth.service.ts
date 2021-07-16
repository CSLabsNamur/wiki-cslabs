import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from "../../users/services/users.service";
import { User } from "../../users/domain/user";
import { JwtService } from "@nestjs/jwt";
import { TokenDto } from "../dto/token.dto";
import { RegisterDto } from "../dto/register.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  // TODO : Remove this data
  private readonly users: any[] = [
    {
      email: 'ppoitier@example.com',
      password: 'ppoitier_password',
    },
    {
      email: 'maria@example.com',
      password: 'maria_password',
    },
  ];

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.users.forEach(u => this.register(u));
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true);
    if (user && await bcrypt.compare(pass, user.password)) {
      const {password, ...result} = user;
      return result as User;
    }
    return null;
  }

  async login(user: User): Promise<TokenDto> {
    const payload = {email: user.email, sub: user.id};
    return {
      value: this.jwtService.sign(payload),
      expiresIn: 3600,
      profile: user,
    };
  }

  async register(registerData: RegisterDto): Promise<TokenDto> {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    try {
      const user = await this.usersService.create({
        ...registerData,
        password: hashedPassword
      });
      return this.login(user);
    } catch (error) {
      if (error.errno === 19) {
        throw new HttpException('This user already exists.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An unknown error occurred.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
