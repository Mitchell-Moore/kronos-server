import { Prisma, PrismaClient, Schedule } from '@prisma/client';
import { z, ZodError } from 'zod';
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

export const addSchedules = async (body: { schedules: Partial<Schedule>[] }): Promise<Schedule[]> => {
  const scheduleSchema = z.object({
    startDateTime: z.string(),
    endDateTime: z.string(),
    isRecurring: z.boolean(),
  });

  const bodySchema = z.object({
    schedules: z.array(scheduleSchema),
    userId: z.number(),
    originalTimezone: z.string(),
  });
  try {
    let data = bodySchema.parse({
      ...body,
    });
    let processedSchedules = [];
    for (let i = 0; i < data.schedules.length; i++) {
      let startDateTime = new Date(new Date(data.schedules[i].startDateTime).toISOString());
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);

      let endDateTime = new Date(new Date(data.schedules[i].endDateTime).toISOString());
      endDateTime.setSeconds(0);
      endDateTime.setMilliseconds(0);

      let schedule = { startDateTime, endDateTime, userId: data.userId, originalTimezone: data.originalTimezone, isRecurring: data.schedules[i].isRecurring };
      processedSchedules.push(schedule);
    }
    await deleteUserSchedules(data.userId);
    await prisma.schedule.createMany({
      data: processedSchedules,
    });
    const schedules = prisma.schedule.findMany({
      where: {
        userId: data.userId,
      },
    });

    return schedules;
  } catch (e) {
    if (e instanceof ZodError || e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};

export const deleteUserSchedules = async (userId: number) => {
  try {
    await prisma.schedule.deleteMany({
      where: {
        userId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};
