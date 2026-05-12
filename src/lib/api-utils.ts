import { Response } from 'express';

/**
 * Common success response
 */
export const sendSuccess = (res: Response, data: any = { success: true }) => {
  return res.json(data);
};

/**
 * Common error response
 */
export const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ error: message });
};

/**
 * Database unavailable error
 */
export const sendDbUnavailable = (res: Response) => {
  return sendError(res, 503, 'حدث خطأ في تقديم الطلب. يرجى المحاولة لاحقاً.');
};

/**
 * Validation error
 */
export const sendValidationError = (res: Response) => {
  return sendError(res, 400, 'بيانات غير صالحة');
};

/**
 * Unauthorized error
 */
export const sendUnauthorized = (res: Response, message: string = 'Unauthorized') => {
  return sendError(res, 401, message);
};
