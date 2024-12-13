import { Request, Response } from 'express';
import AuthService from '@/service/auth';
import { appendAccessTokenCookie } from '@/utils/appendAccessTokenCookie';
import { appendRefreshTokenCookie } from '@/utils/appendRefreshTokenCookie';

type UserInput = {
    input: {
        login: string;
        password: string;
    };
};

type Context = {
    req: Request;
    res: Response;
};

export const authResolver = {
    createUser: async ({ input }: UserInput) => {
        try {
            await AuthService.signUp(input);
            return true;
        } catch {
            return false;
        }
    },

    getUser: async ({ input }: UserInput, { res }: Context) => {
        const [refreshToken, accessToken, user] = await AuthService.signIn(input);
        appendAccessTokenCookie(res, accessToken);
        appendRefreshTokenCookie(res, refreshToken);
        return user;
    },

    updateToken: async (_: any, { req, res }: Context) => {
        try {
            const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
            const [newRefreshToken, newAccessToken] = await AuthService.refreshAccessToken(refreshToken);
            appendAccessTokenCookie(res, newAccessToken);
            appendRefreshTokenCookie(res, newRefreshToken);
            return true;
        } catch {
            return false;
        }
    },

    logOut: async (_: any, { req, res }: Context) => {
        try {
            const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
            const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
            await AuthService.signOut(refreshToken, accessToken);
            res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME || '').clearCookie(
                process.env.ACCESS_TOKEN_COOKIE_NAME || ''
            );
        } finally {
            return true;
        }
    },

    checkToken: async (_: any, { req }: Context) => {
        const isActual = await AuthService.checkRefreshToken(
            req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]
        );
        return isActual;
    },
};
