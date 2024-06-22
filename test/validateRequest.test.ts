import { validate, Targets } from '@src/index'; 
import { HttpError } from '@supercharge/http-errors/dist/http-error';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

describe('validate', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        // Set up some mock HTTP request/response objects for each test
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should calls next when validation succeeds', () => {
        //seteo de mocks y preparacion
        const schema = Joi.object({
            foo: Joi.string().required(),
        });

        mockRequest.body = { foo: 'bar' };

        //ejecutar la funcion a testear
        validate(schema, Targets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        //validar asserts
        expect(nextFunction).toHaveBeenCalled();
    });

    it('returns a 400 error when validation fails', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });

        mockRequest.body = { baz: 'qux' };

        validate(schema, Targets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalled();
        expect(nextFunction).not.toHaveBeenCalled();

    });

    it('returns a 500 error when an unexpected error occurs', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });
        jest.spyOn(Joi, 'assert').mockImplementationOnce(() => {
            throw new Error('test error');
        });

        // This will cause an 400 error because the schema is a string and not an object.
        mockRequest.body = 'not an object';

        validate(schema, Targets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('calls next with the error when validation fails and nextOnError is set to true', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });
    
        mockRequest.body = { baz: 'qux' };
    
        validate(schema, Targets.BODY, undefined, { nextOnError: true })(mockRequest as Request, mockResponse as Response, nextFunction);
    
        expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    });
    
    it('calls next with the error when an unexpected error occurs and nextOnError is set to true', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });
        jest.spyOn(Joi, 'assert').mockImplementationOnce(() => {
            throw new Error('test error');
        });
    
        // This will cause an error because the schema is a string and not an object.
        mockRequest.body = 'not an object';
    
        validate(schema, Targets.BODY, undefined, { nextOnError: true })(mockRequest as Request, mockResponse as Response, nextFunction);
    
        expect(nextFunction).toHaveBeenCalledWith(expect.any(HttpError));
    });
    
});
