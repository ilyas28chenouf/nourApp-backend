import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpiritualPracticeMultipleAnswers1788652800000 implements MigrationInterface {
  name = 'SpiritualPracticeMultipleAnswers1788652800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const field of [
      'prayerPracticeLevel',
      'quranPracticeLevel',
      'fastingPracticeLevel',
    ]) {
      await queryRunner.query(`
        ALTER TABLE "user_preferences"
        ALTER COLUMN "${field}" TYPE jsonb
        USING CASE WHEN "${field}" IS NULL THEN NULL
          ELSE jsonb_build_array("${field}") END
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Refuse to discard selections when rolling back to single-answer storage.
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM "user_preferences" WHERE
          jsonb_array_length("prayerPracticeLevel") > 1 OR
          jsonb_array_length("quranPracticeLevel") > 1 OR
          jsonb_array_length("fastingPracticeLevel") > 1
        ) THEN
          RAISE EXCEPTION 'Cannot roll back: spiritual practices contain multiple answers';
        END IF;
      END $$;
    `);
    for (const field of [
      'prayerPracticeLevel',
      'quranPracticeLevel',
      'fastingPracticeLevel',
    ]) {
      await queryRunner.query(`
        ALTER TABLE "user_preferences"
        ALTER COLUMN "${field}" TYPE character varying
        USING "${field}" ->> 0
      `);
    }
  }
}
