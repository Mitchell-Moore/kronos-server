import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (id: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    return user;
  } catch (e) {
    return e;
  }
};
