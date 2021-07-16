import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "../../users/domain/user";
import { UsersService } from "../../users/services/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'this_is_a_temporary_secret',
        });
    }

    async validate(payload: any): Promise<User> {
        const {sub, email} = payload;
        if (!sub) {
            throw new UnauthorizedException();
        }
        const user = await this.usersService.find(sub);
        if (user.email !== email) {
            throw new UnauthorizedException();
        }
        return user;
    }

}
