import { Body, Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LocalAuthGuard } from "../guards/LocalAuthGuard";
import { RegisterDto } from "../dto/register.dto";
import { TokenDto } from "../dto/token.dto";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

}
