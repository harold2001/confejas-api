import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied: No roles assigned');
    }

    const hasRole = user.roles.some((role: any) =>
      requiredRoles.includes(role.name),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires one of these roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
