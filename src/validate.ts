import { NextFunction, Request, Response, RequestHandler } from 'express';
import { Schema, ValidationOptions, assert, isError as isJoiError } from 'joi';
import { SimplyJoiOptions, Targets } from './interfaces';
import { handleError } from './helpers/handleError';


/**
 * Creates an Express middleware function to validate a specified part of the HTTP request against a Joi schema.
 *
 * @param {Schema} schema - The Joi schema to validate against.
 * @param {Targets} target - The part of the HTTP request to validate. Must be one of Targets enum.
 * @param {ValidationOptions} [joiOptions] - Optional Joi validation options.
 * @param {SimplyJoiOptions} [options] - Optional options for the middleware behavior. 
 *                                       If nextOnError is true, it will pass control to the next middleware on validation error.
 *
 * @returns {RequestHandler} Express middleware for validating request data.
 *
 * @throws {HttpError} Throws an HTTP error if the validation fails or an unexpected error occurs.
 *
 * @example
 * router.get('/', validate(schema, Targets.QUERY, undefined, {nextOnError: true}), (req, res) => {
 *     res.json({ message: 'Success' });
 * });
 */
export function validate(schema: Schema, target: Targets, joiOptions?: ValidationOptions, options?: SimplyJoiOptions): RequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (req: Request, res: Response, next: NextFunction) => {
        const data: unknown = req[target];
        try {
            assert(data, schema, joiOptions);
            next();
        } catch (error: unknown) {
            handleError(error, options, res, next);
        }
    };
}

