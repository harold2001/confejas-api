// // import { User } from '@modules/user/entities/user.entity';
// import { AppRole } from '@core/enums/roles';
// import {
//   // ForbiddenException,
//   Logger,
//   UnauthorizedException,
// } from '@nestjs/common';

// export function validateUserRole(
//   user: User,
//   roles: AppRole[],
//   handlerName: string,
//   logger: Logger,
// ) {
//   if (!user) {
//     throw new UnauthorizedException('Unauthorized request');
//   }

//   /* TODO: Include or adapt the logic for access based on user role validation */

//   // if (!user.hasAnyRole(roles)) {
//   //   logger.error(
//   //     `User ${user.id} was rejected access to perform ${handlerName} due to insufficient permissions`,
//   //   );
//   //   throw new ForbiddenException(
//   //     'You do not have permission to perform this operation',
//   //   );
//   // }

//   return true;
// }
