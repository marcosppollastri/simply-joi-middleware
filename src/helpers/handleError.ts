import { HttpError } from '@supercharge/http-errors/dist';
import { NextFunction, Response } from 'express';
import {isError as isJoiError } from 'joi';
import { SimplyJoiOptions } from '..';

/**
 * Handles errors that occur during Joi schema validation.
 *
 * If the `nextOnError` option is set to `true` in the `SimplyJoiOptions`,
 * the Express 'next' function is called with the error.
 * Otherwise, an HTTP response with an error status code and error message is sent.
 *
 * @param {unknown} error - The error thrown during Joi schema validation.
 * @param {SimplyJoiOptions} [options] - The optional options for the validation middleware.
 * @param {Response} [res] - The Express HTTP response object.
 * @param {NextFunction} [next] - The Express 'next' function to move to the next middleware in the stack.
 */
export function handleError(error: unknown, options?: SimplyJoiOptions, res?: Response, next?: NextFunction) {
    let err: HttpError;
    if(isJoiError(error)){
        err = new HttpError(error.message)
            .withCode('BAD_REQUEST')
            .withStatus(400);
    } else {
        err = new HttpError('Internal server error')
            .withCode('INTERNAL_SERVER_ERROR')
            .withStatus(500);
    }

    if(options?.nextOnError){
        next(err);
    } else {
        res.status(err.status).json({
            code: err.code,
            status: err.status,
            message: err.message,
        });
    }
}