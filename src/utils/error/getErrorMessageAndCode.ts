import BaseError from './BaseError';

const getErrorMessageAndCode = (
  error: Error
): { statusCode: number; message: String } => {
  if (error instanceof BaseError) {
    return { message: error.message, statusCode: error.statusCode };
  }

  const message = error.message ? error.message : 'Server Error';
  return { message, statusCode: 500 };
};

export default getErrorMessageAndCode;
