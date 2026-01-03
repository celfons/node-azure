import { Request, Response } from 'express';

/**
 * Utility for wrapping Express controllers in Azure Functions
 */

/**
 * Creates a mock Express request object from Azure Function parameters
 */
export function createMockRequest(params?: Record<string, any>, body?: any): Request {
  return {
    params: params || {},
    body: body || {}
  } as Request;
}

/**
 * Creates a mock Express response object that captures status and data
 */
export function createMockResponse(): {
  res: Response;
  getStatus: () => number;
  getData: () => any;
} {
  let statusCode = 200;
  let responseData: any = null;

  const mockRes = {
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (data: any) => {
      responseData = data;
    }
  } as Response;

  return {
    res: mockRes,
    getStatus: () => statusCode,
    getData: () => responseData
  };
}
