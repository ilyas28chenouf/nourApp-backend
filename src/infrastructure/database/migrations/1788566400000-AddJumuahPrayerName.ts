import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJumuahPrayerName1788566400000 implements MigrationInterface {
  name = 'AddJumuahPrayerName1788566400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "prayer_logs_prayername_enum" ADD VALUE IF NOT EXISTS 'JUMUAH'`,
    );
  }

  public async down(): Promise<void> {
    // PostgreSQL enum values are intentionally retained so existing Jumu'ah
    // prayer logs stay readable after a rollback.
  }
}
