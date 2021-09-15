import { Request } from 'express';
import { User } from '../users/entities/user.entity';

/**
 * Interface representing an ExpressJS request including an user.
 * This interface is mainly used when the request handles the current logged user.
 * @see User
 * @extends Request
 */
export interface RequestWithUser extends Request {
  /** The user contained in the request */
  user: User;
}
