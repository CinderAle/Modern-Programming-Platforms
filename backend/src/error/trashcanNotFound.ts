export class TrashcanNotFoundError extends Error {
    constructor() {
        super();
        this.message = 'Specified trashcan was not found';
    }
}
