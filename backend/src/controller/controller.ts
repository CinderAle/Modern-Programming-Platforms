import { Request, Response } from 'express';

export interface IController {
    create(req: Request, res: Response): void;
    get(req: Request, res: Response): void;
    getAll?(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    delete(req: Request, res: Response): void;
}

export interface ISocketController {
    create(): void;
    get(): void;
    getAll?(): void;
    update(): void;
    delete(): void;
}
