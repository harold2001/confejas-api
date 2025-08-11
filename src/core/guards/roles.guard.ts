// import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { User } from '@modules/user/entities/user.entity';
// import { AppRole } from '@core/enums/roles';
// import { validateUserRole } from '@core/validation/validate-role';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   private readonly logger = new Logger(RolesGuard.name);

//   constructor(private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const roles = this.reflector.getAllAndOverride<AppRole[]>('roles', [context.getHandler(), context.getClass()]);
//     const handlerName = context.getHandler().name;
//     if (!roles || !roles.length) {
//       return true;
//     }

//     const { user }: { user: User } = context.switchToHttp().getRequest();
//     return validateUserRole(user, roles, handlerName, this.logger);
//   }
// }
