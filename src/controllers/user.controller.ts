import { Request, Response } from 'express';
import * as UserService from '../service/user.service';

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await UserService.getUser(id);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    return res.status(200).json({
      data: user,
      message: 'Successfully Retrieved user ',
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
