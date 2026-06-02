import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig(
  title: string,
  description: string,
  version: string,
) {
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();
}
