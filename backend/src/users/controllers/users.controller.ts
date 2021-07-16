import { Controller, Get } from "@nestjs/common";
import { User } from "../domain/user";
import { UsersService } from "../services/users.service";

@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

}
