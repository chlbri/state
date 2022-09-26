import { NOmit } from '@bemedev/core';

type CreateErrorProps = {
  code: string;
  message: string;
  cause?: string;
  emit?: boolean;
};

export function createError({
  code,
  message,
  cause,
  emit = true,
}: CreateErrorProps) {
  if (emit) {
    const error = new Error(message);
    error.name = code;
    error.cause = cause;
    throw error;
  } else {
    console.error(code, '=>', message);
    cause && console.error('caused by', '=>', cause);
  }
}

export function createWarning({
  code,
  message,
  cause,
}: NOmit<CreateErrorProps, 'emit'>) {
  console.warn(code, '=>', message);
  cause && console.warn('caused by', '=>', cause);
}
