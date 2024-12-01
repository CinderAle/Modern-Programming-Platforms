import { UserRequest } from '@/dto/user/request';
import { UserDAO } from '@/dao/user';
import { RefreshTokenDAO } from '@/dao/refreshToken';
import { AccessTokenDAO } from '@/dao/accessToken';
import { generateRefreshToken } from '@/utils/generateRefreshToken';
import { generateAccesToken } from '@/utils/generateAccessToken';
import jwt from 'jsonwebtoken';
import { AuthorizationError } from '@/error/authorizationError';
import { UserResponse } from '@/dto/user/response';
import { UserRoles } from '@/types/userRoles';

class AuthService {
    async signUp(user: Readonly<UserRequest>): Promise<void> {
        const currentUser = await UserDAO.find({
            login: { $eq: user.login },
        });

        if (currentUser.length) {
            throw new AuthorizationError();
        }

        await UserDAO.create(user);
    }

    async signIn({ login, password }: UserRequest): Promise<Readonly<[string, string, UserResponse]>> {
        const currentUser = await UserDAO.findOne({
            login,
            password,
        });

        if (!currentUser) {
            throw new AuthorizationError();
        }

        const userResponse: UserResponse = { login: currentUser.login, role: currentUser.role };

        const refreshToken = await RefreshTokenDAO.create({ active: true, token: generateRefreshToken(userResponse) });
        const accessToken = await AccessTokenDAO.create({ active: true, token: generateAccesToken(userResponse) });

        return [refreshToken.token, accessToken.token, userResponse];
    }

    async validateAccessToken(accessToken: string): Promise<string> {
        const dbAccessToken = await AccessTokenDAO.findOne({ token: { $eq: accessToken } });

        if (jwt.verify(accessToken, process.env.TOKEN_SECRET as string)) {
            if (dbAccessToken?.active) {
                return accessToken;
            }
        } else if (dbAccessToken) {
            await AccessTokenDAO.findOneAndUpdate({ token: { $eq: accessToken } }, { active: false });
        }

        throw new AuthorizationError();
    }

    async refreshAccessToken(refreshToken: string): Promise<[string, string]> {
        const dbRefreshToken = await RefreshTokenDAO.findOne({ token: { $eq: refreshToken } });

        if (jwt.verify(refreshToken, process.env.TOKEN_SECRET as string)) {
            if (dbRefreshToken?.active) {
                const user: UserResponse = jwt.decode(refreshToken) as UserResponse;
                await RefreshTokenDAO.findOneAndUpdate({ token: { $eq: refreshToken } }, { active: false });

                const { token: newRefreshToken } = await RefreshTokenDAO.create({
                    active: true,
                    token: generateRefreshToken(user),
                });
                const { token: newAccessToken } = await AccessTokenDAO.create({
                    active: true,
                    token: generateAccesToken(user),
                });

                return [newRefreshToken, newAccessToken];
            }
        }
        throw new AuthorizationError();
    }

    async getUserRole(accessToken: string): Promise<UserRoles> {
        await this.validateAccessToken(accessToken);
        const user: UserResponse = jwt.decode(accessToken) as UserResponse;
        return user.role;
    }
}

export default new AuthService();