import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPreferencesDhikrPractices1761000000000 implements MigrationInterface {
  name = 'UserPreferencesDhikrPractices1761000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
      ADD COLUMN IF NOT EXISTS "dhikrPractices" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    await queryRunner.query(`
      UPDATE "user_preferences"
      SET "dhikrPractices" = '[]'::jsonb
      WHERE "dhikrPractices" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
      DROP COLUMN IF EXISTS "dhikrPractices"
    `);
  }
}
