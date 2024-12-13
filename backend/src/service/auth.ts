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
import { InvalidTokenError } from '@/error/invalidTokenError';

class AuthService {
    async signUp(user: Readonly<UserRequest>): Promise<void> {
        const currentUser = await UserDAO.findOne({
            login: { $eq: user.login },
        });

        if (currentUser) {
            throw new AuthorizationError();
        }

        await UserDAO.create({
            ...user,
            role: UserRoles.USER,
        });
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

        try {
            await jwt.verify(accessToken, process.env.TOKEN_SECRET as string);
            if (dbAccessToken?.active) {
                return accessToken;
            }
            throw new AuthorizationError();
        } catch {
            if (dbAccessToken) {
                await AccessTokenDAO.findOneAndUpdate({ token: { $eq: accessToken } }, { active: false });
            }
            throw new AuthorizationError();
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<[string, string]> {
        const dbRefreshToken = await RefreshTokenDAO.findOne({ token: { $eq: refreshToken } });

        try {
            const user: UserResponse = (await jwt.verify(
                refreshToken,
                process.env.TOKEN_SECRET as string
            )) as UserResponse;
            if (dbRefreshToken?.active) {
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
            throw new InvalidTokenError();
        } catch {
            throw new InvalidTokenError();
        }
    }

    async getUserRole(accessToken: string): Promise<UserRoles> {
        await this.validateAccessToken(accessToken);
        const user: UserResponse = jwt.decode(accessToken) as UserResponse;
        return user.role;
    }

    async signOut(refreshToken: string, accessToken: string): Promise<void> {
        await RefreshTokenDAO.findOneAndUpdate({ token: { $eq: refreshToken } }, { active: false });
        await AccessTokenDAO.findOneAndUpdate({ token: { $eq: accessToken } }, { active: false });
    }

    async checkRefreshToken(refreshToken: string | undefined): Promise<boolean> {
        if (!refreshToken) {
            return false;
        }
        const dbRefreshToken = await RefreshTokenDAO.findOne({ token: { $eq: refreshToken } });
        return Boolean(dbRefreshToken?.active);
    }
}

export default new AuthService();
