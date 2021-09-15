import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request?.user as User;
    return user && user.isAdmin === true;
  }
}
