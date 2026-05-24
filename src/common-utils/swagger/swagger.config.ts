import { applyDecorators, UseGuards } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function createSwaggerConfig(title: string, description: string, version: string) {
  return new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).addBearerAuth().build();
}

export function ProtectedApi() {
  return applyDecorators(UseGuards(FirebaseAuthGuard, RolesGuard));
}
