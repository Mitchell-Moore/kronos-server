import UserRouter from './user.route';
import AuthRouter from './auth.route';
import { userAuth } from '../middleware/auth.middleware';

import express, { Request, Response } from 'express';
const app = express();

app.get('/', (_: Request, res: Response) => {
  return res.send('hello world');
});
app.use('/api/users', userAuth, UserRouter);
app.use('/api/auth', AuthRouter);

export default app;
