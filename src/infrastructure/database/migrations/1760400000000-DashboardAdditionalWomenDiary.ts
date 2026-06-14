import { MigrationInterface, QueryRunner } from 'typeorm';

export class DashboardAdditionalWomenDiary1760400000000 implements MigrationInterface {
  name = 'DashboardAdditionalWomenDiary1760400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quran_reading_logs" ALTER COLUMN "pagesCount" TYPE numeric(8,2) USING "pagesCount"::numeric`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "additional_prayer_time" AS ENUM ('DAY', 'NIGHT')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "additional_prayer_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "prayerDate" date NOT NULL,
        "prayerTime" "additional_prayer_time" NOT NULL,
        "rakaat" integer NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_additional_prayer_logs_user_date_time" ON "additional_prayer_logs" ("userId", "prayerDate", "prayerTime")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "women_period_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "date" date NOT NULL,
        "feeling" varchar(100),
        "quran" boolean NOT NULL DEFAULT false,
        "dhikr" boolean NOT NULL DEFAULT false,
        "doua" boolean NOT NULL DEFAULT false,
        "reading" boolean NOT NULL DEFAULT false,
        "sadaka" boolean NOT NULL DEFAULT false,
        "meditation" boolean NOT NULL DEFAULT false,
        "hadith" boolean NOT NULL DEFAULT false,
        "health" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_women_period_logs_user_date" ON "women_period_logs" ("userId", "date")`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "diary_entry_type" AS ENUM ('REFLEXION', 'NIYYAH', 'GRATITUDE')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "diary_entries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "entryDate" date NOT NULL,
        "type" "diary_entry_type" NOT NULL,
        "feeling" varchar(100),
        "title" varchar(255),
        "description" text NOT NULL,
        "tags" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_diary_entries_user_entry_date" ON "diary_entries" ("userId", "entryDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_diary_entries_user_type" ON "diary_entries" ("userId", "type")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quran_reading_logs" ALTER COLUMN "pagesCount" TYPE integer USING ROUND("pagesCount")::integer`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "diary_entries"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "diary_entry_type"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "women_period_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "additional_prayer_logs"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "additional_prayer_time"`);
  }
}
