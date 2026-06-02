import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function ProtectedApi() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Firebase token',
    }),
    ApiForbiddenResponse({ description: 'Insufficient role or access denied' }),
    UseGuards(FirebaseAuthGuard, RolesGuard),
  );
}
