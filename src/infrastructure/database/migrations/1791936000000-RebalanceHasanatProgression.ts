import { MigrationInterface, QueryRunner } from 'typeorm';

export class RebalanceHasanatProgression1791936000000 implements MigrationInterface {
  name = 'RebalanceHasanatProgression1791936000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "hasanat_action_rules"
      ALTER COLUMN "points" TYPE numeric(12,1)
      USING ("points"::numeric / 10)
    `);
    await queryRunner.query(`
      ALTER TABLE "hasanat_point_events"
      ALTER COLUMN "points" TYPE numeric(14,1)
      USING ("points"::numeric / 10)
    `);
    await queryRunner.query(`
      ALTER TABLE "user_progression"
      ALTER COLUMN "totalHasanat" TYPE numeric(14,1)
      USING ("totalHasanat"::numeric / 10)
    `);

    await queryRunner.query(`
      INSERT INTO "hasanat_action_rules"
        ("key", "sourceType", "points", "description", "isActive")
      VALUES
        ('PRAYER_ON_TIME_FARD', 'PRAYER', 2, 'Obligatory prayer completed on time', true),
        ('PRAYER_LATE_FARD', 'PRAYER', 1, 'Obligatory prayer completed late', true),
        ('SUPEREROGATORY_PRAYER_RAKAH', 'PRAYER', 0.5, 'Supererogatory prayer per rakah', true),
        ('QURAN_PAGE', 'QURAN_READING', 1.5, 'Quran reading per page', true),
        ('QURAN_HIZB', 'QURAN_READING', 1.5, 'Quran reading per hizb', true),
        ('MORNING_ADHKAR_COMPLETED', 'DHIKR', 5, 'Morning adhkar completed', true),
        ('EVENING_ADHKAR_COMPLETED', 'DHIKR', 5, 'Evening adhkar completed', true),
        ('FASTING_COMPLETED', 'FASTING', 20, 'Validated fasting day completed', true),
        ('CHARITY_ACTION_COMPLETED', 'CHARITY', 30, 'Solidarity or social activity completed', true)
      ON CONFLICT ("key") DO UPDATE SET
        "sourceType" = EXCLUDED."sourceType",
        "points" = EXCLUDED."points",
        "description" = EXCLUDED."description",
        "isActive" = EXCLUDED."isActive"
    `);

    await this.refreshVisibleLevels(queryRunner, 2000);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "hasanat_action_rules" SET "points" = "points" * 10`,
    );
    await queryRunner.query(
      `UPDATE "hasanat_point_events" SET "points" = "points" * 10`,
    );
    await queryRunner.query(
      `UPDATE "user_progression" SET "totalHasanat" = "totalHasanat" * 10`,
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

    await this.refreshVisibleLevels(queryRunner, 1000);

    await queryRunner.query(`
      ALTER TABLE "hasanat_action_rules"
      ALTER COLUMN "points" TYPE integer
      USING ROUND("points")::integer
    `);
    await queryRunner.query(`
      ALTER TABLE "hasanat_point_events"
      ALTER COLUMN "points" TYPE integer
      USING ROUND("points")::integer
    `);
    await queryRunner.query(`
      ALTER TABLE "user_progression"
      ALTER COLUMN "totalHasanat" TYPE integer
      USING ROUND("totalHasanat")::integer
    `);
  }

  private async refreshVisibleLevels(
    queryRunner: QueryRunner,
    pointsPerStep: number,
  ) {
    await queryRunner.query(`
      WITH resolved AS (
        SELECT
          "id",
          LEAST(
            GREATEST(FLOOR("totalHasanat" / ${pointsPerStep}), 0),
            149
          )::integer AS combined_index
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
  }
}
