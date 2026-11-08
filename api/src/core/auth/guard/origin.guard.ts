import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthSecurityException } from '../data/exception/auth-security.exception';
import { EnvService } from '@common/config/env.service';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly envService: EnvService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    //Les requêtes s
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      return true;
    }

    const origin = request.header('Origin');
    const referer = request.header('Referer');
    const candidate = origin || this.originFromReferer(referer);

    if (candidate && this.envService.corsOrigins.includes(candidate)) {
      return true;
    }

    if (!candidate && !this.envService.isProduction) {
      return true;
    }

    throw new AuthSecurityException('api.security.origin-invalid', 403);
  }

 
  private originFromReferer(referer?: string): string | null {
    if (!referer) return null;
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
}
