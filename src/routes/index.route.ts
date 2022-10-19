import { userAuth } from '../middleware/auth.middleware';
import AuthRouter from './auth.route';
import UserRouter from './user.route';
import ScheduleRouter from './schedule.route';

import express, { Request, Response } from 'express';
const app = express();

app.get('/', (_: Request, res: Response) => {
  return res.send('hello world');
});
app.use('/api/auth', AuthRouter);
app.use('/api/users', userAuth, UserRouter);
app.use('/api/schedules', userAuth, ScheduleRouter);
export default app;
