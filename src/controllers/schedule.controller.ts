import { Request, Response } from 'express';
import * as ScheduleService from '../service/schedule.service';
// import BaseError from '../utils/error/BaseError';

//TODO fix the auth so it adds the decoded user id to the req
export const getSchedules = async (req: Request, res: Response) => {
  try {
    // if (req.params.cookie_user_id != req.params.user_id) {
    //   throw new BaseError(
    //     404,
    //     'You do not have permission to view these schedules'
    //   );
    // }

    const userId = Number(req.params.user_id);
    const schedules = await ScheduleService.getSchedules(userId);
    if (schedules && schedules.length > 0) {
      const dateUTC = schedules[0].startDateTime.toISOString();
      const secondDate = new Date(dateUTC);
      console.log(dateUTC);
      console.log(secondDate.toISOString());
    }

    return res.status(200).json({
      data: schedules,
      message: 'Successfully Retrieved schedules ',
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

//TODO implement the schedule service to accept schedules (maybe should do it for a single schedule????)
export const addOrUpdateSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await ScheduleService.addSchedules(req.body);

    return res.status(200).json({
      data: schedules,
      message: 'Successfully Retrieved schedules ',
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
