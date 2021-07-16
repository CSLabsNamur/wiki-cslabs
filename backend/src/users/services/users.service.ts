import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../domain/user";
import { Connection, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async find(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string, hasPassword = false): Promise<User> {

    if (hasPassword) {
      return await this.connection.getRepository(User)
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({email})
        .getOne();
    }

    return await this.usersRepository.findOne({ email: email });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

}
