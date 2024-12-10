import { Request, Response } from 'express';
import { IController } from './controller';
import { AuthorizationError } from '@/error/authorizationError';
import { HTTP_CODES } from '@/constants/httpCodes';
import AuthService from '@/service/auth';
import { UserRequest } from '@/dto/user/request';
import { InvalidTokenError } from '@/error/invalidTokenError';
import { appendAccessTokenCookie } from '@/utils/appendAccessTokenCookie';
import { appendRefreshTokenCookie } from '@/utils/appendRefreshTokenCookie';

class AuthController implements IController {
    async create(req: Request, res: Response) {
        try {
            const userLogs: UserRequest = req.body;
            await AuthService.signUp(userLogs);
            return res.status(HTTP_CODES.SUCCESS).json();
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.UNAUTHORIZED : HTTP_CODES.BAD_REQUEST)
                .json((e as Error).message);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const userLogs: UserRequest = req.body;
            const [refreshToken, accessToken, user] = await AuthService.signIn(userLogs);
            appendAccessTokenCookie(res, accessToken);
            appendRefreshTokenCookie(res, refreshToken);
            return res.status(HTTP_CODES.SUCCESS).json(user);
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.UNAUTHORIZED : HTTP_CODES.BAD_REQUEST)
                .json((e as Error).message);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
            const [newRefreshToken, newAccessToken] = await AuthService.refreshAccessToken(refreshToken);
            appendAccessTokenCookie(res, newAccessToken);
            appendRefreshTokenCookie(res, newRefreshToken);
            return res.status(HTTP_CODES.SUCCESS);
        } catch (e: unknown) {
            return res
                .status(e instanceof InvalidTokenError ? HTTP_CODES.INVALID_TOKEN : HTTP_CODES.BAD_REQUEST)
                .json((e as Error).message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
            const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
            await AuthService.signOut(refreshToken, accessToken);
            return res
                .status(HTTP_CODES.SUCCESS)
                .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, null, { maxAge: 0 })
                .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string, null, { maxAge: 0 })
                .json();
        } catch (e: unknown) {
            return res.status(HTTP_CODES.BAD_REQUEST).json((e as Error).message);
        }
    }
}

export default new AuthController();
