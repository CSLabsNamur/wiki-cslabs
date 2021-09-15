import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './services/authentication.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { EmailModule } from '../email/email.module';

/**
 * NestJs module handling authentication tasks.
 * Authentication use JWT and includes:
 * - Registering a new user
 * - Log-in and log-out as an user
 * - Access and refresh tokens handling
 * - Password recovery
 *
 * @author ppoitier
 * */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    EmailModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
