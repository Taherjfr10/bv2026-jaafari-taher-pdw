import { SetMetadata } from '@nestjs/common';

export const API_SUCCESS_CODE_KEY = 'api:success-code';

export const ApiSuccessCode = (code: string): MethodDecorator =>
  SetMetadata(API_SUCCESS_CODE_KEY, code);
