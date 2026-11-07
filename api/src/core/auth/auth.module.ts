import { AccountModule } from "@core/account";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthIdentifierEntity } from "./data/entity/auth-identifier.entity";
import { AuthRefreshTokenEntity } from "./data/entity/auth-refresh-token.entity";
import { AuthSessionEntity } from "./data/entity/auth-session.entity";
import { PasswordCredentialEntity } from "./data/entity/password-credential.entity";
import { PasswordHasherService, PasswordPolicyService, AuthCookieService, CsrfService, TokenCryptoService } from "./service";
import { AuthIdentifierService } from "./service/auth-identifier.service";
import { PasswordCredentialService } from "./service/password-credential.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";



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
 providers: [
 AuthIdentifierService,
 PasswordCredentialService,
 PasswordHasherService,
 PasswordPolicyService,
 AuthCookieService,
 CsrfService,
 TokenCryptoService,
 ],
})
export class AuthModule {}
