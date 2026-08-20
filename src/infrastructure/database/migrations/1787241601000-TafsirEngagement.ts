import { MigrationInterface, QueryRunner } from 'typeorm';

export class TafsirEngagement1787241601000 implements MigrationInterface {
  name = 'TafsirEngagement1787241601000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tafsir_progress" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "collectionId" uuid NOT NULL,
        "surahNumber" integer NOT NULL CHECK ("surahNumber" BETWEEN 1 AND 114),
        "ayahNumber" integer NOT NULL CHECK ("ayahNumber" >= 1),
        "readDate" date NOT NULL,
        "completed" boolean NOT NULL DEFAULT true,
        "notes" text,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "FK_tafsir_progress_collection" FOREIGN KEY ("collectionId")
          REFERENCES "tafsir_collections"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_tafsir_progress_user_date" ON "tafsir_progress" ("userId", "readDate")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_tafsir_progress_location" ON "tafsir_progress" ("collectionId", "surahNumber", "ayahNumber")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "tafsir_progress"`);
  }
}
