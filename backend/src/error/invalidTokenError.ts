export class InvalidTokenError extends Error {
    constructor() {
        super();
        this.message = 'Provided token is invalid';
    }
}
