type CreateErrorProps = {
  code: string;
  message: string;
  cause?: string;
};

export function createError({
  code,
  message,
  cause,
}: CreateErrorProps): never {
  const error = new Error(message);
  error.name = code;
  error.cause = cause;
  throw error;
}

export function createWarning({ code, message, cause }: CreateErrorProps) {
  console.warn(code, '=>', message);
  cause && console.warn('caused by', '=>', cause);
}
