export class InvalidEntityError extends Error {
    constructor() {
        super();
        this.message = 'Passed entity contains invalid fields!';
    }
}
