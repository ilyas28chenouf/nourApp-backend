import { MigrationInterface, QueryRunner } from 'typeorm';

export class V16CompatibilityGoalsAndNotifications1787241600000 implements MigrationInterface {
  name = 'V16CompatibilityGoalsAndNotifications1787241600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const charityEnum = await this.columnEnumName(
      queryRunner,
      'charity_logs',
      'actionType',
    );
    for (const value of [
      'SICK_ISOLATED_VISIT',
      'FAMILY_VISIT',
      'FRATERNAL_VISIT',
      'EDUCATION',
      'TEACHING',
      'CONFERENCE_VIGIL',
      'SPIRITUAL_REMINDER',
      'ASSOCIATIVE_ENGAGEMENT',
      'COMMUNITY_ENGAGEMENT',
    ]) {
      await queryRunner.query(
        `ALTER TYPE "${charityEnum}" ADD VALUE IF NOT EXISTS '${value}'`,
      );
    }
    const notificationEnum = await this.columnEnumName(
      queryRunner,
      'scheduled_notifications',
      'type',
    );
    await queryRunner.query(
      `ALTER TYPE "${notificationEnum}" ADD VALUE IF NOT EXISTS 'ACTIVITY'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "activityNotificationsEnabled" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "mainIntentions" jsonb DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(`
      UPDATE "user_preferences"
      SET "mainIntentions" = jsonb_build_array("mainIntention")
      WHERE "mainIntention" IS NOT NULL
        AND ("mainIntentions" IS NULL OR "mainIntentions" = '[]'::jsonb)
    `);
    await queryRunner.query(
      `ALTER TABLE "goals" ADD COLUMN IF NOT EXISTS "goalCode" varchar`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_goals_goal_code" ON "goals" ("goalCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_goals_goal_code"`);
    await queryRunner.query(
      `ALTER TABLE "goals" DROP COLUMN IF EXISTS "goalCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "mainIntentions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "activityNotificationsEnabled"`,
    );
    // PostgreSQL enum values are intentionally retained: removing them can break
    // rows written while this migration was active.
  }

  private async columnEnumName(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ) {
    const rows = (await queryRunner.query(
      `SELECT "udt_name" FROM "information_schema"."columns" WHERE "table_schema" = current_schema() AND "table_name" = $1 AND "column_name" = $2`,
      [tableName, columnName],
    )) as Array<{ udt_name?: string }>;
    const enumName = rows[0]?.udt_name;
    if (!enumName) {
      throw new Error(`Missing enum column ${tableName}.${columnName}`);
    }
    return enumName.replaceAll('"', '""');
  }
}
