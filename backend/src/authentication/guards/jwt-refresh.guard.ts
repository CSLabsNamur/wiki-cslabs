import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/** NestJS Guard handling JWT refresh token */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
