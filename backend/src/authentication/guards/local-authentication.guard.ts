import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/** NestJS Guard handling authentication with credentials */
@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}
