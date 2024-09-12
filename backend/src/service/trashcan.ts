import { Trashcan } from '@/entity/trashcan';
import { IService } from './service';
import { GarbageTypes } from '@/types/garbageTypes';
import { TrashcanDAO } from '@/dao/trashcan';
import { TrashcanRequest } from '@/dto/trashcan/request';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';
import { TrashcanFilters } from '@/types/trashcanFilters';

class TrashcanService implements IService<TrashcanRequest> {
    async create(entity: TrashcanRequest) {
        return await TrashcanDAO.create(entity);
    }
    async getOne(id: string) {
        const trashcan = await TrashcanDAO.findById(id);
        if (trashcan) return trashcan;
        throw new TrashcanNotFoundError();
    }
    async update(entity: TrashcanRequest) {
        if (!entity.id) throw new TrashcanNotFoundError();
        const trashcan = await TrashcanDAO.findByIdAndUpdate(entity.id, entity, { new: true });
        if (trashcan) return trashcan;
        throw new TrashcanNotFoundError();
    }
    async delete(id: string) {
        const trashcan = await TrashcanDAO.findByIdAndDelete(id);
        if (trashcan) return trashcan;
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