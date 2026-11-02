import { ApiException, ApiCodeResponse } from "@common/api";
import { HttpStatus } from "@nestjs/common";

export class AuthSecurityException extends ApiException<null> {
constructor(
code: string = ApiCodeResponse.AuthUnauthorized,
statusCode: HttpStatus = HttpStatus.UNAUTHORIZED,
) {
super({
statusCode,
code,
logMessage: 'Authentication security validation failed',
});
}
}
