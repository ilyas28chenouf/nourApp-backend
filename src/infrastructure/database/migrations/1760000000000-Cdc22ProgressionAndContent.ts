import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cdc22ProgressionAndContent1760000000000 implements MigrationInterface {
  name = 'Cdc22ProgressionAndContent1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "users_gender_enum" AS ENUM ('MALE', 'FEMALE', 'NOT_SPECIFIED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gender" "users_gender_enum" NOT NULL DEFAULT 'NOT_SPECIFIED'`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "spiritual_level_enum" AS ENUM ('MURID', 'SALIK', 'WARID', 'MUTAWASSIT', 'MUQARRAB', 'ARIF')`,
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "hasanat_source_type_enum" AS ENUM ('PRAYER', 'QURAN_READING', 'QURAN_GOAL', 'DHIKR', 'FASTING', 'CHARITY', 'STREAK_BONUS', 'MANUAL_ADJUSTMENT')`,
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "badge_key_enum" AS ENUM ('STREAK_7', 'STREAK_30', 'STREAK_90', 'STREAK_365')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_progression" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL UNIQUE,
        "totalHasanat" integer NOT NULL DEFAULT 0,
        "currentVisibleLevel" "spiritual_level_enum" NOT NULL DEFAULT 'MURID',
        "currentHiddenSubLevel" integer NOT NULL DEFAULT 1,
        "currentStreakDays" integer NOT NULL DEFAULT 0,
        "longestStreakDays" integer NOT NULL DEFAULT 0,
        "lastActivityDate" date,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hasanat_point_events" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "sourceType" "hasanat_source_type_enum" NOT NULL,
        "sourceId" uuid,
        "actionKey" varchar NOT NULL,
        "points" integer NOT NULL,
        "eventDate" date NOT NULL,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_hasanat_events_user_date" ON "hasanat_point_events" ("userId", "eventDate")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_hasanat_events_idempotency" ON "hasanat_point_events" ("userId", "sourceType", "sourceId", "actionKey")`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "hasanat_action_rules" (
        "key" varchar PRIMARY KEY,
        "sourceType" "hasanat_source_type_enum" NOT NULL,
        "points" integer NOT NULL,
        "description" text NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true
      )
    `);
    await queryRunner.query(`
      INSERT INTO "hasanat_action_rules" ("key", "sourceType", "points", "description", "isActive") VALUES
      ('PRAYER_ON_TIME_FARD', 'PRAYER', 25, 'Priere a l heure Fard', true),
      ('PRAYER_GROUP', 'PRAYER', 35, 'Priere en groupe/Jamaa', true),
      ('PRAYER_MOSQUE', 'PRAYER', 40, 'Priere a la mosquee', true),
      ('TAHAJJUD', 'PRAYER', 40, 'Tahajjud', true),
      ('QURAN_PAGE', 'QURAN_READING', 8, 'Quran reading per page', true),
      ('QURAN_OBJECTIVE_REACHED', 'QURAN_READING', 15, 'Quran objective reached', true),
      ('MORNING_ADHKAR_COMPLETED', 'DHIKR', 13, 'Morning adhkar completed', true),
      ('EVENING_ADHKAR_COMPLETED', 'DHIKR', 13, 'Evening adhkar completed', true),
      ('TASBIH_100_MORNING', 'DHIKR', 10, 'Tasbih 100x morning', true),
      ('TASBIH_100_EVENING', 'DHIKR', 10, 'Tasbih 100x evening', true),
      ('FASTING_COMPLETED', 'FASTING', 40, 'Fasting completed', true),
      ('CHARITY_ACTION_COMPLETED', 'CHARITY', 20, 'Sadaqa / social action', true),
      ('STREAK_7_BONUS', 'STREAK_BONUS', 50, '7-day streak bonus', true)
      ON CONFLICT ("key") DO UPDATE SET
        "points" = EXCLUDED."points",
        "description" = EXCLUDED."description",
        "isActive" = EXCLUDED."isActive"
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_badges" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "badgeKey" "badge_key_enum" NOT NULL,
        "unlockedAt" timestamptz NOT NULL DEFAULT now(),
        "metadata" jsonb NOT NULL DEFAULT '{}'
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_badges_unique" ON "user_badges" ("userId", "badgeKey")`,
    );

    await queryRunner.query(
      `ALTER TABLE "prayer_logs" ADD COLUMN IF NOT EXISTS "prayedAtMosque" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TYPE "prayer_logs_prayername_enum" ADD VALUE IF NOT EXISTS 'TAHAJJUD'`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "dhikr_categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "slug" varchar NOT NULL UNIQUE,
        "description" text,
        "period" "dhikr_logs_period_enum",
        "sortOrder" integer NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" ADD COLUMN IF NOT EXISTS "categoryId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" ADD COLUMN IF NOT EXISTS "sourceName" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" ADD COLUMN IF NOT EXISTS "sourceReference" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" ADD COLUMN IF NOT EXISTS "sortOrder" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "dhikr_session_type_enum" AS ENUM ('MORNING_ADHKAR', 'EVENING_ADHKAR', 'TASBIH', 'ISTIGHFAR', 'SALAWAT', 'CUSTOM')`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" ADD COLUMN IF NOT EXISTS "dhikrItemId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" ADD COLUMN IF NOT EXISTS "categoryId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" ADD COLUMN IF NOT EXISTS "sessionType" "dhikr_session_type_enum"`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "quran_memorization_status_enum" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'MEMORIZED', 'TO_REVIEW')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "quran_memorization_progress" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "surahNumber" integer NOT NULL,
        "ayahFrom" integer,
        "ayahTo" integer,
        "status" "quran_memorization_status_enum" NOT NULL DEFAULT 'NOT_STARTED',
        "lastReviewedAt" timestamptz,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_quran_memorization_user_surah" ON "quran_memorization_progress" ("userId", "surahNumber")`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "charity_action_type_enum" AS ENUM ('SADAQA', 'MARAUDE', 'COLLECTE', 'DISTRIBUTION', 'VISITE', 'PARRAINAGE', 'MENTORAT', 'RANDONNEE_SOLIDAIRE', 'COURSE_SOLIDAIRE', 'VOYAGE_SOLIDAIRE', 'OTHER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "charity_logs" ADD COLUMN IF NOT EXISTS "actionType" "charity_action_type_enum" NOT NULL DEFAULT 'SADAQA'`,
    );
    await queryRunner.query(
      `ALTER TYPE "resources_type_enum" ADD VALUE IF NOT EXISTS 'WISDOM'`,
    );
    await queryRunner.query(
      `ALTER TYPE "resources_type_enum" ADD VALUE IF NOT EXISTS 'DUA'`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "sister_unavailable_day_type_enum" AS ENUM ('HAYD', 'NIFAS', 'OTHER')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sister_unavailable_days" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "date" date NOT NULL,
        "type" "sister_unavailable_day_type_enum" NOT NULL,
        "encryptedMetadata" text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        UNIQUE ("userId", "date")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sister_unavailable_days"`);
    await queryRunner.query(
      `ALTER TABLE "charity_logs" DROP COLUMN IF EXISTS "actionType"`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "quran_memorization_progress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" DROP COLUMN IF EXISTS "sessionType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" DROP COLUMN IF EXISTS "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_logs" DROP COLUMN IF EXISTS "dhikrItemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" DROP COLUMN IF EXISTS "sortOrder"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" DROP COLUMN IF EXISTS "sourceReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" DROP COLUMN IF EXISTS "sourceName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dhikr_items" DROP COLUMN IF EXISTS "categoryId"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "dhikr_categories"`);
    await queryRunner.query(
      `ALTER TABLE "prayer_logs" DROP COLUMN IF EXISTS "prayedAtMosque"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "user_badges"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hasanat_action_rules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "hasanat_point_events"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_progression"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "gender"`,
    );
  }
}
