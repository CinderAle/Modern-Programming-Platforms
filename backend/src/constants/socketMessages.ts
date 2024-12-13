export const SOCKET_MESSAGES = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',

    // Receives
    CREATE_TRASHCAN: 'create-trashcan',
    GET_TRASHACN: 'get-trashcan',
    GET_FILTERED_TRASHCANS: 'get-filtered-trashcans',
    UPDATE_TRASHCAN: 'update-traschan',
    DELETE_TRASHCAN: 'delete-trashcan',

    // Sends
    ADDED_TRASHCAN: 'added-trashcan',
    MODIFIED_TRASHCAN: 'modified-trashcan',
    REMOVED_TRASHCAN: 'removed-trashcan',
    LIST_TRASHCANS: 'list-trashcans',

    // Util
    ERROR: 'error',
    SUCCESS: 'success',
    AUTH_ERROR: 'auth-error',
};
