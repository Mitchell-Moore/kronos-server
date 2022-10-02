export const __prod__ = process.env.NODE_ENV === 'production';
export const TOKEN_AGE_SECONDS = 3 * 60 * 60; //3 hours
export const TOKEN_AGE_MS = 3 * 60 * 60 * 1000; //3 hours
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
  ? process.env.JWT_ACCESS_SECRET
  : '';
