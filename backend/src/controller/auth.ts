import { Request, Response } from 'express';
import { IController } from './controller';
import { AuthorizationError } from '@/error/authorizationError';
import { HTTP_CODES } from '@/constants/httpCodes';
import AuthService from '@/service/auth';
import { UserRequest } from '@/dto/user/request';

class AuthController implements IController {
    async create(req: Request, res: Response) {
        try {
            const userLogs: UserRequest = req.body;
            await AuthService.signUp(userLogs);
            return res.status(HTTP_CODES.SUCCESS);
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json((e as Error).message);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const userLogs: UserRequest = req.body;
            const [refreshToken, accessToken, user] = await AuthService.signIn(userLogs);
            return res
                .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, { httpOnly: true })
                .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string, accessToken, { httpOnly: true })
                .status(HTTP_CODES.SUCCESS)
                .json(user);
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json((e as Error).message);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
            const [newRefreshToken, newAccessToken] = await AuthService.refreshAccessToken(refreshToken);
            return res
                .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, newRefreshToken, { httpOnly: true })
                .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string, newAccessToken, { httpOnly: true })
                .status(HTTP_CODES.SUCCESS);
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json((e as Error).message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json((e as Error).message);
        }
    }
}
