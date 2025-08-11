import { SetMetadata } from '@nestjs/common';
import { AppRole } from '@core/enums/roles';

export const Roles = (...args: AppRole[]) => SetMetadata('roles', args);
