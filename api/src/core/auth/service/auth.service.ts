import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppLogger } from '@common/logging';
import { normalizeEmail } from '../utils/normalize-email.util';
import { AccountService } from '@core/account';
import { RegisterRequestDto } from '../data/dto/request/register-request.dto';
import { RegistrationResponseDto } from '../data/dto/response/registration-response.dto';
import { LoginRequestDto } from '../data/dto/request/login-request.dto';
import { AuthSecurityException } from '../data/exception/auth-security.exception';
import { PasswordPolicyService } from './password-policy.service';
import { AuthIdentifierService } from './auth-identifier.service';
import { PasswordCredentialService } from './password-credential.service';
import { PasswordHasherService } from './password-hasher.service';
import { AuthSessionService } from './auth-session.service';


export type AuthSessionResult = {
  accountId: string;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  csrfToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly passwordPolicyService: PasswordPolicyService,
    private readonly authIdentifierService: AuthIdentifierService,
    private readonly accountService: AccountService,
    private readonly passwordCredentialService: PasswordCredentialService,
    private readonly passwordHasher: PasswordHasherService,
    private readonly appLogger: AppLogger,
    private readonly authSessionService: AuthSessionService,
  ) {}

  /*/cInscription d'un nouvel utilisateur /*/
  async register(dto: RegisterRequestDto): Promise<RegistrationResponseDto> {
    this.passwordPolicyService.assertValid(dto.password);
    const email = normalizeEmail(dto.email);

    try {
      const { createdAccount, session } = await this.dataSource.transaction(
        async (manager) => {
          const existingIdentifier =
            await this.authIdentifierService.findEmailInTransaction(manager, email);

          if (existingIdentifier) {
            throw this.emailAlreadyUsed();
          }

          const createdAccount = await this.accountService.create(manager);
          await this.authIdentifierService.create(manager, createdAccount.id, email);
          await this.passwordCredentialService.create(
            manager,
            createdAccount.id,
            dto.password,
          );

          const session = await this.authSessionService.createSession(
            manager,
            createdAccount.id,
          );

          return { createdAccount, session };
        },
      );

      this.appLogger.audit({
        event: 'auth.registration.success',
        accountId: createdAccount.id,
      });

      const sessionData = session as any;

      return {
        accountId: createdAccount.id,
        email,
        status: createdAccount.status,
        emailVerified: false,
        createdAt: createdAccount.createdAt.toISOString(),
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
        refreshExpiresAt: sessionData.refreshExpiresAt,
        csrfToken: sessionData.csrfToken,
      } as unknown as RegistrationResponseDto;
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw this.emailAlreadyUsed();
      }
      throw error;
    }
  }



  //connexion//
  async login(dto: LoginRequestDto) {
    const email = normalizeEmail(dto.email);

    const session = await this.dataSource.transaction(async (manager) => {
      const identifier =
        await this.authIdentifierService.findEmailInTransaction(manager, email);

      if (!identifier) {
        await this.passwordHasher.verifyAgainstDummy(dto.password);
        return null;
      }

      const account = await this.accountService.findByIdInTransaction(
        manager,
        identifier.accountId,
      );

      const credential = await this.passwordCredentialService.findByAccountIdInTransaction(
        manager,
        identifier.accountId,
      );

      const passwordMatches = credential
        ? await this.passwordHasher.verify(credential.passwordHash, dto.password)
        : await this.passwordHasher.verifyAgainstDummy(dto.password);

      if (
        !account ||
        !credential ||
        !passwordMatches ||
        !this.accountService.canAuthenticate(account) ||
        credential.disabledAt !== null ||
        (credential.lockedUntil !== null && credential.lockedUntil > new Date())
      ) {
        if (credential && !passwordMatches) {
          await this.passwordCredentialService.recordFailedAttempt(
            manager,
            credential.id,
          );
        }
        return null;
      }

return await this.authSessionService.createSession(manager, account.id);    });

    if (!session) {
      throw new AuthSecurityException('api.auth.login-failed', 401);
    }

    return session;
  }


  private emailAlreadyUsed(): AuthSecurityException {
    return new AuthSecurityException('api.auth.register.email-used', 409);
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    );
  }
}
