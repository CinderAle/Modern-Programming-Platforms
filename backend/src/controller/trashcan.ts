import { Request, Response } from 'express';
import { IController } from './controller';
import TrashcanService from '@/service/trashcan';
import { HTTP_CODES } from '@/constants/httpCodes';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';
import { GarbageTypes } from '@/types/garbageTypes';
import { UploadedFile } from 'express-fileupload';
import trashcan from '@/service/trashcan';

class TrashcanController implements IController {
    async create(req: Request, res: Response) {
        try {
            const image = req.files && req.files.image ? (req.files.image as UploadedFile) : null;
            const result = await TrashcanService.create(req.body, image);
            res.redirect('../api/trashcan');
            //return res.json(result);
        } catch (e: any) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json(e.message);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TrashcanService.getOne(id);
            res.render('pages/trashcan', { trashcan: result });
            //return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await TrashcanService.update(req.body);
            //return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TrashcanService.delete(id);
            res.redirect('../trashcan');
            //return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
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
            res.render('pages/index', { result });
            //return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }
}

export default new TrashcanController();
