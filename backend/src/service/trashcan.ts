import { IService } from './service';
import { GarbageTypes } from '@/types/garbageTypes';
import { TrashcanDAO } from '@/dao/trashcan';
import { TrashcanRequest } from '@/dto/trashcan/request';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';
import { TrashcanFilters } from '@/types/trashcanFilters';
import { UploadedFile } from 'express-fileupload';
import FileService from './file';
import { IMAGES } from '@/constants/images';
import { Trashcan } from '@/entity/trashcan';
import AuthService from '@/service/auth';
import { UserRoles } from '@/types/userRoles';
import { AuthorizationError } from '@/error/authorizationError';

class TrashcanService implements IService<TrashcanRequest, Trashcan> {
    async create(entity: TrashcanRequest, file: UploadedFile | null, accessToken: string) {
        const role = await AuthService.getUserRole(accessToken);
        if (role !== UserRoles.ADMIN) {
            throw new AuthorizationError();
        }

        const image = file ? FileService.create(file) : `http://localhost:8080/images/${IMAGES.NONE}`;
        return await TrashcanDAO.create({ ...entity, image });
    }
    async getOne(id: string) {
        const trashcan = await TrashcanDAO.findById(id);
        if (trashcan) return trashcan;
        throw new TrashcanNotFoundError();
    }
    async update(entity: TrashcanRequest, file: UploadedFile | null, accessToken: string) {
        const role = await AuthService.getUserRole(accessToken);
        if (role !== UserRoles.ADMIN) {
            throw new AuthorizationError();
        }

        if (!entity.id) throw new TrashcanNotFoundError();
        const image = file ? FileService.create(file) : IMAGES.NONE;
        const trashcan = await TrashcanDAO.findByIdAndUpdate(entity.id, { ...entity, image }, { new: true });
        if (trashcan) return trashcan;
        throw new TrashcanNotFoundError();
    }
    async delete(id: string, accessToken: string) {
        const role = await AuthService.getUserRole(accessToken);
        if (role !== UserRoles.ADMIN) {
            throw new AuthorizationError();
        }

        const trashcan = await TrashcanDAO.findByIdAndDelete(id);
        if (trashcan) {
            FileService.delete((trashcan as Trashcan).image);
            return trashcan;
        }
        throw new TrashcanNotFoundError();
    }
    async getByFilters(type: GarbageTypes, volumeMore: number, volumeLess: number, fillMore: number, fillLess: number) {
        const filters: TrashcanFilters = {
            ...(type && { type }),
            ...((volumeMore || volumeLess) && {
                volume: {
                    ...(volumeMore && { $gt: volumeMore }),
                    ...(volumeLess && { $lt: volumeLess }),
                },
            }),
            ...((fillMore || fillLess) && {
                fill: {
                    ...(fillMore && { $gt: fillMore }),
                    ...(fillLess && { $lt: fillLess }),
                },
            }),
        };

        const trashcans = await TrashcanDAO.find(filters);
        return trashcans;
    }
}

export default new TrashcanService();
