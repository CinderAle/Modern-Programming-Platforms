import { Trashcan } from '@/entity/trashcan';
import { IService } from './service';
import { GarbageTypes } from '@/types/garbageTypes';
import { TrashcanDAO } from '@/dao/trashcan';
import { TrashcanRequest } from '@/dto/trashcan/request';
import { TrashcanNotFoundError } from '@/error/trashcanNotFound';

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
}

export default new TrashcanService();
