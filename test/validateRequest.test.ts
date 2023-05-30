import { validateRequest, ValidationTargets } from '@src/middlewares/validateRequest'; 
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

describe('validateRequest', () => {
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

    it('calls next when validation succeeds', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });

        mockRequest.body = { foo: 'bar' };

        validateRequest(schema, ValidationTargets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

    it('returns a 400 error when validation fails', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });

        mockRequest.body = { baz: 'qux' };

        validateRequest(schema, ValidationTargets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalled();
    });

    it('returns a 500 error when an unexpected error occurs', () => {
        const schema = Joi.object({
            foo: Joi.string().required(),
        });
        jest.spyOn(Joi, 'assert').mockImplementationOnce(() => {
            throw new Error('test error');
        });

        // This will cause an error because the schema is a string and not an object.
        mockRequest.body = 'not an object';

        validateRequest(schema, ValidationTargets.BODY)(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalled();
    });
});
