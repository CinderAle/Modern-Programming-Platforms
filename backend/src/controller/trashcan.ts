import { Request, Response } from 'express';
import { IController } from './controller';
import TrashcanService from '@/service/trashcan';
import { HTTP_CODES } from '@/constants/httpCodes';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';
import { GarbageTypes } from '@/types/garbageTypes';
import { UploadedFile } from 'express-fileupload';
import { Trashcan } from '@/entity/trashcan';
import { AuthorizationError } from '@/error/authorizationError';

class TrashcanController implements IController {
    async create(req: Request, res: Response) {
        try {
            const image = req.files && req.files.image ? (req.files.image as UploadedFile) : null;
            console.log(req.cookies, req.signedCookies);
            const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
            // const result = await TrashcanService.create(req.body, image, accessToken);
            // //res.redirect('../api/trashcan');
            // return res.json(result);
        } catch (e: unknown) {
            return res
                .status(e instanceof AuthorizationError ? HTTP_CODES.UNAUTHORIZED : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json((e as Error).message);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { update } = req.query;
            const result = await TrashcanService.getOne(id);
            //res.render('pages/trashcan', { trashcan: result, update });
            return res.json(result);
        } catch (e: unknown) {
            if (e instanceof TrashcanNotFoundError) {
                res = res.status(HTTP_CODES.BAD_REQUEST);
            } else {
                res = res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
            }
            return res.json((e as Error).message);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const image = req.files && req.files.image ? (req.files.image as UploadedFile) : null;
            const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
            // const result = (await TrashcanService.update(req.body, image, accessToken)) as Trashcan;
            // //res.render(`pages/trashcan`, { trashcan: result, update: false });
            // //res.redirect('trashcan/' + result.id);
            // return res.json(result);
        } catch (e: any) {
            if (e instanceof TrashcanNotFoundError) {
                res = res.status(HTTP_CODES.BAD_REQUEST);
            } else if (e instanceof AuthorizationError) {
                res = res.status(HTTP_CODES.UNAUTHORIZED);
            } else {
                res = res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
            }
            return res.json((e as Error).message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
            const result = await TrashcanService.delete(id, accessToken);
            //res.redirect('../trashcan');
            return res.json(result);
        } catch (e: any) {
            if (e instanceof TrashcanNotFoundError) {
                res = res.status(HTTP_CODES.BAD_REQUEST);
            } else if (e instanceof AuthorizationError) {
                res = res.status(HTTP_CODES.UNAUTHORIZED);
            } else {
                res = res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
            }
            return res.json((e as Error).message);
        }
    }

    async getByFilters(req: Request, res: Response) {
        try {
            const { type, volumeMore, volumeLess, fillMore, fillLess } = req.query;
            const result = await TrashcanService.getByFilters(
                GarbageTypes[type as keyof typeof GarbageTypes],
                Number(volumeMore),
                Number(volumeLess),
                Number(fillMore),
                Number(fillLess)
            );
            //res.render('pages/index', { result, filters: { type, volumeMore, volumeLess, fillMore, fillLess } });
            return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }
}

export default new TrashcanController();
