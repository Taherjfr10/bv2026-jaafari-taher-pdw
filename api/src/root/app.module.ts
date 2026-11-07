import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@common/config/app-config.module';
import { LoggingModule } from '@common/logging/logging.module';
import { ApiInterceptor } from '@common/api/interceptor';
import { HealthModule } from '@core/health/health.module';
import { AccountModule } from '@core/account/account.module';
import { DatabaseModule } from '@common/database/database.module';
import { AuthRefreshTokenEntity } from '@core/auth/data/entity/auth-refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AuthIdentifierEntity } from '@core/auth/data/entity/auth-identifier.entity';
import { PasswordCredentialEntity } from '@core/auth/data/entity/password-credential.entity';
import { AuthSessionEntity } from '@core/auth/data/entity/auth-session.entity';
import { TokenCryptoService } from '@core/auth/service/token-crypto.service';
import { AuthIdentifierService } from '@core/auth/service/auth-identifier.service';
import { PasswordCredentialService } from '@core/auth/service/password-credential.service';
import { PasswordHasherService } from '@core/auth/service/password-hasher.service';
import { PasswordPolicyService } from '@core/auth/service/password-policy.service';
import { AuthCookieService } from '@core/auth/service/auth-cookie.service';
import { CsrfService } from '@core/auth/service/csrf.service';

@Module({
  imports: [
    AccountModule,
 TypeOrmModule.forFeature([
 AuthIdentifierEntity,
 PasswordCredentialEntity,
 AuthSessionEntity,
 AuthRefreshTokenEntity,
  ]),

  ],
  controllers: [AppController],
  providers: [AppService,
    AuthIdentifierService,
 PasswordCredentialService,
 PasswordHasherService,
 PasswordPolicyService,
 AuthCookieService,
 CsrfService,
 TokenCryptoService,
  ],
})
export class AppModule {

  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [AppConfigModule.register(),
        LoggingModule,
        DatabaseModule,
        HealthModule,
        AccountModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
