import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../domain/users/enums/user-role.enum';
import { AdminHadithController } from '../../admin/controllers/admin-hadith.controller';
import { AdminTafsirController } from '../../admin/controllers/admin-tafsir.controller';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

function executionContext(role: UserRole) {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({
      getRequest: () => ({ user: { role } }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard admin authorization', () => {
  const reflector = {
    getAllAndOverride: jest
      .fn()
      .mockReturnValue([UserRole.ADMIN, UserRole.SUPERADMIN]),
  } as unknown as Reflector;
  const guard = new RolesGuard(reflector);

  it('allows ADMIN and SUPERADMIN', () => {
    expect(guard.canActivate(executionContext(UserRole.ADMIN))).toBe(true);
    expect(guard.canActivate(executionContext(UserRole.SUPERADMIN))).toBe(true);
  });

  it('rejects a regular USER with HTTP 403', () => {
    expect(() => guard.canActivate(executionContext(UserRole.USER))).toThrow(
      ForbiddenException,
    );
  });

  it('uses the shared roles metadata key', () => {
    expect(ROLES_KEY).toBe('roles');
    expect(
      Reflect.getMetadata(ROLES_KEY, AdminHadithController) as UserRole[],
    ).toEqual([UserRole.ADMIN, UserRole.SUPERADMIN]);
    expect(
      Reflect.getMetadata(ROLES_KEY, AdminTafsirController) as UserRole[],
    ).toEqual([UserRole.ADMIN, UserRole.SUPERADMIN]);
  });
});
