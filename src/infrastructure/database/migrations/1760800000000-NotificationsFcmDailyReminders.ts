import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationsFcmDailyReminders1760800000000 implements MigrationInterface {
  name = 'NotificationsFcmDailyReminders1760800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regclass('public.device_tokens') IS NOT NULL
          AND to_regclass('public.notification_device_tokens') IS NULL THEN
          ALTER TABLE "device_tokens" RENAME TO "notification_device_tokens";
        END IF;
      END $$;
    `);

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "notification_device_tokens_platform_enum" AS ENUM ('IOS', 'ANDROID')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notification_device_tokens" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "token" varchar NOT NULL,
        "platform" "notification_device_tokens_platform_enum" NOT NULL,
        "provider" varchar NOT NULL DEFAULT 'FCM',
        "deviceId" varchar,
        "appVersion" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "lastSeenAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" ADD COLUMN IF NOT EXISTS "provider" varchar NOT NULL DEFAULT 'FCM'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" ADD COLUMN IF NOT EXISTS "deviceId" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" ADD COLUMN IF NOT EXISTS "appVersion" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" ADD COLUMN IF NOT EXISTS "lastSeenAt" timestamptz NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_notification_device_tokens_user" ON "notification_device_tokens" ("userId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_notification_device_tokens_token" ON "notification_device_tokens" ("token")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_notification_device_tokens_active" ON "notification_device_tokens" ("isActive")`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "dailyReminderEnabled" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "dailyReminderTime" varchar NOT NULL DEFAULT '09:00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "dailyReminderCycleStartDate" date`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "daily_reminder_contents_type_enum" AS ENUM ('VERSE', 'HADITH')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "daily_reminder_contents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "cycleDay" integer NOT NULL,
        "type" "daily_reminder_contents_type_enum" NOT NULL,
        "arabicText" text,
        "frenchText" text NOT NULL,
        "source" varchar NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "CHK_daily_reminder_contents_cycle_day" CHECK ("cycleDay" >= 1 AND "cycleDay" <= 120)
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_daily_reminder_contents_cycle_day" ON "daily_reminder_contents" ("cycleDay")`,
    );

    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "scheduled_notifications_type_enum" AS ENUM ('DAILY_VERSE', 'DAILY_HADITH', 'PRAYER', 'FASTING', 'DHIKR', 'QURAN', 'ENCOURAGEMENT', 'TEST')`,
    );
    await queryRunner.query(
      `ALTER TYPE "scheduled_notifications_type_enum" ADD VALUE IF NOT EXISTS 'DAILY_VERSE'`,
    );
    await queryRunner.query(
      `ALTER TYPE "scheduled_notifications_type_enum" ADD VALUE IF NOT EXISTS 'DAILY_HADITH'`,
    );
    await queryRunner.query(
      `ALTER TYPE "scheduled_notifications_type_enum" ADD VALUE IF NOT EXISTS 'TEST'`,
    );
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "scheduled_notifications_status_enum" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED')`,
    );
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "scheduled_notifications" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "type" "scheduled_notifications_type_enum" NOT NULL,
        "title" varchar NOT NULL,
        "body" text NOT NULL,
        "scheduledAt" timestamptz NOT NULL,
        "sentAt" timestamptz,
        "status" "scheduled_notifications_status_enum" NOT NULL DEFAULT 'PENDING',
        "contentId" uuid,
        "fcmMessageId" varchar,
        "failureReason" text,
        "metadata" jsonb,
        "dedupeKey" varchar
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD COLUMN IF NOT EXISTS "contentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD COLUMN IF NOT EXISTS "fcmMessageId" varchar`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD COLUMN IF NOT EXISTS "failureReason" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD COLUMN IF NOT EXISTS "dedupeKey" varchar`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_scheduled_notifications_user" ON "scheduled_notifications" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_scheduled_notifications_status" ON "scheduled_notifications" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_scheduled_notifications_scheduled_at" ON "scheduled_notifications" ("scheduledAt")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_scheduled_notifications_dedupe" ON "scheduled_notifications" ("dedupeKey") WHERE "dedupeKey" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_scheduled_notifications_dedupe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN IF EXISTS "dedupeKey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN IF EXISTS "failureReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN IF EXISTS "fcmMessageId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN IF EXISTS "contentId"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "daily_reminder_contents"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "daily_reminder_contents_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "dailyReminderCycleStartDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "dailyReminderTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "dailyReminderEnabled"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_notification_device_tokens_active"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_notification_device_tokens_token"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_notification_device_tokens_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" DROP COLUMN IF EXISTS "lastSeenAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" DROP COLUMN IF EXISTS "appVersion"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" DROP COLUMN IF EXISTS "deviceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_device_tokens" DROP COLUMN IF EXISTS "provider"`,
    );
  }
}
