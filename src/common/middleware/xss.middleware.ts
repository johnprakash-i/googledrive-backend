import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const clean = (obj: any): void => {
  if (!obj || typeof obj !== 'object') return;

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      obj[key] = xss(value);
    } else if (typeof value === 'object') {
      clean(value);
    }
  }
};

export const xssMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) clean(req.body);
  if (req.params) clean(req.params);


  next();
};
