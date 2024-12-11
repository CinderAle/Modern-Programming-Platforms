import { SOCKET_MESSAGES } from '@/constants/socketMessages';
import { TrashcanRequest } from '@/dto/trashcan/request';
import { UploadedFile } from 'express-fileupload';
import { Socket } from 'socket.io';
import TrashcanService from '@/service/trashcan';
import { AuthorizationError } from '@/error/authorizationError';
import { TrashcanFilters } from '@/types/trashcanFilters';

export const socketConnectedListener = (socket: Socket) => {
    const accessToken: string =
        socket.request.headers.cookie
            ?.split('; ')
            .find((row) => row.startsWith(process.env['ACCESS_TOKEN_COOKIE_NAME'] || ''))
            ?.split('=')[1] || '';

    socket.on(SOCKET_MESSAGES.CREATE_TRASHCAN, async (trashcan: TrashcanRequest, image: ArrayBuffer | null) => {
        try {
            const result = await TrashcanService.create(trashcan, image, accessToken);
            socket.emit(SOCKET_MESSAGES.SUCCESS, result);
        } catch (e: unknown) {
            socket.emit(
                e instanceof AuthorizationError ? SOCKET_MESSAGES.AUTH_ERROR : SOCKET_MESSAGES.ERROR,
                (e as Error).message
            );
        }
    });
    socket.on(SOCKET_MESSAGES.GET_TRASHACN, async (id: string) => {
        try {
            const result = await TrashcanService.getOne(id);
            socket.emit(SOCKET_MESSAGES.SUCCESS, result);
        } catch (e: unknown) {
            socket.emit(
                e instanceof AuthorizationError ? SOCKET_MESSAGES.AUTH_ERROR : SOCKET_MESSAGES.ERROR,
                (e as Error).message
            );
        }
    });
    socket.on(SOCKET_MESSAGES.UPDATE_TRASHCAN, async (trashcan: TrashcanRequest, image: ArrayBuffer | null) => {
        try {
            const result = await TrashcanService.update(trashcan, image, accessToken);
            socket.emit(SOCKET_MESSAGES.UPDATE_TRASHCAN, result);
        } catch (e: unknown) {
            socket.emit(
                e instanceof AuthorizationError ? SOCKET_MESSAGES.AUTH_ERROR : SOCKET_MESSAGES.ERROR,
                (e as Error).message
            );
        }
    });
    socket.on(SOCKET_MESSAGES.DELETE_TRASHCAN, async (id: string) => {
        try {
            const result = await TrashcanService.delete(id, accessToken);
            socket.emit(SOCKET_MESSAGES.UPDATE_TRASHCAN, result);
        } catch (e: unknown) {
            socket.emit(
                e instanceof AuthorizationError ? SOCKET_MESSAGES.AUTH_ERROR : SOCKET_MESSAGES.ERROR,
                (e as Error).message
            );
        }
    });
    socket.on(SOCKET_MESSAGES.GET_FILTERED_TRASHCANS, async (filter?: TrashcanFilters) => {
        try {
            const result = await TrashcanService.getByFilters(
                filter?.type,
                filter?.volume?.$gt,
                filter?.volume?.$lt,
                filter?.fill?.$gt,
                filter?.fill?.$lt
            );
            socket.emit(SOCKET_MESSAGES.SUCCESS, result);
        } catch (e: unknown) {
            socket.emit(
                e instanceof AuthorizationError ? SOCKET_MESSAGES.AUTH_ERROR : SOCKET_MESSAGES.ERROR,
                (e as Error).message
            );
        }
    });
};
