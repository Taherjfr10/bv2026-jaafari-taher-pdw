export type HttpLogLevel = 'info' | 'warn' | 'error' | 'silent';

import { LogLevel } from '@common/config/data/enum';

const HEALTH_CHECK_LOG_PATHS = new Set(['/health/live', '/health/ready']);

export const resolveHttpLogLevel = (
  path: string | undefined,
  statusCode: number,
  hasError: boolean,
): LogLevel => {
  const normalizePath = path?.split('?')[0];

  if (
    !hasError &&
    statusCode < 400 &&
    normalizePath !== undefined &&
    HEALTH_CHECK_LOG_PATHS.has(normalizePath)
  )
    return LogLevel.Silent;

  if (hasError || statusCode >= 500) return LogLevel.Error;
  if (statusCode >= 400) return LogLevel.Warn;

  return LogLevel.Info;
};
