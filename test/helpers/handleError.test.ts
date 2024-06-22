import { handleError } from '@src/helpers/handleError';
import { HttpError } from '@supercharge/http-errors/dist';
import { NextFunction, Response } from 'express';
import { isError as isJoiError } from 'joi';
import { SimplyJoiOptions } from '@src/interfaces'

// Mock dependencies
jest.mock('joi', () => {
  return {
    isError: jest.fn(),
  };
});

describe('handleError', () => {
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockOptions: SimplyJoiOptions;
  const withCodeSpy = jest.spyOn(HttpError.prototype, 'withCode')
  const withStatusSpy = jest.spyOn(HttpError.prototype, 'withStatus')

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    mockOptions = { nextOnError: false };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle Joi error and send response with 400 status', () => {
    (isJoiError as unknown as jest.Mock).mockReturnValue(true);
    const error = { message: 'Validation error' };

    withCodeSpy.mockImplementation(function (code: string) {
      this.code = code;
      return this;
    });

    withStatusSpy.mockImplementation(function (status: number) {
      this.status = status;
      return this;
    });

    handleError(error, mockOptions, mockRes as Response, mockNext);

    expect(withCodeSpy).toHaveBeenCalledWith('BAD_REQUEST');
    expect(withStatusSpy).toHaveBeenCalledWith(400);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 'BAD_REQUEST',
      status: 400,
      message: 'Validation error',
    });

  });

  test('should handle non-Joi error and send response with 500 status', () => {
    (isJoiError as unknown as jest.Mock).mockReturnValue(false);
    const error = new Error('Some other error');

    withCodeSpy.mockImplementation(function (code: string) {
      this.code = code;
      return this;
    });

    withStatusSpy.mockImplementation(function (status: number) {
      this.status = status;
      return this;
    });

    handleError(error, mockOptions, mockRes as Response, mockNext);

    expect(withCodeSpy).toHaveBeenCalledWith('INTERNAL_SERVER_ERROR');
    expect(withStatusSpy).toHaveBeenCalledWith(500);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
      message: 'Internal server error',
    });

  });

  test('should call next function with error if nextOnError is true', () => {
    (isJoiError as unknown as jest.Mock).mockReturnValue(true);
    const error = { message: 'Validation error' };
    mockOptions.nextOnError = true;


    withCodeSpy.mockImplementation(function (code: string) {
      this.code = code;
      return this;
    });

    withStatusSpy.mockImplementation(function (status: number) {
      this.status = status;
      return this;
    });

    handleError(error, mockOptions, mockRes as Response, mockNext);

    expect(withCodeSpy).toHaveBeenCalledWith('BAD_REQUEST');
    expect(withStatusSpy).toHaveBeenCalledWith(400);
    expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();

  });
});
