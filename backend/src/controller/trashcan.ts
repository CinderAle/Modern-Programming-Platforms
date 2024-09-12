import { Request, Response } from 'express';
import { IController } from './controller';
import TrashcanService from '@/service/trashcan';
import { HTTP_CODES } from '@/constants/httpCodes';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';
import { TrashcanDAO } from '@/dao/trashcan';

class TrashcanController implements IController {
    async create(req: Request, res: Response) {
        try {
            const result = await TrashcanService.create(req.body);
            return res.json(result);
        } catch (e: any) {
            return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json(e.message);
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TrashcanService.getOne(id);
            return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const result = await TrashcanService.update(req.body);
            return res.json(result);
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
            return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }

    // For testing purposes
    async getAll(req: Request, res: Response) {
        try {
            const result = await TrashcanDAO.find();
            return res.json(result);
        } catch (e: any) {
            return res
                .status(e instanceof TrashcanNotFoundError ? HTTP_CODES.BAD_REQUEST : HTTP_CODES.INTERNAL_SERVER_ERROR)
                .json(e.message);
        }
    }
}

export default new TrashcanController();
