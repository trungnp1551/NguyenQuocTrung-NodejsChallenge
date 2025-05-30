import { Response } from 'express';

export const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  res.status(status).json({
    success,
    message,
    ...(data !== null && { data }),
  });
};
