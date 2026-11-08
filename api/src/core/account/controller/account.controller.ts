import { ApiSuccessCode, ApiCodeResponse } from "@common/api";
import { ApiEnvelopeResponse, ApiErrorEnvelopeResponse } from "@common/api/decorator/api-envelope-response.decorator";
import { CurrentAuth } from "@core/auth/decorator/current-auth.decorator";
import { Controller, Get, Header, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiCookieAuth } from "@nestjs/swagger";
import { AccountService } from "../account.service";
import { AccountResponseDto } from "../data/dto/response/account-response.dto";
import type { AuthContext } from "@core/auth/data/model/auth-context";


@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @Header('Cache-Control', 'no-store')
  @ApiCookieAuth('access-cookie')
  @ApiSuccessCode(ApiCodeResponse.AccountMeSuccess)
  @ApiEnvelopeResponse(AccountResponseDto, { status: HttpStatus.OK })
  @ApiErrorEnvelopeResponse({
    status: HttpStatus.UNAUTHORIZED,
    code: ApiCodeResponse.AuthUnauthorized,
  })
  async me(@CurrentAuth() auth: AuthContext): Promise<AccountResponseDto> {
    return this.accountService.me(auth.accountId);
  }
}
