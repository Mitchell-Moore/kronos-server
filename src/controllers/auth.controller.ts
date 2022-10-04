import { Request, Response } from 'express';
import getErrorMessageAndCode from '../utils/error/getErrorMessageAndCode';
import * as AuthService from '../service/auth.service';
import { TOKEN_AGE_MS, __prod__ } from '../constrains';

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.login(req.body);

    return res
      .cookie('jwt', token, {
        httpOnly: false,
        maxAge: TOKEN_AGE_MS, // 3hrs in ms
      })
      .status(200)
      .json({
        data: user,
        message: 'Successfully logged in',
      });
  } catch (error) {
    const { statusCode, message } = getErrorMessageAndCode(error);
    return res.status(statusCode).json({
      message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    return res.status(200).json({
      data: user,
      message: 'Successfully logged in',
    });
  } catch (error) {
    const { statusCode, message } = getErrorMessageAndCode(error);
    return res.status(statusCode).json({
      message,
    });
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    return res.cookie('jwt', '', { maxAge: 1 }).status(200).json({
      message: 'Successfully logged out',
    });
  } catch (error) {
    const { statusCode, message } = getErrorMessageAndCode(error);
    return res.status(statusCode).json({
      message,
    });
  }
};
