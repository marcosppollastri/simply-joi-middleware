/**
 * Interface representing options to customize the behavior of the validation middleware.
 * 
 * @property nextOnError - Determines whether the middleware passes control to the next 
 *                         middleware in the stack when a validation error occurs. If true,
 *                         the next middleware is invoked, passing the error object. If false
 *                         or undefined, an error response is immediately returned.
 */
export interface SimplyJoiOptions {
    /**
     * Determines whether the middleware passes control to the next middleware in the stack 
     * when a validation error occurs. If true, the next middleware is invoked, passing the 
     * error object. If false or undefined, an error response is immediately returned.
     */
    nextOnError: boolean;
}

/**
 * Enumeration for the possible targets of HTTP request validation.
 * @readonly
 * @enum {string}
 * 
 * @property {string} BODY - Represents the body of the HTTP request.
 * @property {string} QUERY - Represents the query parameters of the HTTP request.
 * @property {string} HEADERS - Represents the headers of the HTTP request.
 *
 * @example
 * const target = Targets.BODY; // This will make the middleware validate the body of the request
 */
export enum Targets {
    BODY = 'body',
    QUERY = 'query',
    HEADERS = 'headers',
}


export enum HttpCodes {
    INTERNAL = 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST = 'BAD_REQUEST'
} 