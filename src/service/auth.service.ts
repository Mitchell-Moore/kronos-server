import { Prisma, PrismaClient, User } from '@prisma/client';
import argon2 from 'argon2';
import { z, ZodError } from 'zod';
import BaseError from '../utils/error/BaseError';
import jwt from 'jsonwebtoken';
import { excludePassword } from '../utils/user/excludePassword';
import { JWT_ACCESS_SECRET, TOKEN_AGE_SECONDS } from '../constrains';
require('dotenv').config();

const prisma = new PrismaClient();

export const login = async (body: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const userSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  try {
    const data = userSchema.parse(body);
    const user = await prisma.user.findFirst({ where: { email: data.email } });

    if (!user) {
      throw new BaseError(400, 'User does not exist');
    }

    if (!(await argon2.verify(user.password, data.password))) {
      throw new BaseError(400, 'Invalid Credentials');
    }

    const token = jwt.sign({ user_id: user.id }, JWT_ACCESS_SECRET, {
      expiresIn: TOKEN_AGE_SECONDS,
    });

    return { user, token };
  } catch (e) {
    if (
      e instanceof ZodError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};

export const register = async (body: Partial<User>): Promise<Partial<User>> => {
  const userSchema = z.object({
    email: z.string(),
    password: z.string().min(8),
    first_name: z.string(),
    last_name: z.string(),
  });

  try {
    let data = userSchema.parse(body);
    const password = await argon2.hash(data.password);
    data.password = password;

    const user = await prisma.user.create({
      data: {
        ...data,
      },
    });

    return excludePassword(user, 'password');
  } catch (e) {
    if (
      e instanceof ZodError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new BaseError(400, e.message);
    }
    throw new BaseError(500, 'Server Error');
  }
};
