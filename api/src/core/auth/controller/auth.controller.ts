import { Body, Controller, Header, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Response } from "express";
import { ApiCodeResponse, ApiSuccessCode } from "@common/api";
import { Public } from "../decorator/public.decorator";
import { AuthService } from "../service/auth.service";
import { AuthCookieService } from "../service/auth-cookie.service";
import { LoginRequestDto } from "../data/dto/request/login-request.dto";
import { LoginResponseDto } from "../data/dto/response/login-response.dto";
import { RegisterRequestDto } from "../data/dto/request/register-request.dto";
import { RegistrationResponseDto } from "../data/dto/response/registration-response.dto";
import { AuthSecurityException } from "../data/exception/auth-security.exception";
import { ApiTags } from "@nestjs/swagger";
import { ApiEnvelopeResponse } from "@common/api/decorator/api-envelope-response.decorator";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookies: AuthCookieService,
  ) {}
@Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  @ApiSuccessCode(ApiCodeResponse.AuthRegistrationSuccess)
  @ApiEnvelopeResponse(RegistrationResponseDto, { status: HttpStatus.CREATED })
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RegistrationResponseDto> {
    const registration = (await this.authService.register(dto)) as any;

    this.cookies.setAccessCookie(response, registration.accessToken);
    this.cookies.setRefreshCookie(
      response,
      registration.refreshToken,
      registration.refreshExpiresAt,
    );
    this.cookies.setCsrfCookie(
      response,
      registration.csrfToken,
      registration.refreshExpiresAt,
    );

    return {
      accountId: registration.accountId,
      email: dto.email,
      authenticated: true,
    } as any;
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @Throttle({ global: { limit: 10, ttl: 60_000 } })
  @ApiSuccessCode(ApiCodeResponse.AuthLoginSuccess)
  @ApiEnvelopeResponse(LoginResponseDto, { status: HttpStatus.OK })
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const session = (await this.authService.login(dto)) as any;

    this.cookies.setAccessCookie(response, session.accessToken);
    this.cookies.setRefreshCookie(
      response,
      session.refreshToken,
      session.refreshExpiresAt,
    );
    this.cookies.setCsrfCookie(
      response,
      session.csrfToken,
      session.refreshExpiresAt,
    );

    return {
      accountId: session.accountId,
      email: dto.email,
      authenticated: true,
    } as any;
  }
}
