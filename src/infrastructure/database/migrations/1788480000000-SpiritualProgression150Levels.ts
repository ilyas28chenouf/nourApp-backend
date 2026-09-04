import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpiritualProgression150Levels1788480000000 implements MigrationInterface {
  name = 'SpiritualProgression150Levels1788480000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" TYPE varchar(100) USING "currentVisibleLevel"::text`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "spiritual_level_enum"`);

    await queryRunner.query(`
      WITH resolved AS (
        SELECT
          "id",
          LEAST(GREATEST("totalHasanat", 0) / 1000, 149) AS combined_index
        FROM "user_progression"
      )
      UPDATE "user_progression" AS progression
      SET "currentVisibleLevel" =
        (ARRAY[
          'eveil',
          'discipline',
          'constance',
          'recueillement',
          'devotion',
          'devouement',
          'lumiere-d-allah',
          'intimite-avec-allah',
          'proximite-d-allah',
          'amour-d-allah'
        ])[resolved.combined_index / 15 + 1]
        || '-' ||
        (ARRAY[
          'serviteur-d-allah',
          'croyant',
          'droit',
          'reconnaissant',
          'constamment-obeissant',
          'detache-des-biens-de-ce-monde',
          'pieux',
          'satisfait-du-decret-d-allah',
          'clairvoyant',
          'doue-de-certitude',
          'celui-qui-place-sa-confiance-en-allah',
          'bienfaisant',
          'veridique',
          'allie-d-allah',
          'victorieux'
        ])[resolved.combined_index % 15 + 1]
      FROM resolved
      WHERE progression."id" = resolved."id"
    `);

    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" SET DEFAULT 'eveil-serviteur-d-allah'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progression" DROP COLUMN IF EXISTS "currentHiddenSubLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prayer_logs" ADD COLUMN IF NOT EXISTS "rakaat" integer`,
    );

    await queryRunner.query(`
      INSERT INTO "hasanat_action_rules"
        ("key", "sourceType", "points", "description", "isActive")
      VALUES
        ('PRAYER_ON_TIME_FARD', 'PRAYER', 20, 'Obligatory prayer completed on time', true),
        ('PRAYER_LATE_FARD', 'PRAYER', 10, 'Obligatory prayer completed late', true),
        ('SUPEREROGATORY_PRAYER_RAKAH', 'PRAYER', 5, 'Supererogatory prayer per rakah', true),
        ('QURAN_PAGE', 'QURAN_READING', 15, 'Quran reading per page', true),
        ('QURAN_HIZB', 'QURAN_READING', 15, 'Quran reading per hizb', true),
        ('MORNING_ADHKAR_COMPLETED', 'DHIKR', 50, 'Morning adhkar completed', true),
        ('EVENING_ADHKAR_COMPLETED', 'DHIKR', 50, 'Evening adhkar completed', true),
        ('FASTING_COMPLETED', 'FASTING', 200, 'Validated fasting day completed', true),
        ('CHARITY_ACTION_COMPLETED', 'CHARITY', 300, 'Solidarity or social activity completed', true)
      ON CONFLICT ("key") DO UPDATE SET
        "sourceType" = EXCLUDED."sourceType",
        "points" = EXCLUDED."points",
        "description" = EXCLUDED."description",
        "isActive" = EXCLUDED."isActive"
    `);

    await queryRunner.query(`
      UPDATE "hasanat_action_rules"
      SET "points" = 0, "isActive" = false
      WHERE "key" IN (
        'PRAYER_GROUP',
        'PRAYER_MOSQUE',
        'TAHAJJUD',
        'QURAN_OBJECTIVE_REACHED',
        'TASBIH_100_MORNING',
        'TASBIH_100_EVENING',
        'STREAK_7_BONUS'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prayer_logs" DROP COLUMN IF EXISTS "rakaat"`,
    );
    await queryRunner.query(
      `CREATE TYPE "spiritual_level_enum" AS ENUM ('MURID', 'SALIK', 'WARID', 'MUTAWASSIT', 'MUQARRAB', 'ARIF')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" DROP DEFAULT`,
    );
    await queryRunner.query(`
      UPDATE "user_progression"
      SET "currentVisibleLevel" = CASE
        WHEN "totalHasanat" >= 10000 THEN 'ARIF'
        WHEN "totalHasanat" >= 6000 THEN 'MUQARRAB'
        WHEN "totalHasanat" >= 3000 THEN 'MUTAWASSIT'
        WHEN "totalHasanat" >= 1500 THEN 'WARID'
        WHEN "totalHasanat" >= 500 THEN 'SALIK'
        ELSE 'MURID'
      END
    `);
    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" TYPE "spiritual_level_enum" USING "currentVisibleLevel"::text::"spiritual_level_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progression" ALTER COLUMN "currentVisibleLevel" SET DEFAULT 'MURID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progression" ADD COLUMN IF NOT EXISTS "currentHiddenSubLevel" integer NOT NULL DEFAULT 1`,
    );

    await queryRunner.query(`
      DELETE FROM "hasanat_action_rules"
      WHERE "key" IN (
        'PRAYER_LATE_FARD',
        'SUPEREROGATORY_PRAYER_RAKAH',
        'QURAN_HIZB'
      )
    `);
    await queryRunner.query(`
      INSERT INTO "hasanat_action_rules"
        ("key", "sourceType", "points", "description", "isActive")
      VALUES
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
        "sourceType" = EXCLUDED."sourceType",
        "points" = EXCLUDED."points",
        "description" = EXCLUDED."description",
        "isActive" = EXCLUDED."isActive"
    `);
  }
}
