import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../constrains';

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
      if (typeof decoded !== 'string') {
        req.params.cookie_user_id = decoded.user_id;
      }
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Not authorized, token not available' });
  }
};
