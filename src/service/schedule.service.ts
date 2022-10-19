import { PrismaClient, Schedule } from '@prisma/client';

const prisma = new PrismaClient();

export const getSchedules = async (
  userId: number
): Promise<Schedule[] | null> => {
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
