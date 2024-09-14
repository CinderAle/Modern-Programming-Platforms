import fileUpload from 'express-fileupload';

export interface IService<T> {
    create?(entity: T, file: fileUpload.UploadedFile | null): Promise<T>;
    getOne(id: string): Promise<T>;
    update?(entity: T, file: fileUpload.UploadedFile | null): Promise<T>;
    delete(id: string): Promise<T>;
}
