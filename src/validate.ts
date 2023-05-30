import { NextFunction, Request, Response, RequestHandler } from 'express';
import { Schema, ValidationOptions, assert, isError as isJoiError } from 'joi';
import { HttpError } from '@supercharge/http-errors/dist';

export enum Targets {
    BODY = 'body',
    QUERY = 'query',
    HEADERS = 'headers',
}

export enum HttpCodes {
    INTERNAL = 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST = 'BAD_REQUEST'
} 



export function validate(schema: Schema, target: Targets, options?: ValidationOptions): RequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (req: Request, res: Response, next: NextFunction) => {
        const data: unknown = req[target];
        try {
            assert(data, schema, options);
            next();
        } catch (error: unknown) {
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
            res.status(err.status).json({
                code: err.code,
                status: err.status,
                message: err.message,
            });
        }
    };
}