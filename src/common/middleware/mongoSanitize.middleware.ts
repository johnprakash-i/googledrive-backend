import { Request, Response, NextFunction } from 'express';

export const mongoSanitizeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const sanitize = (obj: any) => {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  next();
};
