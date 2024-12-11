export interface IService<T, K> {
    create?(entity: T, file: ArrayBuffer | null, accessToken?: string): Promise<K>;
    getOne(id: string, accessToken?: string): Promise<K>;
    update?(entity: T, file: ArrayBuffer | null, accessToken?: string): Promise<K>;
    delete(id: string, accessToken?: string): Promise<K>;
}
