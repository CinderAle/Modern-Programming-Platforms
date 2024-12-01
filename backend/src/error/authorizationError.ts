export class AuthorizationError extends Error {
    constructor() {
        super();
        this.message = 'Failed to authorize';
    }
}
