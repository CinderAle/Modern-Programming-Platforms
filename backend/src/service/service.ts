export interface IService<T> {
    create(entity: T): Promise<T>;
    getOne(id: string): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: string): Promise<T>;
}
