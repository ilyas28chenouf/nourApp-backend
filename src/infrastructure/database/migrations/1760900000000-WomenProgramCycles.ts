import { MigrationInterface, QueryRunner } from 'typeorm';

export class WomenProgramCycles1760900000000 implements MigrationInterface {
  name = 'WomenProgramCycles1760900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "women_program_cycles_status_enum" AS ENUM ('ACTIVE', 'COMPLETED', 'STOPPED')`,
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "women_program_activity_logs_activitykey_enum" AS ENUM ('LISTEN_QURAN', 'DHIKR_TASBIH', 'DOUA', 'WELLBEING')`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "women_program_cycles" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date,
        "expectedDays" integer NOT NULL DEFAULT 8,
        "status" "women_program_cycles_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "stopReason" varchar,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_women_program_cycles_user" ON "women_program_cycles" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_women_program_cycles_user_status" ON "women_program_cycles" ("userId", "status")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_women_program_cycles_one_active" ON "women_program_cycles" ("userId") WHERE "status" = 'ACTIVE'`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "women_program_activity_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "programId" uuid NOT NULL,
        "date" date NOT NULL,
        "programDay" integer NOT NULL,
        "activityKey" "women_program_activity_logs_activitykey_enum" NOT NULL,
        "completed" boolean NOT NULL DEFAULT false,
        "completedAt" timestamptz,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_women_program_activity_unique" ON "women_program_activity_logs" ("userId", "programId", "date", "activityKey")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_women_program_activity_day" ON "women_program_activity_logs" ("userId", "programId", "date")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_women_program_activity_day"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_women_program_activity_unique"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "women_program_activity_logs"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_women_program_cycles_one_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_women_program_cycles_user_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_women_program_cycles_user"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "women_program_cycles"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "women_program_activity_logs_activitykey_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "women_program_cycles_status_enum"`,
    );
  }
}
