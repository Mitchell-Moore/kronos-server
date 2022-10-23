import { Prisma, PrismaClient, Schedule } from '@prisma/client';
import { z, ZodError } from 'zod';
import {
  checkIfRecurringScheduleOnSameDayOfWeek,
  convertDateToEndOfUTCDay,
  convertDateToStartOfUTCDay,
  convertDateUTCToOriginalTimeZoneToNewTimeZone,
  convertDateUTCToTimezone,
} from '../utils/date/dateHelper';
import BaseError from '../utils/error/BaseError';

const prisma = new PrismaClient();

export const getSchedules = async (userId: number): Promise<Schedule[] | null> => {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
      },
    });

    return schedules;
  } catch (e) {
    return e;
  }
};

export const addSchedule = async (body: Partial<Schedule>): Promise<Schedule> => {
  const scheduleSchema = z.object({
    startDateTime: z.string(),
    endDateTime: z.string(),
    isRecurring: z.boolean(),
    originalTimezone: z.string(),
    userId: z.number(),
  });
  try {
    let data = scheduleSchema.parse({
      ...body,
    });

    let startDateTime = new Date(new Date(data.startDateTime).toISOString());
    startDateTime.setSeconds(0);
    startDateTime.setMilliseconds(0);

    let endDateTime = new Date(new Date(data.endDateTime).toISOString());
    endDateTime.setSeconds(0);
    endDateTime.setMilliseconds(0);

    await deleteScheduleOnSameDay({ ...data, startDateTime, endDateTime });

    const schedule = await prisma.schedule.create({
      data: {
        ...data,
        startDateTime,
        endDateTime,
      },
    });

    return schedule;
  } catch (e) {
    if (e instanceof ZodError || e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};

export const deleteScheduleOnSameDay = async (data: {
  startDateTime: Date;
  endDateTime: Date;
  originalTimezone: string;
  isRecurring: boolean;
  userId: number;
}) => {
  try {
    let start = convertDateToStartOfUTCDay(data.startDateTime, data.originalTimezone);
    let end = convertDateToEndOfUTCDay(data.endDateTime, data.originalTimezone);

    const schedulesSameDay = await prisma.schedule.findMany({
      where: {
        userId: data.userId,
        OR: [
          {
            startDateTime: {
              lt: end.toISOString(),
              gte: start.toISOString(),
            },
          },
          {
            endDateTime: {
              lt: end.toISOString(),
              gte: start.toISOString(),
            },
          },
        ],
      },
    });

    await prisma.schedule.deleteMany({
      where: {
        id: {
          in: schedulesSameDay.map((schedule) => schedule.id),
        },
      },
    });

    // if (data.isRecurring) {
    //   const schedulesRecurring = await prisma.schedule.findMany({
    //     where: {
    //       userId: data.userId,
    //       isRecurring: true,
    //     },
    //   });

    //   let scheduleStart = convertDateUTCToTimezone(start, data.originalTimezone);
    //   let scheduleEnd = convertDateUTCToTimezone(end, data.originalTimezone);

    //   const schedulesToDelete = [];
    //   for (let i = 0; i < schedulesRecurring.length; i++) {
    //     //Convert the schedule to the requested timezone
    //     let curStart = convertDateUTCToOriginalTimeZoneToNewTimeZone(
    //       schedulesRecurring[i].startDateTime,
    //       schedulesRecurring[i].originalTimezone,
    //       data.originalTimezone
    //     );
    //     let curEnd = convertDateUTCToOriginalTimeZoneToNewTimeZone(
    //       schedulesRecurring[i].endDateTime,
    //       schedulesRecurring[i].originalTimezone,
    //       data.originalTimezone
    //     );

    //     //Check if new schedule or old schedule are on same day of the week
    //     if (
    //       checkIfRecurringScheduleOnSameDayOfWeek({ startDateTime: curStart, endDateTime: curEnd }, { startDateTime: scheduleStart, endDateTime: scheduleEnd })
    //     ) {
    //       schedulesToDelete.push(schedulesRecurring[i].id);
    //     }
    //   }

      // await prisma.schedule.deleteMany({
      //   where: {
      //     id: {
      //       in: schedulesToDelete,
      //     },
      //   },
      // });
    }

    // console.log(schedules);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};
