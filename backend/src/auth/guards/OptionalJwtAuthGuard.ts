import {AuthGuard} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err, user, info, context) {
        return user;
    }

}
