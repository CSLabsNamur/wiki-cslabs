import { User } from "../../users/domain/user";

export interface TokenDto {
    value: string;
    expiresIn: number;
    profile: User;
}
