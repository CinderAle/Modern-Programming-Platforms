export class FileSavingError extends Error {
    constructor(message: string = '') {
        super(message);
        this.message = `Failed to create the file: ${message}`;
    }
}
