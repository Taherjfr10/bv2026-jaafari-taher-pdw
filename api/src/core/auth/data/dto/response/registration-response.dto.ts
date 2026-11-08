import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@core/account';
import { Response } from 'express';

export class RegistrationResponseDto {
  accessToken(response: Response<any, Record<string, any>>, accessToken: any) {
      throw new Error("Method not implemented.");
  }
  refreshToken(response: Response<any, Record<string, any>>, refreshToken: any, refreshExpiresAt: any) {
      throw new Error("Method not implemented.");
  }
  refreshExpiresAt(response: Response<any, Record<string, any>>, refreshToken: any, refreshExpiresAt: any) {
      throw new Error("Method not implemented.");
  }
  csrfToken(response: Response<any, Record<string, any>>, csrfToken: any, refreshExpiresAt: any) {
      throw new Error("Method not implemented.");
  }
  @ApiProperty({ example: '01K2Z3Z4Z5Z6Z7Z8Z9ZAABBCCD' })
  accountId!: string;

  @ApiProperty({ example: 'nicolas@example.com' })
  email!: string;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.Active })
  status!: AccountStatus;

  @ApiProperty({ example: false })
  emailVerified!: boolean;

  @ApiProperty({ example: '2026-08-19T12:00:00.000Z' })
  createdAt!: string;
}
