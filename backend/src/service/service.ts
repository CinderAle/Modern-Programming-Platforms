import fileUpload from 'express-fileupload';

export interface IService<T, K> {
    create?(entity: T, file: fileUpload.UploadedFile | null): Promise<K>;
    getOne(id: string): Promise<K>;
    update?(entity: T, file: fileUpload.UploadedFile | null): Promise<K>;
    delete(id: string): Promise<K>;
}
