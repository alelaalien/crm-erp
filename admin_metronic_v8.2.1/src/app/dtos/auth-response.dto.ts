import { UserDTO } from "./user.dto";

export interface AuthResponseDto
{
        authToken: string;
        refreshToken: string;
        expiresIn: Date;
        user: UserDTO
}