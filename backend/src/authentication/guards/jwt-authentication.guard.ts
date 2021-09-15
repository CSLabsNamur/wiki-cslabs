import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/** NestJS Guard handling JWT access token */
@Injectable()
export class JwtAuthenticationGuard extends AuthGuard('jwt') {}
