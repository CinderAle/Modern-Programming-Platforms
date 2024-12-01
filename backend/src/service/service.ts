import fileUpload from 'express-fileupload';

export interface IService<T, K> {
    create?(entity: T, file: fileUpload.UploadedFile | null, accessToken?: string): Promise<K>;
    getOne(id: string, accessToken?: string): Promise<K>;
    update?(entity: T, file: fileUpload.UploadedFile | null, accessToken?: string): Promise<K>;
    delete(id: string, accessToken?: string): Promise<K>;
}
