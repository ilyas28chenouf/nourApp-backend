import { MigrationInterface, QueryRunner } from 'typeorm';

export class ObjectiveEvidenceAndMemorization1792627200000 implements MigrationInterface {
  name = 'ObjectiveEvidenceAndMemorization1792627200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "quran_memorization_progress_selectionunit_enum"
          AS ENUM ('AYAH', 'HIZB');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$
    `);
    await queryRunner.query(`
      ALTER TABLE "quran_memorization_progress"
        ADD COLUMN IF NOT EXISTS "memorizationDate" date,
        ADD COLUMN IF NOT EXISTS "selectionUnit"
          "quran_memorization_progress_selectionunit_enum",
        ADD COLUMN IF NOT EXISTS "selectionValue" numeric(8,3),
        ADD COLUMN IF NOT EXISTS "completedAt" timestamptz
    `);
    await queryRunner.query(`
      UPDATE "quran_memorization_progress"
      SET
        "memorizationDate" = COALESCE(
          "lastReviewedAt"::date,
          "updatedAt"::date,
          "createdAt"::date
        ),
        "selectionUnit" = COALESCE(
          "selectionUnit",
          'AYAH'::"quran_memorization_progress_selectionunit_enum"
        ),
        "selectionValue" = COALESCE(
          "selectionValue",
          GREATEST(COALESCE("ayahTo", "ayahFrom", 1) - COALESCE("ayahFrom", 1) + 1, 1)
        ),
        "completedAt" = COALESCE("completedAt", "lastReviewedAt")
    `);
    await queryRunner.query(`
      DELETE FROM "quran_memorization_progress" duplicate
      USING "quran_memorization_progress" keeper
      WHERE duplicate."userId" = keeper."userId"
        AND duplicate."memorizationDate" = keeper."memorizationDate"
        AND (
          duplicate."updatedAt" < keeper."updatedAt"
          OR (
            duplicate."updatedAt" = keeper."updatedAt"
            AND duplicate."id"::text < keeper."id"::text
          )
        )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_quran_memorization_user_date"
      ON "quran_memorization_progress" ("userId", "memorizationDate")
    `);

    await queryRunner.query(`
      DELETE FROM "tafsir_progress" duplicate
      USING "tafsir_progress" keeper
      WHERE duplicate."userId" = keeper."userId"
        AND duplicate."collectionId" = keeper."collectionId"
        AND duplicate."surahNumber" = keeper."surahNumber"
        AND duplicate."ayahNumber" = keeper."ayahNumber"
        AND duplicate."readDate" = keeper."readDate"
        AND (
          duplicate."createdAt" < keeper."createdAt"
          OR (
            duplicate."createdAt" = keeper."createdAt"
            AND duplicate."id"::text < keeper."id"::text
          )
        )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tafsir_progress_daily_evidence"
      ON "tafsir_progress"
        ("userId", "collectionId", "surahNumber", "ayahNumber", "readDate")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_tafsir_progress_daily_evidence"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_quran_memorization_user_date"`,
    );
    await queryRunner.query(`
      ALTER TABLE "quran_memorization_progress"
        DROP COLUMN IF EXISTS "completedAt",
        DROP COLUMN IF EXISTS "selectionValue",
        DROP COLUMN IF EXISTS "selectionUnit",
        DROP COLUMN IF EXISTS "memorizationDate"
    `);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "quran_memorization_progress_selectionunit_enum"`,
    );
  }
}
